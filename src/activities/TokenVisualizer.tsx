import { useMemo, useState } from 'react';

const PALETTE = [
  'bg-brand-500/30 border-brand-500/40',
  'bg-emerald-500/30 border-emerald-500/40',
  'bg-violet-500/30 border-violet-500/40',
  'bg-amber-500/30 border-amber-500/40',
  'bg-rose-500/30 border-rose-500/40',
  'bg-cyan-500/30 border-cyan-500/40',
];

// Pseudo-tokenizer: splits like a real BPE on whitespace, punctuation, and chunks of 3-5 chars.
// It's not a real tokenizer — it's a teaching approximation.
function pseudoTokenize(text: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (/\s/.test(ch)) {
      let j = i;
      while (j < text.length && /\s/.test(text[j])) j++;
      tokens.push(text.slice(i, j));
      i = j;
      continue;
    }
    if (/[.,!?،؟؛:"'(){}\[\]\-_/\\]/.test(ch)) {
      tokens.push(ch);
      i++;
      continue;
    }
    // chunk word into 2-4 char pieces
    let j = i;
    while (j < text.length && !/[\s.,!?،؟؛:"'(){}\[\]\-_/\\]/.test(text[j])) j++;
    const word = text.slice(i, j);
    let k = 0;
    while (k < word.length) {
      const len = word.length - k <= 4 ? word.length - k : (Math.random() < 0.5 ? 3 : 4);
      tokens.push(word.slice(k, k + len));
      k += len;
    }
    i = j;
  }
  return tokens.filter(t => t.length > 0);
}

export default function TokenVisualizer() {
  const [text, setText] = useState('الذكاء الاصطناعي يُغيّر العالم. AI is changing the world!');
  const tokens = useMemo(() => pseudoTokenize(text), [text]);
  const wsTokens = tokens.filter(t => !/^\s+$/.test(t));

  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={3}
        className="w-full rounded-xl bg-ink-900/60 border border-ink-700/60 p-3 text-sm leading-loose focus:outline-none focus:border-brand-500/50"
        placeholder="اكتب جملة..."
      />
      <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-ink-900/40 border border-ink-700/60 min-h-[60px]">
        {tokens.map((t, i) => {
          if (/^\s+$/.test(t)) return <span key={i} className="w-2"> </span>;
          return (
            <span
              key={i}
              className={`text-sm px-2 py-1 rounded border ${PALETTE[i % PALETTE.length]}`}
              dir="auto"
            >
              {t}
            </span>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-lg bg-ink-900/40 border border-ink-700/60 p-2 text-center">
          <div className="text-ink-400 en">characters</div>
          <div className="font-bold en text-lg">{text.length}</div>
        </div>
        <div className="rounded-lg bg-ink-900/40 border border-ink-700/60 p-2 text-center">
          <div className="text-ink-400 en">tokens</div>
          <div className="font-bold en text-lg text-brand-300">{wsTokens.length}</div>
        </div>
        <div className="rounded-lg bg-ink-900/40 border border-ink-700/60 p-2 text-center">
          <div className="text-ink-400 en">~cost (1k tok)</div>
          <div className="font-bold en text-lg">${((wsTokens.length / 1000) * 0.002).toFixed(4)}</div>
        </div>
      </div>
      <p className="text-[11px] text-ink-400 leading-loose">
        ملاحظة: المحرّك أعلاه تقريبي للتعليم. النماذج الحقيقية تستخدم خوارزميات مثل
        <span className="en"> BPE</span> و<span className="en">SentencePiece</span> ولها قاموس رموز ثابت.
      </p>
    </div>
  );
}
