"use client";

import { Copy, FileDown, Pencil, Printer } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type ExportAction = "edit" | "copy" | "docx" | "pdf" | "print";

interface ExportButtonsProps {
  actions?: ExportAction[];
  copyText?: string;
  copyToastMessage?: string;
  editing?: boolean;
  onToggleEdit?: () => void;
  documentName?: string;
  className?: string;
}

function ExportButtons({
  actions = ["edit", "copy", "docx", "pdf"],
  copyText,
  copyToastMessage = "Мазмұн көшірілді",
  editing,
  onToggleEdit,
  documentName = "Материал",
  className,
}: ExportButtonsProps) {
  async function handleCopy() {
    try {
      if (copyText) {
        await navigator.clipboard.writeText(copyText);
      }
      toast.success(copyToastMessage);
    } catch {
      toast.error("Көшіру мүмкін болмады");
    }
  }

  function handleExport(format: "DOCX" | "PDF") {
    toast.success(`${documentName} ${format} форматында дайындалды`, {
      description: "Бұл демо режим — жүктеп алу функциясы келесі кезеңде қосылады.",
    });
  }

  function handlePrint() {
    toast.info("Баспаға шығару дайындалуда", {
      description: "Демо режимде нақты баспа функциясы әлі қосылмаған.",
    });
  }

  return (
    <div className={className ? className : "flex flex-wrap gap-2.5"}>
      {actions.includes("edit") ? (
        <Button variant={editing ? "gradient" : "secondary"} size="sm" onClick={onToggleEdit}>
          <Pencil className="size-3.5" />
          {editing ? "Өңдеуді аяқтау" : "Өңдеу"}
        </Button>
      ) : null}
      {actions.includes("copy") ? (
        <Button variant="secondary" size="sm" onClick={handleCopy}>
          <Copy className="size-3.5" />
          Көшіру
        </Button>
      ) : null}
      {actions.includes("print") ? (
        <Button variant="secondary" size="sm" onClick={handlePrint}>
          <Printer className="size-3.5" />
          Print
        </Button>
      ) : null}
      {actions.includes("docx") ? (
        <Button variant="secondary" size="sm" onClick={() => handleExport("DOCX")}>
          <FileDown className="size-3.5" />
          DOCX
        </Button>
      ) : null}
      {actions.includes("pdf") ? (
        <Button variant="secondary" size="sm" onClick={() => handleExport("PDF")}>
          <FileDown className="size-3.5" />
          PDF
        </Button>
      ) : null}
    </div>
  );
}

export { ExportButtons };
