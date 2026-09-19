import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { UserProfile } from "@/lib/db/types";
import type { ProfileInput } from "@/lib/validations/profile";

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(`getProfile failed: ${error.message}`);
  return data as UserProfile | null;
}

export async function updateProfile(
  userId: string,
  input: Partial<ProfileInput>,
): Promise<UserProfile> {
  const patch: Record<string, unknown> = {};
  if (input.fullName !== undefined) patch.full_name = input.fullName;
  if (input.subject !== undefined) patch.subject = input.subject;
  if (input.school !== undefined) patch.school = input.school;
  if (input.grades !== undefined) patch.grades = input.grades;
  if (input.language !== undefined) patch.language = input.language;

  const { data, error } = await getSupabaseAdmin()
    .from("profiles")
    .update(patch)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) throw new Error(`updateProfile failed: ${error.message}`);
  return data as UserProfile;
}
