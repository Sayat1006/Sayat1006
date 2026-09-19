/**
 * Central environment-variable access. Every getter throws a clear,
 * actionable error instead of letting the app crash with an opaque
 * "undefined" failure deep inside Supabase/NextAuth internals.
 *
 * Nothing here runs at module load time — values are only read (and
 * validated) when a getter is actually called, so importing this file
 * never crashes a build or an edge-runtime bundle that doesn't need it.
 */

class MissingEnvError extends Error {
  constructor(name: string) {
    super(
      `[S-AI] Missing required environment variable "${name}". ` +
        `Copy .env.local.example to .env.local and fill in real values before using this feature.`,
    );
    this.name = "MissingEnvError";
  }
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new MissingEnvError(name);
  return value;
}

export const env = {
  get nextAuthSecret() {
    return required("NEXTAUTH_SECRET");
  },
  get nextAuthUrl() {
    return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  },
  get supabaseUrl() {
    return required("SUPABASE_URL");
  },
  get supabaseAnonKey() {
    return required("SUPABASE_ANON_KEY");
  },
  get supabaseServiceRoleKey() {
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
  get openaiApiKey() {
    return required("OPENAI_API_KEY");
  },
  get openaiModel() {
    return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  },
};

/** True once every variable required for the database/auth layer is present. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.SUPABASE_ANON_KEY,
  );
}

export function isAuthConfigured(): boolean {
  return Boolean(process.env.NEXTAUTH_SECRET) && isSupabaseConfigured();
}

/** True once an OpenAI API key is present. Generators must check this before spending tokens. */
export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}
