import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  current: number;
  className?: string;
}

function StepIndicator({ steps, current, className }: StepIndicatorProps) {
  return (
    <ol className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2", className)}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const done = stepNumber < current;
        const active = stepNumber === current;

        return (
          <li key={step} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold transition-colors",
                  done && "bg-success/15 text-success",
                  active && "bg-primary text-white shadow-soft",
                  !done && !active && "bg-primary/6 text-muted",
                )}
              >
                {done ? <Check className="size-4" /> : String(stepNumber).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "text-sm font-semibold",
                  active ? "text-primary" : done ? "text-primary/70" : "text-muted",
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <span className="hidden h-px flex-1 bg-primary/10 sm:block" aria-hidden />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export { StepIndicator };
