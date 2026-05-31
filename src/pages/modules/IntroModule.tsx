import ModuleShell, { Section, ActivityCard, Callout } from '../../components/ModuleShell';
import RuleVsLearnGame from '../../activities/RuleVsLearnGame';

export default function IntroModule() {
  return (
    <ModuleShell slug="intro">
      <Section title="ما هو الذكاء الاصطناعي؟" kicker="What is AI?">
        <p>
          <strong>الذكاء الاصطناعي</strong> (<span className="en">Artificial Intelligence</span>) هو قدرة الآلة على
          أداء مهام كنّا نظنّ أنها تتطلّب ذكاءً بشرياً: التعرّف على الصور، فهم اللغة، اتخاذ القرار،
          وحتى التخطيط لتحقيق هدف.
        </p>
        <p>
          الفكرة الجوهرية: بدلاً من أن نُبرمج الحاسوب بتعليمات صريحة لكل حالة، نُعطيه
          <strong> أمثلة كثيرة (بيانات)</strong> ونتركه يتعلّم القاعدة بنفسه.
        </p>
      </Section>

      <Section title="الفرق بين البرمجة التقليدية والذكاء الاصطناعي" kicker="Traditional vs ML">
        <div className="grid md:grid-cols-2 gap-4 mb-3">
          <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-4">
            <div className="text-xs uppercase tracking-widest text-ink-400 en mb-1">Traditional Programming</div>
            <div className="font-bold mb-2">برمجة تقليدية</div>
            <div className="text-sm text-ink-300 leading-loose">
              المبرمج يكتب القواعد بنفسه:
              <div className="mt-2 kbd"><span className="en">if temperature {'>'} 38 → fever</span></div>
            </div>
          </div>
          <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-4">
            <div className="text-xs uppercase tracking-widest text-brand-300 en mb-1">Machine Learning</div>
            <div className="font-bold mb-2">تعلّم الآلة</div>
            <div className="text-sm text-ink-200 leading-loose">
              نُعطي النموذج أمثلة (بيانات + الإجابة الصحيحة)، فيستنتج القاعدة بنفسه ويُطبّقها على بيانات جديدة لم يرها من قبل.
            </div>
          </div>
        </div>
        <Callout tone="tip" title="بكلمات بسيطة">
          البرمجة التقليدية: <span className="en">Rules + Data → Answers</span>.
          <br />
          تعلّم الآلة: <span className="en">Data + Answers → Rules (Model)</span>.
        </Callout>
      </Section>

      <Section title="أنواع الذكاء الاصطناعي" kicker="Types">
        <div className="grid md:grid-cols-3 gap-3">
          {[
            {
              t: 'ضيّق (ANI)',
              en: 'Narrow AI',
              d: 'متخصص في مهمة واحدة: ترجمة، تصنيف صور، توصية أفلام. كل ما حولنا اليوم.',
              c: 'chip-brand',
            },
            {
              t: 'عام (AGI)',
              en: 'General AI',
              d: 'قادر على أداء أي مهمة فكرية يقدر عليها الإنسان. لم يتحقّق بعد.',
              c: 'chip-amber',
            },
            {
              t: 'فائق (ASI)',
              en: 'Super AI',
              d: 'يتجاوز قدرات الإنسان في كل المجالات. مفهوم نظري ومستقبلي.',
              c: 'chip-violet',
            },
          ].map((x, i) => (
            <div key={i} className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-4">
              <span className={x.c}><span className="en">{x.en}</span></span>
              <h4 className="font-bold text-lg mt-3">{x.t}</h4>
              <p className="text-sm text-ink-300 mt-2 leading-loose">{x.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="لماذا الآن؟" kicker="Why now?">
        <ul>
          <li><strong>بيانات ضخمة:</strong> الإنترنت ينتج كميات هائلة من النصوص والصور.</li>
          <li><strong>قدرة حوسبة:</strong> بطاقات <span className="en">GPU/TPU</span> سرّعت التدريب آلاف المرات.</li>
          <li><strong>خوارزميات أفضل:</strong> الشبكات العصبية العميقة و<span className="en">Transformer</span>.</li>
          <li><strong>وصول مفتوح:</strong> أدوات مثل <span className="en">ChatGPT</span> جعلت الذكاء الاصطناعي بأيدي الجميع.</li>
        </ul>
      </Section>

      <ActivityCard title="نشاط: قاعدة أم تعلّم؟" kicker="Activity 1">
        <p className="text-sm text-ink-300 mb-4 leading-loose">
          سنُحاول تصنيف صور <strong>دبابة</strong> مقابل <strong>شاحنة</strong>. جرّب أن تكتب قواعد بنفسك،
          ثم شاهد كيف تنهار القواعد عند ظهور حالة جديدة — ولماذا نلجأ إلى التعلّم من الأمثلة.
        </p>
        <RuleVsLearnGame />
      </ActivityCard>
    </ModuleShell>
  );
}
