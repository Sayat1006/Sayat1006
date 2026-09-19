import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/header";
import { MaterialsClient } from "@/components/dashboard/materials-client";
import { getCurrentUser } from "@/lib/auth/session";
import { getMaterials } from "@/lib/services/materials";

export default async function MaterialsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const materials = await getMaterials(user.id);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Менің материалдарым"
        description="Барлық дайындалған материалдарыңыз осы жерде."
      />
      <MaterialsClient initialMaterials={materials} />
    </div>
  );
}
