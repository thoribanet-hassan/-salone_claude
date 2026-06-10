import LoginForm from "./LoginForm";

export const metadata = { title: "دخول | دورك" };

export default function LoginPage() {
  return (
    <main className="theme-general min-h-screen flex flex-col items-center justify-center px-5 py-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-extrabold">دورك</h1>
          <p className="muted text-sm mt-1">لوحة الإدارة والموظفين</p>
        </header>
        <div className="surface p-6">
          <LoginForm />
        </div>
        <a href="/register" className="muted text-center text-sm no-underline">
          ليس لديك منشأة؟ أنشئ منشأة جديدة
        </a>
      </div>
    </main>
  );
}
