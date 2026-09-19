import type { MaterialType } from "@/lib/db/types";

/** S-Token cost of each mock generator, charged server-side before generation. */
export const TOKEN_COSTS: Record<MaterialType, number> = {
  qmj: 5,
  test: 2,
  presentation: 8,
  bzb: 5,
  tzb: 7,
  worksheet: 3,
  scenario: 4,
};

export const INSUFFICIENT_TOKENS_MESSAGE =
  "Бұл әрекетті орындау үшін S-Token жеткіліксіз.";
