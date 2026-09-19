export type MaterialType =
  | "qmj"
  | "presentation"
  | "test"
  | "bzb"
  | "tzb"
  | "worksheet"
  | "scenario";

export type TokenTransactionType = "generation" | "purchase" | "refund" | "bonus";

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  subject: string;
  school: string;
  grades: string[];
  language: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  language: string;
  notifications: {
    product: boolean;
    tips: boolean;
    marketing: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface Material {
  id: string;
  user_id: string;
  title: string;
  type: MaterialType;
  subject: string;
  grade: string;
  content: Record<string, unknown>;
  metadata: Record<string, unknown>;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  material_id: string;
  created_at: string;
}

export interface TokenTransaction {
  id: string;
  user_id: string;
  type: TokenTransactionType;
  amount: number;
  description: string;
  reference_id: string | null;
  created_at: string;
}
