import ModuleShell, { Section, ActivityCard, Callout } from '../../components/ModuleShell';
import NeuralNetworkPlayground from '../../activities/NeuralNetworkPlayground';

export default function LearningModule() {
  return (
    <ModuleShell slug="how-ai-learns">
      <Section title="ثلاث طرق رئيسية لتعلّم الآلة" kicker="3 paradigms">
        <div className="grid md:grid-cols-3 gap-3">
          {[
            {
              t: 'تعلّم مُشرَف',
              en: 'Supervised',
              d: 'نُعطي النموذج بيانات مع الإجابات الصحيحة (صور مع تسمياتها). يتعلّم العلاقة، ثم يطبّقها على بيانات جديدة.',
              ex: 'تشخيص أمراض من صور أشعّة، فلترة الرسائل المزعجة.',
            },
            {
              t: 'تعلّم غير مُشرَف',
              en: 'Unsupervised',
              d: 'البيانات بلا تسميات. النموذج يكتشف الأنماط والمجموعات بنفسه.',
              ex: 'تجميع العملاء حسب سلوك الشراء، اكتشاف الاحتيال.',
            },
            {
              t: 'تعلّم بالتعزيز',
              en: 'Reinforcement',
              d: 'النموذج يجرّب أفعالاً ويتلقّى مكافأة أو عقوبة. يتعلّم بالتجربة.',
              ex: 'الروبوتات، AlphaGo، القيادة الذاتية.',
            },
          ].map((x, i) => (
            <div key={i} className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-4">
              <span className="chip-brand"><span className="en">{x.en}</span></span>
              <h4 className="font-bold text-lg mt-3">{x.t}</h4>
              <p className="text-sm text-ink-300 mt-2 leading-loose">{x.d}</p>
              <div className="text-xs text-ink-400 mt-3 italic">مثال: {x.ex}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="الشبكات العصبية" kicker="Neural Networks">
        <p>
          الشبكة العصبية مستوحاة من خلايا الدماغ. تتكوّن من <strong>عُقد (Neurons)</strong> منظّمة في
          <strong> طبقات (Layers)</strong>. كل عقدة تستقبل أرقاماً، تضربها بأوزان تتعلّمها، وتُرسل النتيجة للطبقة التالية.
        </p>
        <ul>
          <li><strong>طبقة الإدخال:</strong> تستقبل البيانات (بكسلات صورة، كلمات، إلخ).</li>
          <li><strong>طبقات مخفية:</strong> تستخرج ميزات تدريجياً (حواف → أشكال → أجسام).</li>
          <li><strong>طبقة الإخراج:</strong> تنتج التنبّؤ (هل الصورة قطة؟ ما الترجمة؟).</li>
        </ul>
        <Callout tone="tip" title="كيف تتعلّم؟">
          عند كل خطأ، تستخدم الشبكة خوارزمية <span className="en">Backpropagation</span> لتعديل الأوزان قليلاً
          باتجاه الإجابة الصحيحة. مع ملايين الأمثلة، تصبح الأوزان دقيقة.
        </Callout>
      </Section>

      <Section title="ثلاثة أعداء يعرفهم كل ممارس" kicker="Common pitfalls">
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { t: 'بيانات قليلة', d: 'النموذج لا يرى تنوّعاً كافياً → يفشل في الواقع.' },
            { t: 'تحيّز البيانات', d: 'إن دُرّب على بيانات غير متوازنة، يرث التحيّز ويُضخّمه.' },
            { t: 'إفراط التخصيص', d: 'حفظ البيانات بدل التعميم — يبدو ممتازاً في التدريب وضعيفاً مع بيانات جديدة. (Overfitting)' },
          ].map((x, i) => (
            <div key={i} className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
              <h4 className="font-bold text-rose-200">{x.t}</h4>
              <p className="text-sm text-ink-300 mt-2 leading-loose">{x.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <ActivityCard title="مختبر الشبكة العصبية" kicker="Activity 2">
        <p className="text-sm text-ink-300 mb-4 leading-loose">
          نقاط زرقاء وحمراء. هل تستطيع شبكة عصبية صغيرة فصلها؟ جرّب تغيير عدد الطبقات والعقد ومعدّل التعلّم،
          واضغط "تدريب" لتُشاهد كيف تتشكّل حدود القرار.
        </p>
        <NeuralNetworkPlayground />
      </ActivityCard>
    </ModuleShell>
  );
}
