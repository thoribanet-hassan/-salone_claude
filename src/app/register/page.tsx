import Link from "next/link";
import RegisterForm from "./RegisterForm";

export const metadata = { title: "تسجيل محل جديد | دورك" };

export default function RegisterPage() {
  return (
    <main className="theme-general min-h-screen flex flex-col items-center px-5 py-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="text-center mt-2">
          <h1 className="text-3xl font-extrabold" style={{ color: "var(--accent)" }}>دورك</h1>
          <p className="muted text-sm mt-1">أنشئ محلك وابدأ إدارة الطابور خلال دقيقة</p>
        </header>
        <div className="surface p-6">
          <RegisterForm />
        </div>
        <Link href="/login" className="muted text-center text-sm no-underline">
          لديك حساب؟ تسجيل الدخول
        </Link>
      </div>
    </main>
  );
}
