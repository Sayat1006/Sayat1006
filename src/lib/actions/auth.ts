"use server";

import { registerSchema } from "@/lib/validations/auth";
import { createUser } from "@/lib/services/users";
import { updateProfile } from "@/lib/services/profile";
import { isSupabaseConfigured } from "@/lib/env";

export interface RegisterActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Partial<Record<"fullName" | "email" | "password" | "confirmPassword", string[]>>;
}

export async function registerAction(input: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<RegisterActionResult> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: "Сервер баптауы аяқталмаған. Әкімшіге хабарласыңыз.",
    };
  }

  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const user = await createUser({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    await updateProfile(user.id, { fullName: parsed.data.fullName });
    return { success: true };
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_TAKEN") {
      return { success: false, fieldErrors: { email: ["Бұл email бұрын тіркелген."] } };
    }
    return { success: false, error: "Тіркеу кезінде қате пайда болды. Қайталап көріңіз." };
  }
}
