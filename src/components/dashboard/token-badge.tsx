import { Coins } from "lucide-react";

import { cn } from "@/lib/utils";

function TokenBadge({ amount, className }: { amount: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary",
        className,
      )}
    >
      <Coins className="size-3.5 text-violet" />
      {amount} S-Tokens
    </span>
  );
}

export { TokenBadge };
