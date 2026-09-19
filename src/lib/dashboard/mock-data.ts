import type {
  AssessmentTask,
  ChatMessage,
  CreditPackage,
  LessonStage,
  Material,
  QmjContent,
  ScenarioSection,
  Slide,
  TeacherProfile,
  TestQuestion,
  TokenTransaction,
  WorksheetTask,
} from "@/lib/dashboard/types";

export const teacherProfile: TeacherProfile = {
  name: "Айгерім Нұрланқызы",
  subject: "Физика",
  school: "№45 мектеп-гимназиясы, Алматы",
  grades: ["7", "8", "9"],
  language: "Қазақша",
  email: "aigerim.nurlan@example.kz",
};

export const tokenBalance = 50;

export const tokenTransactions: TokenTransaction[] = [
  { id: "t1", label: "ҚМЖ жасау — «Жылу құбылыстары»", amount: -5, date: "18 қыркүйек" },
  { id: "t2", label: "Тест жасау — «Ньютон заңдары»", amount: -2, date: "17 қыркүйек" },
  { id: "t3", label: "Презентация — «Электр тогы»", amount: -8, date: "15 қыркүйек" },
  { id: "t4", label: "Жұмыс парағы — «Қысым»", amount: -3, date: "12 қыркүйек" },
  { id: "t5", label: "Айлық бонус", amount: 20, date: "1 қыркүйек" },
  { id: "t6", label: "БЖБ жасау — «Механика»", amount: -6, date: "28 тамыз" },
];

export const creditPackages: CreditPackage[] = [
  {
    name: "Starter",
    tokens: 50,
    price: "—",
    description: "Аптасына бірнеше материал дайындайтын мұғалімге.",
  },
  {
    name: "Teacher",
    tokens: 200,
    price: "—",
    description: "Апта сайын белсенді дайындалатын мұғалімге.",
    highlighted: true,
  },
  {
    name: "Pro",
    tokens: 500,
    price: "—",
    description: "Барлық құралды шектеусіз пайдаланатын мұғалімге.",
  },
];

export const materials: Material[] = [
  { id: "m1", title: "Жылу құбылыстары", type: "qmj", subject: "Физика", grade: "8", createdAt: "18 қыркүйек 2026", favorite: true },
  { id: "m2", title: "Ньютон заңдары", type: "test", subject: "Физика", grade: "9", createdAt: "17 қыркүйек 2026", favorite: false },
  { id: "m3", title: "Электр тогы", type: "presentation", subject: "Физика", grade: "8", createdAt: "15 қыркүйек 2026", favorite: true },
  { id: "m4", title: "Қысым және оның бірліктері", type: "worksheet", subject: "Физика", grade: "7", createdAt: "12 қыркүйек 2026", favorite: false },
  { id: "m5", title: "Механика негіздері", type: "bzb", subject: "Физика", grade: "9", createdAt: "28 тамыз 2026", favorite: false },
  { id: "m6", title: "Дыбыс құбылыстары", type: "tzb", subject: "Физика", grade: "8", createdAt: "20 тамыз 2026", favorite: false },
  { id: "m7", title: "Оптика: жарық сыну", type: "scenario", subject: "Физика", grade: "9", createdAt: "14 тамыз 2026", favorite: true },
  { id: "m8", title: "Атом құрылысы", type: "qmj", subject: "Химия", grade: "8", createdAt: "10 тамыз 2026", favorite: false },
];

export const lessonStages: LessonStage[] = [
  { id: "hook", label: "Қызығушылықты ояту", description: "Тақырыпқа назар аудартатын кіріспе әрекет." },
  { id: "new", label: "Жаңа сабақ", description: "Негізгі түсінік пен білімді меңгерту." },
  { id: "pair", label: "Жұптық жұмыс", description: "Оқушылар жұппен тапсырма орындайды." },
  { id: "group", label: "Топтық жұмыс", description: "Шағын топтарда бірлескен тапсырма." },
  { id: "individual", label: "Жеке жұмыс", description: "Әр оқушы дербес орындайтын тапсырма." },
  { id: "consolidate", label: "Бекіту", description: "Меңгерілген білімді тапсырмамен нығайту." },
  { id: "reflect", label: "Рефлексия", description: "Сабақ соңында ой-толғаныс." },
  { id: "homework", label: "Үй тапсырмасы", description: "Келесі сабаққа дейінгі тапсырма." },
];

export const defaultSelectedStageIds = ["hook", "new", "group", "consolidate", "reflect", "homework"];

export const assistantQuickPrompts = [
  "8-сынып физикасына қызықты тәжірибе ұсын.",
  "Осы тақырыпқа 10 логикалық сұрақ жаса.",
  "ҚМЖ-ға саралау тапсырмаларын қос.",
  "Оқушыларға түсінікті тілмен түсіндір.",
];

export const initialAssistantConversation: ChatMessage[] = [
  {
    id: "a0",
    role: "assistant",
    content:
      "Сәлем! Мен S-AI көмекшісімін. Сабақ дайындауға, тапсырма құрастыруға және оқу материалдарын жетілдіруге көмектесемін.",
  },
];

const mockAssistantReplies = [
  "Жақсы ұсыныс! Мысалы, «Ыстық және суық су» тәжірибесін жүргізіп, оқушыларға температураның теңесуін бақылатуға болады. Нәтижені кестеге түсіріп, талқылау сұрақтарын қоюды ұсынамын.",
  "Міне бірнеше идея: тақырыпты кіші бөліктерге бөліп, әр топқа жеке кейс беріңіз. Соңында қорытынды слайд арқылы салыстыру жасатыңыз.",
  "Түсінікті тілмен түсіндіру үшін күрделі терминдерді күнделікті өмірден алынған мысалдармен алмастырған жөн. Қажет болса, мен нақты сөйлемдерді ұсына аламын.",
  "Саралау тапсырмалары үшін үш деңгей ұсынамын: негізгі, орта және жоғары. Әр деңгейге сай тапсырма мен бағалау критерийін қоса беремін.",
];

export function getMockAssistantReply(index: number) {
  return mockAssistantReplies[index % mockAssistantReplies.length];
}

export function buildQmjContent(params: {
  subject: string;
  grade: string;
  topic: string;
  objective: string;
  goal: string;
  stageLabels: string[];
}): QmjContent {
  const topic = params.topic || "Жаңа тақырып";
  const rowsSource = params.stageLabels.length
    ? params.stageLabels
    : ["Қызығушылықты ояту", "Жаңа сабақ", "Бекіту"];

  return {
    topic,
    learningObjective:
      params.objective ||
      `${params.grade}.${params.subject.slice(0, 1)}.1 — ${topic} тақырыбы бойынша негізгі заңдылықтарды түсіндіру.`,
    lessonGoal: params.goal || `Оқушылар «${topic}» тақырыбының негізгі ұғымдарын меңгереді және тәжірибеде қолдана алады.`,
    successCriteria: [
      `«${topic}» тақырыбына қатысты негізгі терминдерді атайды`,
      "Құбылысты күнделікті өмірден мысалмен түсіндіреді",
      "Есептеу немесе талдау тапсырмасын дербес орындайды",
    ],
    rows: rowsSource.map((stage) => ({
      stage,
      teacherAction: `${stage} кезеңінде мұғалім тапсырма мен нұсқаулық ұсынады, сұрақтар қояды.`,
      studentAction: `Оқушылар ${stage.toLowerCase()} аясында белсенді қатысады, талқылайды, орындайды.`,
      assessment: "Ауызша кері байланыс / дескриптор бойынша бағалау",
      resources: "Оқулық, слайд, жұмыс парағы",
    })),
  };
}

export function buildTestQuestions(params: {
  topic: string;
  count: number;
  types: string[];
}): TestQuestion[] {
  const topic = params.topic || "тақырып";
  const typeCycle = params.types.length ? params.types : ["single"];
  const questions: TestQuestion[] = [];

  for (let i = 0; i < params.count; i += 1) {
    const type = typeCycle[i % typeCycle.length] as TestQuestion["type"];
    const base: TestQuestion = {
      id: `q${i + 1}`,
      type,
      question: `${topic} бойынша ${i + 1}-сұрақ: негізгі заңдылық қалай тұжырымдалады?`,
      points: type === "short" ? 3 : 2,
    };

    if (type === "single" || type === "multiple") {
      base.options = ["Бірінші жауап нұсқасы", "Екінші жауап нұсқасы", "Үшінші жауап нұсқасы", "Төртінші жауап нұсқасы"];
      base.correctAnswer = type === "single" ? base.options[0] : [base.options[0], base.options[2]];
    } else if (type === "boolean") {
      base.options = ["Дұрыс", "Бұрыс"];
      base.correctAnswer = "Дұрыс";
    } else if (type === "matching") {
      base.options = ["A — Ұғым 1 → 1 — Анықтама 1", "B — Ұғым 2 → 2 — Анықтама 2", "C — Ұғым 3 → 3 — Анықтама 3"];
    }

    questions.push(base);
  }

  return questions;
}

export function buildSlides(params: { topic: string; count: number }): Slide[] {
  const topic = params.topic || "Тақырып";
  const templates = [
    { title: topic, bullets: ["Сабақтың мақсаты", "Негізгі сұрақтар", "Жоспар"] },
    { title: "Кіріспе", bullets: [`${topic} деген не?`, "Күнделікті өмірден мысал", "Неге маңызды?"] },
    { title: "Негізгі түсінік", bullets: ["Анықтама", "Формула / заңдылық", "Схема"] },
    { title: "Мысал", bullets: ["Есеп шарты", "Шешу жолы", "Жауап"] },
    { title: "Тәжірибе", bullets: ["Қажетті құрал", "Іс-әрекет реті", "Бақылау нәтижесі"] },
    { title: "Қорытынды", bullets: ["Негізгі қорытынды", "Есте сақтау парағы", "Сұрақтар"] },
  ];

  return Array.from({ length: params.count }, (_, i) => {
    const template = templates[i % templates.length];
    return {
      id: `slide-${i + 1}`,
      title: i === 0 ? template.title : `${template.title} — ${i + 1}`,
      bullets: template.bullets,
    };
  });
}

export function buildAssessmentTasks(params: { topic: string; count?: number }): AssessmentTask[] {
  const topic = params.topic || "бөлім";
  const count = params.count ?? 4;
  const criteria = [
    "Білу және түсіну",
    "Қолдану",
    "Талдау",
    "Синтез және бағалау",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `task-${i + 1}`,
    criterion: criteria[i % criteria.length],
    descriptor: `Оқушы «${topic}» тақырыбы бойынша ${criteria[i % criteria.length].toLowerCase()} деңгейінде тапсырманы дұрыс орындайды.`,
    task: `${i + 1}-тапсырма: «${topic}» тақырыбына қатысты есеп/сұрақты шешіңіз.`,
    points: i === count - 1 ? 3 : 2,
  }));
}

export function buildWorksheetTasks(params: { topic: string; count: number }): WorksheetTask[] {
  const topic = params.topic || "тақырып";
  const types: WorksheetTask["type"][] = ["fill", "choice", "open"];

  return Array.from({ length: params.count }, (_, i) => ({
    id: `wt-${i + 1}`,
    instruction: `${i + 1}. «${topic}» тақырыбына қатысты тапсырманы орындаңыз.`,
    type: types[i % types.length],
  }));
}

export function buildScenarioSections(params: { topic: string }): ScenarioSection[] {
  const topic = params.topic || "тақырып";

  return [
    {
      id: "intro",
      title: "Мұғалімнің кіріспесі",
      content: [
        `Қайырлы күн, балалар! Бүгін біз «${topic}» тақырыбымен танысамыз.`,
        "Алдымен, осы тақырыпқа қатысты не білетінімізді еске түсірейік.",
      ],
    },
    {
      id: "questions",
      title: "Сұрақтар",
      content: [
        `«${topic}» тақырыбы күнделікті өмірде қайда кездеседі?`,
        "Бұл құбылысты қандай факторлар өзгерте алады?",
      ],
    },
    {
      id: "activities",
      title: "Іс-әрекеттер",
      content: [
        "Оқушыларды 3-4 адамнан тұратын топтарға бөліңіз.",
        `Әр топқа «${topic}» тақырыбына қатысты кіші тапсырма беріңіз.`,
      ],
    },
    {
      id: "experiment",
      title: "Тәжірибе",
      content: [
        "Қарапайым құралдармен көрнекі тәжірибе жасаңыз.",
        "Нәтижені бақылап, дәптерге белгілеп отыруды сұраңыз.",
      ],
    },
    {
      id: "discussion",
      title: "Талқылау",
      content: [
        "Топтардың нәтижелерін салыстырыңыз.",
        "Ортақ қорытынды шығаруға көмектесіңіз.",
      ],
    },
    {
      id: "reflection",
      title: "Рефлексия",
      content: [
        "«Бүгін мен нені үйрендім?» сұрағына қысқа жауап сұраңыз.",
        "Әр оқушыдан бір сөзбен сабақты бағалауын өтініңіз.",
      ],
    },
  ];
}
