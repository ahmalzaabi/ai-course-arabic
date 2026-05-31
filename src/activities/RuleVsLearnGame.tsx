import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Item = {
  id: number;
  label: 'tank' | 'truck';
  hasTurret: boolean;
  hasTracks: boolean;
  hasWindows: boolean;
  size: 'small' | 'large';
  color: 'sand' | 'green' | 'gray';
};

const allItems: Item[] = [
  { id: 1, label: 'tank',  hasTurret: true,  hasTracks: true,  hasWindows: false, size: 'large', color: 'sand' },
  { id: 2, label: 'tank',  hasTurret: true,  hasTracks: true,  hasWindows: false, size: 'large', color: 'green' },
  { id: 3, label: 'truck', hasTurret: false, hasTracks: false, hasWindows: true,  size: 'large', color: 'green' },
  { id: 4, label: 'truck', hasTurret: false, hasTracks: false, hasWindows: true,  size: 'small', color: 'sand' },
  { id: 5, label: 'tank',  hasTurret: true,  hasTracks: true,  hasWindows: true,  size: 'large', color: 'gray' }, // tricky: has windows
  { id: 6, label: 'truck', hasTurret: false, hasTracks: true,  hasWindows: true,  size: 'large', color: 'green' }, // tricky: tracked truck
  { id: 7, label: 'tank',  hasTurret: true,  hasTracks: false, hasWindows: false, size: 'large', color: 'sand' }, // tricky: wheeled tank
  { id: 8, label: 'truck', hasTurret: true,  hasTracks: false, hasWindows: true,  size: 'large', color: 'gray' }, // tricky: turret on truck (tech)
];

function VehicleSVG({ item, size = 100 }: { item: Item; size?: number }) {
  const colorMap = { sand: '#c2a16b', green: '#5a7a4c', gray: '#7d8694' };
  const c = colorMap[item.color];
  return (
    <svg viewBox="0 0 120 80" width={size} height={(size * 80) / 120} className="drop-shadow">
      <rect x="10" y="35" width="100" height="25" rx="4" fill={c} stroke="#000" strokeOpacity="0.2" />
      {item.hasTurret && <rect x="40" y="20" width="40" height="18" rx="3" fill={c} stroke="#000" strokeOpacity="0.2" />}
      {item.hasTurret && <rect x="78" y="26" width="28" height="4" fill={c} />}
      {item.hasWindows && <rect x="80" y="38" width="22" height="10" fill="#a8d6ff" stroke="#000" strokeOpacity="0.2" />}
      {item.hasTracks ? (
        <>
          <rect x="8" y="58" width="104" height="10" rx="5" fill="#222" />
          {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={16 + i * 18} cy="63" r="3" fill="#444" />)}
        </>
      ) : (
        <>
          <circle cx="28" cy="62" r="8" fill="#222" />
          <circle cx="92" cy="62" r="8" fill="#222" />
        </>
      )}
    </svg>
  );
}

type Rule = {
  hasTurret: 'any' | 'yes' | 'no';
  hasTracks: 'any' | 'yes' | 'no';
  hasWindows: 'any' | 'yes' | 'no';
};

function evaluateRule(item: Item, rule: Rule): 'tank' | 'truck' {
  const matchesTank =
    (rule.hasTurret === 'any' || (rule.hasTurret === 'yes') === item.hasTurret) &&
    (rule.hasTracks === 'any' || (rule.hasTracks === 'yes') === item.hasTracks) &&
    (rule.hasWindows === 'any' || (rule.hasWindows === 'yes') === item.hasWindows);
  return matchesTank ? 'tank' : 'truck';
}

function learnedClassify(item: Item, training: Item[]): { label: 'tank' | 'truck'; score: number } {
  let tankScore = 0, truckScore = 0;
  training.forEach(t => {
    let s = 0;
    if (t.hasTurret === item.hasTurret) s++;
    if (t.hasTracks === item.hasTracks) s++;
    if (t.hasWindows === item.hasWindows) s++;
    if (t.size === item.size) s++;
    if (t.color === item.color) s++;
    if (t.label === 'tank') tankScore += s; else truckScore += s;
  });
  const total = tankScore + truckScore || 1;
  return tankScore >= truckScore
    ? { label: 'tank', score: tankScore / total }
    : { label: 'truck', score: truckScore / total };
}

export default function RuleVsLearnGame() {
  const [rule, setRule] = useState<Rule>({ hasTurret: 'yes', hasTracks: 'yes', hasWindows: 'no' });
  const [phase, setPhase] = useState<'easy' | 'tricky'>('easy');
  const items = useMemo(() => phase === 'easy' ? allItems.slice(0, 4) : allItems, [phase]);
  const training = allItems.slice(0, 4);

  const ruleResults = items.map(it => ({ item: it, predicted: evaluateRule(it, rule), correct: evaluateRule(it, rule) === it.label }));
  const ruleAccuracy = Math.round((ruleResults.filter(r => r.correct).length / ruleResults.length) * 100);

  const mlResults = items.map(it => {
    const { label, score } = learnedClassify(it, training);
    return { item: it, predicted: label, score, correct: label === it.label };
  });
  const mlAccuracy = Math.round((mlResults.filter(r => r.correct).length / mlResults.length) * 100);

  const select = (k: keyof Rule, v: 'any' | 'yes' | 'no') => setRule({ ...rule, [k]: v });

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Left: Rule editor */}
        <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="chip-amber">طريقة 1</span>
            <h4 className="font-bold">برمجة قواعد يدوياً</h4>
          </div>
          <p className="text-xs text-ink-400 mb-4">حدّد القاعدة لتصنيف "دبابة": إذا كانت الميزة موجودة (نعم) أو غير موجودة (لا) أو لا يهم.</p>
          {([
            ['hasTurret', 'برج (Turret)?'],
            ['hasTracks', 'جنازير (Tracks)?'],
            ['hasWindows', 'نوافذ (Windows)?'],
          ] as [keyof Rule, string][]).map(([k, label]) => (
            <div key={k} className="flex items-center justify-between gap-3 py-1.5">
              <span className="text-sm">{label}</span>
              <div className="flex bg-ink-800 rounded-lg p-1 text-xs">
                {(['yes','no','any'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => select(k, v)}
                    className={`px-3 py-1 rounded-md transition ${rule[k] === v ? 'bg-brand-500 text-white font-bold' : 'text-ink-400 hover:text-white'}`}
                  >
                    {v === 'yes' ? 'نعم' : v === 'no' ? 'لا' : 'لا يهم'}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm">دقّة قواعدك:</span>
            <div className="flex-1 h-2 bg-ink-800 rounded-full overflow-hidden">
              <motion.div animate={{ width: `${ruleAccuracy}%` }} className={`h-full ${ruleAccuracy >= 80 ? 'bg-emerald-500' : ruleAccuracy >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} />
            </div>
            <span className="en font-bold text-sm">{ruleAccuracy}%</span>
          </div>
        </div>

        {/* Right: ML approach */}
        <div className="rounded-xl border border-brand-500/40 bg-brand-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="chip-brand">طريقة 2</span>
            <h4 className="font-bold">التعلّم من أمثلة</h4>
          </div>
          <p className="text-xs text-ink-300 mb-4">
            النموذج يدرس <strong>4 أمثلة معروفة</strong> ويقارن كل عنصر جديد بأقرب الأنماط في بياناته (يشبه <span className="en">k-NN</span>).
          </p>
          <div className="grid grid-cols-4 gap-2">
            {training.map(t => (
              <div key={t.id} className="rounded-lg bg-ink-800/60 border border-ink-700/60 p-2 grid place-items-center">
                <VehicleSVG item={t} size={70} />
                <span className={`mt-1 text-[10px] font-bold ${t.label === 'tank' ? 'text-rose-300' : 'text-emerald-300'}`}>
                  {t.label === 'tank' ? 'دبابة' : 'شاحنة'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm">دقّة النموذج:</span>
            <div className="flex-1 h-2 bg-ink-800 rounded-full overflow-hidden">
              <motion.div animate={{ width: `${mlAccuracy}%` }} className="h-full bg-brand-400" />
            </div>
            <span className="en font-bold text-sm">{mlAccuracy}%</span>
          </div>
        </div>
      </div>

      {/* Test items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold">عناصر الاختبار</h4>
          <div className="flex bg-ink-800 rounded-lg p-1 text-xs">
            <button onClick={() => setPhase('easy')} className={`px-3 py-1 rounded-md ${phase === 'easy' ? 'bg-brand-500 text-white font-bold' : 'text-ink-400'}`}>سهل (4)</button>
            <button onClick={() => setPhase('tricky')} className={`px-3 py-1 rounded-md ${phase === 'tricky' ? 'bg-brand-500 text-white font-bold' : 'text-ink-400'}`}>صعب (8)</button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <AnimatePresence>
            {ruleResults.map((r, i) => (
              <motion.div
                key={r.item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-xl bg-ink-900/60 border border-ink-700/60 p-3"
              >
                <div className="grid place-items-center">
                  <VehicleSVG item={r.item} size={90} />
                </div>
                <div className="text-center mt-1 text-[11px] text-ink-400">
                  الحقيقي: <span className={r.item.label === 'tank' ? 'text-rose-300 font-bold' : 'text-emerald-300 font-bold'}>{r.item.label === 'tank' ? 'دبابة' : 'شاحنة'}</span>
                </div>
                <div className="grid grid-cols-2 gap-1 mt-2 text-[10px]">
                  <div className={`rounded px-1.5 py-1 text-center ${r.correct ? 'bg-emerald-500/15 border border-emerald-500/30' : 'bg-rose-500/15 border border-rose-500/30'}`}>
                    قواعد: {r.predicted === 'tank' ? 'دبابة' : 'شاحنة'}
                  </div>
                  <div className={`rounded px-1.5 py-1 text-center ${mlResults[i].correct ? 'bg-emerald-500/15 border border-emerald-500/30' : 'bg-rose-500/15 border border-rose-500/30'}`}>
                    نموذج: {mlResults[i].predicted === 'tank' ? 'دبابة' : 'شاحنة'}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-4 text-sm leading-loose">
        <strong className="text-brand-200">الخلاصة:</strong> القواعد البشرية قد تنجح في الحالات الواضحة، لكنها تنهار سريعاً
        مع الحالات الاستثنائية (شاحنة بجنازير، دبابة بعجلات، إلخ). نموذج تعلّم الآلة يتأقلم لأنه يقارن
        الأنماط بدلاً من الاعتماد على قاعدة واحدة. بدّل بين "سهل" و"صعب" لترى الفرق.
      </div>
    </div>
  );
}
