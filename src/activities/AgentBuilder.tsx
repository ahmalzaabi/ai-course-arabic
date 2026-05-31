import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Wrench, Eye, CheckCircle2, Play, RotateCcw } from 'lucide-react';

type Tool = 'search' | 'calc' | 'database' | 'code' | 'email';
type Step = {
  type: 'thought' | 'action' | 'observation' | 'final';
  content: string;
  tool?: Tool;
};
type Goal = {
  id: string;
  title: string;
  desc: string;
  needs: Tool[];
  steps: (tools: Set<Tool>) => Step[];
};

const goals: Goal[] = [
  {
    id: 'threat',
    title: 'تحقيق في تنبيه أمني',
    desc: 'تنبيه: محاولات تسجيل دخول مشبوهة على حساب مدير. حدّد ما إذا كان تهديداً حقيقياً.',
    needs: ['database', 'search'],
    steps: (tools) => {
      const out: Step[] = [];
      out.push({ type: 'thought', content: 'الهدف: تقييم تنبيه تسجيل دخول مشبوه. الخطوة الأولى: جمع البيانات الأخيرة لهذا الحساب.' });
      if (tools.has('database')) {
        out.push({ type: 'action', tool: 'database', content: 'استعلام السجل: SELECT * FROM auth_logs WHERE user="admin" ORDER BY ts DESC LIMIT 50' });
        out.push({ type: 'observation', content: '12 محاولة فاشلة من 4 عناوين IP مختلفة خلال 8 دقائق، تتبعها محاولة ناجحة من IP غير معتاد (روسيا).' });
        out.push({ type: 'thought', content: 'النمط يُشبه هجوم تخمين كلمات المرور (brute-force) متبوعاً بنجاح. أحتاج تحقّقاً من سمعة الـ IP.' });
      } else {
        out.push({ type: 'thought', content: 'لا أملك أداة قاعدة بيانات. سأعتمد على المعلومات المتاحة فقط — وهي محدودة.' });
      }
      if (tools.has('search')) {
        out.push({ type: 'action', tool: 'search', content: 'بحث: "185.220.101.42 reputation threat intel"' });
        out.push({ type: 'observation', content: 'مدرج في 3 قوائم تهديدات معروفة كنقطة خروج Tor مرتبطة بحملات تصيّد.' });
      }
      out.push({
        type: 'final',
        content:
          'تقييم: تهديد حقيقي بدرجة ثقة عالية (0.9). إجراء فوري: تعليق الحساب، إجبار إعادة تعيين كلمة المرور، تفعيل MFA، إخطار فريق SOC، وحفظ السجلات للتحقيق.',
      });
      return out;
    },
  },
  {
    id: 'report',
    title: 'إعداد تقرير عمليات',
    desc: 'جمع تقارير 4 وحدات فرعية، توحيد الصياغة، وتوليد ملخّص يومي.',
    needs: ['database', 'code'],
    steps: (tools) => {
      const out: Step[] = [];
      out.push({ type: 'thought', content: 'الهدف يتطلّب: 1) جلب التقارير، 2) معالجتها، 3) توليد ملخّص. سأبدأ بالجلب.' });
      if (tools.has('database')) {
        out.push({ type: 'action', tool: 'database', content: 'GET /reports?date=today&unit=all' });
        out.push({ type: 'observation', content: '4 تقارير من الوحدات A, B, C, D — أحدها ناقص بيانات الجاهزية.' });
      }
      if (tools.has('code')) {
        out.push({ type: 'action', tool: 'code', content: 'استخراج الحقول الأساسية وتوحيد التواريخ والإحداثيات.' });
        out.push({ type: 'observation', content: 'هيكل موحّد جاهز. حقل الجاهزية للوحدة C مفقود — سأشير إليه.' });
      }
      out.push({ type: 'thought', content: 'لدي ما يكفي. سأُولّد الملخّص بصياغة موجزة.' });
      out.push({
        type: 'final',
        content:
          'الجاهزية الإجمالية 87% (A:92%, B:88%, C:n/a, D:81%). 3 حوادث طفيفة، صفر حوادث حرجة. التوصية: متابعة الوحدة D، طلب تقرير محدّث من C قبل 1800.',
      });
      return out;
    },
  },
  {
    id: 'logistics',
    title: 'حساب احتياج لوجستي',
    desc: 'حساب كميات الوقود المطلوبة لمناورة 72 ساعة لـ 3 وحدات.',
    needs: ['calc', 'database'],
    steps: (tools) => {
      const out: Step[] = [];
      out.push({ type: 'thought', content: 'أحتاج: عدد المركبات لكل وحدة، استهلاك الوقود لكل مركبة، ومدّة المناورة.' });
      if (tools.has('database')) {
        out.push({ type: 'action', tool: 'database', content: 'GET /units/fleet?ids=1,2,3' });
        out.push({ type: 'observation', content: 'الوحدة 1: 24 مركبة (متوسط 12 ل/ساعة). الوحدة 2: 18 (10 ل/ساعة). الوحدة 3: 30 (8 ل/ساعة).' });
      }
      if (tools.has('calc')) {
        out.push({ type: 'action', tool: 'calc', content: '(24×12 + 18×10 + 30×8) × 72' });
        out.push({ type: 'observation', content: '(288 + 180 + 240) × 72 = 708 × 72 = 50,976 لتر.' });
      }
      out.push({
        type: 'final',
        content: 'الاحتياج الكلّي: ~51,000 لتر. مع هامش أمان 15%: 58,650 لتر. توصية: تأمين 60,000 لتر قبل 0500.',
      });
      return out;
    },
  },
];

const toolMeta: Record<Tool, { label: string; en: string; emoji: string }> = {
  search:   { label: 'بحث ويب', en: 'Web Search', emoji: '🔎' },
  calc:     { label: 'آلة حاسبة', en: 'Calculator', emoji: '🧮' },
  database: { label: 'قاعدة بيانات', en: 'Database', emoji: '🗄️' },
  code:     { label: 'تنفيذ كود', en: 'Code Run', emoji: '💻' },
  email:    { label: 'إرسال بريد', en: 'Send Email', emoji: '📧' },
};

export default function AgentBuilder() {
  const [goalId, setGoalId] = useState<string>(goals[0].id);
  const [enabled, setEnabled] = useState<Set<Tool>>(new Set(['search', 'calc', 'database', 'code']));
  const [steps, setSteps] = useState<Step[]>([]);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const goal = goals.find(g => g.id === goalId)!;

  const toggle = (t: Tool) => {
    const s = new Set(enabled);
    if (s.has(t)) s.delete(t); else s.add(t);
    setEnabled(s);
  };

  const run = () => {
    setSteps([]);
    setRunning(true);
    const all = goal.steps(enabled);
    let i = 0;
    const tick = () => {
      setSteps(prev => [...prev, all[i]]);
      i++;
      if (i < all.length) {
        timerRef.current = window.setTimeout(tick, 700);
      } else {
        setRunning(false);
      }
    };
    timerRef.current = window.setTimeout(tick, 350);
  };

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSteps([]); setRunning(false);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-4">
      {/* Controls */}
      <div className="space-y-3">
        <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-3">
          <div className="text-xs uppercase tracking-widest text-ink-400 en mb-2">Goal</div>
          <div className="space-y-1.5">
            {goals.map(g => (
              <button
                key={g.id}
                onClick={() => { setGoalId(g.id); reset(); }}
                className={`w-full text-right rounded-lg p-2.5 transition border ${goalId === g.id ? 'border-brand-500/50 bg-brand-500/10' : 'border-ink-700/60 bg-ink-900/40 hover:bg-ink-800/60'}`}
              >
                <div className="text-sm font-bold">{g.title}</div>
                <div className="text-[11px] text-ink-400 mt-1 leading-relaxed">{g.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-3">
          <div className="text-xs uppercase tracking-widest text-ink-400 en mb-2">Available tools</div>
          <div className="grid grid-cols-2 gap-1.5">
            {(Object.keys(toolMeta) as Tool[]).map(t => {
              const isOn = enabled.has(t);
              return (
                <button
                  key={t}
                  onClick={() => toggle(t)}
                  className={`text-xs px-2 py-1.5 rounded-md border flex items-center gap-1.5 transition ${isOn ? 'bg-brand-500/15 border-brand-500/40 text-white' : 'bg-ink-800 border-ink-700 text-ink-400'}`}
                >
                  <span>{toolMeta[t].emoji}</span>
                  <span className="truncate">{toolMeta[t].label}</span>
                </button>
              );
            })}
          </div>
          <div className="text-[11px] text-ink-400 mt-2 leading-relaxed">
            هذا الهدف يحتاج: {goal.needs.map(n => toolMeta[n].label).join('، ')}.
            عطّل أحدها لترى كيف يتأقلم الوكيل.
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={run} disabled={running} className="flex-1 btn-primary disabled:opacity-50">
            <Play className="h-4 w-4" /> {running ? 'يعمل...' : 'شغّل الوكيل'}
          </button>
          <button onClick={reset} className="btn-ghost"><RotateCcw className="h-4 w-4" /></button>
        </div>
      </div>

      {/* Trace */}
      <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-4 min-h-[400px]">
        <div className="flex items-center gap-2 mb-3">
          <span className="chip-violet">حلقة <span className="en">ReAct</span></span>
          <span className="text-xs text-ink-400">Thought → Action → Observation</span>
        </div>
        <div className="space-y-2">
          <AnimatePresence>
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={
                  s.type === 'thought'
                    ? 'rounded-lg border border-amber-500/30 bg-amber-500/5 p-3'
                    : s.type === 'action'
                    ? 'rounded-lg border border-brand-500/30 bg-brand-500/5 p-3'
                    : s.type === 'observation'
                    ? 'rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3'
                    : 'rounded-lg border border-violet-500/40 bg-violet-500/10 p-3'
                }
              >
                <div className="flex items-center gap-2 text-xs font-bold mb-1">
                  {s.type === 'thought' && <><Brain className="h-3.5 w-3.5 text-amber-300" /> <span className="text-amber-200">تفكير · Thought</span></>}
                  {s.type === 'action' && <><Wrench className="h-3.5 w-3.5 text-brand-300" /> <span className="text-brand-200">أداة · Action ({s.tool && toolMeta[s.tool].label})</span></>}
                  {s.type === 'observation' && <><Eye className="h-3.5 w-3.5 text-emerald-300" /> <span className="text-emerald-200">ملاحظة · Observation</span></>}
                  {s.type === 'final' && <><CheckCircle2 className="h-3.5 w-3.5 text-violet-300" /> <span className="text-violet-200">النتيجة النهائية · Final</span></>}
                </div>
                <div className="text-sm leading-loose">{s.content}</div>
              </motion.div>
            ))}
          </AnimatePresence>
          {steps.length === 0 && (
            <div className="text-sm text-ink-400 text-center py-12">
              اضغط <span className="kbd">شغّل الوكيل</span> لرؤية حلقة <span className="en">ReAct</span> تنفّذ الهدف خطوة بخطوة.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
