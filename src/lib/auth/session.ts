import "server-only";

import { auth } from "@/auth";

export interface CurrentUser {
  id: string;
  email: string;
}

/** Returns the authenticated user from the server-side session, or null. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) return null;
  return { id: session.user.id, email: session.user.email };
}

/**
 * Same as getCurrentUser, but throws if there is no session. Use inside
 * server actions / route handlers that must never run for an anonymous
 * caller — the thrown error is caught by the calling action and turned
 * into a user-friendly "session expired" response rather than a crash.
 */
export async function requireCurrentUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}
