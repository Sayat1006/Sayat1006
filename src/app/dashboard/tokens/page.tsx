import { redirect } from "next/navigation";
import { Coins, Minus, Plus, Sparkles } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/header";
import { ToastButton } from "@/components/dashboard/toast-button";
import { getCurrentUser } from "@/lib/auth/session";
import { getTokenBalance, getTokenTransactions } from "@/lib/services/tokens";
import { creditPackages } from "@/lib/dashboard/mock-data";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

export default async function TokensPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [balance, transactions] = await Promise.all([
    getTokenBalance(user.id),
    getTokenTransactions(user.id),
  ]);

  return (
    <div className="space-y-8">
      <DashboardHeader title="S-Tokens" description="Материал жасау үшін жұмсалатын токен балансыңыз." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-white shadow-glow-violet sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-10 size-52 rounded-full bg-[radial-gradient(closest-side,rgba(53,201,255,0.3),transparent)]" />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
            <Coins className="size-3.5 text-cyan" />
            Ағымдағы баланс
          </span>
          <p className="font-display mt-4 text-4xl font-extrabold sm:text-5xl">
            {balance} <span className="text-xl font-semibold text-white/50">S-Tokens</span>
          </p>
          <p className="mt-2 text-sm text-white/50">
            Баланс транзакциялар тарихынан есептеледі. Төлем жүйесі әлі қосылмаған.
          </p>
          <ToastButton
            variant="gradient"
            className="mt-6"
            message="Толықтыру функциясы кейінірек қосылады"
          >
            <Plus className="size-4" />
            Балансты толықтыру
          </ToastButton>
        </div>

        <div className="rounded-2xl border border-primary/10 bg-surface p-6 shadow-soft sm:p-8">
          <h2 className="font-display text-base font-bold text-primary">Пайдалану тарихы</h2>
          {transactions.length > 0 ? (
            <div className="mt-4 space-y-1">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-primary/3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex size-8 shrink-0 items-center justify-center rounded-full",
                        tx.amount > 0 ? "bg-success/10 text-success" : "bg-primary/6 text-primary/50",
                      )}
                    >
                      {tx.amount > 0 ? <Plus className="size-4" /> : <Minus className="size-4" />}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-primary">{tx.description}</p>
                      <p className="text-xs text-muted">{formatDate(tx.created_at)}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 font-display text-sm font-bold",
                      tx.amount > 0 ? "text-success" : "text-primary/70",
                    )}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Әлі транзакциялар жоқ.</p>
          )}
        </div>
      </div>

      <section>
        <h2 className="font-display mb-4 text-lg font-bold text-primary">Токен топтамалары</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {creditPackages.map((pack) => (
            <div
              key={pack.name}
              className={cn(
                "flex flex-col rounded-2xl border p-6 shadow-soft",
                pack.highlighted ? "border-cyan/30 bg-cyan/5" : "border-primary/10 bg-surface",
              )}
            >
              {pack.highlighted ? (
                <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-[linear-gradient(90deg,var(--color-cyan),var(--color-violet))] px-3 py-1 text-xs font-bold text-white">
                  <Sparkles className="size-3" />
                  Танымал
                </span>
              ) : null}
              <h3 className="font-display text-base font-bold text-primary">{pack.name}</h3>
              <p className="mt-1 text-sm text-muted">{pack.description}</p>
              <p className="font-display mt-4 text-2xl font-extrabold text-primary">
                {pack.tokens} <span className="text-sm font-medium text-muted">S-Tokens</span>
              </p>
              <p className="mt-1 text-xs text-muted">{pack.price}</p>
              <ToastButton
                variant={pack.highlighted ? "gradient" : "secondary"}
                className="mt-6"
                message="Төлем жүйесі кейінірек қосылады"
              >
                Таңдау
              </ToastButton>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
