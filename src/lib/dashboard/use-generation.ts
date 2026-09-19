"use client";

import { useEffect, useRef, useState } from "react";

export type GenerationStatus = "idle" | "generating" | "done";

export function useGeneration(steps: string[], stepDelay = 550) {
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [activeStep, setActiveStep] = useState(-1);
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timeouts.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  function start(onDone?: () => void) {
    timeouts.current.forEach((id) => window.clearTimeout(id));
    timeouts.current = [];
    setStatus("generating");
    setActiveStep(0);

    steps.forEach((_, index) => {
      const id = window.setTimeout(() => {
        setActiveStep(index);
        if (index === steps.length - 1) {
          const doneId = window.setTimeout(() => {
            setStatus("done");
            onDone?.();
          }, 450);
          timeouts.current.push(doneId);
        }
      }, index * stepDelay);
      timeouts.current.push(id);
    });
  }

  function reset() {
    timeouts.current.forEach((id) => window.clearTimeout(id));
    timeouts.current = [];
    setStatus("idle");
    setActiveStep(-1);
  }

  return { status, activeStep, start, reset };
}
