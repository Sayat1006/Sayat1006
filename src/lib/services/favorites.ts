import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { setMaterialFavoriteFlag } from "@/lib/services/materials";
import type { Material } from "@/lib/db/types";

export async function getFavoriteMaterials(userId: string): Promise<Material[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("materials")
    .select("*")
    .eq("user_id", userId)
    .eq("is_favorite", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`getFavoriteMaterials failed: ${error.message}`);
  return (data ?? []) as Material[];
}

/** Toggles a favorite and returns the new state. Never creates duplicates. */
export async function toggleFavorite(
  userId: string,
  materialId: string,
): Promise<{ isFavorite: boolean }> {
  const admin = getSupabaseAdmin();

  const { data: existing, error: lookupError } = await admin
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("material_id", materialId)
    .maybeSingle();

  if (lookupError) throw new Error(`toggleFavorite lookup failed: ${lookupError.message}`);

  if (existing) {
    const { error: deleteError } = await admin
      .from("favorites")
      .delete()
      .eq("id", existing.id)
      .eq("user_id", userId);
    if (deleteError) throw new Error(`toggleFavorite delete failed: ${deleteError.message}`);

    await setMaterialFavoriteFlag(userId, materialId, false);
    return { isFavorite: false };
  }

  const { error: insertError } = await admin
    .from("favorites")
    .insert({ user_id: userId, material_id: materialId });
  if (insertError) {
    // 23505 = unique_violation — another request already favorited it; treat as success.
    if (insertError.code !== "23505") {
      throw new Error(`toggleFavorite insert failed: ${insertError.message}`);
    }
  }

  await setMaterialFavoriteFlag(userId, materialId, true);
  return { isFavorite: true };
}
