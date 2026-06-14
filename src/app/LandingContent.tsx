"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { T, LOCALES, type Locale } from "./landing-i18n";

const STORAGE_KEY = "dawrak_lang";

// ===== أيقونات خطّية مصمّمة (تأخذ لون الثيم عبر currentColor) =====
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
function I({ children, size = 26 }: { children: ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
      {children}
    </svg>
  );
}
const IconQR = () => (
  <I>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <path d="M14 14h3M21 14v3M14 17v4M17 21h4M21 18v3" />
  </I>
);
const IconPhone = () => (
  <I>
    <rect x="6" y="2.5" width="12" height="19" rx="3" />
    <path d="M11 18.5h2" />
  </I>
);
const IconBell = () => (
  <I>
    <path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </I>
);
const IconClock = () => (
  <I>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </I>
);
const IconUsers = () => (
  <I>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20a6 6 0 0 1 12 0" />
    <path d="M16.5 5.3A3.2 3.2 0 0 1 18 11" />
    <path d="M18.5 20a6 6 0 0 0-3-5.3" />
  </I>
);
const IconHeart = () => (
  <I>
    <path d="M12 20.5S3.5 15 3.5 8.8A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8.5 1.8C20.5 15 12 20.5 12 20.5z" />
  </I>
);
const IconChart = () => (
  <I>
    <path d="M3 21h18" />
    <rect x="5" y="11" width="3.2" height="7" rx="1" />
    <rect x="10.4" y="6" width="3.2" height="12" rx="1" />
    <rect x="15.8" y="14" width="3.2" height="4" rx="1" />
  </I>
);
const IconCalendar = () => (
  <I>
    <rect x="3" y="5" width="18" height="16" rx="2.5" />
    <path d="M3 9.5h18M8 3v4M16 3v4" />
  </I>
);
const IconTools = () => (
  <I>
    <path d="M14.7 6.3a3.5 3.5 0 0 0-4.8 4.5l-6 6 2.8 2.8 6-6a3.5 3.5 0 0 0 4.5-4.8l-2.3 2.3-2-.5-.5-2z" />
  </I>
);
const STEP_ICONS = [IconQR, IconPhone, IconBell];
const FEATURE_ICONS = [IconClock, IconUsers, IconHeart, IconChart, IconCalendar, IconTools];

// QR زخرفي عائم في الـ hero
function FloatingQR() {
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" className="block">
      <rect x="0" y="0" width="84" height="84" rx="16" fill="var(--surface)" stroke="var(--border)" />
      <g fill="var(--text)">
        <rect x="14" y="14" width="20" height="20" rx="3" fill="none" stroke="var(--text)" strokeWidth="4" />
        <rect x="50" y="14" width="20" height="20" rx="3" fill="none" stroke="var(--text)" strokeWidth="4" />
        <rect x="14" y="50" width="20" height="20" rx="3" fill="none" stroke="var(--text)" strokeWidth="4" />
        <rect x="20" y="20" width="8" height="8" />
        <rect x="56" y="20" width="8" height="8" />
        <rect x="20" y="56" width="8" height="8" />
        <rect x="50" y="50" width="6" height="6" />
        <rect x="62" y="50" width="8" height="8" />
        <rect x="50" y="62" width="8" height="8" />
        <rect x="62" y="62" width="8" height="8" />
      </g>
    </svg>
  );
}

function PhoneMock({ s }: { s: (typeof T)[Locale] }) {
  return (
    <div className="relative w-[17rem] mx-auto">
      {/* عناصر عائمة حول الجوال */}
      <div className="absolute -top-5 -start-6 float-soft z-20" style={{ animationDelay: "0.3s" }}>
        <FloatingQR />
      </div>
      <div
        className="absolute -bottom-3 -end-3 z-20 float-soft surface px-3 py-2 flex items-center gap-2 shadow-lg"
        style={{ animationDelay: "1s", borderColor: "var(--accent)" }}
      >
        <span style={{ color: "var(--accent)" }}>
          <IconBell />
        </span>
        <span className="font-bold text-xs">🔔</span>
      </div>

      <div className="phone-frame float-soft relative z-10">
        <div className="flex flex-col gap-3 p-3">
          <p className="muted text-center text-xs">{s.phoneShop}</p>
          <div className="surface p-5 text-center flex flex-col items-center gap-1">
            <p className="muted text-xs">{s.phoneTicketLabel}</p>
            <p className="text-6xl font-extrabold leading-none" style={{ color: "var(--accent)" }}>
              {s.phoneNumber}
            </p>
            <p className="font-bold text-sm mt-1">{s.phoneCustomer}</p>
          </div>
          <div
            className="p-4 text-center font-extrabold"
            style={{ background: "var(--accent)", color: "var(--accent-contrast)", borderRadius: "var(--radius)" }}
          >
            {s.phoneNext}
          </div>
          <div className="surface p-3 flex items-center justify-between text-sm">
            <span className="muted">{s.phoneAhead}</span>
            <span className="font-extrabold">{s.phoneAheadNum}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingContent({ banner }: { banner: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ar");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && LOCALES.some((l) => l.code === saved)) setLocale(saved);
  }, []);

  const pick = (l: Locale) => {
    setLocale(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* تجاهل */
    }
  };

  const meta = LOCALES.find((l) => l.code === locale)!;
  const s = T[locale];
  const fontFamily =
    locale === "hi" ? "var(--font-deva)" : locale === "bn" ? "var(--font-bengali)" : undefined;

  return (
    <div dir={meta.rtl ? "rtl" : "ltr"} lang={locale} style={{ fontFamily }} className="theme-general">
      {/* ===== شريط علوي: العلامة + مبدّل اللغة ===== */}
      <header className="sticky top-0 z-30 backdrop-blur" style={{ background: "color-mix(in srgb, var(--bg) 80%, transparent)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
          <span className="text-2xl font-extrabold" style={{ color: "var(--accent)" }}>{s.brand}</span>
          <div className="flex gap-1 p-1 rounded-full" style={{ background: "var(--surface-2)" }}>
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => pick(l.code)}
                aria-pressed={locale === l.code}
                className="px-3 py-1 rounded-full text-sm font-bold transition-colors"
                style={
                  locale === l.code
                    ? { background: "var(--accent)", color: "var(--accent-contrast)" }
                    : { color: "var(--text-muted)" }
                }
              >
                {l.short}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="landing-hero-bg relative overflow-hidden px-6 pt-8 pb-20">
        <span className="blob" style={{ width: 280, height: 280, background: "var(--accent)", top: -60, insetInlineStart: -60 }} />
        <span className="blob" style={{ width: 220, height: 220, background: "#22d3ee", bottom: -40, insetInlineEnd: -30, opacity: 0.35 }} />

        <div className="w-full max-w-5xl mx-auto relative">
          <div className="max-w-md mx-auto mb-6">{banner}</div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center md:items-start text-center md:text-start gap-5 fade-up">
              <span className="badge-pill">{s.badge}</span>
              <h1 className="text-6xl font-extrabold" style={{ color: "var(--accent)" }}>{s.brand}</h1>
              <p className="text-xl font-bold">{s.tagline}</p>
              <p className="muted text-lg leading-relaxed max-w-md">{s.heroLead}</p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link href="/register" className="btn-accent py-4 px-8 text-lg no-underline text-center">
                  {s.ctaPrimary}
                </Link>
                <Link href="/login" className="surface py-4 px-8 font-bold no-underline text-center">
                  {s.ctaSecondary}
                </Link>
              </div>
            </div>

            <div className="fade-up pt-6 md:pt-0">
              <PhoneMock s={s} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== كيف يعمل ===== */}
      <section className="px-6 py-16">
        <div className="w-full max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-2">{s.howTitle}</h2>
          <p className="muted text-center mb-12">{s.howLead}</p>
          <div className="grid md:grid-cols-3 gap-6">
            {s.steps.map((st, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <div key={i} className="surface lift p-7 flex flex-col items-center text-center gap-4 relative">
                  <div className="step-num">{i + 1}</div>
                  <span style={{ color: "var(--accent)" }}><Icon /></span>
                  <h3 className="font-extrabold text-lg">{st.title}</h3>
                  <p className="muted text-sm leading-relaxed">{st.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== لماذا دورك ===== */}
      <section className="px-6 py-16" style={{ background: "var(--surface-2)" }}>
        <div className="w-full max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-12">{s.whyTitle}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {s.features.map((f, i) => {
              const Icon = FEATURE_ICONS[i];
              return (
                <div key={i} className="surface lift p-6 flex flex-col gap-3">
                  <div className="feature-icon-grad"><Icon /></div>
                  <h3 className="font-extrabold">{f.title}</h3>
                  <p className="muted text-sm leading-relaxed">{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== لمن دورك ===== */}
      <section className="px-6 py-16">
        <div className="w-full max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-8">{s.audienceTitle}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {s.audience.map((a) => (
              <span key={a} className="chip">{a}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== دعوة ختامية ===== */}
      <section className="px-6 pb-20">
        <div className="w-full max-w-3xl mx-auto landing-cta-bg relative overflow-hidden p-10 md:p-16 text-center flex flex-col items-center gap-4">
          <span className="blob" style={{ width: 200, height: 200, background: "#fff", top: -70, insetInlineEnd: -50, opacity: 0.12 }} />
          <h2 className="text-3xl md:text-4xl font-extrabold relative">{s.ctaFinalTitle}</h2>
          <p className="text-lg opacity-90 max-w-md relative">{s.ctaFinalBody}</p>
          <Link
            href="/register"
            className="no-underline py-4 px-10 text-lg font-extrabold mt-2 relative"
            style={{ background: "var(--accent-contrast)", color: "var(--accent)", borderRadius: "var(--radius)" }}
          >
            {s.ctaFinalBtn}
          </Link>
        </div>
      </section>

      <footer className="px-6 py-8 text-center">
        <p className="font-extrabold" style={{ color: "var(--accent)" }}>{s.brand}</p>
        <p className="muted text-sm mt-1">{s.footerTagline}</p>
      </footer>
    </div>
  );
}
