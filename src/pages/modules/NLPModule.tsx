import ModuleShell, { Section, ActivityCard, Callout } from '../../components/ModuleShell';
import TokenVisualizer from '../../activities/TokenVisualizer';
import PromptLab from '../../activities/PromptLab';

export default function NLPModule() {
  return (
    <ModuleShell slug="nlp-llm">
      <Section title="من الكلمات إلى الأرقام" kicker="Tokens & Embeddings">
        <p>
          نموذج اللغة الكبير (<span className="en">Large Language Model · LLM</span>) لا يفهم الحروف،
          بل يُحوّل النصّ إلى وحدات صغيرة تُسمّى <strong>رموز</strong> (<span className="en">tokens</span>)،
          ثم يُمثّل كلّ رمز كمتّجه أرقام (<span className="en">embedding</span>).
        </p>
        <Callout tone="tip" title="فكرة قوية">
          الكلمات ذات المعنى المتشابه تكون متّجهاتها قريبة في الفضاء. لذلك "ملك − رجل + امرأة ≈ ملكة".
        </Callout>
      </Section>

      <ActivityCard title="جرّب التقسيم إلى رموز" kicker="Activity 4a">
        <p className="text-sm text-ink-300 mb-3 leading-loose">
          اكتب جملة بالعربية أو الإنجليزية، وشاهد كيف يقسّمها النموذج إلى رموز،
          وكم رمزاً ستكلّفك (للنماذج المدفوعة، الفاتورة بالرموز لا بالكلمات).
        </p>
        <TokenVisualizer />
      </ActivityCard>

      <Section title="المحوّل والانتباه" kicker="Transformer & Attention">
        <p>
          البنية المعمارية التي غيّرت كل شيء منذ <span className="en">2017</span> هي
          <strong> Transformer</strong>. سرّها آلية تُسمّى <strong>الانتباه</strong> (<span className="en">attention</span>):
          عند توليد كل كلمة، يُلقي النموذج "نظرة" على كل الكلمات السابقة ويُقرّر أيّها أهمّ في هذه اللحظة.
        </p>
        <ul>
          <li>يُولّد النموذج رمزاً واحداً في كل مرة، ثم يُغذّي ناتجه إلى نفسه ليُولّد التالي.</li>
          <li>كل رمز تالٍ هو "أكثر الاحتمالات احتمالاً" بناءً على ما سبق.</li>
          <li>درجة الحرارة (<span className="en">temperature</span>) تتحكّم بمدى التنوّع: منخفضة = حذرة ومتكرّرة، عالية = مبدعة وعشوائية.</li>
        </ul>
      </Section>

      <Section title="ماذا يستطيع وماذا لا يستطيع؟" kicker="Capabilities & Limits">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <h4 className="font-bold text-emerald-200 mb-2">يستطيع</h4>
            <ul className="text-sm text-ink-200 space-y-1.5 leading-loose">
              <li>الكتابة والترجمة والتلخيص.</li>
              <li>الإجابة على أسئلة عامّة.</li>
              <li>توليد الكود وشرحه.</li>
              <li>محاكاة أساليب وأدوار مختلفة.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
            <h4 className="font-bold text-rose-200 mb-2">لا يستطيع (دائماً)</h4>
            <ul className="text-sm text-ink-200 space-y-1.5 leading-loose">
              <li>تمييز الحقيقة من <strong>الهلوسة</strong> دون أدوات.</li>
              <li>الوصول لمعلومات حديثة بدون اتصال بالإنترنت.</li>
              <li>الحساب الدقيق دون أدوات حسابية.</li>
              <li>التذكّر بين الجلسات بدون نظام ذاكرة.</li>
            </ul>
          </div>
        </div>
      </Section>

      <ActivityCard title="مختبر هندسة المطالبات" kicker="Activity 4b">
        <p className="text-sm text-ink-300 mb-3 leading-loose">
          نفس الطلب يُمكن صياغته بطرق مختلفة، وكل صياغة تُعطي جودة مختلفة.
          غيّر العناصر وشاهد كيف تتحسّن الإجابة المُتوقَّعة.
        </p>
        <PromptLab />
      </ActivityCard>
    </ModuleShell>
  );
}
