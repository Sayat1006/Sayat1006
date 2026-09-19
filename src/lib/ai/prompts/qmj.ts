import type { QMJInput, SupportedLanguage } from "@/lib/ai/types";

const LANGUAGE_INSTRUCTIONS: Record<SupportedLanguage, string> = {
  Қазақша:
    "Барлық мазмұнды табиғи, заманауи қазақ тілінде жаз. Сөзбе-сөз аударылған немесе жасанды дыбысталатын " +
    "терминдерден аулақ бол — нақты қазақстандық мұғалім қалай жазатынын елестет. Пән терминологиясын дұрыс әрі " +
    "дәл қолдан.",
  Русский:
    "Пиши весь контент на естественном, педагогически грамотном русском языке, как его использует практикующий " +
    "учитель в казахстанской школе. Избегай калек и машинного перевода, используй точную предметную терминологию.",
};

export function buildQmjSystemPrompt(language: SupportedLanguage): string {
  return [
    "You are an experienced Kazakhstani school lesson-planning assistant, helping a real classroom teacher " +
      "write a ҚМЖ (қысқа мерзімді жоспар — short-term lesson plan) in the format used across Kazakhstan's " +
      "schools.",
    "",
    LANGUAGE_INSTRUCTIONS[language],
    "",
    "Non-negotiable quality bar for every lesson you produce:",
    "- Pedagogical coherence: every stage must build logically toward the stated lesson objective, not feel like " +
      "a random list of activities.",
    "- Realistic timing: stage durations must sum to approximately the total lesson duration you were given.",
    "- Age-appropriate tasks: match the cognitive level, vocabulary, and task complexity to the given grade.",
    "- Measurable objectives and assessment alignment: the assessment criteria and the descriptors/assessment " +
      "notes inside each stage must let a teacher observably tell whether a student met the objective.",
    "- Concrete teacher and student actions: never write vague filler like 'оқушылар тапсырманы орындайды' or " +
      "'the students complete the task'. Name the actual activity, question, calculation, experiment, or " +
      "discussion prompt — something a teacher could read aloud in class right now.",
    "- Realistic resources: name resources an ordinary Kazakhstani classroom actually has (textbook page " +
      "references, whiteboard, worksheet, simple lab equipment, everyday objects) — not exotic technology.",
    "- Differentiation: give distinct tasks or support for at least three ability levels (e.g. negizgi/orta/joghari " +
      "or equivalent), not just 'harder version for strong students'.",
    "- Safety: only include real, subject-relevant safety notes (e.g. lab/PE safety). If the subject has no " +
      "safety-relevant content, briefly say general classroom safety rules apply — never invent danger that " +
      "isn't there.",
    "- Reflection: a genuine end-of-lesson reflection technique with a concrete prompt, not just 'students " +
      "reflect on the lesson'.",
    "- Homework: a specific, gradeable task tied to the lesson objective.",
    "",
    "If the teacher supplied a Оқу мақсаты (learning objective) or Сабақ мақсаты (lesson goal), you MUST preserve " +
      "its meaning exactly — refine the wording only for clarity, never replace it with a different or unrelated " +
      "objective. If one was left blank, write a suitable one yourself based on the subject, grade, and topic.",
    "Do not fabricate an official curriculum code (like '8.4.3.5') unless the teacher explicitly provided one — " +
      "when none was given, describe the objective in plain language instead of inventing a fake code.",
    "",
    "Respond only with the structured data requested — no extra commentary.",
  ].join("\n");
}

export function buildQmjUserPrompt(input: QMJInput): string {
  const lines: string[] = [
    `Пән (subject): ${input.subject}`,
    `Сынып (grade): ${input.grade}`,
    `Тақырып (topic): ${input.topic}`,
    `Сабақ ұзақтығы (lesson duration): ${input.duration}`,
    `Сабақ түрі (lesson type): ${input.lessonType}`,
  ];

  if (input.learningObjective?.trim()) {
    lines.push(`Мұғалім берген оқу мақсаты (DO NOT change its meaning): ${input.learningObjective.trim()}`);
  } else {
    lines.push("Оқу мақсаты берілмеген — тақырып пен сыныпқа сай өзің жаз.");
  }

  if (input.lessonGoal?.trim()) {
    lines.push(`Мұғалім берген сабақ мақсаты (DO NOT change its meaning): ${input.lessonGoal.trim()}`);
  } else {
    lines.push("Сабақ мақсаты берілмеген — оқу мақсатына сай өзің тұжырымда.");
  }

  if (input.assessmentCriteria?.trim()) {
    lines.push(
      `Мұғалім ұсынған бағалау критерийлері (use as a strong basis, refine only for clarity):\n${input.assessmentCriteria.trim()}`,
    );
  } else {
    lines.push("Бағалау критерийлері берілмеген — оқу мақсатына сай өзің құрастыр.");
  }

  if (input.stageLabels.length > 0) {
    lines.push(
      `Сабақ құрылымына міндетті түрде мына кезеңдер кіруі керек, дәл осы ретпен: ${input.stageLabels.join(", ")}.`,
    );
  } else {
    lines.push("Сабақ кезеңдерінің тізімі берілмеген — сабақ түріне сай логикалық құрылым таңда.");
  }

  lines.push(
    "",
    "Барлық сабақ кезеңдерінің ұзақтығының қосындысы жалпы сабақ ұзақтығына сай болуы керек.",
    "Duration values must be realistic minute ranges that sum to the total lesson duration.",
  );

  return lines.join("\n");
}
