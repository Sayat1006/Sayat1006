import {
  NotebookPen,
  MonitorPlay,
  ListChecks,
  FileSpreadsheet,
  FileText,
  Layers,
  Home,
  MessageCircleHeart,
} from "lucide-react";
import type { SolutionItem } from "@/lib/types";

export const solutionItems: SolutionItem[] = [
  { icon: NotebookPen, title: "ҚМЖ" },
  { icon: MonitorPlay, title: "Презентация" },
  { icon: ListChecks, title: "Тест" },
  { icon: FileSpreadsheet, title: "Жұмыс парағы" },
  { icon: FileText, title: "Дескриптор" },
  { icon: Layers, title: "Саралау" },
  { icon: Home, title: "Үй тапсырмасы" },
  { icon: MessageCircleHeart, title: "Рефлексия" },
];
