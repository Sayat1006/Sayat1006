"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentUser } from "@/lib/auth/session";
import {
  createMaterial,
  deleteMaterial,
  duplicateMaterial,
  renameMaterial,
} from "@/lib/services/materials";
import { toggleFavorite } from "@/lib/services/favorites";
import { createMaterialSchema, renameMaterialSchema } from "@/lib/validations/material";
import type { Material } from "@/lib/db/types";

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

export async function saveMaterialAction(input: {
  title: string;
  type: string;
  subject?: string;
  grade?: string;
  content?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}): Promise<ActionResult<Material>> {
  const parsed = createMaterialSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Деректер жарамсыз." };
  }

  try {
    const user = await requireCurrentUser();
    const material = await createMaterial(user.id, parsed.data);
    revalidatePath("/dashboard/materials");
    revalidatePath("/dashboard");
    return { success: true, data: material };
  } catch (err) {
    return { success: false, error: friendlyError(err, "Сақтау кезінде қате пайда болды.") };
  }
}

export async function renameMaterialAction(input: {
  id: string;
  title: string;
}): Promise<ActionResult<Material>> {
  const parsed = renameMaterialSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Атауы жарамсыз." };
  }

  try {
    const user = await requireCurrentUser();
    const material = await renameMaterial(user.id, parsed.data.id, parsed.data.title);
    revalidatePath("/dashboard/materials");
    revalidatePath("/dashboard/favorites");
    return { success: true, data: material };
  } catch (err) {
    return { success: false, error: friendlyError(err, "Атауын өзгерту кезінде қате пайда болды.") };
  }
}

export async function duplicateMaterialAction(input: {
  id: string;
}): Promise<ActionResult<Material>> {
  try {
    const user = await requireCurrentUser();
    const material = await duplicateMaterial(user.id, input.id);
    revalidatePath("/dashboard/materials");
    revalidatePath("/dashboard");
    return { success: true, data: material };
  } catch (err) {
    return { success: false, error: friendlyError(err, "Көшірмесін жасау кезінде қате пайда болды.") };
  }
}

export async function deleteMaterialAction(input: { id: string }): Promise<ActionResult<null>> {
  try {
    const user = await requireCurrentUser();
    await deleteMaterial(user.id, input.id);
    revalidatePath("/dashboard/materials");
    revalidatePath("/dashboard/favorites");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    return { success: false, error: friendlyError(err, "Жою кезінде қате пайда болды.") };
  }
}

export async function toggleFavoriteAction(input: {
  id: string;
}): Promise<ActionResult<{ isFavorite: boolean }>> {
  try {
    const user = await requireCurrentUser();
    const result = await toggleFavorite(user.id, input.id);
    revalidatePath("/dashboard/materials");
    revalidatePath("/dashboard/favorites");
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: friendlyError(err, "Таңдаулыға қосу кезінде қате пайда болды.") };
  }
}
