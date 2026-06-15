"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { playTurnChime } from "@/lib/sound";
import LangSwitcher from "@/components/LangSwitcher";
import type { Locale } from "@/lib/i18n";
import type { DisplayMsgs } from "@/i18n/misc";

interface State {
  found: boolean;
  shopName: string;
  facilityLabel: string;
  theme: string;
  isOpen: boolean;
  serving: { number: number; barber: string | null }[];
  imminent: number[];
  waiting: number[];
  syncedAt: number;
}

const POLL_MS = 5000;

export default function DisplayView({
  slug,
  initial,
  t,
  locale,
}: {
  slug: string;
  initial: State;
  t: DisplayMsgs;
  locale: Locale;
}) {
  const [state, setState] = useState<State>(initial);
  const [online, setOnline] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const [flash, setFlash] = useState<Set<number>>(new Set());
  const inFlight = useRef(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const prevServing = useRef<Set<number>>(new Set(initial.serving.map((s) => s.number)));
  const prevImminent = useRef<Set<number>>(new Set(initial.imminent));

  const ensureCtx = useCallback(() => {
    type AC = typeof AudioContext;
    const Ctor: AC | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: AC }).webkitAudioContext;
    if (!Ctor) return null;
    const ctx = ctxRef.current ?? new Ctor();
    ctxRef.current = ctx;
    void ctx.resume();
    return ctx;
  }, []);

  const resync = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const res = await fetch(`/api/display/${slug}`, { cache: "no-store" });
      if (res.ok) {
        const data: State = await res.json();
        // أرقام خدمة جديدة → وميض بطاقة + نغمة
        const nowServingSet = new Set(data.serving.map((s) => s.number));
        const freshServing = [...nowServingSet].filter((n) => !prevServing.current.has(n));
        // أرقام حان دورها جديدة (انتقلت للقسم الوامض) → نغمة تنبيه «استعد»
        const nowImminentSet = new Set(data.imminent);
        const freshImminent = data.imminent.filter((n) => !prevImminent.current.has(n));
        if (freshServing.length > 0) {
          setFlash(new Set(freshServing));
          setTimeout(() => setFlash(new Set()), 4000);
        }
        if ((freshServing.length > 0 || freshImminent.length > 0) && soundOn && ctxRef.current) {
          playTurnChime(ctxRef.current);
        }
        prevServing.current = nowServingSet;
        prevImminent.current = nowImminentSet;
        setState(data);
        setOnline(true);
      }
    } catch {
      setOnline(false);
    } finally {
      inFlight.current = false;
    }
  }, [slug, soundOn]);

  useEffect(() => {
    const id = setInterval(resync, POLL_MS);
    return () => clearInterval(id);
  }, [resync]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") resync();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [resync]);

  const toggleSound = () => {
    if (soundOn) {
      setSoundOn(false);
      return;
    }
    ensureCtx();
    setSoundOn(true);
  };

  const s = state;

  return (
    <div className="min-h-screen flex flex-col p-6 md:p-10">
      <header className="flex items-center justify-between mb-6">
        <div>
          <p className="muted text-lg md:text-2xl">{s.facilityLabel}</p>
          <h1 className="text-3xl md:text-5xl font-extrabold">{s.shopName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <LangSwitcher current={locale} />
          <button
            onClick={toggleSound}
            className="surface px-4 py-2 text-sm md:text-base font-bold"
            aria-pressed={soundOn}
            title={t.soundTitle}
          >
            {soundOn ? t.soundOn : t.soundOff}
          </button>
        </div>
      </header>

      {!online && (
        <div className="text-center text-base font-bold py-2 rounded-lg mb-4"
          style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}>
          {t.reconnecting}
        </div>
      )}

      {/* القسم العلوي الوامض: حان دورهم — استعدوا */}
      {s.imminent.length > 0 && (
        <section className="mb-6">
          <p className="text-2xl md:text-4xl font-extrabold mb-4" style={{ color: "var(--accent)" }}>
            🔔 {t.getReady}
          </p>
          <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 260px), 1fr))` }}>
            {s.imminent.map((n) => (
              <div
                key={n}
                className="display-flash rounded-3xl flex flex-col items-center justify-center py-8"
                style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
              >
                <p className="text-xl md:text-3xl font-bold mb-1">{t.numberWord}</p>
                <p className="font-extrabold leading-none" style={{ fontSize: "clamp(4.5rem, 16vw, 12rem)", color: "var(--accent-contrast)" }}>
                  {n}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* القسم السفلي: الآن يُخدَم */}
      <section className="flex-1 flex flex-col">
        <p className="text-xl md:text-3xl font-bold mb-4" style={{ color: "var(--accent)" }}>
          {t.nowServing}
        </p>
        {s.serving.length === 0 ? (
          <div className="surface flex-1 flex items-center justify-center min-h-[24vh]">
            <p className="muted text-2xl md:text-4xl font-bold">
              {s.isOpen ? t.waitingNext : t.closed}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 flex-1" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 320px), 1fr))` }}>
            {s.serving.map((srv) => {
              const isFresh = flash.has(srv.number);
              return (
                <div
                  key={srv.number}
                  className="surface flex flex-col items-center justify-center py-10 stage-card"
                  style={
                    isFresh
                      ? { background: "var(--accent)", color: "var(--accent-contrast)", borderColor: "var(--accent)" }
                      : undefined
                  }
                >
                  <p className="text-2xl md:text-4xl font-bold mb-2">{t.numberWord}</p>
                  <p className="font-extrabold leading-none" style={{ fontSize: "clamp(5rem, 18vw, 14rem)", color: isFresh ? "var(--accent-contrast)" : "var(--accent)" }}>
                    {srv.number}
                  </p>
                  {srv.barber && <p className="text-2xl md:text-3xl font-bold mt-3">{srv.barber}</p>}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* القادمون (بقية الطابور) */}
      {s.waiting.length > 0 && (
        <section className="mt-6">
          <p className="text-lg md:text-2xl font-bold mb-3 muted">{t.coming}</p>
          <div className="flex flex-wrap gap-3">
            {s.waiting.map((n, i) => (
              <div
                key={n}
                className="surface px-5 py-3 md:px-7 md:py-4 font-extrabold"
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 3rem)",
                  opacity: i === 0 ? 1 : Math.max(0.45, 1 - i * 0.12),
                }}
              >
                {n}
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="muted text-center text-sm mt-6">{t.autoUpdate}</p>
    </div>
  );
}
