import type { ZodType } from "zod";

/** Provider-agnostic token usage, when the provider reports one. */
export interface AIUsage {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

export interface AIGenerationResult<T> {
  data: T;
  model: string;
  usage?: AIUsage;
}

export interface GenerateTextParams {
  system: string;
  prompt: string;
  maxOutputTokens?: number;
  temperature?: number;
}

export interface GenerateStructuredParams<T> {
  system: string;
  prompt: string;
  schema: ZodType<T>;
  schemaName: string;
  maxOutputTokens?: number;
  temperature?: number;
}

/**
 * Provider-agnostic AI abstraction. The rest of S-AI talks to this
 * interface, never to a specific vendor SDK — adding Anthropic, Google, or
 * any other provider later means writing one new file under
 * lib/ai/providers/ and switching it in lib/ai/client.ts, with zero
 * changes to generators, prompts, server actions, or UI.
 */
export interface AIProvider {
  readonly name: string;
  generateText(params: GenerateTextParams): Promise<{ text: string; model: string; usage?: AIUsage }>;
  generateStructuredOutput<T>(params: GenerateStructuredParams<T>): Promise<AIGenerationResult<T>>;
}

export type AIErrorCode =
  | "not_configured"
  | "timeout"
  | "rate_limit"
  | "invalid_output"
  | "provider_error";

/** Normalized error every provider maps its own failures onto. */
export class AIProviderError extends Error {
  code: AIErrorCode;

  constructor(code: AIErrorCode, message: string) {
    super(message);
    this.name = "AIProviderError";
    this.code = code;
  }
}

export type AIGenerationStatus = "idle" | "generating" | "done" | "error";

export type SupportedLanguage = "Қазақша" | "Русский";

export type GeneratorType =
  | "qmj"
  | "test"
  | "bzb"
  | "tzb"
  | "presentation"
  | "worksheet"
  | "scenario";

/** Everything the existing /dashboard/qmj form can supply to the AI. */
export interface QMJInput {
  subject: string;
  grade: string;
  topic: string;
  duration: string;
  lessonType: string;
  language: SupportedLanguage;
  /** User-written "Оқу мақсаты" — preserved, never overwritten with an invented one. */
  learningObjective?: string;
  /** User-written "Сабақ мақсаты". */
  lessonGoal?: string;
  /** User-written "Бағалау критерийлері", one per line. */
  assessmentCriteria?: string;
  /** Selected "Сабақ кезеңдері" labels from the existing stage picker. */
  stageLabels: string[];
}
