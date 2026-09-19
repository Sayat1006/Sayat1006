import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { AIGenerationLog, AIGenerationStatusDb, AIGenerationType } from "@/lib/db/types";
import type { AIUsage } from "@/lib/ai/types";

export interface LogAIGenerationParams {
  userId: string;
  type: AIGenerationType;
  model: string;
  status: AIGenerationStatusDb;
  tokenCost: number;
  usage?: AIUsage;
  inputMetadata?: Record<string, unknown>;
  outputMetadata?: Record<string, unknown>;
}

/**
 * Records one AI generation attempt for future analytics/cost tracking.
 * Never pass prompts or raw model output here — only small, non-sensitive
 * shape metadata (subject/grade/topic/language, error codes, etc.).
 * Logging failures never blocks the generation flow: this is best-effort
 * telemetry, not part of the token/generation transaction itself.
 */
export async function logAIGeneration(params: LogAIGenerationParams): Promise<void> {
  const { error } = await getSupabaseAdmin().from("ai_generations").insert({
    user_id: params.userId,
    type: params.type,
    model: params.model,
    status: params.status,
    token_cost: params.tokenCost,
    input_tokens: params.usage?.inputTokens ?? null,
    output_tokens: params.usage?.outputTokens ?? null,
    total_tokens: params.usage?.totalTokens ?? null,
    input_metadata: params.inputMetadata ?? {},
    output_metadata: params.outputMetadata ?? {},
  });

  if (error) {
    // Best-effort: surface in server logs but never throw into the caller.
    console.error("[ai_generations] failed to log generation:", error.message);
  }
}

export async function getAIGenerationHistory(userId: string, limit = 50): Promise<AIGenerationLog[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("ai_generations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`getAIGenerationHistory failed: ${error.message}`);
  return (data ?? []) as AIGenerationLog[];
}
