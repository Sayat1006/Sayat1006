import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full text-xs font-medium px-3 py-1",
  {
    variants: {
      variant: {
        default: "bg-primary/5 text-primary border border-primary/10",
        cyan: "bg-cyan/10 text-[#0b7ea8] border border-cyan/20",
        violet: "bg-violet/10 text-[#5a3fd6] border border-violet/20",
        outline: "border border-white/20 text-white",
        glass: "glass text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}

export { Badge, badgeVariants };
