import { NotebookPen, MonitorPlay, ListChecks, FileSpreadsheet, Home } from "lucide-react";
import type { LessonPackageItem } from "@/lib/types";

export const lessonPackageItems: LessonPackageItem[] = [
  { icon: NotebookPen, label: "ҚМЖ" },
  { icon: MonitorPlay, label: "Презентация" },
  { icon: ListChecks, label: "Тест" },
  { icon: FileSpreadsheet, label: "Жұмыс парағы" },
  { icon: Home, label: "Үй тапсырмасы" },
];
