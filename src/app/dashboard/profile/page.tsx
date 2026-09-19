import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/header";
import { ProfileClient } from "@/components/dashboard/profile-client";
import { getCurrentUser } from "@/lib/auth/session";
import { getProfile } from "@/lib/services/profile";
import { getSettings } from "@/lib/services/settings";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [profile, settings] = await Promise.all([
    getProfile(user.id),
    getSettings(user.id),
  ]);

  return (
    <div className="space-y-8">
      <DashboardHeader title="Профиль" description="Жеке деректеріңізді және баптауларды басқарыңыз." />
      <ProfileClient email={user.email} initialProfile={profile} initialSettings={settings} />
    </div>
  );
}
