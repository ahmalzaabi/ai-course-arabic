import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2 } from 'lucide-react';

type Scenario = {
  id: string;
  title: string;
  task: string;
  bad: string;
  good: string;
  badResponse: string;
  goodResponse: string;
  tips: string[];
};

const scenarios: Scenario[] = [
  {
    id: 'report',
    title: 'كتابة تقرير عملياتي',
    task: 'تلخيص حالة عملياتية يومية للقيادة.',
    bad: 'اكتب تقرير عن اليوم.',
    good:
      'بصفتك ضابط عمليات، اكتب تقريراً يومياً موجزاً (5 نقاط بالعربية + ملخص بالإنجليزية في 30 كلمة) يشمل: الحالة، التهديدات، الموارد، المخاطر، التوصية. النبرة رسمية، رقمية حيث أمكن.',
    badResponse:
      'اليوم كان هادئاً نسبياً. تم تنفيذ بعض الأنشطة الاعتيادية وتم رصد بعض التحركات. الفرق تعمل بشكل جيد. لا يوجد ما يستدعي القلق.',
    goodResponse:
      `• الحالة: استقرار عام، 3 دوريات مكتملة (12-18:00).
• التهديدات: نشاط طائرات مسيّرة غير معروفة شمال القطاع 4 (الساعة 14:20).
• الموارد: 92% جاهزية، نقص في الذخيرة 7.62 بنسبة 18%.
• المخاطر: تأخّر إعادة الإمداد قد يقلّل القدرة الدفاعية بحلول 0600.
• التوصية: تسريع الإمداد والاستطلاع المستهدف للقطاع 4.

EN: Sector stable. UAV anomaly N-Sector 4 at 1420. Readiness 92%, ammo 7.62 at -18%. Recommend: prioritized resupply + targeted ISR before 0600.`,
    tips: [
      'حدّد الدور (Role).',
      'حدّد الهيكل والشكل (5 نقاط، طول معيّن).',
      'حدّد النبرة واللغة.',
      'اطلب أرقاماً وأمثلة.',
    ],
  },
  {
    id: 'email',
    title: 'صياغة بريد للقيادة',
    task: 'إبلاغ القيادة بنتائج تمرين تدريبي.',
    bad: 'اكتب إيميل عن التمرين.',
    good:
      'بصفتك قائد سرية، اكتب بريداً إلى قائد الكتيبة عن نتائج التمرين <span class=en>X-21</span>: نقاط القوة (3)، نقاط للتحسين (3)، الإجراء التالي. الحدّ الأقصى 150 كلمة. اللغة العربية.',
    badResponse:
      'سيدي، أكتب لك لإبلاغك بأن التمرين قد تم تنفيذه بنجاح. هناك بعض الأمور الجيدة والبعض الآخر يحتاج تحسين. سأبقيك على اطلاع.',
    goodResponse:
      `سيدي قائد الكتيبة،

في ما يلي ملخّص نتائج التمرين X-21 (الفترة 0700-1300):

نقاط القوة:
1) سرعة الانتشار 18% أسرع من المعيار.
2) التزام صارم بالتسلسل القيادي عند انقطاع الاتصال.
3) دقة الرماية 87%.

للتحسين:
1) تأخّر تركيب الاتصال البديل (12 دقيقة).
2) تشتّت في تحديد القطاع 3.
3) ضعف توثيق الحدث في السجل التشغيلي.

الإجراء التالي: إعادة تنفيذ مرحلة الاتصال البديل خلال 72 ساعة، وتدريب موجّه للقطاع 3.

تفضّلوا بقبول الاحترام،
قائد السرية`,
    tips: [
      'حدّد الجمهور (قائد الكتيبة).',
      'هيكل واضح (3+3+1).',
      'حدّ أقصى للكلمات.',
      'لغة محدّدة.',
    ],
  },
  {
    id: 'analyze',
    title: 'تحليل صورة استطلاع',
    task: 'استخلاص ملاحظات منظّمة من وصف صورة استطلاع.',
    bad: 'حلل لي الصورة.',
    good:
      'لديك وصف صورة جوية لقطاع 6×6 كم. أعطني تحليلاً منظّماً: (1) عناصر بشرية، (2) عناصر آلية، (3) إشارات نشاط حديث، (4) فجوات في المعلومات، (5) فرضيتان متنافستان مع درجة ثقة لكل منهما. أرقام مبنيّة على الوصف، لا تخمينات.',
    badResponse:
      'يبدو أن هناك بعض المركبات والأشخاص. الموقع نشط على الأرجح. قد يكون هذا معسكراً.',
    goodResponse:
      `1) العناصر البشرية: 6-8 أفراد قرب المبنى الجنوبي، 2 قرب البوابة.
2) العناصر الآلية: 3 مركبات خفيفة (طراز غير محدّد)، شاحنة واحدة.
3) إشارات نشاط حديث: آثار إطارات حديثة، أعمدة دخان منخفضة من المبنى الشمالي.
4) فجوات: لا توجد بيانات حرارية، لا اتجاه رياح، الزاوية لا تكشف الجانب الغربي.
5) الفرضيات:
   أ. نقطة دعم لوجستي مؤقّتة (ثقة 0.65) — يدعمها وجود شاحنة وعدد محدود من الأفراد.
   ب. مقرّ قيادة صغير (ثقة 0.30) — لا يوجد دلائل اتصالات أو هوائيات.`,
    tips: [
      'هيكل مرقّم.',
      'اطلب درجة ثقة.',
      'اطلب فجوات (ما لا نعرفه).',
      'فرضيات متعددة لتفادي تثبيت الرأي.',
    ],
  },
];

export default function PromptLab() {
  const [selected, setSelected] = useState<Scenario>(scenarios[0]);
  const [mode, setMode] = useState<'bad' | 'good'>('bad');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {scenarios.map(s => (
          <button
            key={s.id}
            onClick={() => { setSelected(s); setMode('bad'); }}
            className={`text-sm px-3 py-1.5 rounded-lg font-bold ${selected.id === s.id ? 'bg-brand-500 text-white' : 'bg-ink-800 text-ink-300 hover:bg-ink-700'}`}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-4">
        <div className="text-xs text-ink-400 mb-1 en">Task</div>
        <div className="text-sm">{selected.task}</div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <button
          onClick={() => setMode('bad')}
          className={`text-right rounded-xl border p-4 transition ${mode === 'bad' ? 'border-rose-500/50 bg-rose-500/10' : 'border-ink-700/60 bg-ink-900/40 hover:bg-ink-900/70'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="chip-rose">مطالبة ضعيفة</span>
            <span className="text-[10px] text-ink-400 en">Vague prompt</span>
          </div>
          <div className="text-sm leading-loose">{selected.bad}</div>
        </button>
        <button
          onClick={() => setMode('good')}
          className={`text-right rounded-xl border p-4 transition ${mode === 'good' ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-ink-700/60 bg-ink-900/40 hover:bg-ink-900/70'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="chip-emerald">مطالبة قوية</span>
            <span className="text-[10px] text-ink-400 en">Structured prompt</span>
          </div>
          <div className="text-sm leading-loose" dangerouslySetInnerHTML={{ __html: selected.good }} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected.id + mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Wand2 className="h-4 w-4 text-brand-300" />
            <div className="text-xs uppercase tracking-widest text-brand-300 en">Simulated response</div>
          </div>
          <pre className="whitespace-pre-wrap text-sm font-arabic text-ink-100 leading-loose">{mode === 'bad' ? selected.badResponse : selected.goodResponse}</pre>
        </motion.div>
      </AnimatePresence>

      <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-4">
        <div className="text-xs uppercase tracking-widest text-brand-300 en mb-2">Why the good prompt wins</div>
        <ul className="text-sm space-y-1.5">
          {selected.tips.map((t, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-400" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
