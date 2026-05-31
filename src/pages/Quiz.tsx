import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, RotateCcw, Trophy, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type Q = {
  q: string;
  options: string[];
  answer: number;
  explain: string;
};

const questions: Q[] = [
  {
    q: 'ما الفرق الجوهري بين البرمجة التقليدية وتعلّم الآلة؟',
    options: [
      'تعلّم الآلة أسرع دائماً.',
      'البرمجة التقليدية تستخدم قواعد مكتوبة يدوياً، وتعلّم الآلة يستنتج القواعد من بيانات.',
      'تعلّم الآلة لا يحتاج بيانات.',
      'البرمجة التقليدية لا تعمل على الحاسوب.',
    ],
    answer: 1,
    explain: 'في البرمجة التقليدية: قواعد + بيانات → إجابات. في تعلّم الآلة: بيانات + إجابات → قاعدة (نموذج).',
  },
  {
    q: 'أيّ نوع من التعلّم يُناسب تجميع العملاء حسب سلوكهم بدون تسميات مسبقة؟',
    options: ['تعلّم مُشرف', 'تعلّم غير مُشرف', 'تعلّم بالتعزيز', 'تعلّم تقليدي'],
    answer: 1,
    explain: 'التعلّم غير المُشرَف يكتشف الأنماط والتجمّعات (clusters) بدون تسميات.',
  },
  {
    q: 'ما المقصود بـ "إفراط التخصيص" (Overfitting)؟',
    options: [
      'أن النموذج صغير جداً.',
      'أن النموذج يحفظ بيانات التدريب فيُحسن أداءه عليها لكنه يفشل مع بيانات جديدة.',
      'أن النموذج يستخدم بيانات كثيرة.',
      'أن النموذج لا يُكمل التدريب.',
    ],
    answer: 1,
    explain: 'النموذج يحفظ التفاصيل بدل التعميم. ينجح في التدريب ويفشل في الواقع.',
  },
  {
    q: 'ما الذي يُمثّله "embedding" في النماذج اللغوية؟',
    options: [
      'صورة الكلمة.',
      'متّجه أرقام يُمثّل معنى الكلمة في فضاء متعدّد الأبعاد.',
      'ترجمة الكلمة.',
      'تعريف القاموس.',
    ],
    answer: 1,
    explain: 'الكلمات تتحوّل إلى متّجهات أرقام بحيث تكون الكلمات المتشابهة قريبة في الفضاء.',
  },
  {
    q: 'ما الفرق الأساسي بين النموذج اللغوي والوكيل الذكي (Agent)؟',
    options: [
      'لا يوجد فرق.',
      'الوكيل أصغر.',
      'الوكيل يستخدم النموذج داخل حلقة (تفكير → أداة → ملاحظة) لإنجاز هدف.',
      'الوكيل لا يستخدم نموذجاً لغوياً.',
    ],
    answer: 2,
    explain: 'الوكيل يُضيف الأدوات، الذاكرة، والتخطيط فوق النموذج اللغوي ليُنجز مهمات متعدّدة الخطوات.',
  },
  {
    q: 'في القرارات المصيرية (مثل استخدام قوّة قاتلة)، أين يجب أن يكون الإنسان؟',
    options: [
      'خارج الحلقة (Out)',
      'على الحلقة (On)',
      'داخل الحلقة (In)',
      'لا يهم',
    ],
    answer: 2,
    explain: 'القرارات الحرجة تتطلّب موافقة بشرية صريحة قبل التنفيذ — مبدأ ركيزي في حوكمة الأنظمة الذاتية.',
  },
  {
    q: 'ما هو "المثال المعادي" (Adversarial Example)؟',
    options: [
      'مثال صعب التدريب عليه.',
      'مدخل مُعدَّل بطريقة خفيّة يُسبّب خطأ كبيراً في النموذج رغم أنه يبدو طبيعياً.',
      'بيانات مفقودة.',
      'نموذج منافس.',
    ],
    answer: 1,
    explain: 'تعديل صغير لا يلاحظه الإنسان يُمكن أن يقلب قرار النموذج — تهديد جدّي للأنظمة العملياتية.',
  },
  {
    q: 'إذا كانت مجموعة A تُمثّل 80% من بيانات التدريب ومجموعة B 20%، ما المتوقّع؟',
    options: [
      'النموذج عادل تماماً.',
      'النموذج يتعلّم تحيّزاً ضدّ مجموعة B.',
      'لا يوجد أثر للتوازن في الذكاء الاصطناعي.',
      'النموذج يرفض التدريب.',
    ],
    answer: 1,
    explain: 'النموذج يميل إلى الفئة الأكبر، مما يُؤدّي إلى تحيّز ضدّ الفئة الأقل تمثيلاً.',
  },
  {
    q: 'ما الذي يجعل LLM "يهلوس"؟',
    options: [
      'قلّة الذاكرة.',
      'كونه يُولّد الكلمة الأكثر احتمالاً سياقياً، حتى لو لم تكن صحيحة واقعياً.',
      'وجود فيروس.',
      'بطء الإنترنت.',
    ],
    answer: 1,
    explain: 'النماذج تتنبّأ بالكلمة التالية إحصائياً. قد تبدو الإجابة سلسة وفصيحة لكنها خاطئة.',
  },
  {
    q: 'أيّ مما يلي ليس من مكوّنات الوكيل الذكي؟',
    options: [
      'العقل (LLM)',
      'الأدوات (Tools)',
      'الكاميرا الحرارية',
      'الذاكرة (Memory)',
    ],
    answer: 2,
    explain: 'مكوّنات الوكيل الأساسية: العقل، الأدوات، الذاكرة، التخطيط، والحلقة. الكاميرا قد تكون أداة في حالات محدّدة لكنها ليست مكوّناً أساسياً.',
  },
];

export default function Quiz() {
  const [picks, setPicks] = useState<Record<number, number | undefined>>({});
  const [submitted, setSubmitted] = useState(false);
  const [idx, setIdx] = useState(0);

  const score = useMemo(() => questions.reduce((s, q, i) => (picks[i] === q.answer ? s + 1 : s), 0), [picks]);
  const allAnswered = useMemo(() => questions.every((_, i) => picks[i] !== undefined), [picks]);

  const submit = () => setSubmitted(true);
  const reset = () => { setPicks({}); setSubmitted(false); setIdx(0); };

  const q = questions[idx];

  if (submitted) {
    const pct = Math.round((score / questions.length) * 100);
    const tier = pct >= 80 ? { ar: 'متقدّم', color: 'text-emerald-300' } : pct >= 60 ? { ar: 'جيّد', color: 'text-brand-300' } : { ar: 'تحتاج مراجعة', color: 'text-amber-300' };
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="card-glow !p-8 text-center">
          <Trophy className="h-12 w-12 mx-auto text-brand-300 animate-float" />
          <h1 className="h1 mt-3">انتهى الاختبار!</h1>
          <p className="text-ink-300 mt-2 text-lg">
            نتيجتك: <span className="en font-black text-3xl text-white">{score}/{questions.length}</span> · <span className={tier.color + ' font-black'}>{tier.ar}</span>
          </p>
          <div className="max-w-md mx-auto mt-4 h-3 bg-ink-800 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-l from-brand-400 to-brand-600" />
          </div>
        </div>

        <div className="space-y-3">
          {questions.map((q, i) => {
            const picked = picks[i];
            const correct = picked === q.answer;
            return (
              <div key={i} className={`card border ${correct ? '!border-emerald-500/40' : '!border-rose-500/40'}`}>
                <div className="flex items-start gap-2">
                  {correct ? <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5" /> : <XCircle className="h-5 w-5 text-rose-400 mt-0.5" />}
                  <div className="flex-1">
                    <div className="font-bold mb-2">{i + 1}. {q.q}</div>
                    <div className="text-sm text-ink-300 mb-1">إجابتك: <span className={correct ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>{picked !== undefined ? q.options[picked] : '—'}</span></div>
                    {!correct && <div className="text-sm text-ink-300">الإجابة الصحيحة: <span className="text-emerald-300 font-bold">{q.options[q.answer]}</span></div>}
                    <div className="text-sm text-ink-400 mt-2 leading-loose">{q.explain}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <button onClick={reset} className="btn-ghost"><RotateCcw className="h-4 w-4" /> أعد الاختبار</button>
          <Link to="/" className="btn-primary">العودة إلى الرئيسية <ArrowLeft className="h-4 w-4" /></Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="card-glow !p-6">
        <div className="flex items-center gap-2 text-sm text-ink-300">
          <span className="chip-violet">الاختبار النهائي</span>
          <span>·</span>
          <span><span className="en">{idx + 1}/{questions.length}</span></span>
        </div>
        <div className="mt-2 h-2 bg-ink-800 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${((idx + 1) / questions.length) * 100}%` }} className="h-full bg-gradient-to-l from-brand-400 to-brand-600" />
        </div>
      </div>

      <div className="card">
        <h2 className="h3 mb-4">{q.q}</h2>
        <div className="space-y-2">
          {q.options.map((opt, oi) => {
            const picked = picks[idx] === oi;
            return (
              <button
                key={oi}
                onClick={() => setPicks({ ...picks, [idx]: oi })}
                className={`w-full text-right rounded-xl border p-3 transition ${picked ? 'border-brand-500/60 bg-brand-500/15 text-white' : 'border-ink-700/60 bg-ink-900/40 hover:bg-ink-800/60'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-6 w-6 rounded-full border-2 grid place-items-center ${picked ? 'border-brand-400 bg-brand-400 text-ink-950' : 'border-ink-600'}`}>
                    {picked && <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  <span className="text-sm leading-loose">{opt}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card flex items-center justify-between">
        <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0} className="btn-ghost disabled:opacity-30">
          <ArrowRight className="h-4 w-4" /> السؤال السابق
        </button>
        {idx < questions.length - 1 ? (
          <button onClick={() => setIdx(i => i + 1)} disabled={picks[idx] === undefined} className="btn-primary disabled:opacity-30">
            السؤال التالي <ArrowLeft className="h-4 w-4" />
          </button>
        ) : (
          <button onClick={submit} disabled={!allAnswered} className="btn-primary disabled:opacity-30">
            اعرض النتيجة <Trophy className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
