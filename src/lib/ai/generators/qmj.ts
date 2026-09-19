import "server-only";

import { z } from "zod";

import { AI_CONFIG, getAIProvider } from "@/lib/ai/client";
import { buildQmjSystemPrompt, buildQmjUserPrompt } from "@/lib/ai/prompts/qmj";
import { AIProviderError, type QMJInput } from "@/lib/ai/types";

export const qmjLessonStageSchema = z.object({
  stage: z.string().describe("Kazakh/Russian name of the lesson stage, e.g. 'Қызығушылықты ояту'"),
  duration: z.string().describe("Realistic duration of this stage, e.g. '5 минут'"),
  teacherActivity: z.string().describe("Concrete action the teacher takes during this stage"),
  studentActivity: z.string().describe("Concrete, observable action students take during this stage"),
  assessment: z.string().describe("How this stage is assessed or what feedback is given"),
  resources: z.string().describe("Realistic resources/materials used in this stage"),
});

export const qmjOutputSchema = z.object({
  title: z.string().describe("Lesson title"),
  subject: z.string(),
  grade: z.string(),
  duration: z.string(),
  learningObjectives: z
    .array(z.string())
    .min(1)
    .describe("Оқу мақсаты — one or more curriculum-style learning objectives"),
  lessonObjectives: z
    .array(z.string())
    .min(1)
    .describe("Сабақ мақсаты — what students achieve by the end of this specific lesson"),
  assessmentCriteria: z.array(z.string()).min(1).describe("Бағалау критерийлері"),
  lessonStages: z.array(qmjLessonStageSchema).min(3).describe("Сабақ кезеңдері, in teaching order"),
  differentiation: z.string().describe("Саралау — differentiated tasks for different ability levels"),
  safety: z.string().describe("Қауіпсіздік ережелері"),
  reflection: z.string().describe("Рефлексия — a concrete end-of-lesson reflection technique and prompt"),
  homework: z.string().describe("Үй тапсырмасы"),
});

export type QmjLessonStage = z.infer<typeof qmjLessonStageSchema>;
export type QMJOutput = z.infer<typeof qmjOutputSchema>;

const MAX_ATTEMPTS = 2;

/**
 * Generates a real, structured ҚМЖ via the configured AI provider. Every
 * response is validated against qmjOutputSchema before it's trusted —
 * invalid output triggers one safe retry, then a clear AIProviderError
 * instead of ever rendering unvalidated AI output.
 */
export async function generateQMJContent(input: QMJInput): Promise<QMJOutput> {
  const provider = getAIProvider();
  const system = buildQmjSystemPrompt(input.language);
  const prompt = buildQmjUserPrompt(input);

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const result = await provider.generateStructuredOutput({
        system,
        prompt:
          attempt === 1
            ? prompt
            : `${prompt}\n\nESKERTU: Алдыңғы жауап схемаға сай келмеді. Барлық өрістерді толық және дұрыс форматта қайта бер.`,
        schema: qmjOutputSchema,
        schemaName: "qmj_lesson_plan",
        maxOutputTokens: AI_CONFIG.maxOutputTokens,
        temperature: AI_CONFIG.temperature,
      });

      const validated = qmjOutputSchema.safeParse(result.data);
      if (validated.success) {
        return validated.data;
      }

      lastError = new AIProviderError(
        "invalid_output",
        `AI response failed schema validation: ${validated.error.message}`,
      );
    } catch (err) {
      lastError = err;
      if (err instanceof AIProviderError && err.code !== "invalid_output") {
        // Auth/timeout/rate-limit/provider errors are not worth retrying with the same prompt.
        throw err;
      }
    }
  }

  throw lastError instanceof AIProviderError
    ? lastError
    : new AIProviderError("provider_error", "QMJ generation failed after retry");
}
