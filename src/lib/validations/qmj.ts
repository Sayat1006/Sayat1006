import { z } from "zod";

export const generateQmjSchema = z.object({
  subject: z.string().trim().min(1, { message: "Пәнді таңдаңыз." }).max(80),
  grade: z.string().trim().min(1, { message: "Сыныпты таңдаңыз." }).max(20),
  topic: z.string().trim().min(1, { message: "Тақырыпты жазыңыз." }).max(200),
  duration: z.string().trim().min(1).max(40),
  lessonType: z.string().trim().min(1).max(80),
  language: z.enum(["Қазақша", "Русский"]),
  learningObjective: z.string().trim().max(1000).optional().default(""),
  lessonGoal: z.string().trim().max(1000).optional().default(""),
  assessmentCriteria: z.string().trim().max(2000).optional().default(""),
  stageLabels: z.array(z.string().trim().min(1)).max(12).optional().default([]),
});

export type GenerateQmjInput = z.infer<typeof generateQmjSchema>;
