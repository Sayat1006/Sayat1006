import Link from "next/link";
import { FolderOpen } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { toolTypeLabels } from "@/lib/dashboard/constants";
import { formatDate } from "@/lib/format-date";
import type { Material } from "@/lib/db/types";

function RecentMaterials({ materials }: { materials: Material[] }) {
  if (materials.length === 0) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="Әзірге материал жоқ."
        description="Алғашқы сабағыңызды жасап көріңіз."
      >
        <Button variant="gradient" asChild>
          <a href="#quick-lesson">Жаңа сабақ жасау</a>
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className="space-y-2.5">
      {materials.map((material) => (
        <Link
          key={material.id}
          href="/dashboard/materials"
          className="flex items-center gap-4 rounded-2xl border border-primary/8 bg-surface p-4 shadow-soft transition-colors hover:border-cyan/20"
        >
          <span className="hidden shrink-0 items-center justify-center rounded-xl bg-primary/5 px-3 py-2.5 text-xs font-bold text-primary/70 sm:flex">
            {toolTypeLabels[material.type]}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-sm font-semibold text-primary sm:text-base">
              {material.title}
            </span>
            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted">
              <span className="sm:hidden">{toolTypeLabels[material.type]} ·</span>
              {material.subject ? <span>{material.subject} ·</span> : null}
              <span>{formatDate(material.created_at)}</span>
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}

export { RecentMaterials };
