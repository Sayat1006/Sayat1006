"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Menu, X } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { navItems } from "@/lib/data/nav";
import { cn } from "@/lib/utils";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass shadow-soft" : "bg-transparent",
      )}
    >
      <Container className="flex h-18 items-center justify-between py-3.5">
        <a href="#hero" aria-label="S-AI басты бет">
          <Logo />
        </a>

        <nav aria-label="Негізгі навигация" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-primary/80 transition-colors hover:bg-primary/5 hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-primary/70 transition-colors hover:bg-primary/5"
            aria-label="Тілді таңдау"
          >
            <Globe className="size-4" />
            KZ
          </button>
          <Button variant="ghost" size="sm">
            Кіру
          </Button>
          <Button variant="gradient" size="sm">
            Тегін бастау
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex size-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/5 lg:hidden"
          aria-label="Мәзірді ашу"
          aria-expanded={open}
        >
          <Menu className="size-6" />
        </button>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Мобильді мәзір"
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-surface p-6 shadow-lifted"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex size-10 items-center justify-center rounded-full text-primary hover:bg-primary/5"
                  aria-label="Мәзірді жабу"
                >
                  <X className="size-6" />
                </button>
              </div>

              <nav aria-label="Мобильді навигация" className="mt-8 flex flex-col gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3.5 text-base font-medium text-primary transition-colors hover:bg-primary/5"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-3">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-primary/10 px-4 py-3 text-sm font-medium text-primary/70"
                >
                  <Globe className="size-4" />
                  KZ
                </button>
                <Button variant="secondary" size="lg" className="w-full">
                  Кіру
                </Button>
                <Button variant="gradient" size="lg" className="w-full">
                  Тегін бастау
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export { Header };
