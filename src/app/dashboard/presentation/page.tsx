"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  MonitorPlay,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { DashboardHeader } from "@/components/dashboard/header";
import { SelectField } from "@/components/dashboard/select-field";
import { FormField } from "@/components/dashboard/form-field";
import { GenerationProgress } from "@/components/dashboard/generation-progress";
import { ExportButtons } from "@/components/dashboard/export-buttons";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  GRADES,
  LANGUAGES,
  PRESENTATION_STYLES,
  SUBJECTS,
} from "@/lib/dashboard/constants";
import { buildSlides } from "@/lib/dashboard/mock-data";
import type { Slide } from "@/lib/dashboard/types";
import { useGeneration } from "@/lib/dashboard/use-generation";
import { cn } from "@/lib/utils";

const SLIDE_COUNTS = ["6", "8", "10", "12"];
const generationSteps = [
  "Тақырыпты талдау",
  "Слайд құрылымын жоспарлау",
  "Мазмұнды құрастыру",
  "Дизайнды сәйкестендіру",
];

export default function PresentationPage() {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
  const [slideCount, setSlideCount] = useState(SLIDE_COUNTS[1]);
  const [style, setStyle] = useState(PRESENTATION_STYLES[2]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [slides, setSlides] = useState<Slide[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Slide | null>(null);

  const { status, activeStep, start, reset } = useGeneration(generationSteps, 500);

  function handleGenerate() {
    const nextErrors: Record<string, string> = {};
    if (!subject) nextErrors.subject = "Пәнді таңдаңыз";
    if (!grade) nextErrors.grade = "Сыныпты таңдаңыз";
    if (!topic.trim()) nextErrors.topic = "Тақырыпты жазыңыз";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      toast.error("Міндетті өрістерді толтырыңыз");
      return;
    }

    setSlides(null);
    start(() => {
      const generated = buildSlides({ topic, count: Number(slideCount) });
      setSlides(generated);
      setSelectedId(generated[0]?.id ?? null);
      toast.success("Презентация дайын!");
    });
  }

  const selectedSlide = slides?.find((s) => s.id === selectedId) ?? null;

  function updateSelected(patch: Partial<Slide>) {
    if (!selectedId) return;
    setSlides((prev) => prev?.map((s) => (s.id === selectedId ? { ...s, ...patch } : s)) ?? prev);
  }

  function moveSlide(id: string, direction: -1 | 1) {
    setSlides((prev) => {
      if (!prev) return prev;
      const index = prev.findIndex((s) => s.id === id);
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function duplicateSlide(id: string) {
    setSlides((prev) => {
      if (!prev) return prev;
      const index = prev.findIndex((s) => s.id === id);
      const source = prev[index];
      const copy: Slide = { ...source, id: `${source.id}-copy-${Date.now()}`, title: `${source.title} (көшірме)` };
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      return next;
    });
    toast.success("Слайд көшірілді");
  }

  function confirmDelete() {
    if (!deleteTarget || !slides) return;
    if (slides.length === 1) {
      toast.error("Кемінде бір слайд қалуы керек");
      setDeleteTarget(null);
      return;
    }
    const index = slides.findIndex((s) => s.id === deleteTarget.id);
    const next = slides.filter((s) => s.id !== deleteTarget.id);
    setSlides(next);
    if (selectedId === deleteTarget.id) {
      setSelectedId(next[Math.max(0, index - 1)]?.id ?? next[0]?.id ?? null);
    }
    toast.success("Слайд жойылды");
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-8">
      <DashboardHeader title="Презентация генераторы" description="Тақырыпты енгізіп, дайын слайд жинағын алыңыз." />

      <div className="rounded-2xl border border-primary/10 bg-surface p-5 shadow-soft sm:p-7">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SelectField label="Пән" options={SUBJECTS} value={subject} onChange={setSubject} error={errors.subject} required />
          <SelectField label="Сынып" options={GRADES} value={grade} onChange={setGrade} error={errors.grade} required />
          <FormField label="Тақырып" error={errors.topic} required>
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Мысалы: Электр тогы" />
          </FormField>
          <SelectField label="Слайд саны" options={SLIDE_COUNTS} value={slideCount} onChange={setSlideCount} />
          <SelectField label="Стиль" options={PRESENTATION_STYLES} value={style} onChange={setStyle} />
          <SelectField label="Тіл" options={LANGUAGES} value={language} onChange={setLanguage} />
        </div>

        <Button variant="gradient" size="lg" className="mt-6 w-full sm:w-auto" onClick={handleGenerate} disabled={status === "generating"}>
          <Sparkles className="size-4" />
          Презентация жасау
        </Button>

        {status === "generating" ? (
          <div className="mt-6 rounded-2xl border border-primary/8 bg-[#fbfcfe] p-5">
            <GenerationProgress steps={generationSteps} activeStep={activeStep} />
          </div>
        ) : null}
      </div>

      {status === "done" && slides ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-primary">
              Слайдтар ({slides.length})
            </h2>
            <ExportButtons actions={["docx", "pdf"]} documentName={`Презентация — ${topic}`} />
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
            <div className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={cn(
                    "group relative w-48 shrink-0 rounded-xl border p-3 text-left transition-colors lg:w-auto",
                    slide.id === selectedId
                      ? "border-cyan/40 bg-cyan/5"
                      : "border-primary/10 bg-surface hover:border-primary/20",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(slide.id)}
                    className="block w-full text-left"
                  >
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                      <MonitorPlay className="size-3.5" />
                      Слайд {index + 1}
                    </span>
                    <span className="mt-1.5 block truncate text-sm font-semibold text-primary">
                      {slide.title}
                    </span>
                    <span className="mt-1 block truncate text-xs text-muted">
                      {slide.bullets.length} пункт
                    </span>
                  </button>

                  <div className="mt-2.5 flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Жоғары жылжыту"
                      disabled={index === 0}
                      onClick={() => moveSlide(slide.id, -1)}
                      className="inline-flex size-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary/5 disabled:opacity-30"
                    >
                      <ArrowUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Төмен жылжыту"
                      disabled={index === slides.length - 1}
                      onClick={() => moveSlide(slide.id, 1)}
                      className="inline-flex size-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary/5 disabled:opacity-30"
                    >
                      <ArrowDown className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Көшірмесін жасау"
                      onClick={() => duplicateSlide(slide.id)}
                      className="inline-flex size-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary/5"
                    >
                      <Copy className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Слайдты жою"
                      onClick={() => setDeleteTarget(slide)}
                      className="ml-auto inline-flex size-7 items-center justify-center rounded-full text-danger/70 transition-colors hover:bg-danger/10"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedSlide ? (
              <div className="rounded-2xl border border-primary/10 bg-surface p-6 shadow-soft">
                <FormField label="Слайд атауы">
                  <Input
                    value={selectedSlide.title}
                    onChange={(e) => updateSelected({ title: e.target.value })}
                  />
                </FormField>
                <FormField label="Мазмұны" className="mt-4" hint="Әр пунктті жаңа жолдан жазыңыз">
                  <Textarea
                    value={selectedSlide.bullets.join("\n")}
                    onChange={(e) =>
                      updateSelected({ bullets: e.target.value.split("\n") })
                    }
                    rows={8}
                  />
                </FormField>

                <div className="mt-6 rounded-xl border border-primary/8 bg-[linear-gradient(160deg,#fbfcfe,white)] p-6">
                  <p className="font-display text-lg font-bold text-primary">{selectedSlide.title}</p>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-primary/75">
                    {selectedSlide.bullets.map((bullet, i) => (
                      <li key={i}>{bullet || "…"}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>

          <Button variant="ghost" size="sm" onClick={reset}>
            Жаңадан бастау
          </Button>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Слайдты жою"
        description={`«${deleteTarget?.title}» слайдын жойғыңыз келе ме? Бұл әрекетті кері қайтару мүмкін емес.`}
        confirmLabel="Жою"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}
