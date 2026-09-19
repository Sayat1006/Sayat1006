import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";

/**
 * Privileged Supabase client, authenticated with the service-role key.
 *
 * This bypasses Row Level Security entirely, so it must NEVER be imported
 * from a Client Component and must NEVER be exposed to the browser. Every
 * function that uses it is responsible for scoping queries to the caller's
 * own `user_id`, derived from the authenticated server-side session — never
 * from a client-supplied value. RLS policies on the underlying tables exist
 * as defense-in-depth for the anon/public Postgres roles; this client's own
 * discipline (always filtering by the session user id) is the primary
 * enforcement boundary for this app. See supabase/migrations for details.
 *
 * The `server-only` import above makes any accidental client-side import
 * fail at build time rather than silently leaking the service-role key.
 */
let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  cached = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}
