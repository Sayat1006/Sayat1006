import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/ui/container";

const productLinks = [
  { label: "Құралдар", href: "#tools" },
  { label: "Бағалар", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Қолдау", href: "#faq" },
];

const legalLinks = [
  { label: "Құпиялылық саясаты", href: "#" },
  { label: "Пайдалану шарттары", href: "#" },
];

function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-primary">
      <Container className="flex flex-col gap-10 py-14 sm:py-16">
        <div className="flex flex-col justify-between gap-10 sm:flex-row">
          <div className="max-w-sm">
            <Logo light />
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Мұғалімнің ойы сабаққа арналсын, қалғанын S-AI жасайды. ҚМЖ-дан
              бастап толық сабақ пакетіне дейін бір жерде.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <h3 className="font-display text-sm font-semibold text-white">Өнім</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-sm font-semibold text-white">Құқықтық</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} S-AI. Барлық құқықтар қорғалған.</p>
          <p>Қазақстанның мұғалімдеріне арналып жасалды.</p>
        </div>
      </Container>
    </footer>
  );
}

export { Footer };
