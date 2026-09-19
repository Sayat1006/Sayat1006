"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { pricingPlans } from "@/lib/data/pricing";
import { cn } from "@/lib/utils";

function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Бағалар"
          title="Мұғалімнің қажетіне сай жоспар"
          description="Кез келген жоспарды кейін өзгертуге болады."
        />

        <div className="mt-8 flex items-center justify-center gap-3">
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              !yearly ? "text-primary" : "text-muted",
            )}
          >
            Айлық
          </span>
          <Switch checked={yearly} onCheckedChange={setYearly} aria-label="Жылдық/айлық баға" />
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
              yearly ? "text-primary" : "text-muted",
            )}
          >
            Жылдық
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
              үнемдеу
            </span>
          </span>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={cn(
                "relative flex flex-col rounded-3xl border p-6 sm:p-7",
                plan.highlighted
                  ? "border-transparent bg-primary text-white shadow-glow-violet lg:-translate-y-3"
                  : "border-primary/8 bg-surface shadow-soft",
              )}
            >
              {plan.highlighted ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[linear-gradient(90deg,var(--color-cyan),var(--color-violet))] px-4 py-1 text-xs font-bold text-white shadow-glow-cyan">
                  Ең танымал
                </span>
              ) : null}

              <h3
                className={cn(
                  "font-display text-lg font-bold",
                  plan.highlighted ? "text-white" : "text-primary",
                )}
              >
                {plan.name}
              </h3>
              <p
                className={cn(
                  "mt-1.5 text-sm",
                  plan.highlighted ? "text-white/65" : "text-muted",
                )}
              >
                {plan.description}
              </p>

              <div className="mt-6">
                <span
                  className={cn(
                    "font-display text-3xl font-extrabold",
                    plan.highlighted ? "text-white" : "text-primary",
                  )}
                >
                  {yearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <p
                  className={cn(
                    "mt-1 text-xs",
                    plan.highlighted ? "text-white/50" : "text-muted",
                  )}
                >
                  {plan.priceNote}
                </p>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.label} className="flex items-start gap-2.5 text-sm">
                    {feature.included ? (
                      <Check
                        className={cn(
                          "mt-0.5 size-4 shrink-0",
                          plan.highlighted ? "text-cyan" : "text-success",
                        )}
                      />
                    ) : (
                      <Minus
                        className={cn(
                          "mt-0.5 size-4 shrink-0",
                          plan.highlighted ? "text-white/30" : "text-muted/50",
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        feature.included
                          ? plan.highlighted
                            ? "text-white/90"
                            : "text-primary/80"
                          : plan.highlighted
                            ? "text-white/40"
                            : "text-muted/70",
                      )}
                    >
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlighted ? "gradient" : "secondary"}
                size="lg"
                className="mt-7 w-full"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export { Pricing };
