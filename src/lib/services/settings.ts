import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { UserSettings } from "@/lib/db/types";
import type { SettingsInput } from "@/lib/validations/profile";

export async function getSettings(userId: string): Promise<UserSettings | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(`getSettings failed: ${error.message}`);
  return data as UserSettings | null;
}

export async function updateSettings(
  userId: string,
  input: SettingsInput,
): Promise<UserSettings> {
  const { data, error } = await getSupabaseAdmin()
    .from("user_settings")
    .update({ language: input.language, notifications: input.notifications })
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) throw new Error(`updateSettings failed: ${error.message}`);
  return data as UserSettings;
}
