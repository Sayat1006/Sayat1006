"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentUser } from "@/lib/auth/session";
import { updateProfile } from "@/lib/services/profile";
import { updateSettings } from "@/lib/services/settings";
import { profileSchema, settingsSchema } from "@/lib/validations/profile";
import type { UserProfile, UserSettings } from "@/lib/db/types";

interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function friendlyError(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message === "UNAUTHENTICATED") {
    return "Сеанс аяқталды. Қайта кіріңіз.";
  }
  return fallback;
}

export async function updateProfileAction(input: {
  fullName: string;
  subject: string;
  school: string;
  grades: string[];
  language: string;
}): Promise<ActionResult<UserProfile>> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Деректер жарамсыз." };
  }

  try {
    const user = await requireCurrentUser();
    const profile = await updateProfile(user.id, parsed.data);
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");
    return { success: true, data: profile };
  } catch (err) {
    return { success: false, error: friendlyError(err, "Сақтау кезінде қате пайда болды.") };
  }
}

export async function updateSettingsAction(input: {
  language: string;
  notifications: { product: boolean; tips: boolean; marketing: boolean };
}): Promise<ActionResult<UserSettings>> {
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Деректер жарамсыз." };
  }

  try {
    const user = await requireCurrentUser();
    const settings = await updateSettings(user.id, parsed.data);
    revalidatePath("/dashboard/profile");
    return { success: true, data: settings };
  } catch (err) {
    return { success: false, error: friendlyError(err, "Сақтау кезінде қате пайда болды.") };
  }
}
