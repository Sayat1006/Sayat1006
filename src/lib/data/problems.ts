import {
  NotebookPen,
  ListChecks,
  FileText,
  MonitorPlay,
  ClipboardList,
  FolderKanban,
} from "lucide-react";
import type { ProblemItem } from "@/lib/types";

export const problemItems: ProblemItem[] = [
  {
    icon: NotebookPen,
    title: "ҚМЖ дайындау",
    description: "Әр сабаққа қысқа мерзімді жоспар жазу сағаттап уақыт алады.",
  },
  {
    icon: ListChecks,
    title: "Тапсырма құрастыру",
    description: "Деңгейлік тапсырмаларды нөлден ойлап табу оңай емес.",
  },
  {
    icon: FileText,
    title: "Дескриптор жазу",
    description: "Бағалау критерийлері мен дескрипторларды нақтылау көп күш талап етеді.",
  },
  {
    icon: MonitorPlay,
    title: "Презентация жасау",
    description: "Слайд дизайны мен мазмұнын үйлестіру артық уақыт жейді.",
  },
  {
    icon: ClipboardList,
    title: "БЖБ / ТЖБ дайындау",
    description: "Жиынтық бағалау тапсырмаларын құрастыру жауапкершілігі жоғары.",
  },
  {
    icon: FolderKanban,
    title: "Материалдарды реттеу",
    description: "Барлық құжаттарды сақтап, ретке келтіру өз алдына бөлек жұмыс.",
  },
];
