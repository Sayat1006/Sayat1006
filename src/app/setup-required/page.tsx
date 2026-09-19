import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const REQUIRED_VARS = [
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

export default function SetupRequiredPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <Container className="max-w-xl">
        <div className="rounded-2xl border border-primary/10 bg-surface p-8 shadow-lifted sm:p-10">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <AlertTriangle className="size-6" />
          </span>
          <h1 className="font-display mt-5 text-2xl font-bold text-primary">
            Серверді баптау аяқталмаған
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Аутентификация мен дерекқорды іске қосу үшін қажетті орта
            айнымалылары (environment variables) орнатылмаған. Жобаның
            түбіріндегі <code className="rounded bg-primary/6 px-1.5 py-0.5 text-primary">.env.local.example</code>{" "}
            файлын <code className="rounded bg-primary/6 px-1.5 py-0.5 text-primary">.env.local</code> деп
            көшіріп, нақты мәндермен толтырыңыз.
          </p>

          <div className="mt-6 rounded-xl border border-primary/8 bg-[#fbfcfe] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Қажетті айнымалылар
            </p>
            <ul className="mt-2.5 space-y-1.5">
              {REQUIRED_VARS.map((name) => (
                <li key={name} className="font-mono text-sm text-primary/80">
                  {name}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 text-sm text-muted">
            Мәндерді толтырғаннан кейін серверді қайта іске қосыңыз.
          </p>

          <Button variant="secondary" className="mt-6" asChild>
            <Link href="/">Басты бетке оралу</Link>
          </Button>
        </div>
      </Container>
    </main>
  );
}
