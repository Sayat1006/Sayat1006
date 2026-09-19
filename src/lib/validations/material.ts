import { z } from "zod";

export const materialTypeSchema = z.enum([
  "qmj",
  "presentation",
  "test",
  "bzb",
  "tzb",
  "worksheet",
  "scenario",
]);

export const createMaterialSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Атауын жазыңыз." })
    .max(200, { message: "Атауы тым ұзын." }),
  type: materialTypeSchema,
  subject: z.string().trim().max(80).optional().default(""),
  grade: z.string().trim().max(20).optional().default(""),
  content: z.record(z.string(), z.unknown()).optional().default({}),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
});

export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;

export const renameMaterialSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string()
    .trim()
    .min(1, { message: "Атауын жазыңыз." })
    .max(200, { message: "Атауы тым ұзын." }),
});

export type RenameMaterialInput = z.infer<typeof renameMaterialSchema>;
