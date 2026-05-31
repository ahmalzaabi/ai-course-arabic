import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

type Position = 'in' | 'on' | 'out';
type Scenario = {
  id: string;
  title: string;
  desc: string;
  best: Position;
  why: string;
};

const scenarios: Scenario[] = [
  {
    id: 'spam',
    title: 'فلتر الرسائل المزعجة',
    desc: 'تصنيف ملايين الرسائل يومياً إلى "بريد عادي" أو "مزعج".',
    best: 'out',
    why: 'الحجم ضخم، والخطأ الفردي قابل للتراجع (يمكن للمستخدم استرجاع رسالة). الرقابة على عيّنات وتقارير دورية كافية.',
  },
  {
    id: 'medical',
    title: 'تشخيص طبي بالأشعة',
    desc: 'نظام يقترح وجود ورم بناءً على صور أشعة.',
    best: 'in',
    why: 'القرار يؤثّر مباشرة على حياة إنسان. يجب أن يُؤكّد الطبيب التشخيص قبل أيّ إجراء.',
  },
  {
    id: 'isr',
    title: 'تحليل صور استطلاع جوّي',
    desc: 'نظام يفرز آلاف الصور ويُمييز ما هو ذو قيمة استخباراتية.',
    best: 'on',
    why: 'الحجم كبير ولا يمكن لإنسان مراجعة كل شيء. النظام يُرشّح، والمحلّل يراجع المرشّحات الأعلى أهمية.',
  },
  {
    id: 'cyber',
    title: 'حظر اتصال شبكي مشبوه',
    desc: 'نظام دفاع سيبراني يكتشف اتصالاً يُطابق نمط هجوم معروف.',
    best: 'out',
    why: 'السرعة حرجة (ميلي-ثانية)، وتكلفة الخطأ منخفضة (يمكن استرجاع الاتصال). الإنسان يُراجع لاحقاً.',
  },
  {
    id: 'lethal',
    title: 'استخدام قوّة قاتلة',
    desc: 'منظومة دفاع جوي قادرة على إطلاق نار على هدف معادٍ.',
    best: 'in',
    why: 'القرارات القاتلة لا يجب أن تُتخذ بدون موافقة بشرية صريحة. مبدأ مركزي في الحوكمة الدولية للأنظمة الذاتية.',
  },
  {
    id: 'logistics',
    title: 'إعادة توزيع الإمدادات',
    desc: 'نظام يحسب خطّة توزيع وقود وذخيرة على وحدات في مناورة.',
    best: 'on',
    why: 'النظام أسرع وأدق، لكن قد لا يدرك متغيّرات إنسانية. ضابط اللوجستيات يُراجع ويُعدّل قبل التنفيذ.',
  },
];

const labels: Record<Position, { ar: string; en: string; color: string }> = {
  in:  { ar: 'داخل الحلقة', en: 'In the loop', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' },
  on:  { ar: 'على الحلقة', en: 'On the loop', color: 'border-amber-500/40 bg-amber-500/10 text-amber-200' },
  out: { ar: 'خارج الحلقة', en: 'Out of the loop', color: 'border-rose-500/40 bg-rose-500/10 text-rose-200' },
};

export default function HumanInLoop() {
  const [answers, setAnswers] = useState<Record<string, Position>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const choose = (id: string, p: Position) => {
    setAnswers(a => ({ ...a, [id]: p }));
    setRevealed(r => ({ ...r, [id]: true }));
  };

  const correct = scenarios.filter(s => answers[s.id] === s.best).length;
  const answered = Object.keys(answers).length;

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {scenarios.map(s => {
          const ans = answers[s.id];
          const open = revealed[s.id];
          const right = ans === s.best;
          return (
            <div key={s.id} className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h4 className="font-bold">{s.title}</h4>
                  <p className="text-sm text-ink-300 mt-1 leading-loose">{s.desc}</p>
                </div>
                {open && (
                  <span className={`chip ${right ? 'chip-emerald' : 'chip-rose'}`}>
                    {right ? <><CheckCircle2 className="h-3.5 w-3.5" /> صحيح</> : <><AlertTriangle className="h-3.5 w-3.5" /> فكّر مجدّداً</>}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {(['in', 'on', 'out'] as Position[]).map(p => {
                  const isPicked = ans === p;
                  const isBest = open && p === s.best;
                  return (
                    <button
                      key={p}
                      onClick={() => choose(s.id, p)}
                      className={`text-xs px-2 py-2 rounded-lg border transition ${
                        isBest
                          ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-100'
                          : isPicked
                          ? labels[p].color
                          : 'border-ink-700 bg-ink-800/60 text-ink-300 hover:bg-ink-800'
                      }`}
                    >
                      <div className="font-bold">{labels[p].ar}</div>
                      <div className="en text-[10px] opacity-70">{labels[p].en}</div>
                    </button>
                  );
                })}
              </div>
              {open && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 rounded-lg border border-brand-500/30 bg-brand-500/5 p-3 text-sm leading-loose"
                >
                  <div className="text-xs text-brand-300 en mb-1">Expert reasoning</div>
                  {s.why}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-3 flex items-center justify-between">
        <span className="text-sm text-ink-300">أجبت <span className="en font-bold">{answered}/{scenarios.length}</span> · صحيح <span className="en font-bold text-emerald-300">{correct}</span></span>
        <ArrowRight className="h-4 w-4 text-ink-500" />
      </div>
    </div>
  );
}
