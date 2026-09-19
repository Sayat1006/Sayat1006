"use client";

import { createContext, useContext, useMemo, useState } from "react";

import { materials as seedMaterials } from "@/lib/dashboard/mock-data";
import type { Material } from "@/lib/dashboard/types";

interface MaterialsContextValue {
  materials: Material[];
  toggleFavorite: (id: string) => void;
  rename: (id: string, title: string) => void;
  duplicate: (id: string) => void;
  remove: (id: string) => void;
}

const MaterialsContext = createContext<MaterialsContextValue | null>(null);

export function MaterialsProvider({ children }: { children: React.ReactNode }) {
  const [materials, setMaterials] = useState<Material[]>(seedMaterials);

  const value = useMemo<MaterialsContextValue>(
    () => ({
      materials,
      toggleFavorite: (id) =>
        setMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, favorite: !m.favorite } : m))),
      rename: (id, title) =>
        setMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, title } : m))),
      duplicate: (id) =>
        setMaterials((prev) => {
          const source = prev.find((m) => m.id === id);
          if (!source) return prev;
          const copy: Material = {
            ...source,
            id: `${source.id}-copy-${Date.now()}`,
            title: `${source.title} (көшірме)`,
            createdAt: "Бүгін",
          };
          return [copy, ...prev];
        }),
      remove: (id) => setMaterials((prev) => prev.filter((m) => m.id !== id)),
    }),
    [materials],
  );

  return <MaterialsContext.Provider value={value}>{children}</MaterialsContext.Provider>;
}

export function useMaterials() {
  const ctx = useContext(MaterialsContext);
  if (!ctx) {
    throw new Error("useMaterials must be used within a MaterialsProvider");
  }
  return ctx;
}
