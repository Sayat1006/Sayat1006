import "server-only";

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { ContentFilterFinishReasonError, LengthFinishReasonError } from "openai/core/error";

import { env } from "@/lib/env";
import {
  AIProviderError,
  type AIProvider,
  type AIUsage,
  type GenerateStructuredParams,
  type GenerateTextParams,
} from "@/lib/ai/types";

let cachedClient: OpenAI | null = null;

function getClient(): OpenAI {
  if (cachedClient) return cachedClient;
  cachedClient = new OpenAI({ apiKey: env.openaiApiKey, timeout: 60_000 });
  return cachedClient;
}

function toUsage(usage: OpenAI.CompletionUsage | undefined): AIUsage | undefined {
  if (!usage) return undefined;
  return {
    inputTokens: usage.prompt_tokens,
    outputTokens: usage.completion_tokens,
    totalTokens: usage.total_tokens,
  };
}

/** Maps every OpenAI SDK failure mode onto our provider-agnostic error codes. */
function toProviderError(err: unknown): AIProviderError {
  if (err instanceof AIProviderError) return err;

  if (err instanceof OpenAI.APIConnectionTimeoutError) {
    return new AIProviderError("timeout", "OpenAI request timed out");
  }
  if (err instanceof OpenAI.RateLimitError) {
    return new AIProviderError("rate_limit", "OpenAI rate limit exceeded");
  }
  if (err instanceof OpenAI.AuthenticationError || err instanceof OpenAI.PermissionDeniedError) {
    return new AIProviderError("not_configured", "OpenAI API key is invalid or unauthorized");
  }
  if (err instanceof OpenAI.APIConnectionError) {
    return new AIProviderError("provider_error", "Could not reach OpenAI");
  }
  if (err instanceof LengthFinishReasonError) {
    return new AIProviderError("invalid_output", "OpenAI response was truncated before completion");
  }
  if (err instanceof ContentFilterFinishReasonError) {
    return new AIProviderError("invalid_output", "OpenAI response was blocked by content filtering");
  }
  if (err instanceof OpenAI.APIError) {
    return new AIProviderError("provider_error", `OpenAI API error: ${err.message}`);
  }

  return new AIProviderError(
    "provider_error",
    err instanceof Error ? err.message : "Unknown OpenAI provider error",
  );
}

export class OpenAIProvider implements AIProvider {
  readonly name = "openai";

  async generateText({
    system,
    prompt,
    maxOutputTokens,
    temperature,
  }: GenerateTextParams): Promise<{ text: string; model: string; usage?: AIUsage }> {
    try {
      const model = env.openaiModel;
      const completion = await getClient().chat.completions.create({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
        max_completion_tokens: maxOutputTokens,
        temperature,
      });

      const text = completion.choices[0]?.message?.content ?? "";
      return { text, model, usage: toUsage(completion.usage) };
    } catch (err) {
      throw toProviderError(err);
    }
  }

  async generateStructuredOutput<T>({
    system,
    prompt,
    schema,
    schemaName,
    maxOutputTokens,
    temperature,
  }: GenerateStructuredParams<T>) {
    try {
      const model = env.openaiModel;
      const completion = await getClient().chat.completions.parse({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
        response_format: zodResponseFormat(schema, schemaName),
        max_completion_tokens: maxOutputTokens,
        temperature,
      });

      const choice = completion.choices[0];
      if (choice?.message?.refusal) {
        throw new AIProviderError("invalid_output", `OpenAI refused the request: ${choice.message.refusal}`);
      }

      const parsed = choice?.message?.parsed;
      if (parsed === null || parsed === undefined) {
        throw new AIProviderError("invalid_output", "OpenAI returned no parsable structured output");
      }

      return { data: parsed, model, usage: toUsage(completion.usage) };
    } catch (err) {
      throw toProviderError(err);
    }
  }
}
