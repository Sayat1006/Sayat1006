"use client";

import { useMemo, useState } from "react";
import { FolderOpen, Search } from "lucide-react";
import { toast } from "sonner";

import { DashboardHeader } from "@/components/dashboard/header";
import { MaterialCard } from "@/components/dashboard/material-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMaterials } from "@/lib/dashboard/materials-context";
import type { Material } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

const FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "Барлығы" },
  { value: "qmj", label: "ҚМЖ" },
  { value: "presentation", label: "Презентация" },
  { value: "test", label: "Тест" },
  { value: "bzb", label: "БЖБ" },
  { value: "tzb", label: "ТЖБ" },
  { value: "worksheet", label: "Жұмыс парағы" },
];

const SORTS = [
  { value: "newest", label: "Жаңасы" },
  { value: "oldest", label: "Ескісі" },
  { value: "title", label: "Атауы" },
];

export default function MaterialsPage() {
  const { materials, toggleFavorite, rename, duplicate, remove } = useMaterials();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [deleteTarget, setDeleteTarget] = useState<Material | null>(null);
  const [renameTarget, setRenameTarget] = useState<Material | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const filtered = useMemo(() => {
    let list = materials.filter((m) => (filter === "all" ? true : m.type === filter));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((m) => m.title.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q));
    }
    list = [...list];
    if (sort === "oldest") list.reverse();
    if (sort === "title") list.sort((a, b) => a.title.localeCompare(b.title, "kk"));
    return list;
  }, [materials, filter, search, sort]);

  function handleOpen(material: Material) {
    toast.info(`«${material.title}» ашылуда`, { description: "Демо режимде толық қарау әлі қосылмаған." });
  }

  function handleDuplicate(material: Material) {
    duplicate(material.id);
    toast.success("Материал көшірілді");
  }

  function handleToggleFavorite(material: Material) {
    toggleFavorite(material.id);
    toast.success(material.favorite ? "Таңдаулылардан алынды" : "Таңдаулыға қосылды");
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

  function openRename(material: Material) {
    setRenameTarget(material);
    setRenameValue(material.title);
  }

  function confirmRename() {
    if (!renameTarget) return;
    if (!renameValue.trim()) {
      toast.error("Атау бос болмауы керек");
      return;
    }
    rename(renameTarget.id, renameValue.trim());
    toast.success("Атауы өзгертілді");
    setRenameTarget(null);
  }

  return (
    <div className="space-y-6">
      <DashboardHeader title="Менің материалдарым" description="Барлық дайындалған материалдарыңыз осы жерде." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Материалды іздеу..."
            className="pl-10"
            aria-label="Материалды іздеу"
          />
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORTS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            aria-pressed={filter === f.value}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              filter === f.value
                ? "border-cyan/40 bg-cyan/10 text-[#0b7ea8]"
                : "border-primary/10 bg-surface text-primary/70 hover:border-primary/20",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              onOpen={handleOpen}
              onRename={openRename}
              onDuplicate={handleDuplicate}
              onToggleFavorite={handleToggleFavorite}
              onDelete={setDeleteTarget}
              onExport={handleExport}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderOpen}
          title="Материал табылмады"
          description="Іздеу немесе сүзгі шарттарына сай материал жоқ. Басқа сөз бойынша іздеп көріңіз."
        />
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

      <Dialog open={Boolean(renameTarget)} onOpenChange={(open) => !open && setRenameTarget(null)}>
        <DialogContent>
          <DialogTitle>Атауын өзгерту</DialogTitle>
          <DialogDescription>Материалға жаңа атау беріңіз.</DialogDescription>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            className="mt-4"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && confirmRename()}
          />
          <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setRenameTarget(null)}>
              Бас тарту
            </Button>
            <Button variant="gradient" onClick={confirmRename}>
              Сақтау
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
