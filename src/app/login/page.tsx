import LoginForm from "./LoginForm";
import { getServerLocale } from "@/lib/locale-server";
import { dirFor, fontVarFor } from "@/lib/i18n";
import { AUTH } from "@/i18n/auth";
import LangSwitcher from "@/components/LangSwitcher";

export const metadata = { title: "دخول | دورك" };

export default async function LoginPage() {
  const locale = await getServerLocale();
  const t = AUTH[locale];
  return (
    <main
      className="theme-general min-h-screen flex flex-col items-center justify-center px-5 py-8"
      dir={dirFor(locale)}
      lang={locale}
      style={{ fontFamily: fontVarFor(locale) }}
    >
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex justify-center">
          <LangSwitcher current={locale} />
        </div>
        <header className="text-center">
          <h1 className="text-3xl font-extrabold">دورك</h1>
          <p className="muted text-sm mt-1">{t.loginTagline}</p>
        </header>
        <div className="surface p-6">
          <LoginForm t={t} />
        </div>
        <a href="/register" className="muted text-center text-sm no-underline">
          {t.noShop}
        </a>
      </div>
    </main>
  );
}
