import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const SIZE = 220;

type Image = {
  id: 'tank' | 'truck' | 'jet';
  label: string;
  altLabels: string[];
};

const images: Image[] = [
  { id: 'tank', label: 'دبابة', altLabels: ['شاحنة', 'حافلة'] },
  { id: 'truck', label: 'شاحنة', altLabels: ['دبابة', 'سيارة عسكرية'] },
  { id: 'jet', label: 'طائرة مقاتلة', altLabels: ['طائر', 'طائرة ركاب'] },
];

function drawTank(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // sky/ground
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#1f2944'); grad.addColorStop(1, '#3b3324');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
  // tank
  ctx.fillStyle = '#5a6a3e';
  ctx.fillRect(w * 0.15, h * 0.55, w * 0.7, h * 0.18);
  ctx.fillRect(w * 0.32, h * 0.4, w * 0.32, h * 0.18);
  ctx.fillRect(w * 0.6, h * 0.46, w * 0.3, h * 0.04);
  ctx.fillStyle = '#1c1c1c';
  for (let i = 0; i < 6; i++) ctx.beginPath(), ctx.arc(w * 0.18 + i * (w * 0.13), h * 0.78, 9, 0, Math.PI * 2), ctx.fill();
}
function drawTruck(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#2a3a5c'); grad.addColorStop(1, '#5a6a4a');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#7a6a40';
  ctx.fillRect(w * 0.1, h * 0.5, w * 0.55, h * 0.25);
  ctx.fillRect(w * 0.65, h * 0.55, w * 0.2, h * 0.2);
  ctx.fillStyle = '#a8d6ff';
  ctx.fillRect(w * 0.66, h * 0.58, w * 0.1, h * 0.08);
  ctx.fillStyle = '#1c1c1c';
  ctx.beginPath(); ctx.arc(w * 0.25, h * 0.78, 11, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(w * 0.55, h * 0.78, 11, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(w * 0.78, h * 0.78, 11, 0, Math.PI * 2); ctx.fill();
}
function drawJet(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#2a4a7c'); grad.addColorStop(1, '#7faed8');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#cfd6e0';
  ctx.beginPath();
  ctx.moveTo(w * 0.1, h * 0.5);
  ctx.lineTo(w * 0.85, h * 0.45);
  ctx.lineTo(w * 0.95, h * 0.5);
  ctx.lineTo(w * 0.85, h * 0.55);
  ctx.lineTo(w * 0.1, h * 0.5);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(w * 0.4, h * 0.5); ctx.lineTo(w * 0.55, h * 0.3); ctx.lineTo(w * 0.65, h * 0.5);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(w * 0.3, h * 0.55); ctx.lineTo(w * 0.45, h * 0.7); ctx.lineTo(w * 0.55, h * 0.55);
  ctx.fill();
}

const drawers: Record<Image['id'], (ctx: CanvasRenderingContext2D, w: number, h: number) => void> = {
  tank: drawTank, truck: drawTruck, jet: drawJet,
};

export default function AdversarialDemo() {
  const [imgId, setImgId] = useState<Image['id']>('tank');
  const [noise, setNoise] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const seedRef = useRef<number[]>([]);
  const img = useMemo(() => images.find(i => i.id === imgId)!, [imgId]);

  useEffect(() => {
    seedRef.current = Array.from({ length: SIZE * SIZE }, () => Math.random() * 2 - 1);
  }, [imgId]);

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    drawers[imgId](ctx, c.width, c.height);
    if (noise > 0) {
      const data = ctx.getImageData(0, 0, c.width, c.height);
      const seed = seedRef.current;
      const amount = noise * 60;
      for (let i = 0; i < c.width * c.height; i++) {
        const n = seed[i] * amount;
        data.data[i * 4]     = Math.max(0, Math.min(255, data.data[i * 4]     + n));
        data.data[i * 4 + 1] = Math.max(0, Math.min(255, data.data[i * 4 + 1] + n));
        data.data[i * 4 + 2] = Math.max(0, Math.min(255, data.data[i * 4 + 2] + n));
      }
      ctx.putImageData(data, 0, 0);
    }
  }, [imgId, noise]);

  // simulated probabilities
  const baseScore = 0.97;
  const drop = Math.min(0.93, noise * (1 + Math.random() * 0.3));
  const correctScore = Math.max(0.02, baseScore - drop);
  const remaining = 1 - correctScore;
  const altA = remaining * 0.65;
  const altB = remaining * 0.35;
  const flipped = correctScore < 0.5;

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-[280px_1fr_220px] gap-4">
        {/* Image preview */}
        <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-3">
          <canvas
            ref={canvasRef}
            width={SIZE}
            height={SIZE}
            className="rounded-lg w-full"
            style={{ aspectRatio: '1/1' }}
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {images.map(i => (
              <button
                key={i.id}
                onClick={() => { setImgId(i.id); setNoise(0); }}
                className={`text-xs px-2 py-1 rounded-md ${imgId === i.id ? 'bg-brand-500 text-white' : 'bg-ink-800 text-ink-300 hover:bg-ink-700'}`}
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slider + explanation */}
        <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-4 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs uppercase tracking-widest text-ink-400 en">Adversarial perturbation (ε)</div>
              <span className="en font-bold text-sm">{noise.toFixed(2)}</span>
            </div>
            <input type="range" min={0} max={1} step={0.02} value={noise} onChange={e => setNoise(parseFloat(e.target.value))} />
          </div>
          <div className="text-sm text-ink-300 leading-loose">
            عند <span className="en">ε = 0</span>: الصورة الأصلية، النموذج واثق.
            عند <span className="en">ε صغير (0.1)</span>: العين البشرية لا ترى تغييراً تقريباً، لكن النموذج قد يهتزّ.
            عند <span className="en">ε أعلى</span>: الصورة قد تبدو مشوّشة قليلاً، لكن المهاجمين الحقيقيين يصنعون
            تغييرات أذكى تستهدف نقاط ضعف محدّدة في النموذج بدقّة جراحية.
          </div>
          {flipped && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-100 p-3 flex items-start gap-2"
            >
              <AlertTriangle className="h-4 w-4 mt-0.5" />
              <div className="text-sm leading-loose">
                <strong>التصنيف انقلب!</strong> ضوضاء بسيطة كافية لتحويل قرار عسكري حسّاس.
                هذا بالضبط ما يجعل الأمثلة المعادية تهديداً جدّياً للأنظمة العملياتية.
              </div>
            </motion.div>
          )}
        </div>

        {/* Predictions */}
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-3">
          <div className="text-xs uppercase tracking-widest text-brand-300 en mb-2">Model output</div>
          <div className="space-y-2">
            <Row label={img.label} value={correctScore} highlight={!flipped} />
            <Row label={img.altLabels[0]} value={altA} highlight={flipped} />
            <Row label={img.altLabels[1]} value={altB} />
          </div>
          <div className="mt-3 text-[11px] text-ink-400 leading-relaxed">
            هذه أرقام محاكاة للتوضيح. الفكرة المهمة: ثقة النموذج <strong>ليست متينة</strong> أمام الاضطراب المُصمَّم.
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm flex-1 truncate">{label}</span>
      <div className="flex-1 h-2 bg-ink-800 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }}
          className={`h-full ${highlight ? 'bg-brand-400' : 'bg-ink-600'}`}
        />
      </div>
      <span className="en text-xs w-10 text-right">{(value * 100).toFixed(0)}%</span>
    </div>
  );
}
