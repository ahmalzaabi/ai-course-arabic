import ModuleShell, { Section, ActivityCard, Callout } from '../../components/ModuleShell';
import AdversarialDemo from '../../activities/AdversarialDemo';

export default function CyberModule() {
  return (
    <ModuleShell slug="cybersecurity">
      <Section title="سيف ذو حدّين" kicker="AI ↔ Cybersecurity">
        <p>
          الذكاء الاصطناعي والأمن السيبراني علاقتهما متبادلة:
          الذكاء الاصطناعي <strong>أداة دفاع</strong> قويّة، لكنّه أيضاً <strong>هدف هجوم</strong> جديد.
        </p>
      </Section>

      <Section title="تهديدات على الذكاء الاصطناعي" kicker="Threats against AI">
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-3">
          {[
            {
              t: 'تسميم البيانات',
              en: 'Data Poisoning',
              d: 'يحقن المهاجم أمثلة خبيثة في بيانات التدريب → النموذج يتعلّم سلوكاً خاطئاً، أو يحتوي بوّابة خلفية تنفتح بمحفّز معيّن.',
            },
            {
              t: 'أمثلة معادية',
              en: 'Adversarial Examples',
              d: 'تعديل خفيف غير ملحوظ على المدخلات يُسبّب خطأً جسيماً في القرار (مثال: ملصق صغير يجعل النموذج يرى علامة "قف" كأنها حدّ سرعة).',
            },
            {
              t: 'سرقة النموذج',
              en: 'Model Theft',
              d: 'إرسال آلاف الاستعلامات وتحليل المخرجات لإعادة بناء نسخة من النموذج — انتهاك ملكية فكرية وكشف منطق سرّي.',
            },
            {
              t: 'استخراج البيانات',
              en: 'Data Extraction',
              d: 'استدراج النموذج لكشف بيانات تدريبه (أسرار، معلومات شخصية). كلما حفظ النموذج البيانات حرفياً، كان عرضة أكثر.',
            },
            {
              t: 'حقن المطالبات',
              en: 'Prompt Injection',
              d: 'إخفاء تعليمات خبيثة داخل مستند أو صفحة ويب يقرأها وكيل ذكي — فيُنفّذها وكأنها أوامر مشروعة.',
            },
            {
              t: 'هجمات على الوكلاء',
              en: 'Agent Hijacking',
              d: 'استغلال صلاحيات أدوات الوكيل (بريد، ملفات، API) لتنفيذ عمليات لم يطلبها المستخدم.',
            },
          ].map((x, i) => (
            <div key={i} className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-rose-100">{x.t}</h4>
                <span className="text-[10px] en text-rose-300/80">{x.en}</span>
              </div>
              <p className="text-sm text-ink-200 mt-2 leading-loose">{x.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <ActivityCard title="هجوم معادي بسيط" kicker="Activity 7">
        <p className="text-sm text-ink-300 mb-3 leading-loose">
          هذه صورة "دبابة"، والنموذج (محاكاة) واثق من تصنيفه.
          أضف ضوضاء صغيرة بالمنزلق ولاحظ كيف ينقلب التصنيف أو ينخفض اليقين بشكل جنوني — رغم أن العين البشرية لا ترى فرقاً يُذكر.
        </p>
        <AdversarialDemo />
      </ActivityCard>

      <Section title="دور الذكاء الاصطناعي في الدفاع" kicker="AI for defense">
        <ul>
          <li><strong>كشف التهديدات:</strong> تحليل ملايين سجلّات الشبكة وتمييز النشاط الشاذ.</li>
          <li><strong>تصنيف البرمجيات الخبيثة:</strong> تحديد عائلة البرنامج الخبيث آلياً.</li>
          <li><strong>التحليل السلوكي:</strong> ملف شخصي للمستخدم/الجهاز وكشف الانحراف عنه.</li>
          <li><strong>التنبّه الاستباقي:</strong> ربط مؤشّرات صغيرة في حدث مركّب قبل وقوع الهجوم.</li>
          <li><strong>الاستجابة الآلية:</strong> عزل جهاز مصاب أو تعليق حساب فور كشف نمط هجوم معروف.</li>
        </ul>
      </Section>

      <Section title="مبادئ بناء أنظمة AI آمنة" kicker="Secure AI principles">
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { t: 'أقل صلاحية', d: 'لا تُعطِ النموذج أو الوكيل صلاحيات أكثر مما يحتاج.' },
            { t: 'فصل البيانات', d: 'لا تخلط بيانات تدريب مع تعليمات تنفيذية في نفس السياق.' },
            { t: 'ختم وتحقّق', d: 'تحقّق من توقيع النموذج/الأوزان قبل النشر.' },
            { t: 'مراقبة مستمرّة', d: 'سجّل كل قرار، اكتشف الانحراف، أعد التدريب دورياً.' },
            { t: 'فحص أحمر', d: 'فريق Red Team يحاول كسر النموذج قبل الإنتاج.' },
            { t: 'حدود واضحة', d: 'حدّد ما النموذج مسموح له بفعله، ووفّر آلية إنسانية للموافقة على الباقي.' },
          ].map((x, i) => (
            <div key={i} className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-4">
              <h4 className="font-bold text-brand-100">{x.t}</h4>
              <p className="text-sm text-ink-200 mt-1 leading-loose">{x.d}</p>
            </div>
          ))}
        </div>
        <Callout tone="warn" title="القاعدة الذهبية">
          الأمن لا يُضاف في النهاية. يُصمّم منذ البداية ضمن دورة حياة الذكاء الاصطناعي:
          البيانات → النموذج → النشر → المراقبة → التحديث.
        </Callout>
      </Section>
    </ModuleShell>
  );
}
