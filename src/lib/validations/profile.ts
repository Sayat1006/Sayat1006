import { z } from "zod";

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Аты-жөнді толық жазыңыз." })
    .max(120, { message: "Аты-жөні тым ұзын." }),
  subject: z.string().trim().max(80).optional().default(""),
  school: z.string().trim().max(200).optional().default(""),
  grades: z.array(z.string()).default([]),
  language: z.string().trim().min(1, { message: "Тілді таңдаңыз." }),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const settingsSchema = z.object({
  language: z.string().trim().min(1),
  notifications: z.object({
    product: z.boolean(),
    tips: z.boolean(),
    marketing: z.boolean(),
  }),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
