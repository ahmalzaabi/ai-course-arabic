import ModuleShell, { Section, ActivityCard, Callout } from '../../components/ModuleShell';
import HumanInLoop from '../../activities/HumanInLoop';

export default function AutonomousModule() {
  return (
    <ModuleShell slug="autonomous">
      <Section title="ما المقصود بالنظام الذاتي؟" kicker="Autonomous Systems">
        <p>
          النظام الذاتي هو نظام قادر على إدراك بيئته، اتخاذ قرارات، وتنفيذ أفعال
          لتحقيق هدف بأقلّ تدخّل بشري ممكن. يجمع بين <strong>الإدراك</strong> (مستشعرات + رؤية حاسوبية)،
          <strong> القرار</strong> (نماذج تنبؤ وتخطيط)، و<strong>التنفيذ</strong> (محرّكات أو إجراءات).
        </p>
      </Section>

      <Section title="مستويات الاستقلالية" kicker="6 levels">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { l: 'L0', t: 'بدون استقلالية', d: 'الإنسان يقوم بكل شيء.' },
            { l: 'L1', t: 'مساعدة', d: 'النظام يساعد في وظيفة واحدة (تثبيت سرعة).' },
            { l: 'L2', t: 'استقلالية جزئية', d: 'النظام يدير عدّة وظائف، الإنسان يراقب باستمرار.' },
            { l: 'L3', t: 'استقلالية مشروطة', d: 'النظام يقود في ظروف محدّدة، الإنسان جاهز للتدخّل.' },
            { l: 'L4', t: 'استقلالية عالية', d: 'النظام يدير معظم الحالات بدون تدخّل ضمن نطاق محدّد.' },
            { l: 'L5', t: 'استقلالية كاملة', d: 'لا حاجة لإنسان في أي ظرف. لا يوجد تجارياً بعد.' },
          ].map((x, i) => (
            <div key={i} className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-4">
              <span className="chip-brand !text-[11px]"><span className="en">{x.l}</span></span>
              <h4 className="font-bold mt-2">{x.t}</h4>
              <p className="text-sm text-ink-300 mt-1 leading-loose">{x.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="موقع الإنسان من الحلقة" kicker="Human in/on/out of the loop">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <h4 className="font-bold text-emerald-200">داخل الحلقة (<span className="en">In</span>)</h4>
            <p className="text-sm text-ink-200 mt-2 leading-loose">
              الإنسان يُوافق على كل قرار حرج قبل التنفيذ. أعلى أمان، أبطأ.
            </p>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
            <h4 className="font-bold text-amber-200">على الحلقة (<span className="en">On</span>)</h4>
            <p className="text-sm text-ink-200 mt-2 leading-loose">
              النظام يُنفّذ تلقائياً، الإنسان يُراقب ويتدخّل عند الحاجة. توازن بين السرعة والسيطرة.
            </p>
          </div>
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
            <h4 className="font-bold text-rose-200">خارج الحلقة (<span className="en">Out</span>)</h4>
            <p className="text-sm text-ink-200 mt-2 leading-loose">
              النظام يُنفّذ بدون رقابة آنية. أسرع، لكنه يحمل أعلى مخاطر — يُتجنّب في القرارات المصيرية.
            </p>
          </div>
        </div>
      </Section>

      <Section title="تكامل البيانات المعقّدة" kicker="Sensor Fusion">
        <p>
          الأنظمة الذاتية الحديثة لا تعتمد على مستشعر واحد. تدمج الكاميرات، الرادار، الليدار،
          المعلومات الجغرافية، والاتصالات — في طبقة <strong>إدراك موحّدة</strong>.
          الذكاء الاصطناعي هو ما يربط هذه المصادر ويُولّد فهماً متّسقاً للموقف.
        </p>
        <Callout tone="warn" title="حجر الزاوية">
          القرار الذاتي الجيّد يُبنى على إدراك موثوق. مستشعر معطوب → قرار خاطئ.
        </Callout>
      </Section>

      <ActivityCard title="أين يجلس الإنسان؟" kicker="Activity 6">
        <p className="text-sm text-ink-300 mb-4 leading-loose">
          أمامك سيناريوهات حقيقية. لكل سيناريو، اختر الموقع المناسب للإنسان.
          سنُقارن إجابتك مع رأي الخبراء.
        </p>
        <HumanInLoop />
      </ActivityCard>
    </ModuleShell>
  );
}
