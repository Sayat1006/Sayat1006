import "server-only";

import { env, isOpenAIConfigured } from "@/lib/env";
import { OpenAIProvider } from "@/lib/ai/providers/openai";
import type { AIProvider } from "@/lib/ai/types";

/**
 * Central AI configuration. Every generator reads limits from here instead
 * of hardcoding them, and the model always comes from OPENAI_MODEL rather
 * than being hardcoded throughout the app. Temperature is intentionally
 * not user-configurable.
 */
export const AI_CONFIG = {
  provider: "openai" as const,
  get model() {
    return env.openaiModel;
  },
  maxOutputTokens: 4000,
  temperature: 0.6,
};

let cachedProvider: AIProvider | null = null;

/**
 * Returns the configured AIProvider. Adding a second provider later is a
 * matter of adding a case here (and an env var to pick it, e.g.
 * AI_PROVIDER=anthropic) — no generator, prompt, or UI code needs to
 * change, since they only ever depend on the AIProvider interface.
 */
export function getAIProvider(): AIProvider {
  if (cachedProvider) return cachedProvider;

  switch (AI_CONFIG.provider) {
    case "openai":
      cachedProvider = new OpenAIProvider();
      return cachedProvider;
    default:
      throw new Error(`Unknown AI provider: ${AI_CONFIG.provider}`);
  }
}

export { isOpenAIConfigured };
