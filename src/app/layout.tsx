import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "S-AI — Мұғалімге арналған AI жұмыс кеңістігі",
  description:
    "ҚМЖ, презентация, тест, БЖБ/ТЖБ және жұмыс парағын бір тақырыптан дайындаңыз. Ойыңыз — сабаққа, қалғанын S-AI жасайды.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="kk"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
