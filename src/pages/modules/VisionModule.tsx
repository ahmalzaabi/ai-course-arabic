import ModuleShell, { Section, ActivityCard, Callout } from '../../components/ModuleShell';
import DigitClassifier from '../../activities/DigitClassifier';
import MobileNetClassifier from '../../activities/MobileNetClassifier';

export default function VisionModule() {
  return (
    <ModuleShell slug="computer-vision">
      <Section title="كيف ترى الآلة الصور؟" kicker="Pixels are numbers">
        <p>
          الصورة بالنسبة لك مشهد، أمّا الحاسوب فيراها كمصفوفة من الأرقام.
          كل بكسل في صورة بالأبيض والأسود هو رقم بين <span className="en">0</span> (أسود) و<span className="en">255</span> (أبيض).
          الصور الملوّنة لها ثلاث قنوات (<span className="en">R, G, B</span>).
        </p>
        <Callout tone="tip" title="فكرة مفتاحية">
          مهمّة الذكاء الاصطناعي البصري: تحويل آلاف الأرقام (البكسلات) إلى تسمية واحدة معبّرة
          مثل "قطة" أو "طائرة" أو رقم "7".
        </Callout>
      </Section>

      <Section title="الميزات: من الحواف إلى المعنى" kicker="Feature hierarchy">
        <p>
          الشبكات الالتفافية (<span className="en">CNN</span>) تستخرج الميزات على طبقات:
        </p>
        <ul>
          <li><strong>الطبقات الأولى:</strong> تكتشف الحواف، الزوايا، النقاط.</li>
          <li><strong>الطبقات الوسطى:</strong> تركّب الميزات في أشكال (دوائر، خطوط منحنية، عيون، إطارات).</li>
          <li><strong>الطبقات الأخيرة:</strong> تتعرّف على أجسام كاملة (وجه، سيارة، رقم).</li>
        </ul>
        <p>
          هذا التسلسل الهرمي يُشبه نظام الرؤية في الدماغ، وهو سرّ نجاح <span className="en">Deep Learning</span> في الرؤية.
        </p>
      </Section>

      <Section title="تطبيقات حقيقية" kicker="Applications">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { t: 'التشخيص الطبي', d: 'كشف الأورام في صور الأشعة بدقّة تنافس المتخصصين.' },
            { t: 'القيادة الذاتية', d: 'التعرّف على المشاة، الإشارات، والمركبات في الزمن الحقيقي.' },
            { t: 'الاستطلاع', d: 'تحليل صور الأقمار والطائرات بدون طيار وتمييز الأهداف.' },
            { t: 'المراقبة', d: 'كشف الحركة، الوجوه، والسلوك المشبوه.' },
            { t: 'التحقّق من الهوية', d: 'فتح الجوال، الجوازات الإلكترونية.' },
            { t: 'الجودة الصناعية', d: 'كشف العيوب على خطوط الإنتاج.' },
          ].map((x, i) => (
            <div key={i} className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-4">
              <h4 className="font-bold">{x.t}</h4>
              <p className="text-sm text-ink-300 mt-1">{x.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <ActivityCard title="ارسم رقماً واترك النموذج يخمّنه" kicker="Activity 3a">
        <p className="text-sm text-ink-300 mb-4 leading-loose">
          ارسم رقماً (من <span className="en">0 إلى 9</span>) في المربّع باستخدام الفأرة أو الإصبع.
          النموذج يحلّل البكسلات ويعرض احتماله لكل رقم. كل شيء يحدث داخل متصفّحك بدون أي خادم.
        </p>
        <DigitClassifier />
      </ActivityCard>

      <ActivityCard title="مصنّف صور حقيقي بآلاف الفئات" kicker="Activity 3b · Real CNN">
        <p className="text-sm text-ink-300 mb-4 leading-loose">
          هذه المرة نُحمّل شبكة <span className="en">CNN</span> حقيقية (<span className="en">MobileNet v2</span>) دُرّبت على ملايين الصور
          و<span className="en">1000 فئة</span>. ارفع أيّ صورة، أو جرّب صوراً جاهزة من <span className="en">picsum.photos</span> (واجهة برمجية مجّانية).
          الشبكة ستُعطيك أعلى 5 توقّعات.
        </p>
        <MobileNetClassifier />
      </ActivityCard>

      <Section title="حدود الرؤية الحاسوبية" kicker="Limitations">
        <ul>
          <li>تُخدع بصور معدّلة قليلاً (<span className="en">adversarial examples</span> — سنراها في وحدة الأمن السيبراني).</li>
          <li>تتأثّر بالإضاءة، زوايا التصوير، والحالات النادرة.</li>
          <li>تحتاج بيانات تدريب متنوّعة وممثّلة للواقع.</li>
        </ul>
      </Section>
    </ModuleShell>
  );
}
