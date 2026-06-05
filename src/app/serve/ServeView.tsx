"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  callNextAction,
  completeAction,
  skipAction,
  toggleStatusAction,
  markReadyAction,
  restoreAction,
} from "./actions";

interface Current {
  ticketNumber: number;
  customerName: string;
  serviceName: string | null;
}

interface Skipped {
  id: string;
  ticketNumber: number;
  customerName: string;
}

interface Props {
  theme: string;
  shopName: string;
  barberName: string;
  role: "manager" | "barber";
  status: "available" | "unavailable" | "busy";
  isManual: boolean;
  waitingCount: number;
  current: Current | null;
  skipped?: Skipped[];
  embedded?: boolean; // داخل لوحة المدير: نخفي الترويسة والخروج
}

export default function ServeView(props: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  // تحديث دوري خفيف ليرى الحلاق تغيّر الطابور
  useEffect(() => {
    const id = setInterval(() => router.refresh(), 8000);
    return () => clearInterval(id);
  }, [router]);

  const run = (fn: () => Promise<{ error?: string } | void>) =>
    start(async () => {
      const r = await fn();
      setMsg(r && "error" in r && r.error ? r.error : null);
      router.refresh();
    });

  const isServing = !!props.current;
  const isAvailable = props.status === "available";

  return (
    <div className="w-full max-w-md flex flex-col gap-5">
      {!props.embedded && (
        <header className="text-center mt-1">
          <p className="muted text-sm">{props.shopName}</p>
          <h1 className="text-xl font-extrabold">{props.barberName}</h1>
          {props.role === "manager" && (
            <a href="/dashboard" className="muted text-xs underline">
              ← لوحة التحكم
            </a>
          )}
        </header>
      )}

      {/* حالة الموظف */}
      <div className="surface p-4 flex items-center justify-between">
        <span className="font-bold">حالتك</span>
        <button
          disabled={pending || isServing}
          onClick={() => run(() => toggleStatusAction(isAvailable ? "unavailable" : "available"))}
          className="px-4 py-2 rounded-lg font-bold"
          style={{
            background: isAvailable ? "var(--accent)" : "var(--surface-2)",
            color: isAvailable ? "var(--accent-contrast)" : "var(--text-muted)",
          }}
        >
          {props.status === "busy" ? "مشغول" : isAvailable ? "متاح ✓" : "غير متاح"}
        </button>
      </div>

      {/* العميل الحالي */}
      {isServing ? (
        <div className="surface p-6 text-center" style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}>
          <p className="text-sm opacity-80">العميل الحالي</p>
          <p className="text-5xl font-extrabold my-1">#{props.current!.ticketNumber}</p>
          <p className="font-bold text-lg">{props.current!.customerName}</p>
          {props.current!.serviceName && <p className="text-sm opacity-90">{props.current!.serviceName}</p>}
        </div>
      ) : (
        <div className="surface p-6 text-center">
          <p className="muted">لا يوجد عميل قيد الخدمة</p>
          <p className="text-3xl font-extrabold mt-2">{props.waitingCount}</p>
          <p className="muted text-sm">في الانتظار</p>
        </div>
      )}

      {msg && <p className="text-red-400 text-sm font-bold text-center">{msg}</p>}

      {/* الأزرار الكبيرة (لمس) */}
      <div className="grid grid-cols-1 gap-3">
        {isServing ? (
          <>
            <button disabled={pending} onClick={() => run(completeAction)} className="btn-accent py-5 text-xl">
              ✓ إنهاء الخدمة
            </button>
            <button disabled={pending} onClick={() => run(skipAction)} className="surface py-4 text-lg font-bold">
              تخطّي العميل
            </button>
          </>
        ) : (
          <button
            disabled={pending || !isAvailable}
            onClick={() => run(callNextAction)}
            className="btn-accent py-6 text-2xl"
          >
            العميل التالي ←
          </button>
        )}

        {/* الوضع اليدوي (مطعم): إطلاق عدّاد العميل التالي */}
        {props.isManual && (
          <div className="surface p-4 mt-1">
            <p className="font-bold text-sm mb-2">طاولة ستفرغ قريباً؟ نبّه العميل التالي:</p>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map((m) => (
                <button
                  key={m}
                  disabled={pending}
                  onClick={() => run(() => markReadyAction(m))}
                  className="surface py-3 font-bold"
                  style={{ background: "var(--surface-2)" }}
                >
                  {m} دقيقة
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* العملاء المتخطّون — مع إمكانية الإعادة */}
      {props.skipped && props.skipped.length > 0 && (
        <div className="surface p-4">
          <p className="font-bold text-sm mb-2">عملاء تم تخطّيهم اليوم</p>
          <div className="flex flex-col gap-2">
            {props.skipped.map((t) => (
              <div key={t.id} className="flex items-center justify-between" style={{ background: "var(--surface-2)", borderRadius: 8, padding: "8px 12px" }}>
                <span className="text-sm">
                  <span className="font-bold">#{t.ticketNumber}</span> {t.customerName}
                </span>
                <button
                  disabled={pending}
                  onClick={() => run(() => restoreAction(t.id))}
                  className="px-3 py-1 rounded font-bold text-sm"
                  style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
                >
                  إعادة للطابور
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!props.embedded && (
        <a href="/api/logout" className="muted text-center text-xs underline mt-2">
          تسجيل الخروج
        </a>
      )}
    </div>
  );
}
