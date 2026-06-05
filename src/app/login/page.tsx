import LoginForm from "./LoginForm";

export const metadata = { title: "دخول | صالون" };

export default function LoginPage() {
  return (
    <main className="theme-general min-h-screen flex flex-col items-center justify-center px-5 py-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-extrabold">صالون</h1>
          <p className="muted text-sm mt-1">لوحة الإدارة والموظفين</p>
        </header>
        <div className="surface p-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
