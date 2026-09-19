import { cn } from "@/lib/utils";

function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span
      className={cn(
        "font-display inline-flex items-center gap-2 text-xl font-extrabold tracking-tight",
        light ? "text-white" : "text-primary",
        className,
      )}
    >
      <span className="relative flex size-8 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-cyan),var(--color-violet))] text-white shadow-glow-cyan">
        <span className="text-sm font-black">S</span>
      </span>
      S-AI
    </span>
  );
}

export { Logo };
