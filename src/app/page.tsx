import Link from "next/link";

export default function Home() {
  return (
    <main className="theme-general min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div>
          <h1 className="text-5xl font-extrabold" style={{ color: "var(--accent)" }}>
            دورك
          </h1>
          <p className="muted mt-3 text-lg">
            نظام إدارة طوابير محلات الحلاقة والصالونات والطوابير العامة عبر QR
          </p>
        </div>

        <div className="surface p-6 flex flex-col gap-3">
          <p className="font-bold">الزبون يدخل بمسح رمز QR الخاص بالمحل — بدون أي تطبيق.</p>
          <Link href="/register" className="btn-accent py-4 text-lg no-underline">
            أنشئ محلك الآن
          </Link>
          <Link href="/login" className="surface py-3 font-bold no-underline">
            دخول المدير / الموظف
          </Link>
        </div>
      </div>
    </main>
  );
}
