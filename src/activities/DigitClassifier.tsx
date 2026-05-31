import { useEffect, useRef, useState } from 'react';
import { Eraser } from 'lucide-react';

const DRAW = 280;
const GRID = 28;

// Stroke-based templates for digits 0-9 drawn into 28x28 canvases for similarity matching.
const digitStrokes: { d: string; w?: number }[] = [
  // 0 - oval
  { d: 'M14 4 C5 4 4 12 4 14 C4 16 5 24 14 24 C23 24 24 16 24 14 C24 12 23 4 14 4 Z' },
  // 1 - vertical line
  { d: 'M11 6 L14 4 L14 24 M9 24 L19 24' },
  // 2
  { d: 'M5 9 C5 4 11 3 15 4 C20 5 22 10 19 14 L7 24 L23 24' },
  // 3
  { d: 'M5 6 C9 3 19 3 21 7 C23 11 18 13 14 13 C19 13 23 14 23 19 C22 24 11 25 5 22' },
  // 4
  { d: 'M16 4 L4 18 L24 18 M18 8 L18 24' },
  // 5
  { d: 'M22 4 L8 4 L7 13 C12 11 22 11 22 18 C22 24 14 25 6 22' },
  // 6
  { d: 'M22 6 C14 3 7 8 6 16 C5 24 16 26 19 22 C24 16 18 12 13 13 C9 14 7 16 6 18' },
  // 7
  { d: 'M5 5 L23 5 L11 24' },
  // 8
  { d: 'M14 4 C7 4 6 11 14 13 C20 14 22 22 14 24 C7 24 5 17 14 13 M14 13 C9 12 5 8 9 5' },
  // 9
  { d: 'M19 14 C16 17 8 17 7 12 C6 6 12 4 18 6 C24 8 24 14 21 20 L17 25' },
];

function renderTemplate(idx: number, size = GRID): Float32Array {
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const path = new Path2D(digitStrokes[idx].d);
  ctx.stroke(path);
  const img = ctx.getImageData(0, 0, size, size);
  const arr = new Float32Array(size * size);
  for (let i = 0; i < arr.length; i++) arr[i] = img.data[i * 4] / 255;
  return arr;
}

function downsample(big: ImageData, dim = GRID): Float32Array {
  const arr = new Float32Array(dim * dim);
  const ratio = big.width / dim;
  for (let y = 0; y < dim; y++) {
    for (let x = 0; x < dim; x++) {
      let sum = 0, count = 0;
      for (let dy = 0; dy < ratio; dy++) {
        for (let dx = 0; dx < ratio; dx++) {
          const sx = Math.floor(x * ratio + dx);
          const sy = Math.floor(y * ratio + dy);
          const idx = (sy * big.width + sx) * 4;
          // alpha channel as ink (we draw in white on transparent)
          sum += big.data[idx + 3] / 255;
          count++;
        }
      }
      arr[y * dim + x] = sum / count;
    }
  }
  return arr;
}

function center(arr: Float32Array, dim = GRID): Float32Array {
  let cx = 0, cy = 0, total = 0;
  for (let y = 0; y < dim; y++) for (let x = 0; x < dim; x++) {
    const v = arr[y * dim + x];
    cx += x * v; cy += y * v; total += v;
  }
  if (total < 1e-3) return arr;
  cx /= total; cy /= total;
  const dx = Math.round(dim / 2 - cx);
  const dy = Math.round(dim / 2 - cy);
  const out = new Float32Array(dim * dim);
  for (let y = 0; y < dim; y++) for (let x = 0; x < dim; x++) {
    const sx = x - dx, sy = y - dy;
    if (sx >= 0 && sx < dim && sy >= 0 && sy < dim) out[y * dim + x] = arr[sy * dim + sx];
  }
  return out;
}

function similarity(a: Float32Array, b: Float32Array) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na * nb) + 1e-6);
}

export default function DigitClassifier() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [scores, setScores] = useState<number[]>(new Array(10).fill(0));
  const [hasInk, setHasInk] = useState(false);
  const templatesRef = useRef<Float32Array[]>([]);

  useEffect(() => {
    templatesRef.current = Array.from({ length: 10 }, (_, i) => renderTemplate(i));
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  }, []);

  const getPos = (e: React.PointerEvent) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const sx = c.width / rect.width;
    const sy = c.height / rect.height;
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
  };

  const start = (e: React.PointerEvent) => {
    e.preventDefault();
    setDrawing(true);
    setHasInk(true);
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = getPos(e);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 22;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 0.1, y + 0.1); ctx.stroke();
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y); ctx.stroke();
    classifyDebounced();
  };
  const end = () => { setDrawing(false); classify(); };

  const clear = () => {
    const c = canvasRef.current!; const ctx = c.getContext('2d')!;
    ctx.clearRect(0, 0, c.width, c.height);
    const g = gridRef.current!; const gctx = g.getContext('2d')!;
    gctx.clearRect(0, 0, g.width, g.height);
    setScores(new Array(10).fill(0));
    setHasInk(false);
  };

  const debounceRef = useRef<number | null>(null);
  const classifyDebounced = () => {
    if (debounceRef.current) cancelAnimationFrame(debounceRef.current);
    debounceRef.current = requestAnimationFrame(classify);
  };

  const classify = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext('2d')!;
    const img = ctx.getImageData(0, 0, c.width, c.height);
    const small = center(downsample(img));
    // render small grid preview
    const g = gridRef.current!; const gctx = g.getContext('2d')!;
    const cell = g.width / GRID;
    gctx.clearRect(0, 0, g.width, g.height);
    for (let y = 0; y < GRID; y++) for (let x = 0; x < GRID; x++) {
      const v = small[y * GRID + x];
      gctx.fillStyle = `rgba(89,171,255,${Math.min(1, v * 1.3)})`;
      gctx.fillRect(x * cell, y * cell, cell, cell);
    }
    gctx.strokeStyle = 'rgba(255,255,255,0.04)';
    for (let i = 0; i <= GRID; i++) {
      gctx.beginPath(); gctx.moveTo(i * cell, 0); gctx.lineTo(i * cell, g.height); gctx.stroke();
      gctx.beginPath(); gctx.moveTo(0, i * cell); gctx.lineTo(g.width, i * cell); gctx.stroke();
    }
    const sims = templatesRef.current.map(t => similarity(small, t));
    // softmax
    const tau = 12;
    const exps = sims.map(s => Math.exp(s * tau));
    const sum = exps.reduce((a, b) => a + b, 0);
    setScores(exps.map(e => e / sum));
  };

  const top = scores.indexOf(Math.max(...scores));

  return (
    <div className="grid lg:grid-cols-[1fr_1fr_1.2fr] gap-4">
      {/* Drawing pad */}
      <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-3">
        <div className="text-xs uppercase tracking-widest text-ink-400 en mb-2">Draw a digit (0-9)</div>
        <canvas
          ref={canvasRef}
          width={DRAW}
          height={DRAW}
          className="rounded-lg bg-ink-950 cursor-crosshair touch-none"
          style={{ width: '100%', aspectRatio: '1/1' }}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={() => drawing && end()}
        />
        <button onClick={clear} className="btn-ghost mt-2 w-full text-sm"><Eraser className="h-4 w-4" /> مسح</button>
      </div>

      {/* What the model sees */}
      <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-3">
        <div className="text-xs uppercase tracking-widest text-ink-400 en mb-2">What the model sees · 28×28</div>
        <canvas ref={gridRef} width={224} height={224} className="rounded-lg bg-ink-950" style={{ width: '100%', aspectRatio: '1/1' }} />
        <p className="text-xs text-ink-400 mt-2 leading-loose">
          صورتك تُصغَّر إلى شبكة <span className="en">28×28</span> = 784 رقم. هذه هي مدخلات النموذج فعلياً.
        </p>
      </div>

      {/* Predictions */}
      <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs uppercase tracking-widest text-brand-300 en">Predictions</div>
          {hasInk && (
            <div className="text-sm">
              توقّعي: <span className="en text-2xl font-black text-brand-200">{top}</span>
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          {scores.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="en w-6 text-center font-bold">{i}</span>
              <div className="flex-1 h-2 rounded-full bg-ink-800 overflow-hidden">
                <div
                  className={`h-full transition-all ${i === top ? 'bg-brand-400' : 'bg-ink-600'}`}
                  style={{ width: `${s * 100}%` }}
                />
              </div>
              <span className="en text-xs w-10 text-right">{(s * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-ink-400 mt-3 leading-loose">
          النموذج هنا يستخدم <strong>مطابقة قوالب</strong> (<span className="en">template matching</span>) — أبسط بكثير من شبكة <span className="en">CNN</span> حقيقية،
          لكنه يُوضّح الفكرة: مقارنة بكسلات صورتك بأنماط مرجعية للأرقام.
        </p>
      </div>
    </div>
  );
}
