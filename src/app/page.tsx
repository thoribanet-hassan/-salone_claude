import Link from "next/link";
import AnnouncementBanner from "@/components/AnnouncementBanner";

// ديناميكية حتى يظهر إعلان المؤسس فور تغييره
export const dynamic = "force-dynamic";

const STEPS = [
  {
    n: "١",
    title: "علّق رمز QR",
    body: "يحصل محلك على رمز QR وملصق جاهز للطباعة في دقيقة واحدة.",
  },
  {
    n: "٢",
    title: "الزبون يمسح ويحجز",
    body: "يدخل اسمه ويأخذ رقمه في الطابور من جوّاله — بدون أي تطبيق.",
  },
  {
    n: "٣",
    title: "ينتظر بحرّية ويُنبَّه",
    body: "يتابع دوره من جوّاله، وننبّهه بالصوت والإشعار عند اقترابه.",
  },
];

const FEATURES = [
  { icon: "⏰", title: "تحرير وقت العميل", body: "لا وقوف في طابور — يقضي مشواره ويعود عند دوره." },
  { icon: "🚪", title: "تقليل التكدّس", body: "لا ازدحام داخل منشأتك، وتجربة أرقى وأهدأ للجميع." },
  { icon: "💚", title: "عملاء أوفى", body: "لا تخسر زبوناً بسبب الزحام أو طول الانتظار." },
  { icon: "📊", title: "رؤية واضحة", body: "تعرف أداء منشأتك وموظفيك يومياً بالأرقام." },
  { icon: "🗓️", title: "مواعيد وحجوزات", body: "دور فوري أو موعد محدّد بخانات، كما يناسب نشاطك." },
  { icon: "🛠️", title: "بلا أجهزة", body: "يعمل من جوّال الموظف — لا حاجة لشراء حاسب." },
];

const AUDIENCE = ["حلاقين", "صالونات نسائية", "مطاعم", "كافيهات", "عيادات", "أي منشأة بها طابور"];

function PhoneMock() {
  return (
    <div className="phone-frame float-soft w-[16rem] mx-auto">
      <div className="flex flex-col gap-3 p-3">
        <p className="muted text-center text-xs">صالون النخبة للحلاقة</p>
        <div className="surface p-5 text-center flex flex-col items-center gap-1">
          <p className="muted text-xs">رقم تذكرتك</p>
          <p className="text-6xl font-extrabold leading-none" style={{ color: "var(--accent)" }}>
            ٤٢
          </p>
          <p className="font-bold text-sm mt-1">حسن</p>
        </div>
        <div
          className="p-4 text-center font-extrabold"
          style={{ background: "var(--accent)", color: "var(--accent-contrast)", borderRadius: "var(--radius)" }}
        >
          أنت التالي — تجهّز 🎉
        </div>
        <div className="surface p-3 flex items-center justify-between text-sm">
          <span className="muted">عدد الأشخاص قبلك</span>
          <span className="font-extrabold">٠</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="theme-general min-h-screen">
      {/* ===== Hero ===== */}
      <section className="landing-hero-bg px-6 pt-8 pb-14">
        <div className="w-full max-w-5xl mx-auto">
          <div className="max-w-md mx-auto mb-6">
            <AnnouncementBanner page="home" />
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="flex flex-col items-center md:items-start text-center md:text-right gap-5 fade-up">
              <span className="badge-pill">✨ مجاني خلال فترة الإطلاق</span>
              <h1 className="text-6xl font-extrabold" style={{ color: "var(--accent)" }}>
                دورك
              </h1>
              <p className="text-xl font-bold">نظام إدارة الانتظار في الأماكن المزدحمة</p>
              <p className="muted text-lg leading-relaxed max-w-md">
                حرّر وقت عملائك: يمسحون رمز QR، يحجزون دورهم، ويتابعون أعمالهم بينما ننبّههم عند
                اقترابه. بدون تطبيق، وبدون تكدّس.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link href="/register" className="btn-accent py-4 px-8 text-lg no-underline text-center">
                  أنشئ منشأتك مجاناً
                </Link>
                <Link href="/login" className="surface py-4 px-8 font-bold no-underline text-center">
                  دخول المدير / الموظف
                </Link>
              </div>
            </div>

            <div className="fade-up">
              <PhoneMock />
            </div>
          </div>
        </div>
      </section>

      {/* ===== كيف يعمل ===== */}
      <section className="px-6 py-14">
        <div className="w-full max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-2">كيف يعمل؟</h2>
          <p className="muted text-center mb-10">ثلاث خطوات — وتكون جاهزاً</p>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="surface p-6 flex flex-col items-center text-center gap-3">
                <div className="step-num">{s.n}</div>
                <h3 className="font-extrabold text-lg">{s.title}</h3>
                <p className="muted text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== لماذا دورك ===== */}
      <section className="px-6 py-14" style={{ background: "var(--surface-2)" }}>
        <div className="w-full max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-10">لماذا دورك؟</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="surface p-5 flex flex-col gap-3">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="font-extrabold">{f.title}</h3>
                <p className="muted text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== لمن دورك ===== */}
      <section className="px-6 py-14">
        <div className="w-full max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-8">لكل منشأة بها انتظار</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {AUDIENCE.map((a) => (
              <span key={a} className="chip">{a}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== دعوة ختامية ===== */}
      <section className="px-6 pb-16">
        <div className="w-full max-w-3xl mx-auto landing-cta-bg p-10 md:p-14 text-center flex flex-col items-center gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold">جاهز تنظّم طابورك؟</h2>
          <p className="text-lg opacity-90 max-w-md">
            ابدأ الآن مجاناً خلال فترة الإطلاق — دقائق وتكون جاهزاً لاستقبال عملائك بلا زحام.
          </p>
          <Link
            href="/register"
            className="no-underline py-4 px-10 text-lg font-extrabold mt-2"
            style={{ background: "var(--accent-contrast)", color: "var(--accent)", borderRadius: "var(--radius)" }}
          >
            أنشئ منشأتك مجاناً
          </Link>
        </div>
      </section>

      <footer className="px-6 py-8 text-center">
        <p className="font-extrabold" style={{ color: "var(--accent)" }}>دورك</p>
        <p className="muted text-sm mt-1">نظام إدارة الانتظار في الأماكن المزدحمة</p>
      </footer>
    </main>
  );
}
