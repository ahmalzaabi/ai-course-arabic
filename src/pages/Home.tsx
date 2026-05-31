import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Cpu, GraduationCap, Globe } from 'lucide-react';
import { modules } from '../modules';
import { loadProgress } from '../progress';
import { useEffect, useState } from 'react';

export default function Home() {
  const [progress, setProgress] = useState(loadProgress());
  useEffect(() => {
    const u = () => setProgress(loadProgress());
    window.addEventListener('progress-update', u);
    return () => window.removeEventListener('progress-update', u);
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card-glow !p-8 md:!p-12 relative overflow-hidden"
      >
        <div className="absolute -top-16 -left-16 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-10 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />
        <div className="relative">
          <span className="chip-brand mb-4"><Sparkles className="h-3.5 w-3.5" /> دورة تفاعلية · مستوى مبتدئ</span>
          <h1 className="h1 max-w-3xl">
            مقدمة شاملة إلى <span className="text-brand-300">الذكاء الاصطناعي</span>
            <br />بأسلوب تفاعلي وعملي.
          </h1>
          <p className="text-ink-300 text-lg mt-5 max-w-2xl leading-loose">
            ثمان وحدات قصيرة تشرح المفاهيم من الصفر، مع أنشطة تفاعلية حقيقية داخل كل وحدة:
            دَرّب نموذجاً، استخدم نماذج جاهزة، واستدعِ <span className="en">APIs</span> مفتوحة لبناء وكلاء أذكياء.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to={`/module/${modules[0].slug}`} className="btn-primary text-base">
              ابدأ الآن <ArrowLeft className="h-4 w-4" />
            </Link>
            <a href="#modules" className="btn-ghost">استعرض المحتوى</a>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            {[
              { icon: <GraduationCap className="h-5 w-5" />, label: 'صفر معرفة مسبقة', en: 'Beginner-friendly' },
              { icon: <Cpu className="h-5 w-5" />, label: 'دَرِّب نماذج فعلية', en: 'Train real models' },
              { icon: <Globe className="h-5 w-5" />, label: 'تستخدم APIs مفتوحة', en: 'Open APIs included' },
              { icon: <Sparkles className="h-5 w-5" />, label: 'وحدة عن الوكلاء', en: 'Includes Agentic AI' },
            ].map((f, i) => (
              <div key={i} className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-3 flex items-center gap-3">
                <div className="h-9 w-9 grid place-items-center rounded-lg bg-brand-500/15 text-brand-300">{f.icon}</div>
                <div className="leading-tight">
                  <div className="text-sm font-bold">{f.label}</div>
                  <div className="text-[11px] text-ink-400 en">{f.en}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Modules grid */}
      <section id="modules" className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="h2">الوحدات الدراسية</h2>
            <p className="text-ink-400 text-sm mt-1 en">8 modules · interactive · ~2.5 hours total</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m, i) => {
            const done = progress[m.slug];
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i }}
              >
                <Link
                  to={`/module/${m.slug}`}
                  className="card hover:border-brand-500/50 hover:bg-ink-900/80 transition-all duration-200 block group h-full"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-3xl">{m.emoji}</div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="chip-brand !text-[10px]"><span className="en">Module {m.number}</span></span>
                      {done && <span className="chip-emerald !text-[10px]">✓ منجزة</span>}
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-lg mt-3 group-hover:text-brand-300 transition">{m.title}</h3>
                  <p className="text-sm text-ink-400 mt-1 en">{m.english}</p>
                  <p className="text-sm text-ink-300 mt-3 leading-loose">{m.subtitle}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {m.topics.slice(0, 2).map((t, j) => (
                      <span key={j} className="text-[11px] px-2 py-0.5 rounded-md bg-ink-800/80 text-ink-300 border border-ink-700/60">
                        {t}
                      </span>
                    ))}
                    {m.topics.length > 2 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-ink-800/80 text-ink-400 border border-ink-700/60">
                        +{m.topics.length - 2}
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="card flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="h3">جاهز للاختبار؟</h3>
          <p className="text-ink-300 text-sm mt-1">اختبار قصير لقياس استيعابك للمفاهيم الأساسية.</p>
        </div>
        <Link to="/quiz" className="btn-primary">إلى الاختبار النهائي <ArrowLeft className="h-4 w-4" /></Link>
      </section>
    </div>
  );
}
