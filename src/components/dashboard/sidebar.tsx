"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, User } from "lucide-react";

import {
  dashboardBottomNav,
  dashboardLibraryNav,
  dashboardToolNav,
} from "@/lib/dashboard/constants";
import { teacherProfile, tokenBalance } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-white/10 text-white"
          : "text-white/55 hover:bg-white/5 hover:text-white/90",
      )}
    >
      <Icon
        className={cn(
          "size-[18px] shrink-0 transition-colors",
          active ? "text-cyan" : "text-white/40 group-hover:text-white/70",
        )}
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/5 bg-primary lg:flex">
      <div className="flex h-18 items-center gap-2 px-5">
        <span className="inline-flex size-8 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-cyan),var(--color-violet))] text-white shadow-glow-cyan">
          <span className="text-sm font-black">S</span>
        </span>
        <span className="font-display text-lg font-extrabold text-white">S-AI</span>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4" aria-label="Негізгі навигация">
        <div className="space-y-1">
          {dashboardToolNav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={pathname === item.href}
            />
          ))}
        </div>

        <div className="border-t border-white/8 pt-4">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-white/30">
            Кітапхана
          </p>
          <div className="space-y-1">
            {dashboardLibraryNav.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={pathname === item.href}
              />
            ))}
          </div>
        </div>
      </nav>

      <div className="space-y-3 border-t border-white/8 p-3">
        <Link
          href="/dashboard/tokens"
          className="flex items-center justify-between rounded-xl bg-white/5 px-3.5 py-2.5 transition-colors hover:bg-white/10"
        >
          <span className="text-xs font-medium text-white/60">S-Tokens</span>
          <span className="font-display text-sm font-bold text-cyan">{tokenBalance}</span>
        </Link>

        <div className="space-y-1">
          {dashboardBottomNav.map((item, i) => (
            <NavLink
              key={`${item.href}-${i}`}
              href={item.href}
              label={item.label}
              icon={i === 0 ? User : Settings}
              active={pathname === item.href && i === 0}
            />
          ))}
        </div>

        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-white/5"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-cyan),var(--color-violet))] text-xs font-bold text-white">
            {teacherProfile.name.charAt(0)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-white/85">
              {teacherProfile.name}
            </span>
            <span className="block truncate text-xs text-white/40">{teacherProfile.subject} мұғалімі</span>
          </span>
        </Link>
      </div>
    </aside>
  );
}

export { DashboardSidebar };
