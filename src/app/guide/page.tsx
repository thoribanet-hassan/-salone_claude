import Link from "next/link";
import { StagesDemo, QueueDemo, FlowDemo } from "./GuideDemos";

export const metadata = {
  title: "دليل استخدام دورك",
  description: "تعلّم كيف تستخدم دورك بكل عناصره — خطوة بخطوة، مع مقاطع متحركة توضيحية",
};

// قسم برأس مرقّم + محتوى
function Section({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="surface p-6 flex flex-col gap-3 scroll-mt-20" id={`s${n}`}>
      <div className="flex items-center gap-3">
        <span className="step-num">{n}</span>
        <h2 className="text-xl font-extrabold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-sm rounded-xl p-3"
      style={{ background: "var(--surface-2)", borderInlineStart: "3px solid var(--accent)" }}
    >
      💡 {children}
    </p>
  );
}

function DemoBox({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col items-center gap-3" style={{ background: "var(--surface-2)" }}>
      <div className="w-full flex justify-center">{children}</div>
      <p className="muted text-xs text-center">▶︎ {caption}</p>
    </div>
  );
}

const TOC = [
  "ما هو دورك؟",
  "أنشئ منشأتك",
  "اضبط منشأتك",
  "أضف موظفيك وخدماتك",
  "ادعُ عملاءك للحجز",
  "كيف يحجز عميلك",
  "شاشة انتظار العميل",
  "شاشة الموظف: الاستقبال والخدمة",
  "شاشة العرض للمحل",
  "إحصائياتك",
  "إعلانات منشأتك",
];

export default function GuidePage() {
  return (
    <main className="theme-general min-h-screen px-5 py-8">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
        <header className="text-center flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold" style={{ color: "var(--accent)" }}>
            دليل استخدام دورك
          </h1>
          <p className="muted">تعلّم كل عناصر دورك خطوة بخطوة — مع مقاطع متحركة توضيحية</p>
        </header>

        {/* فهرس */}
        <nav className="surface p-5">
          <p className="font-extrabold mb-2">المحتويات</p>
          <ol className="flex flex-col gap-1 text-sm">
            {TOC.map((t, i) => (
              <li key={i}>
                <a href={`#s${i + 1}`} className="no-underline" style={{ color: "var(--accent)" }}>
                  {i + 1}. {t}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <Section n={1} title="ما هو دورك؟">
          <p className="leading-relaxed">
            دورك نظام لإدارة الانتظار في الأماكن المزدحمة. يأخذ عميلك دوره من جوّاله عبر مسح رمز
            QR — بدون أي تطبيق — ثم يتابع أعماله بينما ننبّهه عند اقتراب دوره. النتيجة: لا تكدّس
            داخل محلك، وعملاء أكثر رضاً، وتحكّم أوضح بوقتك.
          </p>
          <DemoBox caption="رحلة العميل في ثلاث خطوات">
            <FlowDemo />
          </DemoBox>
        </Section>

        <Section n={2} title="أنشئ منشأتك">
          <p className="leading-relaxed">
            افتح{" "}
            <Link href="/register" className="font-bold" style={{ color: "var(--accent)" }}>
              صفحة الإنشاء
            </Link>{" "}
            واكتب <b>نوع المنشأة</b> (حلاق، صالون، مطعم، عيادة…) و<b>اسمها</b>. يُنشأ حسابك فوراً
            وتدخل لوحة التحكم. النوع يحدّد المظهر والمصطلحات فقط، وكل السلوك تضبطه أنت لاحقاً.
          </p>
          <Tip>سجّل ببريدك وكلمة مرور — هذا حساب المدير الذي تدير منه كل شيء.</Tip>
        </Section>

        <Section n={3} title="اضبط منشأتك (لوحة التحكم)">
          <p className="leading-relaxed">من لوحة المدير تتحكّم بكل شيء من مكان واحد:</p>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed list-disc ps-5">
            <li>
              <b>استقبال العملاء مفتوح/مغلق</b> — أوقف الحجز خارج الدوام بضغطة.
            </li>
            <li>
              <b>نموذج الموظفين</b> — هل يختار العميل الموظف، أم دور واحد موحّد؟ وهل يظهر اسم الموظف
              على التذكرة؟
            </li>
            <li>
              <b>نظام الزمن</b> — ثلاث طرق: <b>بالرقم فقط</b> (بلا زمن)، أو <b>زمني تلقائي</b>
              (يُحسب من مدد الخدمات)، أو <b>يدوي</b> (الموظف يحدّد الوقت). اختر ما يناسب نشاطك.
            </li>
            <li>
              <b>المواعيد</b> — فعّل الحجز في ساعة محدّدة، واضبط ساعات العمل، وطول الخانة، ونافذة
              حماية الموعد (كم دقيقة قبله يُثبَّت صاحبه في المقدمة).
            </li>
            <li>
              <b>الأسعار والعرض</b> — أظهِر الأسعار، وعدد المنتظرين، والعدّاد الحي للعميل.
            </li>
          </ul>
          <Tip>ابدأ بسيطاً: «بالرقم فقط» يكفي معظم المحلات، وفعّل المواعيد لاحقاً عند الحاجة.</Tip>
        </Section>

        <Section n={4} title="أضف موظفيك وخدماتك">
          <p className="leading-relaxed">
            في قسم <b>الموظفين</b> أضف كل موظف ويحصل على <b>رمز دخول</b> خاص يدخل به لشاشته. وفي قسم
            <b> الخدمات</b> أضف خدماتك وأسعارها ومدّتها. يمكنك تحديد <b>مدّة كل خدمة لكل موظف</b>
            لحساب الوقت بدقة. المدير نفسه يُعدّ موظفاً ويستقبل العملاء.
          </p>
          <Tip>رمز الدخول يُسلَّم للموظف مع رمز المحل ليفتح شاشته من أي جوال.</Tip>
        </Section>

        <Section n={5} title="ادعُ عملاءك للحجز">
          <p className="leading-relaxed">لديك قناتان، وكلتاهما تُقاس تلقائياً لتعرف مصدر كل عميل:</p>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed list-disc ps-5">
            <li>
              <b>في المحل:</b> نزّل ملصق QR (جاهز للطباعة في دقيقة) وعلّقه عند المدخل — الزبون
              الحاضر يمسحه ويأخذ دوره.
            </li>
            <li>
              <b>عن بُعد:</b> شارك الرمز أو رابط الحجز عبر واتساب، صفحاتك، أو أي مكان — ليحجز عملاؤك
              قبل وصولهم.
            </li>
          </ul>
          <Tip>القناتان توصلان لنفس صفحة الحجز؛ الفرق فقط أنك تعرف من أين جاء كل عميل من إحصائياتك.</Tip>
        </Section>

        <Section n={6} title="كيف يحجز عميلك">
          <p className="leading-relaxed">
            يفتح العميل الرابط، يكتب اسمه، يختار الخدمة (والموظف إن سمحت)، ثم:{" "}
            <b>دور فوري الآن</b>، أو — إن فعّلت المواعيد — <b>موعد في ساعة محدّدة</b> يختاره من خانات
            متاحة (المحجوزة تظهر معطّلة فلا تُحجز مرتين). كل ذلك من المتصفح بلا أي تطبيق.
          </p>
        </Section>

        <Section n={7} title="شاشة انتظار العميل">
          <p className="leading-relaxed">
            بعد الحجز يرى العميل شاشة حيّة تتحدّث تلقائياً: رقمه، عدد من قبله، والوقت المتوقع. وكلما
            اقترب دوره <b>تتدرّج البطاقة لوناً وحركةً</b>، مع تنبيه صوتي واهتزاز، وإشعار على جواله إن
            فعّله — حتى لو أغلق الصفحة (أندرويد).
          </p>
          <DemoBox caption="تتدرّج الشاشة تلقائياً: بعيد ← اقترب ← استعد ← أنت التالي ← حان دورك">
            <StagesDemo />
          </DemoBox>
          <Tip>
            على أندرويد يظهر زر «نبّهني عند اقتراب دوري» للإشعار والصفحة مغلقة؛ على آيفون يُبقي العميل
            الصفحة مفتوحة ويُنبَّه بالصوت.
          </Tip>
        </Section>

        <Section n={8} title="شاشة الموظف: الاستقبال والخدمة">
          <p className="leading-relaxed">
            لكل موظف <b>شاشته الخاصة</b> منفصلة عن لوحة المدير. يدخل إليها من{" "}
            <Link href="/login" className="font-bold" style={{ color: "var(--accent)" }}>
              صفحة الدخول
            </Link>{" "}
            ← تبويب <b>«موظف»</b>، بكتابة <b>رمز المحل</b> و<b>رمز دخوله الخاص</b> — من أي جوال
            وبدون أي تطبيق. (رموز الدخول يُنشئها المدير في قسم الموظفين.)
          </p>
          <p className="leading-relaxed">
            يضبط الموظف <b>حالته</b> بنفسه: <b>«متاح ✓»</b> لاستقبال العملاء، أو <b>«غير متاح»</b>
            عند الاستراحة فلا يُسحب له عميل، وتظهر <b>«مشغول»</b> تلقائياً أثناء خدمته لعميل.
          </p>
          <p className="leading-relaxed">
            ومن أزرار شاشته: <b>نادِ العميل التالي</b> فيُسحب أقدم عميل ويُنبَّه أن دوره حان، ثم{" "}
            <b>أنهِ الخدمة</b> ليتقدّم الطابور تلقائياً. إن لم يحضر العميل <b>تخطّاه</b> (ويظهر في
            قائمة المتخطّين مع إمكانية <b>إعادته</b> للطابور). في الوضع اليدوي يحدّد للعميل التالي{" "}
            <b>وقت جاهزيته</b> بمنزلق بسيط فتصله نغمة.
          </p>
          <DemoBox caption="عند إنهاء كل عميل يتقدّم الطابور والرقم التالي يُنادى">
            <QueueDemo />
          </DemoBox>
          <Tip>المدير نفسه موظفٌ أيضاً، ويستقبل العملاء بنفس الأزرار من داخل لوحته مباشرةً.</Tip>
        </Section>

        <Section n={9} title="شاشة العرض للمحل">
          <p className="leading-relaxed">
            افتح <b>شاشة العرض</b> على تلفزيون أو جهاز لوحي داخل محلك — تعرض بأرقام كبيرة من
            يُخدَم الآن والأرقام القادمة، وتُحدّث نفسها تلقائياً مع نغمة عند نداء رقم جديد. مثالية
            للمطاعم والعيادات.
          </p>
          <Tip>رابط الشاشة: <code dir="ltr">/display/رمز-محلك</code> — افتحه على الشاشة واتركه.</Tip>
        </Section>

        <Section n={10} title="إحصائياتك">
          <p className="leading-relaxed">
            صفحة <b>الإحصائيات</b> تعرض لكل موظف عدد من خدمهم وإيرادهم اليوم، وإجماليات الشهر،
            وتفصيل الأيام — لتعرف أداء محلك وموظفيك بالأرقام، وتتنقّل بين الشهور.
          </p>
        </Section>

        <Section n={11} title="إعلانات منشأتك">
          <p className="leading-relaxed">
            إن مُنحت الصلاحية، يظهر في لوحتك قسم <b>«إعلانات منشأتي»</b> لبثّ إعلان (نص + صورة/فيديو +
            رابط) على صفحات منشأتك — كعرض اليوم أو تنبيه. تختار الصفحة التي يظهر فيها ومدّة تفعيله.
          </p>
        </Section>

        <div className="surface p-6 text-center flex flex-col items-center gap-3">
          <p className="font-extrabold text-lg">جاهز تبدأ؟</p>
          <Link href="/register" className="btn-accent py-3 px-8 no-underline">
            أنشئ منشأتك مجاناً
          </Link>
          <Link href="/dashboard" className="muted text-sm no-underline">
            أو ادخل لوحة التحكم ←
          </Link>
        </div>

        <p className="muted text-center text-xs">مدعوم بنظام «دورك»</p>
      </div>
    </main>
  );
}
