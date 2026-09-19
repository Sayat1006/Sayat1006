"use client";

import { useState } from "react";
import { Bell, Check, Globe, KeyRound, Save, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

import { DashboardHeader } from "@/components/dashboard/header";
import { FormField } from "@/components/dashboard/form-field";
import { SelectField } from "@/components/dashboard/select-field";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GRADES, LANGUAGES, SUBJECTS } from "@/lib/dashboard/constants";
import { teacherProfile } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const [name, setName] = useState(teacherProfile.name);
  const [subject, setSubject] = useState(teacherProfile.subject);
  const [school, setSchool] = useState(teacherProfile.school);
  const [grades, setGrades] = useState<string[]>(teacherProfile.grades);
  const [language, setLanguage] = useState(teacherProfile.language);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [notifications, setNotifications] = useState({
    product: true,
    tips: true,
    marketing: false,
  });

  function toggleGrade(grade: string) {
    setGrades((prev) => (prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]));
  }

  function saveProfile() {
    if (!name.trim()) {
      toast.error("Аты-жөнді енгізіңіз");
      return;
    }
    toast.success("Профиль сақталды");
  }

  function updatePassword() {
    if (!currentPassword || !newPassword) {
      toast.error("Барлық өрісті толтырыңыз");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Жаңа құпия сөз кемінде 8 таңбадан тұруы керек");
      return;
    }
    toast.success("Құпия сөз өзгертілді");
    setCurrentPassword("");
    setNewPassword("");
  }

  return (
    <div className="space-y-8">
      <DashboardHeader title="Профиль" description="Жеке деректеріңізді және баптауларды басқарыңыз." />

      <div className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-surface p-5 shadow-soft sm:p-6">
        <Avatar className="size-16">
          <AvatarFallback className="text-lg">{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-display text-lg font-bold text-primary">{name}</p>
          <p className="text-sm text-muted">
            {subject} мұғалімі · {school}
          </p>
        </div>
      </div>

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">
            <UserIcon className="mr-1.5 inline size-4" />
            Жеке ақпарат
          </TabsTrigger>
          <TabsTrigger value="security">
            <KeyRound className="mr-1.5 inline size-4" />
            Қауіпсіздік
          </TabsTrigger>
          <TabsTrigger value="language">
            <Globe className="mr-1.5 inline size-4" />
            Тіл
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-1.5 inline size-4" />
            Хабарламалар
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <div className="max-w-2xl space-y-4 rounded-2xl border border-primary/10 bg-surface p-5 shadow-soft sm:p-7">
            <FormField label="Аты-жөні" required>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormField>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SelectField label="Пәні" options={SUBJECTS} value={subject} onChange={setSubject} />
              <FormField label="Мектебі">
                <Input value={school} onChange={(e) => setSchool(e.target.value)} />
              </FormField>
            </div>
            <FormField label="Сыныптары" hint="Сабақ беретін сыныптарыңызды белгілеңіз">
              <div className="flex flex-wrap gap-2">
                {GRADES.map((grade) => {
                  const active = grades.includes(grade);
                  return (
                    <button
                      key={grade}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleGrade(grade)}
                      className={cn(
                        "inline-flex size-10 items-center justify-center rounded-xl border text-sm font-semibold transition-colors",
                        active
                          ? "border-cyan/40 bg-cyan/10 text-[#0b7ea8]"
                          : "border-primary/10 bg-[#fbfcfe] text-primary/60 hover:border-primary/20",
                      )}
                    >
                      {grade}
                    </button>
                  );
                })}
              </div>
            </FormField>
            <Button variant="gradient" onClick={saveProfile}>
              <Save className="size-4" />
              Сақтау
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="max-w-2xl space-y-4 rounded-2xl border border-primary/10 bg-surface p-5 shadow-soft sm:p-7">
            <FormField label="Ағымдағы құпия сөз">
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
            </FormField>
            <FormField label="Жаңа құпия сөз" hint="Кемінде 8 таңба">
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </FormField>
            <Button variant="gradient" onClick={updatePassword}>
              Құпия сөзді өзгерту
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="language">
          <div className="max-w-2xl space-y-4 rounded-2xl border border-primary/10 bg-surface p-5 shadow-soft sm:p-7">
            <p className="text-sm text-muted">Платформа интерфейсінің тілін таңдаңыз.</p>
            <div className="flex flex-wrap gap-2.5">
              {LANGUAGES.map((lang) => {
                const active = language === lang;
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    aria-pressed={active}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                      active
                        ? "border-cyan/40 bg-cyan/10 text-[#0b7ea8]"
                        : "border-primary/10 bg-[#fbfcfe] text-primary/70 hover:border-primary/20",
                    )}
                  >
                    {active ? <Check className="size-4" /> : null}
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="max-w-2xl space-y-1 rounded-2xl border border-primary/10 bg-surface p-5 shadow-soft sm:p-7">
            {[
              { key: "product" as const, label: "Өнім жаңалықтары", hint: "Жаңа құралдар мен мүмкіндіктер туралы хабарландыру" },
              { key: "tips" as const, label: "Пайдалы кеңестер", hint: "S-AI-ды тиімді қолдану бойынша ұсыныстар" },
              { key: "marketing" as const, label: "Жарнамалық хабарламалар", hint: "Акциялар мен арнайы ұсыныстар" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4 rounded-xl px-2 py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-primary">{item.label}</p>
                  <p className="text-xs text-muted">{item.hint}</p>
                </div>
                <Switch
                  checked={notifications[item.key]}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                  }
                  aria-label={item.label}
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
