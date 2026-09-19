"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-7 w-13 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-primary/15 transition-colors data-[state=checked]:bg-[linear-gradient(90deg,var(--color-cyan),var(--color-violet))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-5.5 translate-x-0.5 rounded-full bg-white shadow-soft transition-transform data-[state=checked]:translate-x-6.5"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
