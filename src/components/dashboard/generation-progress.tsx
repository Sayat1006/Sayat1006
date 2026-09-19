"use client";

import { CheckCircle2, Circle, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface GenerationProgressProps {
  steps: string[];
  activeStep: number;
  className?: string;
}

function GenerationProgress({ steps, activeStep, className }: GenerationProgressProps) {
  return (
    <div className={cn("space-y-4", className)} role="status" aria-live="polite">
      {steps.map((step, index) => {
        const isDone = index < activeStep || (index === activeStep && index === steps.length - 1);
        const isActive = index === activeStep && !isDone;

        return (
          <div key={step} className="flex items-center gap-3">
            {isDone ? (
              <CheckCircle2 className="size-5 shrink-0 text-success" />
            ) : isActive ? (
              <Loader2 className="size-5 shrink-0 animate-spin text-cyan" />
            ) : (
              <Circle className="size-5 shrink-0 text-primary/15" />
            )}
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                index <= activeStep ? "text-primary" : "text-muted",
              )}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export { GenerationProgress };
