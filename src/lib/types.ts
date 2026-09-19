import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
}

export interface TrustItem {
  icon: LucideIcon;
  label: string;
}

export interface ProblemItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface SolutionItem {
  icon: LucideIcon;
  title: string;
}

export interface ToolItem {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: "cyan" | "violet";
}

export interface StepItem {
  number: string;
  title: string;
  description: string;
}

export interface PlanFeature {
  label: string;
  included: boolean;
}

export interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  priceNote: string;
  features: PlanFeature[];
  cta: string;
  highlighted?: boolean;
  accent?: "cyan" | "violet" | "primary";
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface AssistantPrompt {
  text: string;
}

export interface LessonPackageItem {
  icon: LucideIcon;
  label: string;
}
