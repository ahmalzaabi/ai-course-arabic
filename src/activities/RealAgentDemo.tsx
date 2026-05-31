import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Wrench, Eye, CheckCircle2, Play, Loader2, Globe, ExternalLink } from 'lucide-react';

type Step =
  | { kind: 'thought'; content: string }
  | { kind: 'action'; tool: string; input: string; api: string }
  | { kind: 'observation'; content: string; raw?: any }
  | { kind: 'final'; content: string };

type Goal = {
  id: string;
  title: string;
  desc: string;
  example: string;
  run: (q: string, push: (s: Step) => void) => Promise<void>;
};

// ----- Tools (real API calls, no API keys needed) -----

async function wikipediaSearch(query: string): Promise<{ title: string; description: string }[]> {
  const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=3&format=json&origin=*`;
  const r = await fetch(url);
  const data = await r.json();
  // [query, [titles], [descriptions], [urls]]
  const titles: string[] = data[1] || [];
  const descs: string[] = data[2] || [];
  return titles.map((t, i) => ({ title: t, description: descs[i] || '' }));
}

async function wikipediaSummary(title: string): Promise<{ extract: string; thumbnail?: string; pageUrl: string }> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const r = await fetch(url);
  const data = await r.json();
  return {
    extract: data.extract || data.description || 'لا يوجد ملخّص.',
    thumbnail: data.thumbnail?.source,
    pageUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
  };
}

async function geocode(place: string): Promise<{ name: string; lat: number; lon: number; country?: string } | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1&language=ar&format=json`;
  const r = await fetch(url);
  const data = await r.json();
  const hit = data.results?.[0];
  if (!hit) return null;
  return { name: hit.name, lat: hit.latitude, lon: hit.longitude, country: hit.country };
}

async function weather(lat: number, lon: number): Promise<any> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code&timezone=auto`;
  const r = await fetch(url);
  return await r.json();
}

async function country(name: string): Promise<any> {
  const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fields=name,capital,population,region,languages,currencies,flag,latlng`;
  const r = await fetch(url);
  if (!r.ok) return null;
  const data = await r.json();
  return data[0];
}

const wmoMap: Record<number, string> = {
  0: 'صافي', 1: 'صافٍ معظمه', 2: 'غائم جزئياً', 3: 'غائم',
  45: 'ضباب', 48: 'ضباب متجمّد',
  51: 'رذاذ خفيف', 53: 'رذاذ متوسّط', 55: 'رذاذ كثيف',
  61: 'مطر خفيف', 63: 'مطر متوسّط', 65: 'مطر غزير',
  71: 'ثلج خفيف', 73: 'ثلج', 75: 'ثلج كثيف',
  80: 'زخّات مطر', 81: 'زخّات قويّة',
  95: 'عاصفة رعدية', 96: 'عاصفة مع برد', 99: 'عاصفة شديدة',
};

const goals: Goal[] = [
  {
    id: 'wiki',
    title: 'بحث وتلخيص',
    desc: 'وكيل يبحث في ويكيبيديا عن موضوع، يختار أنسب مقال، ثم يُلخّصه.',
    example: 'Artificial Intelligence',
    run: async (q, push) => {
      push({ kind: 'thought', content: `الهدف: تلخيص موضوع "${q}". الخطوة الأولى: البحث في ويكيبيديا عن أنسب مقال.` });
      push({ kind: 'action', tool: 'wikipedia_search', input: q, api: 'GET en.wikipedia.org/w/api.php?action=opensearch' });
      const results = await wikipediaSearch(q);
      if (results.length === 0) {
        push({ kind: 'observation', content: 'لم أجد نتائج. سأحاول صياغة مختلفة.' });
        push({ kind: 'final', content: 'تعذّر العثور على مقال ذي صلة.' });
        return;
      }
      push({ kind: 'observation', content: `وجدت ${results.length} نتائج. أفضلها: "${results[0].title}".`, raw: results });
      push({ kind: 'thought', content: `سأجلب الملخّص الكامل للمقال الأول.` });
      push({ kind: 'action', tool: 'wikipedia_summary', input: results[0].title, api: 'GET en.wikipedia.org/api/rest_v1/page/summary/...' });
      const sum = await wikipediaSummary(results[0].title);
      push({ kind: 'observation', content: sum.extract.slice(0, 280) + (sum.extract.length > 280 ? '...' : ''), raw: sum });
      push({
        kind: 'final',
        content: `**${results[0].title}** — ${sum.extract}\n\nالمصدر: ${sum.pageUrl}`,
      });
    },
  },
  {
    id: 'weather',
    title: 'حالة الطقس',
    desc: 'وكيل يحوّل اسم مدينة إلى إحداثيات، ثم يجلب حالة الطقس الحالية.',
    example: 'Abu Dhabi',
    run: async (q, push) => {
      push({ kind: 'thought', content: `لجلب الطقس أحتاج إحداثيات. سأستخدم خدمة الترميز الجغرافي أوّلاً.` });
      push({ kind: 'action', tool: 'geocode', input: q, api: 'GET geocoding-api.open-meteo.com/v1/search' });
      const g = await geocode(q);
      if (!g) {
        push({ kind: 'observation', content: 'لم أجد إحداثيات لهذا المكان.' });
        push({ kind: 'final', content: 'تعذّر تحديد المكان.' });
        return;
      }
      push({ kind: 'observation', content: `${g.name}، ${g.country || ''}: ${g.lat.toFixed(2)}°، ${g.lon.toFixed(2)}°`, raw: g });
      push({ kind: 'thought', content: `لديّ الإحداثيات. سأطلب الطقس الحالي من Open-Meteo.` });
      push({ kind: 'action', tool: 'weather', input: `lat=${g.lat}, lon=${g.lon}`, api: 'GET api.open-meteo.com/v1/forecast' });
      const w = await weather(g.lat, g.lon);
      const cur = w.current;
      const cond = wmoMap[cur.weather_code] || 'غير محدّد';
      push({
        kind: 'observation',
        content: `${cur.temperature_2m}°م · ${cond} · رياح ${cur.wind_speed_10m} كم/س · رطوبة ${cur.relative_humidity_2m}%`,
        raw: w,
      });
      push({
        kind: 'final',
        content: `الطقس الحالي في **${g.name}**:\n• الحرارة: ${cur.temperature_2m}°م\n• الحالة: ${cond}\n• الرياح: ${cur.wind_speed_10m} كم/س\n• الرطوبة: ${cur.relative_humidity_2m}%`,
      });
    },
  },
  {
    id: 'country',
    title: 'بطاقة دولة',
    desc: 'وكيل يجمع بيانات أساسية عن دولة من واجهة REST Countries.',
    example: 'United Arab Emirates',
    run: async (q, push) => {
      push({ kind: 'thought', content: `سأستعلم مباشرة عن بيانات الدولة.` });
      push({ kind: 'action', tool: 'rest_countries', input: q, api: 'GET restcountries.com/v3.1/name/...' });
      const c = await country(q);
      if (!c) {
        push({ kind: 'observation', content: 'لم أجد بيانات لهذه الدولة.' });
        push({ kind: 'final', content: 'لم تُحدَّد الدولة.' });
        return;
      }
      const langs = c.languages ? Object.values(c.languages).join('، ') : '—';
      const cur = c.currencies ? Object.values(c.currencies).map((x: any) => `${x.name} (${x.symbol || ''})`).join('، ') : '—';
      const cap = c.capital?.[0] || '—';
      push({
        kind: 'observation',
        content: `${c.name.common} · العاصمة ${cap} · ${(c.population || 0).toLocaleString('ar-EG')} نسمة · ${c.region}`,
        raw: c,
      });
      push({ kind: 'thought', content: `سأبحث الآن عن طقس العاصمة لإثراء الإجابة.` });
      if (c.latlng) {
        push({ kind: 'action', tool: 'weather', input: cap, api: 'GET api.open-meteo.com/v1/forecast' });
        const w = await weather(c.latlng[0], c.latlng[1]);
        const cond = wmoMap[w.current.weather_code] || '—';
        push({ kind: 'observation', content: `طقس ${cap}: ${w.current.temperature_2m}°م · ${cond}`, raw: w });
        push({
          kind: 'final',
          content: `**${c.name.common}** ${c.flag || ''}\n• العاصمة: ${cap}\n• السكان: ${(c.population || 0).toLocaleString('ar-EG')}\n• المنطقة: ${c.region}\n• اللغات: ${langs}\n• العملة: ${cur}\n• طقس العاصمة الآن: ${w.current.temperature_2m}°م، ${cond}`,
        });
      } else {
        push({
          kind: 'final',
          content: `**${c.name.common}** ${c.flag || ''}\n• العاصمة: ${cap}\n• السكان: ${(c.population || 0).toLocaleString('ar-EG')}\n• المنطقة: ${c.region}\n• اللغات: ${langs}\n• العملة: ${cur}`,
        });
      }
    },
  },
];

const apiBadges = [
  { name: 'Wikipedia REST', url: 'https://en.wikipedia.org/api/rest_v1/' },
  { name: 'Open-Meteo', url: 'https://open-meteo.com/' },
  { name: 'REST Countries', url: 'https://restcountries.com/' },
];

export default function RealAgentDemo() {
  const [goalId, setGoalId] = useState<string>(goals[0].id);
  const [query, setQuery] = useState<string>(goals[0].example);
  const [steps, setSteps] = useState<Step[]>([]);
  const [running, setRunning] = useState(false);

  const goal = goals.find(g => g.id === goalId)!;

  const selectGoal = (id: string) => {
    setGoalId(id);
    const g = goals.find(x => x.id === id)!;
    setQuery(g.example);
    setSteps([]);
  };

  const run = async () => {
    if (!query.trim()) return;
    setSteps([]); setRunning(true);
    const push = (s: Step) =>
      new Promise<void>(resolve => {
        setSteps(prev => [...prev, s]);
        setTimeout(resolve, 350);
      });
    try {
      const queue: Step[] = [];
      const collect = (s: Step) => queue.push(s);
      const promise = goal.run(query, collect);
      // play steps as they arrive (poll-based)
      let idx = 0;
      const tick = async () => {
        while (idx < queue.length) {
          await push(queue[idx]);
          idx++;
        }
      };
      const interval = setInterval(tick, 200);
      await promise;
      clearInterval(interval);
      await tick(); // flush remaining
    } catch (e: any) {
      setSteps(s => [...s, { kind: 'observation', content: `خطأ: ${e?.message || 'تعذّر الاتصال بالـ API.'}` }]);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Goal selector */}
      <div className="flex flex-wrap gap-2">
        {goals.map(g => (
          <button
            key={g.id}
            onClick={() => selectGoal(g.id)}
            className={`text-sm px-3 py-1.5 rounded-lg font-bold ${goalId === g.id ? 'bg-brand-500 text-white' : 'bg-ink-800 text-ink-300 hover:bg-ink-700'}`}
          >
            {g.title}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-3">
        <div className="text-sm text-ink-300 mb-2">{goal.desc}</div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !running) run(); }}
            className="flex-1 rounded-lg bg-ink-950/60 border border-ink-700/60 px-3 py-2 text-sm focus:outline-none focus:border-brand-500/50"
            placeholder={goal.example}
            dir="auto"
          />
          <button onClick={run} disabled={running} className="btn-primary disabled:opacity-50">
            {running ? <><Loader2 className="h-4 w-4 animate-spin" /> يعمل...</> : <><Play className="h-4 w-4" /> شغّل الوكيل</>}
          </button>
        </div>
      </div>

      {/* APIs used */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Globe className="h-3.5 w-3.5 text-brand-300" />
        <span className="text-ink-400 en">Free public APIs:</span>
        {apiBadges.map(b => (
          <a key={b.name} href={b.url} target="_blank" rel="noreferrer" className="chip-brand hover:underline">
            <span className="en">{b.name}</span> <ExternalLink className="h-3 w-3" />
          </a>
        ))}
      </div>

      {/* Trace */}
      <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-4 min-h-[280px]">
        <AnimatePresence>
          {steps.length === 0 && !running ? (
            <div className="text-sm text-ink-400 text-center py-12">
              اكتب استعلاماً واضغط <span className="kbd">شغّل الوكيل</span> لرؤية حلقة <span className="en">ReAct</span> مع <strong>استدعاءات APIs حقيقية</strong>.
            </div>
          ) : (
            <div className="space-y-2">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={
                    s.kind === 'thought'
                      ? 'rounded-lg border border-amber-500/30 bg-amber-500/5 p-3'
                      : s.kind === 'action'
                      ? 'rounded-lg border border-brand-500/30 bg-brand-500/5 p-3'
                      : s.kind === 'observation'
                      ? 'rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3'
                      : 'rounded-lg border border-violet-500/40 bg-violet-500/10 p-3'
                  }
                >
                  <div className="flex items-center gap-2 text-xs font-bold mb-1">
                    {s.kind === 'thought' && <><Brain className="h-3.5 w-3.5 text-amber-300" /> <span className="text-amber-200">تفكير · Thought</span></>}
                    {s.kind === 'action' && <><Wrench className="h-3.5 w-3.5 text-brand-300" /> <span className="text-brand-200">أداة · {s.tool}</span></>}
                    {s.kind === 'observation' && <><Eye className="h-3.5 w-3.5 text-emerald-300" /> <span className="text-emerald-200">ملاحظة · API response</span></>}
                    {s.kind === 'final' && <><CheckCircle2 className="h-3.5 w-3.5 text-violet-300" /> <span className="text-violet-200">النتيجة النهائية</span></>}
                  </div>
                  {s.kind === 'action' && (
                    <div className="text-[11px] text-ink-400 en mb-1 break-all">{s.api}</div>
                  )}
                  <div className={s.kind === 'final' ? 'text-sm leading-loose whitespace-pre-line' : 'text-sm leading-loose'} dir="auto">
                    {(s as any).input ? <code className="kbd">{(s as any).input}</code> : null}
                    {(s as any).input && <br />}
                    {(s as any).content}
                  </div>
                </motion.div>
              ))}
              {running && (
                <div className="flex items-center gap-2 text-xs text-ink-400 px-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> الوكيل يفكّر...
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-4 text-sm leading-loose">
        <strong className="text-brand-200">ما الذي يجعل هذا "وكيلاً"؟</strong> الفرق عن نموذج لغوي عادي: هذا يُنفّذ
        <strong> سلسلة أدوات (API calls)</strong> بناءً على هدفك، يقرأ النتائج، ويُكوّن إجابة من بيانات حيّة.
        لو وصلتَه بنموذج لغوي، يُمكنه اختيار الأداة بنفسه وكتابة الملخّص النهائي بأيّ أسلوب تطلبه.
      </div>
    </div>
  );
}
