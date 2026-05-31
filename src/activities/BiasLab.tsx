import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

type Sample = { group: 'A' | 'B'; outcome: 0 | 1 };

function genDataset(skew: number, totalA: number, totalB: number): Sample[] {
  // skew 0..1: how much group A is over-represented in positive class
  const data: Sample[] = [];
  for (let i = 0; i < totalA; i++) {
    const p = 0.45 + 0.35 * skew;
    data.push({ group: 'A', outcome: Math.random() < p ? 1 : 0 });
  }
  for (let i = 0; i < totalB; i++) {
    const p = 0.45 - 0.30 * skew;
    data.push({ group: 'B', outcome: Math.random() < p ? 1 : 0 });
  }
  return data;
}

function trainAndEvaluate(data: Sample[]) {
  // Simple model: predict 1 with probability proportional to group's positive rate
  let totalA = 0, posA = 0, totalB = 0, posB = 0;
  for (const d of data) {
    if (d.group === 'A') { totalA++; if (d.outcome === 1) posA++; } else { totalB++; if (d.outcome === 1) posB++; }
  }
  const rateA = totalA ? posA / totalA : 0.5;
  const rateB = totalB ? posB / totalB : 0.5;
  // Test set evaluation (simulate)
  const acceptanceA = rateA;
  const acceptanceB = rateB;
  const gap = Math.abs(acceptanceA - acceptanceB);
  return { rateA, rateB, acceptanceA, acceptanceB, gap, totalA, totalB };
}

export default function BiasLab() {
  const [skew, setSkew] = useState(0.6);
  const [sizeA, setSizeA] = useState(70);
  const [sizeB, setSizeB] = useState(30);
  const [seed, setSeed] = useState(0);

  const data = useMemo(() => genDataset(skew, sizeA, sizeB), [skew, sizeA, sizeB, seed]);
  const stats = useMemo(() => trainAndEvaluate(data), [data]);
  const balanced = useMemo(() => trainAndEvaluate(genDataset(0, 50, 50)), [seed]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="grid md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-3">
          <div className="text-xs uppercase tracking-widest text-ink-400 en mb-1">Group A samples</div>
          <input type="range" min={10} max={100} step={5} value={sizeA} onChange={e => setSizeA(parseInt(e.target.value))} />
          <div className="text-sm en font-bold mt-1">{sizeA}</div>
        </div>
        <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-3">
          <div className="text-xs uppercase tracking-widest text-ink-400 en mb-1">Group B samples</div>
          <input type="range" min={10} max={100} step={5} value={sizeB} onChange={e => setSizeB(parseInt(e.target.value))} />
          <div className="text-sm en font-bold mt-1">{sizeB}</div>
        </div>
        <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-3">
          <div className="text-xs uppercase tracking-widest text-ink-400 en mb-1">Historical bias (skew)</div>
          <input type="range" min={0} max={1} step={0.05} value={skew} onChange={e => setSkew(parseFloat(e.target.value))} />
          <div className="text-sm en font-bold mt-1">{(skew * 100).toFixed(0)}%</div>
        </div>
      </div>

      {/* Visual */}
      <div className="grid md:grid-cols-2 gap-3">
        <Bar label="مجموعة A" en="Group A" rate={stats.acceptanceA} count={stats.totalA} color="bg-brand-400" />
        <Bar label="مجموعة B" en="Group B" rate={stats.acceptanceB} count={stats.totalB} color="bg-violet-400" />
      </div>

      <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-300 en">Disparity gap</div>
            <div className="font-bold text-amber-100 mt-1">الفجوة بين المجموعتين: <span className="en">{(stats.gap * 100).toFixed(1)}%</span></div>
          </div>
          <span className={`chip ${stats.gap > 0.2 ? 'chip-rose' : stats.gap > 0.1 ? 'chip-amber' : 'chip-emerald'}`}>
            {stats.gap > 0.2 ? 'تحيّز كبير' : stats.gap > 0.1 ? 'تحيّز متوسّط' : 'مقبول'}
          </span>
        </div>
        <p className="text-sm text-ink-300 mt-2 leading-loose">
          النموذج "تعلّم" أن مجموعة A تستحقّ النتيجة الإيجابية أكثر من B —
          ليس لأنها أفضل فعلاً، بل لأن البيانات التاريخية كانت مُنحازة. هذا ما يُسمّى تحيّز <strong>تاريخي</strong>.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <button
          onClick={() => { setSizeA(50); setSizeB(50); setSkew(0); setSeed(s => s + 1); }}
          className="btn-primary"
        >
          وازن البيانات وأعد التدريب
        </button>
        <button
          onClick={() => setSeed(s => s + 1)}
          className="btn-ghost"
        >
          أعد توليد العيّنة (نفس الإعدادات)
        </button>
      </div>

      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
        <div className="text-xs uppercase tracking-widest text-emerald-300 en mb-1">Balanced reference</div>
        <div className="text-sm leading-loose">
          مع <strong>50/50</strong> بدون تحيّز تاريخي، تكون الفجوة عادة قريبة من <span className="en font-bold">{(balanced.gap * 100).toFixed(1)}%</span>،
          أي عدالة مقاربة بين المجموعتين.
        </div>
      </div>

      <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-4 text-sm leading-loose">
        <strong>الدرس:</strong> تنظيف البيانات، توازن الفئات، اختبار الفجوة قبل النشر،
        ومراقبة الإنتاج هي خطوات لا غنى عنها. الذكاء الاصطناعي العادل ليس مصادفة —
        بل نتيجة قرارات هندسية واعية.
      </div>
    </div>
  );
}

function Bar({ label, en, rate, count, color }: { label: string; en: string; rate: number; count: number; color: string }) {
  return (
    <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-4">
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="font-bold">{label}</div>
          <div className="text-[11px] text-ink-400 en">{en} · n={count}</div>
        </div>
        <span className="en font-bold text-2xl">{(rate * 100).toFixed(0)}%</span>
      </div>
      <div className="text-[11px] text-ink-400 mb-1">معدّل النتيجة الإيجابية للنموذج</div>
      <div className="h-3 bg-ink-800 rounded-full overflow-hidden">
        <motion.div animate={{ width: `${rate * 100}%` }} className={`h-full ${color}`} />
      </div>
    </div>
  );
}
