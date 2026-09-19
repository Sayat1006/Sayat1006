import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ToolCardData } from "@/lib/dashboard/types";

function ToolCard({ tool }: { tool: ToolCardData }) {
  return (
    <Link
      href={tool.href}
      className="group relative flex flex-col rounded-2xl border border-primary/8 bg-surface p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-cyan/25 hover:shadow-lifted focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/40"
    >
      <div className="flex items-start justify-between">
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-cyan),var(--color-violet))] text-white">
          <tool.icon className="size-5.5" />
        </span>
        <ArrowUpRight className="size-4 text-muted/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan" />
      </div>
      <h3 className="font-display mt-4 text-base font-semibold text-primary">{tool.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{tool.description}</p>
    </Link>
  );
}

export { ToolCard };
