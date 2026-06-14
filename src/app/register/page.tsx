import Link from "next/link";
import RegisterForm from "./RegisterForm";
import { getServerLocale } from "@/lib/locale-server";
import { dirFor, fontVarFor } from "@/lib/i18n";
import { AUTH } from "@/i18n/auth";
import LangSwitcher from "@/components/LangSwitcher";

export const metadata = { title: "تسجيل محل جديد | دورك" };

export default async function RegisterPage() {
  const locale = await getServerLocale();
  const t = AUTH[locale];
  return (
    <main
      className="theme-general min-h-screen flex flex-col items-center px-5 py-8"
      dir={dirFor(locale)}
      lang={locale}
      style={{ fontFamily: fontVarFor(locale) }}
    >
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex justify-center">
          <LangSwitcher current={locale} />
        </div>
        <header className="text-center">
          <h1 className="text-3xl font-extrabold" style={{ color: "var(--accent)" }}>دورك</h1>
          <p className="muted text-sm mt-1">{t.regTagline}</p>
        </header>
        <div className="surface p-6">
          <RegisterForm t={t} />
        </div>
        <Link href="/login" className="muted text-center text-sm no-underline">
          {t.loginManager}
        </Link>
      </div>
    </main>
  );
}
