import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

function DashboardHeader({ title, description, className, children }: DashboardHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        <h1 className="font-display text-2xl font-bold text-primary sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1.5 text-sm text-muted sm:text-base">{description}</p> : null}
      </div>
      {children ? <div className="flex shrink-0 items-center gap-2">{children}</div> : null}
    </div>
  );
}

export { DashboardHeader };
