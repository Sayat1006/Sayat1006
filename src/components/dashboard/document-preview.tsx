import { cn } from "@/lib/utils";

interface DocumentPreviewProps {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}

function DocumentPreview({ title, subtitle, className, children }: DocumentPreviewProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-primary/10 bg-surface shadow-soft",
        className,
      )}
    >
      <div className="border-b border-primary/8 px-6 py-5 sm:px-8 sm:py-6">
        <h2 className="font-display text-lg font-bold text-primary sm:text-xl">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      </div>
      <div className="px-6 py-6 sm:px-8 sm:py-8">{children}</div>
    </div>
  );
}

export { DocumentPreview };
