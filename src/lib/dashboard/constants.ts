import {
  Bot,
  FileBarChart,
  FileCheck2,
  FileSpreadsheet,
  Clapperboard,
  ListChecks,
  MonitorPlay,
  NotebookPen,
  Home,
  FolderKanban,
  Star,
  Coins,
  User,
  Settings,
} from "lucide-react";

import type { DashboardNavItem, ToolCardData } from "@/lib/dashboard/types";

export const SUBJECTS = [
  "Физика",
  "Химия",
  "Биология",
  "Математика",
  "Қазақ тілі",
  "Қазақ әдебиеті",
  "Тарих",
  "Ағылшын тілі",
  "Информатика",
];

export const GRADES = ["5", "6", "7", "8", "9", "10", "11"];

export const LANGUAGES = ["Қазақша", "Русский"];

export const DIFFICULTIES = ["Стандарт", "Күрделі", "Шығармашылық"];

export const LESSON_DURATIONS = ["40 минут", "45 минут", "80 минут"];

export const QUARTERS = ["I тоқсан", "II тоқсан", "III тоқсан", "IV тоқсан"];

export const LESSON_TYPES = ["Жаңа білім беру", "Бекіту", "Қайталау-жинақтау", "Аралас сабақ"];

export const PRESENTATION_STYLES = ["Минимализм", "Академиялық", "Заманауи", "Балаларға арналған"];

export const QUESTION_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "single", label: "Бір дұрыс жауап" },
  { value: "multiple", label: "Бірнеше дұрыс жауап" },
  { value: "boolean", label: "Дұрыс / Бұрыс" },
  { value: "matching", label: "Сәйкестендіру" },
  { value: "short", label: "Қысқа жауап" },
];

export const WORKSHEET_LEVELS = ["Базалық", "Орта", "Жоғары"];

export const dashboardToolNav: DashboardNavItem[] = [
  { label: "Басты бет", href: "/dashboard", icon: Home },
  { label: "ҚМЖ", href: "/dashboard/qmj", icon: NotebookPen },
  { label: "Презентация", href: "/dashboard/presentation", icon: MonitorPlay },
  { label: "Тест", href: "/dashboard/test", icon: ListChecks },
  { label: "БЖБ", href: "/dashboard/bzb", icon: FileCheck2 },
  { label: "ТЖБ", href: "/dashboard/tzb", icon: FileBarChart },
  { label: "Жұмыс парағы", href: "/dashboard/worksheet", icon: FileSpreadsheet },
  { label: "Сабақ сценарийі", href: "/dashboard/scenario", icon: Clapperboard },
  { label: "AI Көмекші", href: "/dashboard/assistant", icon: Bot },
];

export const dashboardLibraryNav: DashboardNavItem[] = [
  { label: "Менің материалдарым", href: "/dashboard/materials", icon: FolderKanban },
  { label: "Таңдаулылар", href: "/dashboard/favorites", icon: Star },
  { label: "S-Tokens", href: "/dashboard/tokens", icon: Coins },
];

export const dashboardBottomNav: DashboardNavItem[] = [
  { label: "Профиль", href: "/dashboard/profile", icon: User },
  { label: "Баптаулар", href: "/dashboard/profile", icon: Settings },
];

export const mobileTabNav: DashboardNavItem[] = [
  { label: "Басты бет", href: "/dashboard", icon: Home },
  { label: "Материалдар", href: "/dashboard/materials", icon: FolderKanban },
  { label: "Көмекші", href: "/dashboard/assistant", icon: Bot },
  { label: "Tokens", href: "/dashboard/tokens", icon: Coins },
  { label: "Профиль", href: "/dashboard/profile", icon: User },
];

export const toolCards: ToolCardData[] = [
  {
    type: "qmj",
    title: "ҚМЖ",
    description: "45 минуттық сабақ жоспарын жасаңыз",
    href: "/dashboard/qmj",
    icon: NotebookPen,
  },
  {
    type: "presentation",
    title: "Презентация",
    description: "Сабаққа арналған слайдтар дайындаңыз",
    href: "/dashboard/presentation",
    icon: MonitorPlay,
  },
  {
    type: "test",
    title: "Тест",
    description: "Тест тапсырмаларын құрастырыңыз",
    href: "/dashboard/test",
    icon: ListChecks,
  },
  {
    type: "bzb",
    title: "БЖБ / ТЖБ",
    description: "Бағалау материалдарын дайындаңыз",
    href: "/dashboard/bzb",
    icon: FileCheck2,
  },
  {
    type: "worksheet",
    title: "Жұмыс парағы",
    description: "Оқушыға арналған материал жасаңыз",
    href: "/dashboard/worksheet",
    icon: FileSpreadsheet,
  },
  {
    type: "assistant",
    title: "AI Көмекші",
    description: "Сабақ туралы кез келген сұрақ қойыңыз",
    href: "/dashboard/assistant",
    icon: Bot,
  },
];

export const toolTypeLabels: Record<string, string> = {
  qmj: "ҚМЖ",
  presentation: "Презентация",
  test: "Тест",
  bzb: "БЖБ",
  tzb: "ТЖБ",
  worksheet: "Жұмыс парағы",
  scenario: "Сабақ сценарийі",
};
