import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-xl border border-primary/12 bg-surface px-3.5 text-sm font-medium text-primary outline-none transition-colors placeholder:font-normal placeholder:text-muted/60 focus:border-cyan/50 focus:ring-2 focus:ring-cyan/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger/50 aria-invalid:ring-danger/15",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
