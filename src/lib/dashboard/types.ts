import type { LucideIcon } from "lucide-react";

export type ToolType =
  | "qmj"
  | "presentation"
  | "test"
  | "bzb"
  | "tzb"
  | "worksheet"
  | "scenario";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface ToolCardData {
  type: ToolType | "assistant";
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export interface Material {
  id: string;
  title: string;
  type: ToolType;
  subject: string;
  grade: string;
  createdAt: string;
  favorite: boolean;
}

export interface TokenTransaction {
  id: string;
  label: string;
  amount: number;
  date: string;
}

export interface CreditPackage {
  name: string;
  tokens: number;
  price: string;
  description: string;
  highlighted?: boolean;
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

export interface TeacherProfile {
  name: string;
  subject: string;
  school: string;
  grades: string[];
  language: string;
  email: string;
}

export interface LessonStage {
  id: string;
  label: string;
  description: string;
}

export interface QmjRow {
  stage: string;
  teacherAction: string;
  studentAction: string;
  assessment: string;
  resources: string;
}

export interface QmjContent {
  topic: string;
  learningObjective: string;
  lessonGoal: string;
  successCriteria: string[];
  rows: QmjRow[];
}

export type QuestionType =
  | "single"
  | "multiple"
  | "boolean"
  | "matching"
  | "short";

export interface TestQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
}

export interface Slide {
  id: string;
  title: string;
  bullets: string[];
}

export interface AssessmentTask {
  id: string;
  criterion: string;
  descriptor: string;
  task: string;
  points: number;
}

export interface WorksheetTask {
  id: string;
  instruction: string;
  type: "open" | "choice" | "fill";
}

export interface ScenarioSection {
  id: string;
  title: string;
  content: string[];
}

export interface GenerationStepDef {
  label: string;
}
