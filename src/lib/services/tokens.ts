import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { TokenTransaction } from "@/lib/db/types";

export async function getTokenBalance(userId: string): Promise<number> {
  const { data, error } = await getSupabaseAdmin().rpc("get_token_balance", {
    p_user_id: userId,
  });

  if (error) throw new Error(`getTokenBalance failed: ${error.message}`);
  return (data as number) ?? 0;
}

export async function getTokenTransactions(
  userId: string,
  limit = 50,
): Promise<TokenTransaction[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("token_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`getTokenTransactions failed: ${error.message}`);
  return (data ?? []) as TokenTransaction[];
}

export interface ConsumeTokensResult {
  success: boolean;
  balance: number;
  transactionId: string | null;
}

/**
 * Atomically checks the caller's balance and debits `amount` tokens in a
 * single database round trip (see supabase/migrations/0001_init.sql —
 * `consume_tokens`), so two concurrent requests can never both succeed past
 * a balance they only had enough for once.
 */
export async function consumeTokens(
  userId: string,
  amount: number,
  description: string,
  referenceId?: string,
): Promise<ConsumeTokensResult> {
  const { data, error } = await getSupabaseAdmin().rpc("consume_tokens", {
    p_user_id: userId,
    p_amount: amount,
    p_description: description,
    p_reference_id: referenceId ?? null,
  });

  if (error) throw new Error(`consumeTokens failed: ${error.message}`);

  const row = Array.isArray(data) ? data[0] : data;
  return {
    success: Boolean(row?.success),
    balance: Number(row?.balance ?? 0),
    transactionId: (row?.transaction_id as string | null) ?? null,
  };
}

export async function refundTokens(
  userId: string,
  amount: number,
  description: string,
  referenceId?: string,
): Promise<number> {
  const { data, error } = await getSupabaseAdmin().rpc("refund_tokens", {
    p_user_id: userId,
    p_amount: amount,
    p_description: description,
    p_reference_id: referenceId ?? null,
  });

  if (error) throw new Error(`refundTokens failed: ${error.message}`);
  return (data as number) ?? 0;
}
