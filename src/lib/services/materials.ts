import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { Material } from "@/lib/db/types";
import type { CreateMaterialInput } from "@/lib/validations/material";

export async function getMaterials(userId: string): Promise<Material[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("materials")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`getMaterials failed: ${error.message}`);
  return (data ?? []) as Material[];
}

export async function getRecentMaterials(userId: string, limit = 5): Promise<Material[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("materials")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`getRecentMaterials failed: ${error.message}`);
  return (data ?? []) as Material[];
}

export async function getMaterialById(
  userId: string,
  materialId: string,
): Promise<Material | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("materials")
    .select("*")
    .eq("user_id", userId)
    .eq("id", materialId)
    .maybeSingle();

  if (error) throw new Error(`getMaterialById failed: ${error.message}`);
  return data as Material | null;
}

export async function createMaterial(
  userId: string,
  input: CreateMaterialInput,
): Promise<Material> {
  const { data, error } = await getSupabaseAdmin()
    .from("materials")
    .insert({
      user_id: userId,
      title: input.title,
      type: input.type,
      subject: input.subject ?? "",
      grade: input.grade ?? "",
      content: input.content ?? {},
      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw new Error(`createMaterial failed: ${error.message}`);
  return data as Material;
}

export async function renameMaterial(
  userId: string,
  materialId: string,
  title: string,
): Promise<Material> {
  const { data, error } = await getSupabaseAdmin()
    .from("materials")
    .update({ title })
    .eq("user_id", userId)
    .eq("id", materialId)
    .select("*")
    .single();

  if (error) throw new Error(`renameMaterial failed: ${error.message}`);
  return data as Material;
}

export async function duplicateMaterial(userId: string, materialId: string): Promise<Material> {
  const source = await getMaterialById(userId, materialId);
  if (!source) throw new Error("NOT_FOUND");

  const { data, error } = await getSupabaseAdmin()
    .from("materials")
    .insert({
      user_id: userId,
      title: `${source.title} (көшірме)`,
      type: source.type,
      subject: source.subject,
      grade: source.grade,
      content: source.content,
      metadata: source.metadata,
    })
    .select("*")
    .single();

  if (error) throw new Error(`duplicateMaterial failed: ${error.message}`);
  return data as Material;
}

export async function deleteMaterial(userId: string, materialId: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("materials")
    .delete()
    .eq("user_id", userId)
    .eq("id", materialId);

  if (error) throw new Error(`deleteMaterial failed: ${error.message}`);
}

export async function setMaterialFavoriteFlag(
  userId: string,
  materialId: string,
  isFavorite: boolean,
): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("materials")
    .update({ is_favorite: isFavorite })
    .eq("user_id", userId)
    .eq("id", materialId);

  if (error) throw new Error(`setMaterialFavoriteFlag failed: ${error.message}`);
}

export async function getMaterialStats(
  userId: string,
): Promise<{ total: number; favorites: number }> {
  const { count: total, error: totalError } = await getSupabaseAdmin()
    .from("materials")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (totalError) throw new Error(`getMaterialStats failed: ${totalError.message}`);

  const { count: favorites, error: favError } = await getSupabaseAdmin()
    .from("materials")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_favorite", true);

  if (favError) throw new Error(`getMaterialStats failed: ${favError.message}`);

  return { total: total ?? 0, favorites: favorites ?? 0 };
}
