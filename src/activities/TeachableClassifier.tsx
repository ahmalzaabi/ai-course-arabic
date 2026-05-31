import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, Trash2, RotateCcw, Wand2, ImagePlus } from 'lucide-react';

type ClassId = 'tank' | 'truck' | 'jet';
type Sample = { id: string; src: string; classId: ClassId };

const CLASSES: { id: ClassId; ar: string; en: string; emoji: string; color: string }[] = [
  { id: 'tank',  ar: 'دبابة',           en: 'Tank',     emoji: '🛡️', color: 'border-emerald-500/40 bg-emerald-500/5' },
  { id: 'truck', ar: 'شاحنة عسكرية',     en: 'Truck',    emoji: '🚚', color: 'border-amber-500/40 bg-amber-500/5' },
  { id: 'jet',   ar: 'طائرة مقاتلة',     en: 'Fighter',  emoji: '✈️', color: 'border-brand-500/40 bg-brand-500/5' },
];

// ----- Programmatic sample generator (canvas → dataURL) -----
function rand(min: number, max: number) { return Math.random() * (max - min) + min; }
function pick<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateSample(cls: ClassId): string {
  const W = 160, H = 120;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d')!;

  if (cls === 'tank') {
    const ground = pick(['#3a4a2a', '#5e5230', '#4a3f28', '#2f3a25']);
    const sky = pick(['#1a2030', '#202840', '#2a2f48']);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, sky); grad.addColorStop(0.55, sky); grad.addColorStop(0.55, ground); grad.addColorStop(1, ground);
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    const body = pick(['#4f5d2c', '#5a6a3e', '#3f4a25', '#6b6440', '#5b5232']);
    ctx.fillStyle = body;
    const x = rand(15, 30), y = rand(60, 70);
    ctx.fillRect(x, y, 110, 22);
    ctx.fillRect(x + 18, y - 14, 55, 18);
    ctx.fillRect(x + 70, y - 8, 60, 5);
    ctx.fillStyle = '#1a1a1a';
    for (let i = 0; i < 7; i++) ctx.beginPath(), ctx.arc(x + 8 + i * 16, y + 25, 6, 0, Math.PI * 2), ctx.fill();
  } else if (cls === 'truck') {
    const ground = pick(['#7a6440', '#5e5230', '#3a4a2a', '#806b3a']);
    const sky = pick(['#3a527c', '#2c3e63', '#406088', '#1f2e4c']);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, sky); grad.addColorStop(0.55, sky); grad.addColorStop(0.55, ground); grad.addColorStop(1, ground);
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    const body = pick(['#7a6a40', '#5b4f2a', '#4a4030', '#6e5b34', '#8a7b48']);
    ctx.fillStyle = body;
    const x = rand(10, 20);
    ctx.fillRect(x, 60, 70, 25);
    ctx.fillRect(x + 70, 65, 28, 20);
    ctx.fillStyle = '#a8d6ff';
    ctx.fillRect(x + 73, 70, 14, 10);
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.arc(x + 16, 90, 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 50, 90, 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 84, 90, 8, 0, Math.PI * 2); ctx.fill();
  } else {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, pick(['#1d3a6c', '#2a4a7c', '#1a2b50']));
    grad.addColorStop(1, pick(['#7faed8', '#5a7fb0', '#a8c8e8']));
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    const fuselage = pick(['#cfd6e0', '#a0a8b4', '#dfe4ec', '#b8c0cc']);
    ctx.fillStyle = fuselage;
    const yBase = rand(50, 70);
    ctx.beginPath();
    ctx.moveTo(20, yBase);
    ctx.lineTo(140, yBase - 5);
    ctx.lineTo(155, yBase);
    ctx.lineTo(140, yBase + 5);
    ctx.closePath(); ctx.fill();
    // wings
    ctx.beginPath();
    ctx.moveTo(60, yBase); ctx.lineTo(85, yBase - 22); ctx.lineTo(100, yBase); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(50, yBase + 5); ctx.lineTo(75, yBase + 22); ctx.lineTo(95, yBase + 5); ctx.closePath(); ctx.fill();
    // tail
    ctx.beginPath();
    ctx.moveTo(25, yBase); ctx.lineTo(35, yBase - 12); ctx.lineTo(45, yBase); ctx.closePath(); ctx.fill();
    // cockpit
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath(); ctx.ellipse(125, yBase - 2, 8, 4, 0, 0, Math.PI * 2); ctx.fill();
  }

  // light noise
  const data = ctx.getImageData(0, 0, W, H);
  for (let i = 0; i < data.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 18;
    data.data[i] = Math.max(0, Math.min(255, data.data[i] + n));
    data.data[i + 1] = Math.max(0, Math.min(255, data.data[i + 1] + n));
    data.data[i + 2] = Math.max(0, Math.min(255, data.data[i + 2] + n));
  }
  ctx.putImageData(data, 0, 0);

  return c.toDataURL('image/jpeg', 0.85);
}

// ----- Feature extraction -----
const FEAT_DIM = 4 * 4 * 4 + 8;
async function extractFeatures(src: string): Promise<Float32Array> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const W = 64, H = 64;
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      const ctx = c.getContext('2d')!;
      ctx.drawImage(img, 0, 0, W, H);
      const data = ctx.getImageData(0, 0, W, H).data;
      // 4×4×4 RGB color histogram
      const hist = new Float32Array(64);
      let totalLuma = 0, lumaSq = 0;
      // edge-density via simple difference
      let edges = 0;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const i = (y * W + x) * 4;
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const ri = Math.min(3, Math.floor(r / 64));
          const gi = Math.min(3, Math.floor(g / 64));
          const bi = Math.min(3, Math.floor(b / 64));
          hist[ri * 16 + gi * 4 + bi]++;
          const luma = 0.299 * r + 0.587 * g + 0.114 * b;
          totalLuma += luma; lumaSq += luma * luma;
          if (x > 0) {
            const j = (y * W + x - 1) * 4;
            edges += Math.abs(luma - (0.299 * data[j] + 0.587 * data[j + 1] + 0.114 * data[j + 2]));
          }
        }
      }
      const N = W * H;
      for (let i = 0; i < hist.length; i++) hist[i] /= N;
      const meanLuma = totalLuma / N;
      const varLuma = lumaSq / N - meanLuma * meanLuma;
      const edgeDensity = edges / (N * 255);

      // Quadrant averages (top-left, top-right, bot-left, bot-right) for 3 channels
      const quad = new Float32Array(8);
      const sums = [[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
      const counts = [0,0,0,0];
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const i = (y * W + x) * 4;
          const q = (y < H/2 ? 0 : 2) + (x < W/2 ? 0 : 1);
          sums[q][0] += data[i]; sums[q][1] += data[i+1]; sums[q][2] += data[i+2];
          counts[q]++;
        }
      }
      // top half mean R&B (sky color), bottom half mean R&G (ground color)
      quad[0] = (sums[0][0] + sums[1][0]) / (counts[0] + counts[1]) / 255; // top R
      quad[1] = (sums[0][2] + sums[1][2]) / (counts[0] + counts[1]) / 255; // top B
      quad[2] = (sums[2][0] + sums[3][0]) / (counts[2] + counts[3]) / 255; // bot R
      quad[3] = (sums[2][1] + sums[3][1]) / (counts[2] + counts[3]) / 255; // bot G
      quad[4] = meanLuma / 255;
      quad[5] = Math.sqrt(varLuma) / 128;
      quad[6] = Math.min(1, edgeDensity);
      quad[7] = (img.naturalWidth / Math.max(1, img.naturalHeight)) / 3; // aspect ratio scaled

      const feat = new Float32Array(FEAT_DIM);
      feat.set(hist, 0);
      feat.set(quad, hist.length);
      resolve(feat);
    };
    img.onerror = reject;
    img.src = src;
  });
}

function meanVec(vecs: Float32Array[]): Float32Array {
  const out = new Float32Array(FEAT_DIM);
  for (const v of vecs) for (let i = 0; i < FEAT_DIM; i++) out[i] += v[i];
  for (let i = 0; i < FEAT_DIM; i++) out[i] /= Math.max(1, vecs.length);
  return out;
}
function distance(a: Float32Array, b: Float32Array) {
  let s = 0; for (let i = 0; i < a.length; i++) { const d = a[i] - b[i]; s += d * d; }
  return Math.sqrt(s);
}

// ----- Component -----
export default function TeachableClassifier() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [trained, setTrained] = useState<{ classId: ClassId; mean: Float32Array }[] | null>(null);
  const [training, setTraining] = useState(false);
  const [testImage, setTestImage] = useState<string | null>(null);
  const [scores, setScores] = useState<{ classId: ClassId; score: number }[]>([]);
  const fileRefs = useRef<Record<ClassId, HTMLInputElement | null>>({ tank: null, truck: null, jet: null });
  const testFileRef = useRef<HTMLInputElement | null>(null);

  const counts = useMemo(() => {
    const c: Record<ClassId, number> = { tank: 0, truck: 0, jet: 0 };
    samples.forEach(s => c[s.classId]++);
    return c;
  }, [samples]);

  const canTrain = counts.tank >= 3 && counts.truck >= 3 && counts.jet >= 3;

  const addGenerated = (classId: ClassId, n = 4) => {
    const news = Array.from({ length: n }, () => ({
      id: `${classId}-${Math.random().toString(36).slice(2, 8)}`,
      src: generateSample(classId),
      classId,
    }));
    setSamples(s => [...s, ...news]);
    setTrained(null); setTestImage(null); setScores([]);
  };

  const handleUpload = async (classId: ClassId, files: FileList | null) => {
    if (!files) return;
    const arr: Sample[] = [];
    for (const f of Array.from(files).slice(0, 12)) {
      const src = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.onerror = rej; r.readAsDataURL(f);
      });
      arr.push({ id: `${classId}-${Math.random().toString(36).slice(2, 8)}`, src, classId });
    }
    setSamples(s => [...s, ...arr]);
    setTrained(null); setTestImage(null); setScores([]);
  };

  const removeSample = (id: string) => {
    setSamples(s => s.filter(x => x.id !== id));
    setTrained(null); setTestImage(null); setScores([]);
  };

  const train = async () => {
    setTraining(true);
    const byClass: Record<ClassId, Float32Array[]> = { tank: [], truck: [], jet: [] };
    for (const s of samples) {
      const f = await extractFeatures(s.src);
      byClass[s.classId].push(f);
    }
    const out = (Object.keys(byClass) as ClassId[]).map(classId => ({ classId, mean: meanVec(byClass[classId]) }));
    setTrained(out);
    setTraining(false);
  };

  const classify = async (src: string) => {
    if (!trained) return;
    const f = await extractFeatures(src);
    const dists = trained.map(t => ({ classId: t.classId, d: distance(f, t.mean) }));
    const inv = dists.map(x => 1 / (x.d + 0.01));
    const sum = inv.reduce((a, b) => a + b, 0);
    const probs = dists.map((x, i) => ({ classId: x.classId, score: inv[i] / sum }));
    setScores(probs.sort((a, b) => b.score - a.score));
    setTestImage(src);
  };

  const handleTestUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    const src = await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.onerror = rej; r.readAsDataURL(f);
    });
    classify(src);
  };

  const reset = () => {
    setSamples([]); setTrained(null); setTestImage(null); setScores([]);
  };

  // pre-fill with a few samples for first-time users
  useEffect(() => {
    if (samples.length === 0) {
      setSamples([
        { id: 'init-1', src: generateSample('tank'), classId: 'tank' },
        { id: 'init-2', src: generateSample('tank'), classId: 'tank' },
        { id: 'init-3', src: generateSample('truck'), classId: 'truck' },
        { id: 'init-4', src: generateSample('truck'), classId: 'truck' },
        { id: 'init-5', src: generateSample('jet'), classId: 'jet' },
        { id: 'init-6', src: generateSample('jet'), classId: 'jet' },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const top = scores[0];

  return (
    <div className="space-y-5">
      {/* Step indicator */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className={`chip ${samples.length > 0 ? 'chip-emerald' : 'chip-brand'}`}>
          1. اجمع البيانات
        </span>
        <span className="text-ink-500">←</span>
        <span className={`chip ${trained ? 'chip-emerald' : 'chip-brand'}`}>
          2. درّب النموذج
        </span>
        <span className="text-ink-500">←</span>
        <span className={`chip ${scores.length > 0 ? 'chip-emerald' : 'chip-brand'}`}>
          3. اختبر
        </span>
      </div>

      {/* Class collectors */}
      <div className="grid md:grid-cols-3 gap-3">
        {CLASSES.map(cls => (
          <div key={cls.id} className={`rounded-xl border ${cls.color} p-3 space-y-2`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{cls.emoji}</span>
                <div>
                  <div className="font-bold">{cls.ar}</div>
                  <div className="text-[11px] text-ink-400 en">{cls.en} · {counts[cls.id]} samples</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5 max-h-44 overflow-y-auto rounded-lg bg-ink-950/40 p-1.5 min-h-[7rem]">
              {samples.filter(s => s.classId === cls.id).map(s => (
                <div key={s.id} className="relative group rounded overflow-hidden aspect-[4/3]">
                  <img src={s.src} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeSample(s.id)}
                    className="absolute top-0.5 right-0.5 bg-rose-500/80 hover:bg-rose-500 text-white rounded p-0.5 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {samples.filter(s => s.classId === cls.id).length === 0 && (
                <div className="col-span-3 grid place-items-center text-[11px] text-ink-500 py-3">لا توجد عيّنات بعد</div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button onClick={() => addGenerated(cls.id, 4)} className="btn-ghost !py-1.5 !px-2 text-xs">
                <Sparkles className="h-3.5 w-3.5" /> +٤ عيّنات
              </button>
              <button onClick={() => fileRefs.current[cls.id]?.click()} className="btn-ghost !py-1.5 !px-2 text-xs">
                <Upload className="h-3.5 w-3.5" /> ارفع
              </button>
              <input
                ref={el => { fileRefs.current[cls.id] = el; }}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={e => handleUpload(cls.id, e.target.files)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Train */}
      <div className="card !p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="text-sm text-ink-300 leading-loose">
          <strong className="text-white">نصيحة:</strong> أضف ٣ عيّنات على الأقل لكل فئة. كلّما زاد التنوّع، تعلّم النموذج بشكل أفضل.
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="btn-ghost"><RotateCcw className="h-4 w-4" /> إعادة</button>
          <button
            onClick={train}
            disabled={!canTrain || training}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Wand2 className="h-4 w-4" />
            {training ? 'يدرّب...' : trained ? 'إعادة التدريب' : 'تدريب النموذج'}
          </button>
        </div>
      </div>

      {/* Test */}
      <AnimatePresence>
        {trained && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs uppercase tracking-widest text-violet-300 en">3. Test the trained model</div>
                <h4 className="font-bold mt-1">جرّب النموذج على صور جديدة</h4>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_1fr] gap-4">
              {/* Test source */}
              <div className="space-y-2">
                <div className="rounded-lg bg-ink-950/40 border border-ink-700/60 aspect-[4/3] overflow-hidden grid place-items-center">
                  {testImage ? (
                    <img src={testImage} className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-sm text-ink-500 text-center px-4">
                      اختر طريقة اختبار من الأسفل، وستظهر الصورة هنا.
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => classify(generateSample(pick(['tank', 'truck', 'jet'])))}
                    className="btn-ghost text-xs"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> صورة عشوائية
                  </button>
                  <button onClick={() => testFileRef.current?.click()} className="btn-ghost text-xs">
                    <ImagePlus className="h-3.5 w-3.5" /> ارفع صورتك
                  </button>
                  <input
                    ref={el => { testFileRef.current = el; }}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={e => handleTestUpload(e.target.files)}
                  />
                </div>
              </div>

              {/* Predictions */}
              <div className="space-y-3">
                {top && (
                  <div className="rounded-lg bg-brand-500/10 border border-brand-500/30 p-3">
                    <div className="text-xs text-brand-300 en">Top prediction</div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{CLASSES.find(c => c.id === top.classId)?.emoji}</span>
                        <div className="font-bold text-lg">{CLASSES.find(c => c.id === top.classId)?.ar}</div>
                      </div>
                      <span className="en font-black text-2xl text-brand-200">{(top.score * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                )}
                {scores.length > 0 ? (
                  <div className="space-y-2">
                    {scores.map(s => {
                      const cls = CLASSES.find(c => c.id === s.classId)!;
                      return (
                        <div key={s.classId} className="flex items-center gap-2">
                          <span className="text-lg w-6">{cls.emoji}</span>
                          <span className="text-sm w-24 truncate">{cls.ar}</span>
                          <div className="flex-1 h-2 bg-ink-800 rounded-full overflow-hidden">
                            <motion.div animate={{ width: `${s.score * 100}%` }} className="h-full bg-brand-400" />
                          </div>
                          <span className="en text-xs w-10 text-right">{(s.score * 100).toFixed(0)}%</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-ink-400 text-center py-8">
                    اختر صورة اختبار لرؤية تنبّؤ النموذج.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-4 text-sm leading-loose">
        <strong className="text-brand-200">الفكرة:</strong> هذا بالضبط ما يفعله مهندس الذكاء الاصطناعي:
        يجمع بيانات لكل فئة، يستخرج <span className="en">features</span>،
        يحسب "النموذج" (مركز كل فئة في فضاء الميزات)، ثم يُصنّف العيّنات الجديدة بمقارنتها بأقرب مركز.
        النموذج هنا يستخدم <strong>هيستوغرام الألوان + ميزات إحصائية</strong>،
        أمّا الشبكات العميقة فتتعلّم ميزات أعقد بكثير.
      </div>
    </div>
  );
}
