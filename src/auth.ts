import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { isSupabaseConfigured } from "@/lib/env";
import { loginSchema } from "@/lib/validations/auth";
import { findUserByEmail, verifyPassword } from "@/lib/services/users";

/**
 * True once every variable NextAuth + the database layer need is present.
 * Consumed by middleware.ts to redirect to /setup-required instead of
 * letting a missing-secret/missing-Supabase-config error surface as an
 * opaque crash the first time someone hits /login or /dashboard.
 */
export const isAuthEnvConfigured = Boolean(process.env.NEXTAUTH_SECRET) && isSupabaseConfigured();

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
  // NextAuth's constructor requires *a* string secret to not throw at import
  // time (which would take down every route, including the public landing
  // page, via middleware). The real guard is isAuthEnvConfigured above: when
  // it's false, middleware never lets a request reach a code path that
  // would rely on this placeholder for anything real.
  secret: process.env.NEXTAUTH_SECRET ?? "s-ai-dev-placeholder-set-NEXTAUTH_SECRET",
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Құпиясөз", type: "password" },
      },
      async authorize(credentials) {
        if (!isSupabaseConfigured()) return null;

        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        try {
          const user = await findUserByEmail(parsed.data.email);
          if (!user) return null;

          const valid = await verifyPassword(user, parsed.data.password);
          if (!valid) return null;

          return { id: user.id, email: user.email };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
