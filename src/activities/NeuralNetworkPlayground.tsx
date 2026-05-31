import { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

type Dataset = 'circle' | 'xor' | 'spiral' | 'blobs';

function genData(kind: Dataset, n = 160): { x: number; y: number; label: 0 | 1 }[] {
  const out: { x: number; y: number; label: 0 | 1 }[] = [];
  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  if (kind === 'circle') {
    for (let i = 0; i < n; i++) {
      const r = rand(0, 1.0); const t = rand(0, Math.PI * 2);
      const x = r * Math.cos(t); const y = r * Math.sin(t);
      out.push({ x, y, label: r < 0.45 ? 1 : 0 });
    }
  } else if (kind === 'xor') {
    for (let i = 0; i < n; i++) {
      const x = rand(-1, 1), y = rand(-1, 1);
      const label = (x * y > 0 ? 1 : 0) as 0 | 1;
      out.push({ x: x + rand(-0.05, 0.05), y: y + rand(-0.05, 0.05), label });
    }
  } else if (kind === 'spiral') {
    for (let i = 0; i < n / 2; i++) {
      const r = i / (n / 2);
      const t = 1.75 * i / (n / 2) * 2 * Math.PI + rand(-0.2, 0.2);
      out.push({ x: r * Math.cos(t), y: r * Math.sin(t), label: 1 });
      out.push({ x: r * Math.cos(t + Math.PI), y: r * Math.sin(t + Math.PI), label: 0 });
    }
  } else {
    for (let i = 0; i < n; i++) {
      const cls = Math.random() < 0.5 ? 0 : 1;
      const cx = cls ? 0.45 : -0.45, cy = cls ? -0.35 : 0.35;
      out.push({ x: cx + rand(-0.25, 0.25), y: cy + rand(-0.25, 0.25), label: cls as 0 | 1 });
    }
  }
  return out;
}

// Simple MLP from scratch
class MLP {
  layers: number[];
  W: number[][][] = [];
  b: number[][] = [];
  constructor(layers: number[]) {
    this.layers = layers;
    for (let l = 0; l < layers.length - 1; l++) {
      const fan_in = layers[l];
      const stdev = Math.sqrt(2 / fan_in);
      const w: number[][] = [];
      for (let i = 0; i < layers[l + 1]; i++) {
        const row: number[] = [];
        for (let j = 0; j < layers[l]; j++) row.push((Math.random() * 2 - 1) * stdev);
        w.push(row);
      }
      this.W.push(w);
      this.b.push(new Array(layers[l + 1]).fill(0));
    }
  }
  static tanh(x: number) { return Math.tanh(x); }
  static dtanh(y: number) { return 1 - y * y; }
  static sigmoid(x: number) { return 1 / (1 + Math.exp(-x)); }

  forward(x: number[]) {
    const acts: number[][] = [x];
    let a = x;
    for (let l = 0; l < this.W.length; l++) {
      const w = this.W[l], b = this.b[l];
      const z: number[] = [];
      for (let i = 0; i < w.length; i++) {
        let s = b[i];
        for (let j = 0; j < w[i].length; j++) s += w[i][j] * a[j];
        z.push(s);
      }
      const isLast = l === this.W.length - 1;
      a = isLast ? z.map(MLP.sigmoid) : z.map(MLP.tanh);
      acts.push(a);
    }
    return acts;
  }

  trainStep(data: { x: number; y: number; label: 0 | 1 }[], lr: number) {
    let totalLoss = 0;
    // accumulate grads
    const dW: number[][][] = this.W.map(w => w.map(r => r.map(() => 0)));
    const dB: number[][] = this.b.map(b => b.map(() => 0));
    for (const d of data) {
      const acts = this.forward([d.x, d.y]);
      const out = acts[acts.length - 1][0];
      const t = d.label;
      const eps = 1e-7;
      totalLoss += -(t * Math.log(out + eps) + (1 - t) * Math.log(1 - out + eps));
      let delta: number[] = [out - t]; // dL/dz for sigmoid+BCE
      for (let l = this.W.length - 1; l >= 0; l--) {
        const a_prev = acts[l];
        for (let i = 0; i < this.W[l].length; i++) {
          for (let j = 0; j < this.W[l][i].length; j++) {
            dW[l][i][j] += delta[i] * a_prev[j];
          }
          dB[l][i] += delta[i];
        }
        if (l > 0) {
          const a_l = acts[l];
          const newDelta: number[] = new Array(this.W[l][0].length).fill(0);
          for (let j = 0; j < newDelta.length; j++) {
            let s = 0;
            for (let i = 0; i < delta.length; i++) s += this.W[l][i][j] * delta[i];
            newDelta[j] = s * MLP.dtanh(a_l[j]);
          }
          delta = newDelta;
        }
      }
    }
    const N = data.length;
    for (let l = 0; l < this.W.length; l++) {
      for (let i = 0; i < this.W[l].length; i++) {
        for (let j = 0; j < this.W[l][i].length; j++) this.W[l][i][j] -= (lr * dW[l][i][j]) / N;
        this.b[l][i] -= (lr * dB[l][i]) / N;
      }
    }
    return totalLoss / N;
  }

  predict(x: number, y: number) {
    const a = this.forward([x, y]);
    return a[a.length - 1][0];
  }
}

const SIZE = 280;

export default function NeuralNetworkPlayground() {
  const [dataset, setDataset] = useState<Dataset>('circle');
  const [hidden, setHidden] = useState<number[]>([6, 4]);
  const [lr, setLr] = useState(0.3);
  const [running, setRunning] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0);
  const [acc, setAcc] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const data = useMemo(() => genData(dataset), [dataset]);
  const modelRef = useRef<MLP>(new MLP([2, ...hidden, 1]));
  const rafRef = useRef<number | null>(null);

  const reset = (newHidden = hidden, newDataset = dataset) => {
    setRunning(false);
    setEpoch(0); setLoss(0); setAcc(0);
    modelRef.current = new MLP([2, ...newHidden, 1]);
    setTimeout(draw, 0);
    if (newDataset !== dataset) setDataset(newDataset);
  };

  const draw = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = SIZE, H = SIZE;
    const grid = 50;
    const img = ctx.createImageData(W, H);
    const m = modelRef.current;
    for (let py = 0; py < H; py += 1) {
      const ny = (py / H) * 2 - 1;
      for (let px = 0; px < W; px += 1) {
        const nx = (px / W) * 2 - 1;
        const p = m.predict(nx, -ny);
        // blend two brand colors
        const r = Math.round(255 * (1 - p) * 0.35 + 47 * p * 0.6);
        const g = Math.round(80 * (1 - p) * 0.5 + 139 * p * 0.6);
        const b = Math.round(120 * (1 - p) * 0.5 + 255 * p * 0.6);
        const i = (py * W + px) * 4;
        img.data[i] = r; img.data[i + 1] = g; img.data[i + 2] = b; img.data[i + 3] = 200;
      }
    }
    ctx.putImageData(img, 0, 0);
    // grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
    for (let i = 0; i <= grid; i += 5) {
      ctx.beginPath(); ctx.moveTo((i / grid) * W, 0); ctx.lineTo((i / grid) * W, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, (i / grid) * H); ctx.lineTo(W, (i / grid) * H); ctx.stroke();
    }
    // points
    for (const d of data) {
      const px = ((d.x + 1) / 2) * W;
      const py = ((1 - d.y) / 2) * H;
      ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = d.label === 1 ? '#59abff' : '#ff7a8a';
      ctx.strokeStyle = '#0b0f1a'; ctx.lineWidth = 1.5;
      ctx.fill(); ctx.stroke();
    }
  };

  // train loop
  useEffect(() => {
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const tick = () => {
      const stepsPerFrame = 4;
      let l = 0;
      for (let i = 0; i < stepsPerFrame; i++) l = modelRef.current.trainStep(data, lr);
      setEpoch(e => e + stepsPerFrame);
      setLoss(l);
      // accuracy
      let correct = 0;
      for (const d of data) {
        const p = modelRef.current.predict(d.x, d.y);
        if ((p > 0.5 ? 1 : 0) === d.label) correct++;
      }
      setAcc(correct / data.length);
      draw();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [running, data, lr]);

  // initial draw
  useEffect(() => { draw(); }, [data]);

  const setHiddenLayers = (which: 'add' | 'remove' | 'incNode' | 'decNode', idx?: number) => {
    let newH = [...hidden];
    if (which === 'add' && newH.length < 4) newH.push(4);
    if (which === 'remove' && newH.length > 1) newH.pop();
    if (which === 'incNode' && idx !== undefined && newH[idx] < 10) newH[idx]++;
    if (which === 'decNode' && idx !== undefined && newH[idx] > 1) newH[idx]--;
    setHidden(newH);
    reset(newH);
  };

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-4">
      {/* Controls */}
      <div className="space-y-4">
        <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-3">
          <div className="text-xs uppercase tracking-widest text-ink-400 en mb-2">Dataset</div>
          <div className="grid grid-cols-2 gap-1.5">
            {(['circle', 'xor', 'spiral', 'blobs'] as Dataset[]).map(d => (
              <button
                key={d}
                onClick={() => { setDataset(d); reset(hidden, d); }}
                className={`text-xs px-2 py-1.5 rounded-md font-bold ${dataset === d ? 'bg-brand-500 text-white' : 'bg-ink-800 text-ink-300 hover:bg-ink-700'}`}
              >
                <span className="en">{d}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs uppercase tracking-widest text-ink-400 en">Hidden layers</div>
            <div className="flex gap-1">
              <button onClick={() => setHiddenLayers('remove')} className="btn-ghost !p-1 !px-2 text-xs">−</button>
              <button onClick={() => setHiddenLayers('add')} className="btn-ghost !p-1 !px-2 text-xs">+</button>
            </div>
          </div>
          <div className="space-y-2">
            {hidden.map((n, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-ink-400 en">L{i + 1}</span>
                <button onClick={() => setHiddenLayers('decNode', i)} className="btn-ghost !p-1 !px-2 text-xs">−</button>
                <span className="en font-bold text-sm w-8 text-center">{n}</span>
                <button onClick={() => setHiddenLayers('incNode', i)} className="btn-ghost !p-1 !px-2 text-xs">+</button>
                <div className="flex-1 flex gap-0.5">
                  {Array.from({ length: n }).map((_, k) => (
                    <div key={k} className="h-1.5 flex-1 rounded-full bg-brand-500/40" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs uppercase tracking-widest text-ink-400 en">Learning rate</div>
            <span className="en text-sm font-bold">{lr.toFixed(2)}</span>
          </div>
          <input type="range" min={0.05} max={1.5} step={0.05} value={lr} onChange={e => setLr(parseFloat(e.target.value))} />
        </div>

        <div className="flex gap-2">
          <button onClick={() => setRunning(r => !r)} className={`flex-1 ${running ? 'btn-ghost' : 'btn-primary'}`}>
            {running ? <><Pause className="h-4 w-4" /> إيقاف</> : <><Play className="h-4 w-4" /> تدريب</>}
          </button>
          <button onClick={() => reset()} className="btn-ghost" title="إعادة">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-xl bg-ink-900/40 border border-ink-700/60 p-3 text-sm space-y-1">
          <div className="flex justify-between"><span className="text-ink-400 en">epoch</span><span className="en font-bold">{epoch}</span></div>
          <div className="flex justify-between"><span className="text-ink-400 en">loss</span><span className="en font-bold">{loss.toFixed(4)}</span></div>
          <div className="flex justify-between"><span className="text-ink-400 en">accuracy</span><span className="en font-bold">{(acc * 100).toFixed(1)}%</span></div>
        </div>
      </div>

      {/* Canvas */}
      <div className="rounded-2xl border border-ink-700/60 bg-ink-900/40 p-3 grid place-items-center">
        <canvas ref={canvasRef} width={SIZE} height={SIZE} className="rounded-xl shadow-glow" style={{ width: '100%', maxWidth: 480, aspectRatio: '1/1' }} />
        <div className="text-xs text-ink-400 mt-2 text-center leading-loose">
          النقاط الزرقاء فئة، والوردية فئة أخرى. اللون الخلفي يُمثّل قرار النموذج لكل نقطة في الفضاء.
        </div>
      </div>
    </div>
  );
}
