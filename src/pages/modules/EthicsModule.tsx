import ModuleShell, { Section, ActivityCard, Callout } from '../../components/ModuleShell';
import BiasLab from '../../activities/BiasLab';

export default function EthicsModule() {
  return (
    <ModuleShell slug="ethics">
      <Section title="لماذا الأخلاقيات؟" kicker="Why Ethics?">
        <p>
          النموذج لا يفهم المعنى ولا التأثير الاجتماعي لقراراته — هو مرآة لبيانات تدريبه ولأهدافنا في تصميمه.
          المسؤولية تبقى علينا: <strong>كيف نبني، ولِمَن، وبأيّ ضمانات؟</strong>
        </p>
      </Section>

      <Section title="التحيّز: من أين يأتي؟" kicker="Bias sources">
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { t: 'تحيّز البيانات', d: 'البيانات لا تُمثّل الواقع بشكل متوازن (مثلاً: غالبية الصور لرجال).' },
            { t: 'تحيّز التسمية', d: 'البشر الذين يُسمّون البيانات يحملون تحيّزاتهم.' },
            { t: 'تحيّز الخوارزمية', d: 'الخوارزمية قد تُضخّم انحرافاً صغيراً في البيانات.' },
            { t: 'تحيّز التقييم', d: 'مقاييس النجاح لا تكشف الفروق بين الفئات.' },
            { t: 'تحيّز النشر', d: 'النموذج يُستخدم في سياق غير الذي صُمّم له.' },
            { t: 'تحيّز الحلقة', d: 'النموذج يؤثّر على البيانات المستقبلية فيُكرّس تحيّزه.' },
          ].map((x, i) => (
            <div key={i} className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-4">
              <h4 className="font-bold">{x.t}</h4>
              <p className="text-sm text-ink-300 mt-1 leading-loose">{x.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <ActivityCard title="مختبر التحيّز" kicker="Activity 8">
        <p className="text-sm text-ink-300 mb-3 leading-loose">
          ادرس بيانات تدريب غير متوازنة، وشاهد كيف ينحاز النموذج. ثم وازن البيانات وقارن النتائج.
        </p>
        <BiasLab />
      </ActivityCard>

      <Section title="مبادئ الذكاء الاصطناعي المسؤول" kicker="Responsible AI">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { t: 'العدالة', en: 'Fairness', d: 'لا تمييز غير مبرّر بين الفئات.' },
            { t: 'الشفافية', en: 'Transparency', d: 'نُوضّح متى يُستخدم النظام وكيف يصل لقراراته.' },
            { t: 'القابلية للتفسير', en: 'Explainability', d: 'يستطيع المستخدم فهم سبب القرار.' },
            { t: 'الخصوصية', en: 'Privacy', d: 'البيانات الشخصية محميّة، استخدامها بإذن، وتُحذف عند الانتهاء.' },
            { t: 'السلامة', en: 'Safety', d: 'النظام يُختبر، يُراقب، ويتوقّف بأمان عند الفشل.' },
            { t: 'المساءلة', en: 'Accountability', d: 'يوجد مسؤول واضح عن قرارات النظام.' },
          ].map((x, i) => (
            <div key={i} className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <div className="text-xs en text-emerald-300 mb-1">{x.en}</div>
              <h4 className="font-bold text-emerald-100">{x.t}</h4>
              <p className="text-sm text-ink-200 mt-1 leading-loose">{x.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="الإطار الإماراتي" kicker="UAE AI Strategy">
        <p>
          تبنّت دولة الإمارات استراتيجية وطنية للذكاء الاصطناعي، وأنشأت وزارة مخصّصة له،
          ووضعت خططاً للتحوّل الرقمي في القطاعات الحيوية بما فيها الدفاع.
          الهدف: أن تكون الإمارات في طليعة الدول في تبنّي الذكاء الاصطناعي بشكل مسؤول.
        </p>
        <ul>
          <li>الاستراتيجية الوطنية للذكاء الاصطناعي 2031.</li>
          <li>مبادرات تدريب وتأهيل الكفاءات الوطنية.</li>
          <li>سياسات حوكمة وأخلاقيات الذكاء الاصطناعي.</li>
          <li>تكامل مع أهداف التحوّل الرقمي العسكري.</li>
        </ul>
        <Callout tone="tip" title="الخلاصة">
          الذكاء الاصطناعي ليس اختياراً تقنياً فحسب، بل قرار استراتيجي وأخلاقي.
          المؤسسات التي تنجح هي تلك التي تستثمر في <strong>القدرة</strong> و<strong>الحوكمة</strong> معاً.
        </Callout>
      </Section>
    </ModuleShell>
  );
}
