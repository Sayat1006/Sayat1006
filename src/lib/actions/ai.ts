"use server";

import { requireCurrentUser } from "@/lib/auth/session";
import { checkGenerationRateLimit } from "@/lib/ai/rate-limit";
import { AI_CONFIG } from "@/lib/ai/client";
import { toFriendlyAIError } from "@/lib/ai/errors";
import { generateQMJContent, type QMJOutput } from "@/lib/ai/generators/qmj";
import { isOpenAIConfigured } from "@/lib/env";
import { consumeTokens, refundTokens } from "@/lib/services/tokens";
import { logAIGeneration } from "@/lib/services/ai-generations";
import { TOKEN_COSTS, INSUFFICIENT_TOKENS_MESSAGE } from "@/lib/tokens/costs";
import { generateQmjSchema } from "@/lib/validations/qmj";

export interface GenerateQmjActionResult {
  success: boolean;
  data?: QMJOutput;
  balance?: number;
  error?: string;
}

/**
 * The one secure entry point the /dashboard/qmj client component calls.
 * Everything security-sensitive happens here, server-side, in this order:
 * auth -> rate limit -> input validation -> config check -> atomic token
 * charge -> AI call -> output validation (inside generateQMJContent) ->
 * refund-on-failure -> usage logging. The client never sees a token cost,
 * a balance, or a user id it could tamper with — every one of those is
 * decided here from the authenticated session.
 */
export async function generateQmjAction(input: unknown): Promise<GenerateQmjActionResult> {
  const user = await requireCurrentUser().catch(() => null);
  if (!user) {
    return { success: false, error: "Сеанс аяқталды. Қайта кіріңіз." };
  }

  const rateLimit = checkGenerationRateLimit(user.id);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: "Сұраныстар тым жиі жіберілді. Біраз уақыттан кейін қайталап көріңіз.",
    };
  }

  const parsed = generateQmjSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Деректер жарамсыз." };
  }

  if (!isOpenAIConfigured()) {
    // Fail before spending a single token — never charge for a request we
    // already know cannot succeed.
    return { success: false, error: "OpenAI API кілті конфигурацияланбаған." };
  }

  const cost = TOKEN_COSTS.qmj;
  let charge: Awaited<ReturnType<typeof consumeTokens>>;
  try {
    charge = await consumeTokens(user.id, cost, "ҚМЖ жасау");
  } catch {
    return { success: false, error: "Токенді есептен шығару кезінде қате пайда болды." };
  }

  if (!charge.success) {
    return { success: false, error: INSUFFICIENT_TOKENS_MESSAGE, balance: charge.balance };
  }

  const inputMetadata = {
    subject: parsed.data.subject,
    grade: parsed.data.grade,
    language: parsed.data.language,
    lessonType: parsed.data.lessonType,
    duration: parsed.data.duration,
  };

  try {
    const qmj = await generateQMJContent(parsed.data);

    // Best-effort logging — never let a logging failure fail the request.
    void logAIGeneration({
      userId: user.id,
      type: "qmj",
      model: AI_CONFIG.model,
      status: "success",
      tokenCost: cost,
      inputMetadata,
      outputMetadata: { title: qmj.title, stageCount: qmj.lessonStages.length },
    });

    return { success: true, data: qmj, balance: charge.balance };
  } catch (err) {
    await refundTokens(user.id, cost, "Қайтарым: ҚМЖ жасау", charge.transactionId ?? undefined).catch(() => {
      // If the refund itself fails, this is now an operational issue to
      // investigate from the ai_generations + token_transactions logs —
      // but we must not throw a second error over the user's original one.
    });

    void logAIGeneration({
      userId: user.id,
      type: "qmj",
      model: AI_CONFIG.model,
      status: "failed",
      tokenCost: 0,
      inputMetadata,
      outputMetadata: { errorCode: err instanceof Error ? err.name : "unknown" },
    });

    return { success: false, error: toFriendlyAIError(err) };
  }
}
