import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: "Аты-жөнді толық жазыңыз." })
      .max(120, { message: "Аты-жөні тым ұзын." }),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, { message: "Email енгізіңіз." })
      .email({ message: "Email дұрыс енгізілмеген." }),
    password: z
      .string()
      .min(8, { message: "Құпиясөз кемінде 8 таңбадан тұруы керек." })
      .max(72, { message: "Құпиясөз тым ұзын." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Құпиясөздер сәйкес келмейді.",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Email енгізіңіз." })
    .email({ message: "Email дұрыс енгізілмеген." }),
  password: z.string().min(1, { message: "Құпиясөзді енгізіңіз." }),
});

export type LoginInput = z.infer<typeof loginSchema>;
