"use client";

import { useEffect, useRef, useState } from "react";

import type { AIGenerationStatus } from "@/lib/ai/types";

/**
 * Drives the generation-progress UI from the real request, not a fixed
 * fake timer: while the task is in flight, activeStep advances through the
 * given stage labels on an interval (so the UI shows meaningful progress),
 * but the moment the real response resolves or rejects, status flips
 * immediately — a fast API response is never artificially delayed, and a
 * slow one never leaves the UI stuck on an early step.
 */
export function useAiGeneration(steps: string[], stepIntervalMs = 900) {
  const [status, setStatus] = useState<AIGenerationStatus>("idle");
  const [activeStep, setActiveStep] = useState(-1);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    };
  }, []);

  async function run<T>(task: () => Promise<T>): Promise<T> {
    setStatus("generating");
    let step = 0;
    setActiveStep(0);

    intervalRef.current = window.setInterval(() => {
      step = Math.min(step + 1, steps.length - 1);
      setActiveStep(step);
    }, stepIntervalMs);

    try {
      const result = await task();
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
      setActiveStep(steps.length - 1);
      setStatus("done");
      return result;
    } catch (err) {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
      setStatus("error");
      throw err;
    }
  }

  function reset() {
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    setStatus("idle");
    setActiveStep(-1);
  }

  return { status, activeStep, run, reset };
}
