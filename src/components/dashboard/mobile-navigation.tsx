"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import {
  dashboardBottomNav,
  dashboardLibraryNav,
  dashboardToolNav,
  mobileTabNav,
} from "@/lib/dashboard/constants";
import { teacherProfile, tokenBalance } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

function MobileTopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-primary/8 bg-surface/95 px-4 backdrop-blur lg:hidden">
      <Link href="/dashboard" className="flex items-center gap-2">
        <span className="inline-flex size-7 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--color-cyan),var(--color-violet))] text-white">
          <span className="text-xs font-black">S</span>
        </span>
        <span className="font-display text-base font-extrabold text-primary">S-AI</span>
      </Link>

      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/tokens"
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary"
        >
          {tokenBalance} <span className="text-muted">S-T</span>
        </Link>
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Мәзірді ашу"
          className="inline-flex size-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/5"
        >
          <Menu className="size-5" />
        </button>
      </div>
    </header>
  );
}

function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Төменгі навигация"
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-primary/8 bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      {mobileTabNav.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
              active ? "text-cyan" : "text-muted",
            )}
          >
            <item.icon className={cn("size-5", active && "text-cyan")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileMenuDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const allItems = [...dashboardToolNav, ...dashboardLibraryNav];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Дашборд мәзірі"
          className="fixed inset-0 z-[60] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-primary p-5"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          >
            <div className="flex items-center justify-between">
              <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2">
                <span className="inline-flex size-8 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-cyan),var(--color-violet))] text-white">
                  <span className="text-sm font-black">S</span>
                </span>
                <span className="font-display text-lg font-extrabold text-white">S-AI</span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Мәзірді жабу"
                className="inline-flex size-10 items-center justify-center rounded-full text-white/70 hover:bg-white/10"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-white/5 px-3 py-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-cyan),var(--color-violet))] text-xs font-bold text-white">
                {teacherProfile.name.charAt(0)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-white/90">
                  {teacherProfile.name}
                </span>
                <span className="block truncate text-xs text-white/40">{teacherProfile.subject} мұғалімі</span>
              </span>
            </div>

            <nav className="mt-4 flex-1 space-y-1 overflow-y-auto" aria-label="Мобильді дашборд навигациясы">
              {allItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium transition-colors",
                      active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white/90",
                    )}
                  >
                    <item.icon className={cn("size-[18px]", active ? "text-cyan" : "text-white/40")} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-1 border-t border-white/8 pt-3">
              {dashboardBottomNav.map((item, i) => (
                <Link
                  key={`${item.href}-${i}`}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white/90"
                >
                  <item.icon className="size-[18px] text-white/40" />
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function MobileNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <MobileTopBar onOpenMenu={() => setOpen(true)} />
      <MobileMenuDrawer open={open} onClose={() => setOpen(false)} />
      <MobileBottomNav />
    </>
  );
}

export { MobileNavigation };
