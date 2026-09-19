"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentUser } from "@/lib/auth/session";
import { consumeTokens, refundTokens } from "@/lib/services/tokens";
import { TOKEN_COSTS, INSUFFICIENT_TOKENS_MESSAGE } from "@/lib/tokens/costs";
import type { MaterialType } from "@/lib/db/types";

interface ConsumeResult {
  success: boolean;
  balance?: number;
  transactionId?: string | null;
  error?: string;
}

const MATERIAL_TYPE_LABELS: Record<MaterialType, string> = {
  qmj: "ҚМЖ жасау",
  presentation: "Презентация жасау",
  test: "Тест жасау",
  bzb: "БЖБ жасау",
  tzb: "ТЖБ жасау",
  worksheet: "Жұмыс парағы жасау",
  scenario: "Сабақ сценарийін жасау",
};

/**
 * Charges the S-Token cost of a mock generator before the (still mock)
 * generation runs. The deduction itself is atomic and server-side — see
 * consume_tokens() in supabase/migrations/0001_init.sql — so the client
 * never supplies, and can never influence, the amount actually debited.
 */
export async function chargeForGenerationAction(
  type: MaterialType,
): Promise<ConsumeResult> {
  try {
    const user = await requireCurrentUser();
    const amount = TOKEN_COSTS[type];

    const result = await consumeTokens(user.id, amount, MATERIAL_TYPE_LABELS[type]);
    revalidatePath("/dashboard/tokens");
    revalidatePath("/dashboard");

    if (!result.success) {
      return { success: false, error: INSUFFICIENT_TOKENS_MESSAGE, balance: result.balance };
    }

    return { success: true, balance: result.balance, transactionId: result.transactionId };
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHENTICATED") {
      return { success: false, error: "Сеанс аяқталды. Қайта кіріңіз." };
    }
    return { success: false, error: "Токенді есептен шығару кезінде қате пайда болды." };
  }
}

/** Refunds a charge if the mock generation step that followed it failed. */
export async function refundGenerationAction(
  type: MaterialType,
  transactionId?: string | null,
): Promise<{ success: boolean; balance?: number }> {
  try {
    const user = await requireCurrentUser();
    const amount = TOKEN_COSTS[type];
    const balance = await refundTokens(
      user.id,
      amount,
      `Қайтарым: ${MATERIAL_TYPE_LABELS[type]}`,
      transactionId ?? undefined,
    );
    revalidatePath("/dashboard/tokens");
    revalidatePath("/dashboard");
    return { success: true, balance };
  } catch {
    return { success: false };
  }
}
