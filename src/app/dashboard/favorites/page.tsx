import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/header";
import { MaterialsClient } from "@/components/dashboard/materials-client";
import { getCurrentUser } from "@/lib/auth/session";
import { getFavoriteMaterials } from "@/lib/services/favorites";

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const favorites = await getFavoriteMaterials(user.id);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Таңдаулылар"
        description="Жиі қолданатын материалдарыңызды осы жерден тез табыңыз."
      />
      <MaterialsClient
        initialMaterials={favorites}
        showFilters={false}
        emptyTitle="Таңдаулы материалдар әзірге жоқ."
        emptyDescription="Материалдар тізімінде жұлдызша белгісін басып, жиі қолданатын материалдарды осы жерге қосыңыз."
      />
    </div>
  );
}
