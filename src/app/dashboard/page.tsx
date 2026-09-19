import { redirect } from "next/navigation";
import { Coins, FolderKanban, Star } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/header";
import { ToolCard } from "@/components/dashboard/tool-card";
import { QuickLessonCreator } from "@/components/dashboard/quick-lesson-creator";
import { RecentMaterials } from "@/components/dashboard/recent-materials";
import { toolCards } from "@/lib/dashboard/constants";
import { getCurrentUser } from "@/lib/auth/session";
import { getProfile } from "@/lib/services/profile";
import { getMaterialStats, getRecentMaterials } from "@/lib/services/materials";
import { getTokenBalance } from "@/lib/services/tokens";

export default async function DashboardHomePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [profile, stats, recentMaterials, tokenBalance] = await Promise.all([
    getProfile(user.id),
    getMaterialStats(user.id),
    getRecentMaterials(user.id, 5),
    getTokenBalance(user.id),
  ]);

  const firstName = (profile?.full_name?.trim() || user.email.split("@")[0]).split(" ")[0];

  const statCards = [
    { icon: FolderKanban, label: "Материалдар", value: stats.total },
    { icon: Star, label: "Таңдаулылар", value: stats.favorites },
    { icon: Coins, label: "S-Tokens", value: tokenBalance },
  ];

  return (
    <div className="space-y-10">
      <DashboardHeader
        title={`Қайырлы күн, ${firstName}! \u{1F44B}`}
        description="Бүгін қандай сабақ дайындаймыз?"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3.5 rounded-2xl border border-primary/8 bg-surface p-5 shadow-soft"
          >
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/5 text-primary">
              <stat.icon className="size-5" />
            </span>
            <div>
              <p className="font-display text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <QuickLessonCreator />

      <section>
        <h2 className="font-display mb-4 text-lg font-bold text-primary">Соңғы материалдар</h2>
        <RecentMaterials materials={recentMaterials} />
      </section>

      <section>
        <h2 className="font-display mb-4 text-lg font-bold text-primary">Құралдар</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toolCards.map((tool) => (
            <ToolCard key={tool.title} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
