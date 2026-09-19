import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/ui/container";
import { faqItems } from "@/lib/data/faq";

function Faq() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="Жиі қойылатын сұрақтар"
          title="Сұрағыңыз бар ма?"
          description="Ең жиі қойылатын сұрақтарға жауап таба аласыз."
        />

        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {faqItems.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}

export { Faq };
