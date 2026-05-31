import ModuleShell, { Section, ActivityCard, Callout } from '../../components/ModuleShell';
import AgentBuilder from '../../activities/AgentBuilder';

export default function AgentsModule() {
  return (
    <ModuleShell slug="agents">
      <Section title="من نموذج إلى وكيل" kicker="From Model to Agent">
        <p>
          النموذج اللغوي (<span className="en">LLM</span>) يستجيب لطلب واحد ويعود إلى الصمت.
          أمّا <strong>الوكيل</strong> (<span className="en">Agent</span>) فيستخدم نفس النموذج كـ"محرّك تفكير" داخل حلقة:
          يُخطّط، يستخدم أدوات، يُلاحظ النتيجة، ويُكرّر — حتى يُنجز هدفاً.
        </p>
        <Callout tone="tip" title="بصياغة بسيطة">
          <strong>نموذج:</strong> سؤال → جواب.<br />
          <strong>وكيل:</strong> هدف → تفكير → أداة → ملاحظة → تفكير → ... → نتيجة نهائية.
        </Callout>
      </Section>

      <Section title="مكوّنات أي وكيل" kicker="The 5 building blocks">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { t: 'العقل', en: 'LLM brain', d: 'يقرأ الهدف ويُخطّط الخطوة التالية.' },
            { t: 'الأدوات', en: 'Tools', d: 'بحث، آلة حاسبة، استعلام قاعدة بيانات، تنفيذ كود.' },
            { t: 'الذاكرة', en: 'Memory', d: 'قصيرة (السياق الحالي) وطويلة (قاعدة معرفية).' },
            { t: 'التخطيط', en: 'Planning', d: 'تقسيم الهدف إلى خطوات يمكن تنفيذها.' },
            { t: 'الحلقة', en: 'Loop', d: 'فكّر → نفّذ → لاحظ → كرّر حتى الإنجاز.' },
          ].map((x, i) => (
            <div key={i} className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-4">
              <div className="text-xs text-ink-400 en mb-1">{x.en}</div>
              <h4 className="font-bold">{x.t}</h4>
              <p className="text-sm text-ink-300 mt-2 leading-loose">{x.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="نمط ReAct" kicker="Think → Act → Observe">
        <p>
          النمط الأشهر في بناء الوكلاء يُسمّى <span className="en">ReAct</span> (<span className="en">Reasoning + Acting</span>).
          في كل خطوة يُنتج النموذج:
        </p>
        <ul>
          <li><strong>Thought (تفكير):</strong> ماذا أحتاج لأفعله الآن؟</li>
          <li><strong>Action (أداة):</strong> اختيار أداة وتمرير مدخلاتها.</li>
          <li><strong>Observation (ملاحظة):</strong> النتيجة التي عادت من الأداة.</li>
        </ul>
        <p>
          ثم يقرّر إن كان قد أنجز الهدف أم يحتاج خطوة أخرى. هذه الحلقة هي ما يُحوّل
          نموذجاً ساكناً إلى نظام يُنجز مهمّات.
        </p>
      </Section>

      <Section title="درجات الاستقلالية" kicker="Levels of autonomy">
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { t: 'مساعد', en: 'Co-pilot', d: 'يقترح، الإنسان يُنفّذ. كل خطوة تحت الرقابة.', c: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-200' },
            { t: 'وكيل خاضع للموافقة', en: 'Approval-loop', d: 'يخطّط ويعرض كل أداة قبل تنفيذها للحصول على إذن.', c: 'border-amber-500/40 bg-amber-500/5 text-amber-200' },
            { t: 'وكيل مستقل', en: 'Autonomous', d: 'يُنفّذ سلسلة من الإجراءات حتى الإنجاز. أعلى مخاطر، أعلى إنتاجية.', c: 'border-rose-500/40 bg-rose-500/5 text-rose-200' },
          ].map((x, i) => (
            <div key={i} className={`rounded-xl border ${x.c} p-4`}>
              <div className="text-xs en mb-1">{x.en}</div>
              <h4 className="font-bold">{x.t}</h4>
              <p className="text-sm text-ink-200 mt-2 leading-loose">{x.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="أمثلة عملية" kicker="Real-world agents">
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { t: 'تحليل تهديدات سيبرانية', d: 'وكيل يقرأ التنبيهات، يستعلم سجلّات SIEM، يربط الأحداث، ويُولّد تقريراً مع توصية.' },
            { t: 'مساعد عمليات', d: 'وكيل يجمع تقارير الوحدات، يُنشئ خلاصة، ويُحدّث لوحة المعلومات تلقائياً.' },
            { t: 'بحث استخباراتي', d: 'وكيل يبحث في مصادر مفتوحة، يُلخّص، ويتحقّق من المصادر متعارضة.' },
            { t: 'سير عمل إداري', d: 'حجز اجتماعات، توليد محاضر، متابعة المهام، وإرسال التذكيرات.' },
          ].map((x, i) => (
            <div key={i} className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-4">
              <h4 className="font-bold">{x.t}</h4>
              <p className="text-sm text-ink-300 mt-1 leading-loose">{x.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="تحدّيات الوكلاء" kicker="Challenges">
        <ul>
          <li><strong>الأخطاء تتراكم:</strong> خطأ صغير في خطوة قد يُفسد بقية الخطوات.</li>
          <li><strong>الحلقات اللانهائية:</strong> قد يُعيد المحاولة دون تقدّم.</li>
          <li><strong>أمن الأدوات:</strong> أداة بصلاحيات واسعة = خطر سيبراني.</li>
          <li><strong>هندسة المطالبات للأدوات:</strong> توصيف غير دقيق للأداة يُربك الوكيل.</li>
          <li><strong>التكلفة:</strong> الحلقة قد تستهلك آلاف الرموز.</li>
        </ul>
      </Section>

      <ActivityCard title="ابنِ وكيلك بنفسك" kicker="Activity 5">
        <p className="text-sm text-ink-300 mb-3 leading-loose">
          اختر هدفاً، ثم شاهد كيف يُفكّر الوكيل خطوة بخطوة، يختار أداة، ويُلاحظ النتيجة.
          اضبط الأدوات المتاحة وشاهد كيف يتغيّر سلوكه.
        </p>
        <AgentBuilder />
      </ActivityCard>
    </ModuleShell>
  );
}
