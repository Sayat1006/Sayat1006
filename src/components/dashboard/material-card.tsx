"use client";

import {
  Copy,
  Download,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toolTypeLabels } from "@/lib/dashboard/constants";
import type { Material } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

interface MaterialCardProps {
  material: Material;
  onOpen: (material: Material) => void;
  onRename: (material: Material) => void;
  onDuplicate: (material: Material) => void;
  onToggleFavorite: (material: Material) => void;
  onDelete: (material: Material) => void;
  onExport: (material: Material) => void;
}

function MaterialCard({
  material,
  onOpen,
  onRename,
  onDuplicate,
  onToggleFavorite,
  onDelete,
  onExport,
}: MaterialCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-primary/8 bg-surface p-4 shadow-soft transition-colors hover:border-cyan/20 sm:p-5">
      <button
        type="button"
        onClick={() => onOpen(material)}
        className="flex min-w-0 flex-1 items-center gap-4 text-left"
      >
        <span className="hidden shrink-0 items-center justify-center rounded-xl bg-primary/5 px-3 py-2.5 text-xs font-bold text-primary/70 sm:flex">
          {toolTypeLabels[material.type]}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate font-display text-sm font-semibold text-primary sm:text-base">
              {material.title}
            </span>
            <span className="inline-flex shrink-0 rounded-full bg-primary/5 px-2 py-0.5 text-[11px] font-semibold text-primary/60 sm:hidden">
              {toolTypeLabels[material.type]}
            </span>
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted">
            <span>{material.subject}</span>
            <span aria-hidden>·</span>
            <span>{material.grade}-сынып</span>
            <span aria-hidden>·</span>
            <span>{material.createdAt}</span>
          </span>
        </span>
      </button>

      <button
        type="button"
        onClick={() => onToggleFavorite(material)}
        aria-pressed={material.favorite}
        aria-label={material.favorite ? "Таңдаулылардан алып тастау" : "Таңдаулыға қосу"}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary/5"
      >
        <Star className={cn("size-4.5", material.favorite && "fill-violet text-violet")} />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Әрекеттер мәзірі"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary/5"
          >
            <MoreHorizontal className="size-4.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => onOpen(material)}>
            <FolderOpen className="size-4" />
            Ашу
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onRename(material)}>
            <Pencil className="size-4" />
            Атын өзгерту
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onDuplicate(material)}>
            <Copy className="size-4" />
            Көшірмесін жасау
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onExport(material)}>
            <Download className="size-4" />
            Экспорттау
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="danger" onSelect={() => onDelete(material)}>
            <Trash2 className="size-4" />
            Жою
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export { MaterialCard };
