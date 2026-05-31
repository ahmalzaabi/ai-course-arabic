import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { modules } from '../modules';
import { loadProgress, resetProgress } from '../progress';
import { Menu, X, RotateCcw, BookOpen } from 'lucide-react';

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(loadProgress());
  const location = useLocation();

  useEffect(() => {
    const update = () => setProgress(loadProgress());
    window.addEventListener('progress-update', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('progress-update', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const completedCount = Object.values(progress).filter(Boolean).length;
  const total = modules.length;
  const pct = Math.round((completedCount / total) * 100);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-ink-950/70 border-b border-ink-800/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 grid place-items-center shadow-glow">
              <span className="text-white font-black"><span className="en">AI</span></span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-extrabold text-sm md:text-base">دورة الذكاء الاصطناعي</span>
              <span className="text-[11px] text-ink-400 en">Intro to AI · Interactive</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-ink-300">
              <span>تقدّمك</span>
              <div className="w-40 h-2 rounded-full bg-ink-800 overflow-hidden">
                <div className="h-full bg-gradient-to-l from-brand-400 to-brand-600 transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="en font-semibold text-ink-100">{completedCount}/{total}</span>
            </div>
            <button onClick={resetProgress} className="btn-ghost !py-1.5 !px-3 text-xs" title="إعادة التقدّم">
              <RotateCcw className="h-4 w-4" /> إعادة
            </button>
          </div>

          <button className="md:hidden btn-ghost !p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-10 grid md:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar */}
        <aside className={`md:sticky md:top-24 md:self-start ${open ? 'block' : 'hidden md:block'}`}>
          <nav className="card !p-3 space-y-1">
            <NavLink
              end
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                  isActive ? 'bg-brand-500/15 text-white border border-brand-500/30' : 'text-ink-300 hover:bg-ink-800/60'
                }`
              }
            >
              <BookOpen className="h-4 w-4" />
              <span className="font-semibold">الرئيسية</span>
            </NavLink>
            <div className="divider !my-2" />
            {modules.map((m) => {
              const done = progress[m.slug];
              return (
                <NavLink
                  key={m.id}
                  to={`/module/${m.slug}`}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                      isActive ? 'bg-brand-500/15 text-white border border-brand-500/30' : 'text-ink-300 hover:bg-ink-800/60'
                    }`
                  }
                >
                  <span className="text-lg">{m.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{m.title}</div>
                    <div className="text-[11px] text-ink-400 truncate"><span className="en">{m.english}</span></div>
                  </div>
                  {done && (
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-2 py-0.5">✓</span>
                  )}
                </NavLink>
              );
            })}
            <div className="divider !my-2" />
            <NavLink
              to="/quiz"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                  isActive ? 'bg-brand-500/15 text-white border border-brand-500/30' : 'text-ink-300 hover:bg-ink-800/60'
                }`
              }
            >
              <span className="text-lg">🏁</span>
              <span className="font-semibold">الاختبار النهائي</span>
            </NavLink>
          </nav>
          <div className="md:hidden mt-4 flex items-center gap-2 text-xs text-ink-300">
            <span>تقدّمك</span>
            <div className="flex-1 h-2 rounded-full bg-ink-800 overflow-hidden">
              <div className="h-full bg-gradient-to-l from-brand-400 to-brand-600" style={{ width: `${pct}%` }} />
            </div>
            <span className="en font-semibold text-ink-100">{completedCount}/{total}</span>
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>

      <footer className="border-t border-ink-800/70 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-ink-400">
          <p>دورة تعليمية تفاعلية · جميع الأنشطة تعمل بالكامل داخل المتصفح بدون رفع بيانات.</p>
          <p className="mt-1 en text-[11px] text-ink-500">Built with React, TensorFlow.js-free in-browser demos · Static deploy on Netlify.</p>
        </div>
      </footer>
    </div>
  );
}
