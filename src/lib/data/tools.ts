import {
  NotebookPen,
  MonitorPlay,
  FileCheck2,
  FileBarChart,
  ListChecks,
  FileSpreadsheet,
  Clapperboard,
  Bot,
} from "lucide-react";
import type { ToolItem } from "@/lib/types";

export const toolItems: ToolItem[] = [
  {
    icon: NotebookPen,
    title: "ҚМЖ",
    description: "Қысқа мерзімді жоспарды мақсат, әдіс және бағалаумен бірге жасайды.",
    accent: "cyan",
  },
  {
    icon: MonitorPlay,
    title: "Презентация",
    description: "Тақырыпқа сай слайд құрылымы мен мазмұнын автоматты құрастырады.",
    accent: "violet",
  },
  {
    icon: FileCheck2,
    title: "БЖБ",
    description: "Бөлім бойынша жиынтық бағалау тапсырмалары мен өлшемдер.",
    accent: "cyan",
  },
  {
    icon: FileBarChart,
    title: "ТЖБ",
    description: "Тоқсандық жиынтық бағалауға арналған кешенді тапсырмалар.",
    accent: "violet",
  },
  {
    icon: ListChecks,
    title: "Тест",
    description: "Күрделілік деңгейі бойынша сұрақтар мен жауап кілттері.",
    accent: "cyan",
  },
  {
    icon: FileSpreadsheet,
    title: "Жұмыс парағы",
    description: "Сыныпта немесе үйде орындауға дайын тапсырмалар парағы.",
    accent: "violet",
  },
  {
    icon: Clapperboard,
    title: "Сабақ сценарийі",
    description: "Сабақтың әр кезеңін қадам-қадаммен сипаттайтын сценарий.",
    accent: "cyan",
  },
  {
    icon: Bot,
    title: "AI Көмекші",
    description: "Кез келген сұрағыңызға сабаққа қатысты жауап беретін көмекші.",
    accent: "violet",
  },
];
