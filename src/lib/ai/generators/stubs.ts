import "server-only";

/**
 * Stage 4 only wires up generateQMJContent() to a real AI provider. These
 * stubs exist so the rest of the app (server actions, generator pages) can
 * already be written against the final function names/shape — swapping a
 * stub for a real implementation later (following the exact pattern in
 * generators/qmj.ts: a Zod schema + a prompt builder + provider.
 * generateStructuredOutput) never requires touching call sites.
 */

function notImplemented(name: string): never {
  throw new Error(
    `${name}() is not implemented yet — only generateQMJContent() is live in this stage.`,
  );
}

// Each will eventually take a typed *Input shape (mirroring QMJInput) once
// implemented — omitted for now since an unused parameter has nothing to
// type-check against yet.
export async function generateTest(): Promise<never> {
  return notImplemented("generateTest");
}

export async function generateBZB(): Promise<never> {
  return notImplemented("generateBZB");
}

export async function generateTZB(): Promise<never> {
  return notImplemented("generateTZB");
}

export async function generatePresentation(): Promise<never> {
  return notImplemented("generatePresentation");
}

export async function generateWorksheet(): Promise<never> {
  return notImplemented("generateWorksheet");
}

export async function generateScenario(): Promise<never> {
  return notImplemented("generateScenario");
}
