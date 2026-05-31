import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getModule, getNext, getPrev } from '../modules';
import { markComplete, loadProgress } from '../progress';
import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

export default function ModuleShell({ slug, children }: { slug: string; children: ReactNode }) {
  const m = getModule(slug)!;
  const next = getNext(slug);
  const prev = getPrev(slug);
  const [done, setDone] = useState(loadProgress()[slug] || false);

  useEffect(() => {
    setDone(loadProgress()[slug] || false);
  }, [slug]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="card-glow">
        <div className="flex items-center gap-3 text-sm text-ink-300 mb-3">
          <span className="chip-brand"><span className="en">Module {m.number}</span></span>
          <span className="text-ink-400">•</span>
          <span>{m.duration}</span>
          {done && (
            <>
              <span className="text-ink-400">•</span>
              <span className="chip-emerald"><CheckCircle2 className="h-3.5 w-3.5" /> أُنجزت</span>
            </>
          )}
        </div>
        <div className="flex items-start gap-4">
          <div className="text-5xl animate-float">{m.emoji}</div>
          <div className="flex-1">
            <h1 className="h1">{m.title}</h1>
            <p className="text-ink-300 mt-2 text-lg">{m.subtitle}</p>
            <p className="text-ink-400 mt-1 text-sm en">{m.english}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-8">{children}</div>

      {/* Footer nav */}
      <div className="card flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <button
          onClick={() => {
            markComplete(slug);
            setDone(true);
          }}
          className={`btn ${done ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200' : 'btn-primary'}`}
        >
          <CheckCircle2 className="h-4 w-4" />
          {done ? 'تم إنهاء هذه الوحدة' : 'وضع علامة "مكتملة"'}
        </button>
        <div className="flex gap-2">
          {prev && (
            <Link to={`/module/${prev.slug}`} className="btn-ghost">
              <ArrowRight className="h-4 w-4" /> السابقة
            </Link>
          )}
          {next ? (
            <Link to={`/module/${next.slug}`} className="btn-primary">
              التالية: {next.title} <ArrowLeft className="h-4 w-4" />
            </Link>
          ) : (
            <Link to="/quiz" className="btn-primary">
              الاختبار النهائي <ArrowLeft className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Section({ title, kicker, children }: { title: string; kicker?: string; children: ReactNode }) {
  return (
    <section className="card">
      {kicker && <div className="text-xs uppercase tracking-widest text-brand-300 mb-2 en">{kicker}</div>}
      <h2 className="h2 mb-4">{title}</h2>
      <div className="prose-rtl">{children}</div>
    </section>
  );
}

export function ActivityCard({ title, kicker = 'Activity', children }: { title: string; kicker?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl p-[1px] bg-gradient-to-bl from-brand-400/40 via-violet-400/30 to-emerald-400/30">
      <div className="rounded-2xl bg-ink-900/80 backdrop-blur p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-brand-300 en">{kicker}</div>
            <h3 className="h3 mt-1">{title}</h3>
          </div>
          <span className="chip-violet">نشاط تفاعلي</span>
        </div>
        {children}
      </div>
    </section>
  );
}

export function Callout({ tone = 'info', title, children }: { tone?: 'info' | 'warn' | 'tip'; title?: string; children: ReactNode }) {
  const styles =
    tone === 'warn'
      ? 'border-amber-500/40 bg-amber-500/10 text-amber-100'
      : tone === 'tip'
      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
      : 'border-brand-500/40 bg-brand-500/10 text-brand-100';
  return (
    <div className={`rounded-xl border ${styles} p-4`}>
      {title && <div className="font-bold mb-1">{title}</div>}
      <div className="text-sm leading-loose">{children}</div>
    </div>
  );
}
