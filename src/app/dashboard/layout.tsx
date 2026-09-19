import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { MobileNavigation } from "@/components/dashboard/mobile-navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getProfile } from "@/lib/services/profile";
import { getTokenBalance } from "@/lib/services/tokens";

export const metadata: Metadata = {
  title: "Дашборд — S-AI",
  description: "Мұғалімнің S-AI жұмыс кеңістігі.",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth: middleware already redirects unauthenticated requests
  // to /login, but this page is never allowed to render for an anonymous
  // caller even if middleware were ever bypassed or misconfigured.
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [profile, tokenBalance] = await Promise.all([
    getProfile(user.id),
    getTokenBalance(user.id),
  ]);

  const userName = profile?.full_name?.trim() || user.email.split("@")[0];
  const userSubject = profile?.subject ?? "";

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar userName={userName} userSubject={userSubject} tokenBalance={tokenBalance} />
      <MobileNavigation userName={userName} userSubject={userSubject} tokenBalance={tokenBalance} />

      <main className="min-h-screen pb-20 lg:pb-0 lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
