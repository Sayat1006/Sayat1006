"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/dashboard/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerSchema } from "@/lib/validations/auth";
import { registerAction } from "@/lib/actions/auth";

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = registerSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        fullName: fieldErrors.fullName?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const result = await registerAction(parsed.data);

      if (!result.success) {
        if (result.fieldErrors) {
          setErrors({
            fullName: result.fieldErrors.fullName?.[0],
            email: result.fieldErrors.email?.[0],
            password: result.fieldErrors.password?.[0],
            confirmPassword: result.fieldErrors.confirmPassword?.[0],
          });
        }
        if (result.error) toast.error(result.error);
        setSubmitting(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.success("Тіркелу сәтті аяқталды. Енді кіріңіз.");
        router.push("/login");
        return;
      }

      toast.success("Қош келдіңіз! Аккаунтыңызға 50 S-Token сыйға берілді.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Тіркеу кезінде қате пайда болды. Қайталап көріңіз.");
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Тіркелу"
      description="S-AI-мен алғашқы сабағыңызды дайындауды бастаңыз."
      footer={
        <>
          Аккаунтыңыз бар ма?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Кіру
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField label="Аты-жөні" error={errors.fullName} required>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Айгерім Нұрланқызы"
            autoComplete="name"
            aria-invalid={Boolean(errors.fullName)}
          />
        </FormField>
        <FormField label="Email" error={errors.email} required>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
          />
        </FormField>
        <FormField label="Құпиясөз" error={errors.password} required hint="Кемінде 8 таңба">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
          />
        </FormField>
        <FormField label="Құпиясөзді растау" error={errors.confirmPassword} required>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
          />
        </FormField>

        <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Тіркелуде..." : "Тіркелу"}
        </Button>
      </form>
    </AuthShell>
  );
}
