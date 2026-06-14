"use client";

import { LOCALES, LOCALE_COOKIE, type Locale } from "@/lib/i18n";

// مبدّل اللغة المشترك — يضبط الكوكي (ليقرأه الخادم) + localStorage ثم يعيد التحميل
export default function LangSwitcher({ current }: { current: Locale }) {
  const pick = (l: Locale) => {
    if (l === current) return;
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    try {
      localStorage.setItem(LOCALE_COOKIE, l);
    } catch {
      /* تجاهل */
    }
    location.reload();
  };
  return (
    <div className="flex gap-1 p-1 rounded-full" style={{ background: "var(--surface-2)" }}>
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => pick(l.code)}
          aria-pressed={l.code === current}
          className="px-2.5 py-1 rounded-full text-xs font-bold transition-colors"
          style={
            l.code === current
              ? { background: "var(--accent)", color: "var(--accent-contrast)" }
              : { color: "var(--text-muted)" }
          }
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
