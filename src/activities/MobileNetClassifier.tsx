import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, Loader2, Brain, ExternalLink } from 'lucide-react';

type Prediction = { className: string; probability: number };

// Curated free Picsum seeds (no API key) — predictable images
const SAMPLE_IMAGES: { label: string; url: string }[] = [
  { label: 'كلب', url: 'https://picsum.photos/seed/dog42/400/300' },
  { label: 'قطة', url: 'https://picsum.photos/seed/cat19/400/300' },
  { label: 'مدينة', url: 'https://picsum.photos/seed/city31/400/300' },
  { label: 'طبيعة', url: 'https://picsum.photos/seed/nature9/400/300' },
  { label: 'سيارة', url: 'https://picsum.photos/seed/car71/400/300' },
  { label: 'طعام', url: 'https://picsum.photos/seed/food3/400/300' },
];

// Translation hints for common ImageNet classes (Arabic gloss)
const ARABIC_HINTS: Record<string, string> = {
  'tabby cat': 'قطة', 'tiger cat': 'قطة', 'Persian cat': 'قطة',
  'Egyptian cat': 'قطة', 'Siamese cat': 'قطة',
  'golden retriever': 'كلب', 'Labrador retriever': 'كلب', 'beagle': 'كلب',
  'sports car': 'سيارة', 'racer': 'سيارة', 'limousine': 'سيارة',
  'minivan': 'سيارة', 'pickup': 'شاحنة', 'fire engine': 'مركبة إطفاء',
  'tank': 'دبابة', 'half track': 'مركبة عسكرية',
  'warplane': 'طائرة عسكرية', 'airliner': 'طائرة ركاب',
  'cellular telephone': 'جوال', 'laptop': 'حاسوب محمول', 'desktop computer': 'حاسوب',
  'pizza': 'بيتزا', 'cheeseburger': 'برغر', 'espresso': 'قهوة',
  'banana': 'موز', 'orange': 'برتقال', 'lemon': 'ليمون',
  'mountain bike': 'دراجة جبلية', 'tricycle': 'دراجة ثلاثية',
};

function arHint(en: string): string | null {
  const lower = en.toLowerCase();
  for (const k in ARABIC_HINTS) if (lower.includes(k.toLowerCase())) return ARABIC_HINTS[k];
  return null;
}

export default function MobileNetClassifier() {
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [classifying, setClassifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadModel = async () => {
    if (model) return model;
    setLoading(true); setError(null);
    try {
      const tf = await import('@tensorflow/tfjs');
      const mobilenet = await import('@tensorflow-models/mobilenet');
      await tf.ready();
      const m = await mobilenet.load({ version: 2, alpha: 1.0 });
      setModel(m);
      setLoading(false);
      return m;
    } catch (e: any) {
      setError('فشل تحميل النموذج. تحقّق من الاتصال بالإنترنت.');
      setLoading(false);
      return null;
    }
  };

  const classify = async (src: string) => {
    setImageUrl(src);
    setPredictions([]);
    setError(null);
    const m = await loadModel();
    if (!m) return;
    setClassifying(true);
    try {
      // wait for image to be loaded
      await new Promise<void>((resolve, reject) => {
        const i = imgRef.current!;
        if (i.complete && i.naturalWidth > 0) return resolve();
        const onLoad = () => { i.removeEventListener('load', onLoad); resolve(); };
        const onErr = () => { i.removeEventListener('error', onErr); reject(); };
        i.addEventListener('load', onLoad);
        i.addEventListener('error', onErr);
      });
      const preds = await m.classify(imgRef.current!, 5);
      setPredictions(preds);
    } catch (e: any) {
      setError('تعذّر تصنيف الصورة. قد تكون من نطاق يحظر الوصول (CORS).');
    } finally {
      setClassifying(false);
    }
  };

  const handleUpload = (files: FileList | null) => {
    if (!files || !files[0]) return;
    const r = new FileReader();
    r.onload = () => classify(r.result as string);
    r.readAsDataURL(files[0]);
  };

  // pre-load model on mount in idle time
  useEffect(() => {
    const t = setTimeout(() => loadModel(), 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="chip-violet"><Brain className="h-3 w-3" /> نموذج حقيقي</span>
        <span className="text-ink-400 en">MobileNet v2 · ~14MB · 1000-class ImageNet · runs in your browser</span>
      </div>

      {/* Sample images strip */}
      <div>
        <div className="text-xs text-ink-400 en mb-2">Try a sample image</div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {SAMPLE_IMAGES.map(s => (
            <button
              key={s.url}
              onClick={() => classify(s.url)}
              className="rounded-lg overflow-hidden border border-ink-700/60 hover:border-brand-500/60 transition group"
            >
              <div className="aspect-square overflow-hidden">
                <img src={s.url} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" loading="lazy" />
              </div>
              <div className="text-[11px] text-center py-1 bg-ink-900/60">{s.label}</div>
            </button>
          ))}
        </div>
        <div className="text-[10px] text-ink-500 mt-1 en flex items-center gap-1">
          <ExternalLink className="h-3 w-3" /> Sample images via picsum.photos (free, no API key)
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-4">
        {/* Image preview */}
        <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-3 space-y-2">
          <div className="aspect-[4/3] rounded-lg bg-ink-950/50 overflow-hidden grid place-items-center">
            {imageUrl ? (
              <img ref={imgRef} src={imageUrl} crossOrigin="anonymous" className="w-full h-full object-contain" />
            ) : (
              <div className="text-sm text-ink-500 text-center px-4">
                اختر صورة مرجعية من الأعلى أو ارفع صورتك.
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => classify(`https://picsum.photos/seed/random${Math.floor(Math.random()*9999)}/400/300`)}
              className="btn-ghost text-sm"
            >
              <Sparkles className="h-4 w-4" /> صورة عشوائية
            </button>
            <button onClick={() => fileRef.current?.click()} className="btn-ghost text-sm">
              <Upload className="h-4 w-4" /> ارفع صورة
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => handleUpload(e.target.files)} />
          </div>
        </div>

        {/* Predictions */}
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-3 min-h-[280px]">
          <div className="text-xs uppercase tracking-widest text-brand-300 en mb-2">Top-5 predictions</div>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-ink-300">
              <Loader2 className="h-4 w-4 animate-spin" /> يُحمَّل النموذج لأوّل مرّة (~14MB)...
            </div>
          )}
          {classifying && (
            <div className="flex items-center gap-2 text-sm text-ink-300">
              <Loader2 className="h-4 w-4 animate-spin" /> يُحلّل الصورة...
            </div>
          )}
          {error && (
            <div className="text-sm text-rose-300 mt-2">{error}</div>
          )}
          <AnimatePresence>
            {!loading && !classifying && predictions.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 mt-1">
                {predictions.map((p, i) => {
                  const ar = arHint(p.className);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-lg bg-ink-900/60 border border-ink-700/60 p-2.5"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="min-w-0">
                          <div className="font-bold text-sm en truncate">{p.className}</div>
                          {ar && <div className="text-xs text-brand-300">≈ {ar}</div>}
                        </div>
                        <span className="en font-bold text-sm">{(p.probability * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 bg-ink-800 rounded-full overflow-hidden">
                        <motion.div
                          animate={{ width: `${p.probability * 100}%` }}
                          className={`h-full ${i === 0 ? 'bg-brand-400' : 'bg-ink-600'}`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
          {!loading && !classifying && predictions.length === 0 && !error && (
            <div className="text-sm text-ink-400 text-center py-12">
              ستظهر التنبّؤات هنا بعد اختيار صورة.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-4 text-sm leading-loose">
        <strong className="text-brand-200">ما الذي حدث للتو؟</strong> صورتك مرّت عبر شبكة عصبية التفافية (<span className="en">MobileNet v2</span>) دُرّبت على
        <span className="en"> ImageNet</span> (1.28 مليون صورة، 1000 فئة). الشبكة تستخرج ميزات من الحواف الأولى وصولاً إلى الأشكال المعقّدة،
        ثم تُعطي توزيعاً احتمالياً عبر 1000 فئة. النموذج يعمل بالكامل على جهازك بعد التحميل الأول.
      </div>
    </div>
  );
}
