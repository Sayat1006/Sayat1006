import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full resize-y rounded-xl border border-primary/12 bg-surface px-3.5 py-3 text-sm font-medium text-primary outline-none transition-colors placeholder:font-normal placeholder:text-muted/60 focus:border-cyan/50 focus:ring-2 focus:ring-cyan/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger/50 aria-invalid:ring-danger/15",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
