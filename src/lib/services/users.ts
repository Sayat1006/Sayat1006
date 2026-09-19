import "server-only";

import bcrypt from "bcryptjs";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { UserRecord } from "@/lib/db/types";

const SALT_ROUNDS = 12;

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("users")
    .select("*")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error) throw new Error(`findUserByEmail failed: ${error.message}`);
  return data as UserRecord | null;
}

export async function createUser(params: {
  email: string;
  password: string;
}): Promise<UserRecord> {
  const email = params.email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(params.password, SALT_ROUNDS);

  const { data, error } = await getSupabaseAdmin()
    .from("users")
    .insert({ email, password_hash: passwordHash })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("EMAIL_TAKEN");
    }
    throw new Error(`createUser failed: ${error.message}`);
  }

  return data as UserRecord;
}

export async function verifyPassword(user: UserRecord, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.password_hash);
}
