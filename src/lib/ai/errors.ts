import { AIProviderError, type AIErrorCode } from "@/lib/ai/types";

const MESSAGES: Record<AIErrorCode, string> = {
  not_configured: "OpenAI API кілті конфигурацияланбаған.",
  timeout: "AI қызметіне қосылу мүмкін болмады. Кейінірек қайталап көріңіз.",
  rate_limit: "AI қызметі қазір бос емес. Бірнеше секундтан кейін қайталап көріңіз.",
  invalid_output: "ҚМЖ жасау кезінде қате пайда болды. Қайталап көріңіз.",
  provider_error: "AI қызметіне қосылу мүмкін болмады. Кейінірек қайталап көріңіз.",
};

/** Turns any thrown error from the AI layer into a safe, friendly Kazakh message. Never leaks provider details. */
export function toFriendlyAIError(err: unknown): string {
  if (err instanceof AIProviderError) {
    return MESSAGES[err.code] ?? MESSAGES.provider_error;
  }
  return "ҚМЖ жасау кезінде қате пайда болды.";
}
