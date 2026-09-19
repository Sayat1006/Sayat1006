import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { TrustStrip } from "@/components/sections/trust-strip";
import { Problem } from "@/components/sections/problem";
import { Solution } from "@/components/sections/solution";
import { AiDemo } from "@/components/sections/ai-demo";
import { Tools } from "@/components/sections/tools";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FullLessonPackage } from "@/components/sections/full-lesson-package";
import { AiAssistant } from "@/components/sections/ai-assistant";
import { Pricing } from "@/components/sections/pricing";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <Problem />
        <Solution />
        <AiDemo />
        <Tools />
        <HowItWorks />
        <FullLessonPackage />
        <AiAssistant />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
