"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  playPattern,
  reminderPatternFor,
  playTurnChime,
  playCountdownStartAlert,
  playReadyUpdateChime,
} from "@/lib/sound";

const REMINDER_MS = 5 * 60 * 1000; // تنبيه كل 5 دقائق

interface State {
  found: boolean;
  ticketNumber: number;
  customerName: string;
  status: "waiting" | "serving" | "skipped" | "completed" | "cancelled";
  peopleAhead: number;
  remainingMinutes: number;
  remainingSeconds: number;
  countdownActive: boolean;
  readyAtMs: number | null;
  serviceName: string | null;
  barberName: string | null;
  headline: string;
  settings: {
    showExpectedTime: boolean;
    showPeopleAhead: boolean;
    showBarberName: boolean;
    showCountdown: boolean;
  };
  shopName: string;
}

const POLL_MS = 5000;

function fmt(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function TicketView({
  token,
  initial,
}: {
  token: string;
  initial: State;
}) {
  const [state, setState] = useState<State>(initial);
  const [secondsLeft, setSecondsLeft] = useState<number>(initial.remainingSeconds);
  const [online, setOnline] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const inFlight = useRef(false);

  // صوت: AudioContext + لقطة حيّة من حالة الطابور لقراءتها داخل المؤقّت
  const ctxRef = useRef<AudioContext | null>(null);
  const liveRef = useRef({ remainingMinutes: initial.remainingMinutes, peopleAhead: initial.peopleAhead });
  const prevStatusRef = useRef(initial.status);
  const prevCountdownActiveRef = useRef(initial.countdownActive);
  const prevReadyAtMsRef = useRef(initial.readyAtMs);
  liveRef.current = { remainingMinutes: state.remainingMinutes, peopleAhead: state.peopleAhead };

  // العدّاد يُثبّت على لحظة هدف ليتناقص بسلاسة، ويُعاد ضبطه فقط حين تتغيّر تقدير الخادم
  // (وإلا كان يقفز للأعلى كل مزامنة لأن "مجموع المدد" ثابت لا يتناقص مع الوقت)
  const targetRef = useRef<number>(0);
  const lastServerSecRef = useRef<number>(initial.remainingSeconds);

  // تفعيل الصوت (يتطلب تفاعل المستخدم بسبب سياسة المتصفح)
  const toggleSound = useCallback(() => {
    if (soundOn) {
      setSoundOn(false);
      return;
    }
    type AC = typeof AudioContext;
    const Ctor: AC | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: AC }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = ctxRef.current ?? new Ctor();
    ctxRef.current = ctx;
    void ctx.resume();
    playPattern(ctx, { freq: 880, count: 1, volume: 0.2 }); // نغمة تأكيد التفعيل
    setSoundOn(true);
  }, [soundOn]);

  // مزامنة كاملة مع قاعدة البيانات — يُعاد ضبط العدّاد من قيمة الخادم (لا يُبنى تراكمياً)
  const resync = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const res = await fetch(`/api/t/${token}`, { cache: "no-store" });
      if (res.ok) {
        const data: State = await res.json();
        setState(data);
        // أعد تثبيت الهدف فقط إذا تغيّر تقدير الخادم (تحرّك الطابور) — وإلا اترك العدّاد يكمل تناقصه
        if (data.remainingSeconds !== lastServerSecRef.current) {
          lastServerSecRef.current = data.remainingSeconds;
          targetRef.current = Date.now() + data.remainingSeconds * 1000;
        }
        setOnline(true);
      }
    } catch {
      setOnline(false);
    } finally {
      inFlight.current = false;
    }
  }, [token]);

  // polling دوري احتياطي
  useEffect(() => {
    const id = setInterval(resync, POLL_MS);
    return () => clearInterval(id);
  }, [resync]);

  // تثبيت لحظة الهدف عند أول تحميل
  useEffect(() => {
    targetRef.current = Date.now() + initial.remainingSeconds * 1000;
  }, [initial.remainingSeconds]);

  // العدّاد التنازلي الحي — يُحسب من لحظة الهدف الثابتة (يتناقص فعلياً مع الوقت)
  useEffect(() => {
    if (state.status !== "waiting") return;
    const tick = () =>
      setSecondsLeft(Math.max(0, Math.round((targetRef.current - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [state.status]);

  // تنبيه صوتي كل 5 دقائق أثناء الانتظار — تتصاعد النغمة كلما اقترب الدور
  useEffect(() => {
    if (!soundOn || state.status !== "waiting") return;
    const id = setInterval(() => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      const { remainingMinutes, peopleAhead } = liveRef.current;
      playPattern(ctx, reminderPatternFor(remainingMinutes, peopleAhead));
    }, REMINDER_MS);
    return () => clearInterval(id);
  }, [soundOn, state.status]);

  // نغمة "حان دورك" المميّزة عند انتقال الحالة إلى serving
  useEffect(() => {
    if (prevStatusRef.current !== "serving" && state.status === "serving" && soundOn && ctxRef.current) {
      playTurnChime(ctxRef.current);
    }
    prevStatusRef.current = state.status;
  }, [state.status, soundOn]);

  // تنبيه قوي عند بدء العدّاد اليدوي لأول مرة (مطعم: لم يكن هناك وقت سابق)
  useEffect(() => {
    const firstActivation =
      !prevCountdownActiveRef.current &&
      state.countdownActive &&
      state.status === "waiting" &&
      prevReadyAtMsRef.current == null &&
      state.readyAtMs == null; // عدّاد تلقائي بدأ، لا تحديد يدوي
    if (firstActivation) {
      if (soundOn && ctxRef.current) playCountdownStartAlert(ctxRef.current);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.([200, 100, 200, 100, 300]);
      }
    }
    prevCountdownActiveRef.current = state.countdownActive;
  }, [state.countdownActive, state.status, soundOn]);

  // 🆕 نغمة فريدة عندما يحدّد/يقلّص الموظف وقت الجاهزية (إنهاء مبكر) — في كل الأوضاع
  useEffect(() => {
    const readyChanged =
      state.readyAtMs != null &&
      state.readyAtMs !== prevReadyAtMsRef.current &&
      state.status === "waiting";
    if (readyChanged) {
      if (soundOn && ctxRef.current) playReadyUpdateChime(ctxRef.current);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.([120, 80, 120]);
      }
    }
    prevReadyAtMsRef.current = state.readyAtMs;
  }, [state.readyAtMs, state.status, soundOn]);

  // إعادة مزامنة فورية عند عودة الاتصال أو عودة التبويب للواجهة
  useEffect(() => {
    const onOnline = () => {
      setOnline(true);
      resync();
    };
    const onOffline = () => setOnline(false);
    const onVisible = () => {
      if (document.visibilityState === "visible") resync();
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [resync]);

  const s = state;
  const isServing = s.status === "serving";
  const isDone = s.status === "completed" || s.status === "cancelled";
  const isWaiting = s.status === "waiting";
  // العدّاد يظهر فقط إن كان فعّالاً (في الوضع اليدوي لا يبدأ إلا بإطلاق المدير)
  const showCountdown = s.settings.showCountdown && s.countdownActive && !isServing && !isDone;
  const waitingNoTimer = isWaiting && !s.countdownActive;

  return (
    <div className="w-full max-w-md flex flex-col gap-6">
      {!online && (
        <div
          className="text-center text-sm font-bold py-2 rounded-lg"
          style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
        >
          إعادة الاتصال…
        </div>
      )}

      <header className="text-center mt-2">
        <p className="muted text-sm">{s.shopName}</p>
      </header>

      {!isServing && !isDone && (
        <button
          onClick={toggleSound}
          className="surface py-3 font-bold text-sm"
          aria-pressed={soundOn}
        >
          {soundOn ? "🔔 التنبيه الصوتي مُفعّل (إيقاف)" : "🔕 فعّل التنبيه الصوتي"}
        </button>
      )}

      <div className="surface p-7 text-center flex flex-col items-center gap-2">
        <p className="muted text-sm">رقم تذكرتك</p>
        <p className="text-7xl font-extrabold" style={{ color: "var(--accent)" }}>
          {s.ticketNumber}
        </p>
        <p className="font-bold mt-1">{s.customerName}</p>
        {s.serviceName && <p className="muted text-sm">{s.serviceName}</p>}
      </div>

      {/* العدّاد التنازلي الحي — العنصر المحوري */}
      {showCountdown &&
        (secondsLeft <= 0 ? (
          <div className="surface p-7 text-center" style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}>
            <p className="text-3xl font-extrabold">أنت التالي — تجهّز 🎉</p>
          </div>
        ) : (
          <div className="surface p-7 text-center flex flex-col items-center gap-1">
            <p className="muted text-sm">الوقت المتبقي لدورك (تقريبي)</p>
            <p className="text-6xl font-extrabold tabular-nums" style={{ color: "var(--accent)" }}>
              {fmt(secondsLeft)}
            </p>
            <p className="muted text-xs">دقيقة : ثانية</p>
          </div>
        ))}

      <div
        className="surface p-6 text-center"
        style={
          isServing
            ? { background: "var(--accent)", color: "var(--accent-contrast)" }
            : undefined
        }
      >
        <p className="text-xl font-extrabold">{s.headline}</p>
      </div>

      {!isServing && !isDone && (
        <div className="grid grid-cols-1 gap-3">
          {s.settings.showPeopleAhead && (
            <div className="surface p-5 flex items-center justify-between">
              <span className="muted">عدد الأشخاص قبلك</span>
              <span className="text-2xl font-extrabold">{s.peopleAhead}</span>
            </div>
          )}
          {s.settings.showExpectedTime && s.countdownActive && (
            <div className="surface p-5 flex items-center justify-between">
              <span className="muted">الوقت المتوقع</span>
              <span className="text-2xl font-extrabold">
                ~{s.remainingMinutes} <span className="text-base font-normal">دقيقة</span>
              </span>
            </div>
          )}
          {s.settings.showBarberName && s.barberName && (
            <div className="surface p-5 flex items-center justify-between">
              <span className="muted">مزوّد الخدمة</span>
              <span className="text-lg font-bold">{s.barberName}</span>
            </div>
          )}
        </div>
      )}

      <p className="muted text-center text-xs">
        تحدّث هذه الشاشة تلقائياً — لا حاجة لإعادة التحميل
      </p>
    </div>
  );
}
