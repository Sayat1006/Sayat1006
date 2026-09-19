"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { saveMaterialAction } from "@/lib/actions/materials";
import type { MaterialType } from "@/lib/db/types";

interface SaveMaterialButtonProps {
  type: MaterialType;
  title: string;
  subject?: string;
  grade?: string;
  content: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  savedMessage?: string;
  viewLinkLabel?: string;
}

function SaveMaterialButton({
  type,
  title,
  subject,
  grade,
  content,
  metadata,
  savedMessage = "Материал сақталды",
  viewLinkLabel = "Материалдарды көру",
}: SaveMaterialButtonProps) {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  async function handleSave() {
    setState("saving");
    const result = await saveMaterialAction({ title, type, subject, grade, content, metadata });

    if (!result.success) {
      toast.error(result.error ?? "Сақтау кезінде қате пайда болды.");
      setState("idle");
      return;
    }

    toast.success(savedMessage);
    setState("saved");
  }

  if (state === "saved") {
    return (
      <Button variant="secondary" size="sm" disabled>
        <Check className="size-3.5 text-success" />
        Сақталды
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <Button variant="secondary" size="sm" onClick={handleSave} disabled={state === "saving"}>
        <Save className="size-3.5" />
        {state === "saving" ? "Сақталуда..." : "Сақтау"}
      </Button>
      {state === "idle" ? null : (
        <Link href="/dashboard/materials" className="text-xs font-medium text-primary/60 hover:underline">
          {viewLinkLabel}
        </Link>
      )}
    </div>
  );
}

export { SaveMaterialButton };
