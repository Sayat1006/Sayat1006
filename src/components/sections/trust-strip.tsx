import { Container } from "@/components/ui/container";
import { trustItems } from "@/lib/data/trust";

function TrustStrip() {
  return (
    <section className="border-y border-primary/8 bg-surface py-6">
      <Container>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {trustItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-center gap-2.5 rounded-xl px-3 py-2 text-center sm:justify-start"
            >
              <item.icon className="size-4.5 shrink-0 text-violet" />
              <span className="text-sm font-semibold text-primary/80">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export { TrustStrip };
