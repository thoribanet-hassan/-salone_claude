"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LOCALES, type Locale } from "../landing-i18n";
import { G } from "./guide-i18n";
import { StagesDemo, QueueDemo, FlowDemo } from "./GuideDemos";

const STORAGE_KEY = "dawrak_lang"; // نفس مفتاح صفحة الهبوط — اختيار لغة موحّد

export default function GuideContent() {
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
  const g = G[locale];
  const fontFamily =
    locale === "hi" ? "var(--font-deva)" : locale === "bn" ? "var(--font-bengali)" : undefined;

  const renderDemo = (kind?: string, caption?: string) => {
    if (!kind) return null;
    const node =
      kind === "flow" ? (
        <FlowDemo items={g.flow} />
      ) : kind === "stages" ? (
        <StagesDemo stages={g.stages} ticketLabel={g.ticketLabel} ticketNum={g.ticketNum} aheadLabel={g.aheadLabel} />
      ) : (
        <QueueDemo nowServing={g.nowServing} coming={g.coming} />
      );
    return (
      <div className="rounded-2xl p-5 flex flex-col items-center gap-3" style={{ background: "var(--surface-2)" }}>
        <div className="w-full flex justify-center">{node}</div>
        {caption && <p className="muted text-xs text-center">▶︎ {caption}</p>}
      </div>
    );
  };

  return (
    <div dir={meta.rtl ? "rtl" : "ltr"} lang={locale} style={{ fontFamily }} className="theme-general min-h-screen">
      {/* شريط علوي: مبدّل اللغة */}
      <header className="sticky top-0 z-30 backdrop-blur" style={{ background: "color-mix(in srgb, var(--bg) 80%, transparent)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold no-underline" style={{ color: "var(--accent)" }}>
            {locale === "ar" ? "دورك" : "Dawrak"}
          </Link>
          <div className="flex gap-1 p-1 rounded-full" style={{ background: "var(--surface-2)" }}>
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => pick(l.code)}
                aria-pressed={locale === l.code}
                className="px-3 py-1 rounded-full text-sm font-bold transition-colors"
                style={locale === l.code ? { background: "var(--accent)", color: "var(--accent-contrast)" } : { color: "var(--text-muted)" }}
              >
                {l.short}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="w-full max-w-2xl mx-auto px-5 py-8 flex flex-col gap-6">
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold" style={{ color: "var(--accent)" }}>{g.title}</h1>
          <p className="muted">{g.subtitle}</p>
        </div>

        {/* فهرس */}
        <nav className="surface p-5">
          <p className="font-extrabold mb-2">{g.toc}</p>
          <ol className="flex flex-col gap-1 text-sm">
            {g.sections.map((s, i) => (
              <li key={i}>
                <a href={`#s${i + 1}`} className="no-underline" style={{ color: "var(--accent)" }}>
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {g.sections.map((s, i) => (
          <section key={i} id={`s${i + 1}`} className="surface p-6 flex flex-col gap-3 scroll-mt-20">
            <div className="flex items-center gap-3">
              <span className="step-num">{i + 1}</span>
              <h2 className="text-xl font-extrabold">{s.title}</h2>
            </div>
            {s.paras.map((p, j) => (
              <p key={j} className="leading-relaxed">{p}</p>
            ))}
            {s.bullets && (
              <ul className="flex flex-col gap-2 text-sm leading-relaxed list-disc ps-5">
                {s.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            )}
            {renderDemo(s.demo, s.demoCaption)}
            {s.tip && (
              <p className="text-sm rounded-xl p-3" style={{ background: "var(--surface-2)", borderInlineStart: "3px solid var(--accent)" }}>
                💡 {s.tip}
              </p>
            )}
          </section>
        ))}

        <div className="surface p-6 text-center flex flex-col items-center gap-3">
          <p className="font-extrabold text-lg">{g.ctaTitle}</p>
          <Link href="/register" className="btn-accent py-3 px-8 no-underline">{g.ctaBtn}</Link>
          <Link href="/dashboard" className="muted text-sm no-underline">{g.ctaDash}</Link>
        </div>

        <p className="muted text-center text-xs">{g.footer}</p>
      </div>
    </div>
  );
}
