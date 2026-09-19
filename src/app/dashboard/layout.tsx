import type { Metadata } from "next";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { MobileNavigation } from "@/components/dashboard/mobile-navigation";
import { MaterialsProvider } from "@/lib/dashboard/materials-context";

export const metadata: Metadata = {
  title: "Дашборд — S-AI",
  description: "Мұғалімнің S-AI жұмыс кеңістігі.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <MaterialsProvider>
      <div className="min-h-screen bg-background">
        <DashboardSidebar />
        <MobileNavigation />

        <main className="min-h-screen pb-20 lg:pb-0 lg:pl-64">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </MaterialsProvider>
  );
}
