export type Module = {
  id: string;
  number: number;
  slug: string;
  title: string;
  subtitle: string;
  english: string;
  emoji: string;
  duration: string;
  topics: string[];
};

export const modules: Module[] = [
  {
    id: 'intro',
    number: 1,
    slug: 'intro',
    title: 'مقدمة في الذكاء الاصطناعي',
    subtitle: 'ما هو الذكاء الاصطناعي ولماذا الآن؟',
    english: 'Introduction to AI',
    emoji: '✨',
    duration: '15 دقيقة',
    topics: [
      'تعريف الذكاء الاصطناعي',
      'الفرق بين البرمجة التقليدية والذكاء الاصطناعي',
      'تاريخ مختصر',
      'أنواع الذكاء الاصطناعي',
    ],
  },
  {
    id: 'how-ai-learns',
    number: 2,
    slug: 'how-ai-learns',
    title: 'كيف يتعلم الذكاء الاصطناعي',
    subtitle: 'البيانات، الخوارزميات، والشبكات العصبية',
    english: 'How AI Learns',
    emoji: '🧠',
    duration: '20 دقيقة',
    topics: [
      'التعلم المُشرف وغير المُشرف والتعزيزي',
      'الشبكات العصبية والطبقات',
      'الانحدار والتصنيف',
      'مختبر الشبكة العصبية التفاعلي',
    ],
  },
  {
    id: 'computer-vision',
    number: 3,
    slug: 'computer-vision',
    title: 'الرؤية الحاسوبية',
    subtitle: 'كيف ترى الآلة الصور؟',
    english: 'Computer Vision',
    emoji: '👁️',
    duration: '20 دقيقة',
    topics: [
      'البكسلات والمصفوفات',
      'استخراج الميزات',
      'الشبكات الالتفافية CNN',
      'تصنيف صور تفاعلي',
    ],
  },
  {
    id: 'nlp-llm',
    number: 4,
    slug: 'nlp-llm',
    title: 'النماذج اللغوية الكبيرة',
    subtitle: 'كيف تفهم الآلة وتنتج اللغة؟',
    english: 'NLP & Large Language Models',
    emoji: '💬',
    duration: '25 دقيقة',
    topics: [
      'الكلمات كمتجهات (Embeddings)',
      'المحوّل (Transformer) والانتباه',
      'هندسة المطالبات (Prompt Engineering)',
      'الهلوسات والقيود',
    ],
  },
  {
    id: 'agents',
    number: 5,
    slug: 'agents',
    title: 'الوكلاء والذكاء الاصطناعي الوكيلي',
    subtitle: 'من نموذج يجيب إلى وكيل ينفّذ',
    english: 'Agents & Agentic AI',
    emoji: '🤖',
    duration: '25 دقيقة',
    topics: [
      'الفرق بين النموذج والوكيل',
      'حلقة Tool Use و ReAct',
      'الذاكرة والتخطيط',
      'بناء سير عمل وكيل تفاعلي',
    ],
  },
  {
    id: 'autonomous',
    number: 6,
    slug: 'autonomous',
    title: 'الأنظمة الذاتية واتخاذ القرار',
    subtitle: 'من المساعدة إلى الاستقلال',
    english: 'Autonomous Systems',
    emoji: '🛰️',
    duration: '15 دقيقة',
    topics: [
      'مستويات الاستقلالية',
      'الإنسان داخل/على/خارج الحلقة',
      'تكامل البيانات المعقدة',
      'تمرين قرار تشغيلي',
    ],
  },
  {
    id: 'cybersecurity',
    number: 7,
    slug: 'cybersecurity',
    title: 'الأمن السيبراني والذكاء الاصطناعي',
    subtitle: 'سيف ذو حدّين',
    english: 'Cybersecurity & AI',
    emoji: '🛡️',
    duration: '20 دقيقة',
    topics: [
      'تهديدات على نماذج الذكاء الاصطناعي',
      'أمثلة معادية (Adversarial Examples)',
      'تسميم البيانات وسرقة النموذج',
      'دور الذكاء الاصطناعي في الدفاع السيبراني',
    ],
  },
  {
    id: 'ethics',
    number: 8,
    slug: 'ethics',
    title: 'الأخلاقيات والتحيّز والتقييم',
    subtitle: 'استخدام مسؤول وذكي',
    english: 'Ethics, Bias & Final Quiz',
    emoji: '⚖️',
    duration: '15 دقيقة',
    topics: [
      'تحيّز البيانات والنموذج',
      'الخصوصية والشفافية',
      'الإطار الإماراتي والاستراتيجية الوطنية',
      'اختبار نهائي تفاعلي',
    ],
  },
];

export const getModule = (slug: string) => modules.find(m => m.slug === slug);
export const getNext = (slug: string) => {
  const i = modules.findIndex(m => m.slug === slug);
  return i >= 0 && i < modules.length - 1 ? modules[i + 1] : null;
};
export const getPrev = (slug: string) => {
  const i = modules.findIndex(m => m.slug === slug);
  return i > 0 ? modules[i - 1] : null;
};
