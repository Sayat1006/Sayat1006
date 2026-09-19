import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white shadow-lifted hover:shadow-glow-cyan hover:-translate-y-0.5 active:translate-y-0",
        gradient:
          "bg-[linear-gradient(90deg,var(--color-cyan),var(--color-violet))] text-white shadow-glow-violet hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-surface text-primary border border-primary/10 shadow-soft hover:border-primary/20 hover:-translate-y-0.5 active:translate-y-0",
        ghost: "text-primary hover:bg-primary/5",
        outline:
          "border border-white/20 text-white hover:bg-white/10 hover:-translate-y-0.5",
      },
      size: {
        default: "h-12 px-6 text-[15px]",
        sm: "h-10 px-4 text-sm",
        lg: "h-14 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
