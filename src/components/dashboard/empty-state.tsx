import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}

function EmptyState({ icon: Icon, title, description, className, children }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary/15 bg-surface px-6 py-16 text-center",
        className,
      )}
    >
      <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/5 text-primary/40">
        <Icon className="size-7" />
      </span>
      <h3 className="font-display mt-4 text-lg font-semibold text-primary">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}

export { EmptyState };
