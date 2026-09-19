"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { DashboardHeader } from "@/components/dashboard/header";
import { MaterialCard } from "@/components/dashboard/material-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useMaterials } from "@/lib/dashboard/materials-context";
import type { Material } from "@/lib/dashboard/types";

export default function FavoritesPage() {
  const { materials, toggleFavorite, duplicate, remove } = useMaterials();
  const [deleteTarget, setDeleteTarget] = useState<Material | null>(null);

  const favorites = materials.filter((m) => m.favorite);

  function handleOpen(material: Material) {
    toast.info(`«${material.title}» ашылуда`);
  }

  function handleDuplicate(material: Material) {
    duplicate(material.id);
    toast.success("Материал көшірілді");
  }

  function handleToggleFavorite(material: Material) {
    toggleFavorite(material.id);
    toast.success("Таңдаулылардан алынды");
  }

  function handleExport(material: Material) {
    toast.success(`«${material.title}» экспортталды`);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    toast.success("Материал жойылды");
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      <DashboardHeader title="Таңдаулылар" description="Жиі қолданатын материалдарыңызды осы жерден тез табыңыз." />

      {favorites.length > 0 ? (
        <div className="space-y-3">
          {favorites.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              onOpen={handleOpen}
              onRename={() => toast.info("Атауын өзгерту үшін «Менің материалдарым» бөліміне өтіңіз")}
              onDuplicate={handleDuplicate}
              onToggleFavorite={handleToggleFavorite}
              onDelete={setDeleteTarget}
              onExport={handleExport}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Star}
          title="Таңдаулылар әлі бос"
          description="Материалдар тізімінде жұлдызша белгісін басып, жиі қолданатын материалдарды осы жерге қосыңыз."
        >
          <Button variant="secondary" asChild>
            <Link href="/dashboard/materials">Материалдарды қарау</Link>
          </Button>
        </EmptyState>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Материалды жою"
        description={`«${deleteTarget?.title}» материалын жойғыңыз келе ме? Бұл әрекетті кері қайтару мүмкін емес.`}
        confirmLabel="Жою"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}
