"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { createBookingAction, type BookingState } from "./actions";

interface BarberOption {
  id: string;
  name: string;
}

interface ServiceOption {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface Props {
  slug: string;
  barbers: BarberOption[];
  services: ServiceOption[];
  showProviderChoice: boolean;
  allowServiceChoice: boolean;
  showPrices: boolean;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-accent w-full py-4 text-lg mt-2">
      {pending ? "جارٍ الحجز…" : "احجز دوري الآن"}
    </button>
  );
}

export default function BookingForm({ slug, barbers, services, showProviderChoice, allowServiceChoice, showPrices }: Props) {
  // تظهر كل الخدمات النشطة للاختيار (حتى لو واحدة). تُخفى فقط إن عطّل المدير اختيار الخدمة.
  const showServicePicker = allowServiceChoice && services.length >= 1;
  const [selected, setSelected] = useState<string[]>(
    services.length === 1 ? services.map((s) => s.id) : []
  );
  const chosen = services.filter((s) => selected.includes(s.id));
  const totalMin = chosen.reduce((sum, s) => sum + s.duration, 0);
  const totalPrice = chosen.reduce((sum, s) => sum + s.price, 0);
  const [whenMode, setWhenMode] = useState<"now" | "scheduled">("now");
  // منتقي وقت سهل: ساعة (1-12) + دقيقة + قبل/بعد الظهر
  const [apptH, setApptH] = useState(4);
  const [apptM, setApptM] = useState("00");
  const [apptPeriod, setApptPeriod] = useState<"am" | "pm">("pm");
  const apptH24 = apptPeriod === "am" ? apptH % 12 : (apptH % 12) + 12;
  const scheduledTime24 = `${String(apptH24).padStart(2, "0")}:${apptM}`;
  const toggle = (id: string) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  const [state, formAction] = useActionState<BookingState, FormData>(
    createBookingAction,
    {}
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="slug" value={slug} />

      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm">اسمك</label>
        <input
          name="customerName"
          required
          autoFocus
          placeholder="اكتب اسمك"
          className="input-field px-4 py-3 text-lg"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm">
          الجوال <span className="muted font-normal">(اختياري)</span>
        </label>
        <input
          name="customerPhone"
          type="tel"
          inputMode="tel"
          placeholder="05xxxxxxxx"
          className="input-field px-4 py-3 text-lg"
        />
      </div>

      {!showServicePicker ? (
        // خدمة واحدة أو الاختيار معطّل ← تُستخدم الأولى تلقائياً
        <input type="hidden" name="serviceIds" value={services[0]?.id ?? ""} />
      ) : (
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm">
            الخدمات المطلوبة <span className="muted font-normal">(يمكنك اختيار أكثر من واحدة)</span>
          </label>
          <div className="flex flex-col gap-2">
            {services.map((s) => {
              const on = selected.includes(s.id);
              return (
                <label
                  key={s.id}
                  className="flex items-center justify-between px-4 py-3 rounded-xl border-2 cursor-pointer"
                  style={{
                    borderColor: on ? "var(--accent)" : "var(--border)",
                    background: on ? "var(--surface-2)" : "transparent",
                  }}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="serviceIds"
                      value={s.id}
                      checked={on}
                      onChange={() => toggle(s.id)}
                      className="w-5 h-5"
                    />
                    <span className="font-bold">{s.name}</span>
                  </span>
                  <span className="muted text-sm">
                    ~{s.duration} د
                    {showPrices && s.price > 0 && (
                      <span style={{ color: "var(--accent)" }}> · {s.price} ريال</span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
          {totalMin > 0 && (
            <p className="text-sm font-bold" style={{ color: "var(--accent)" }}>
              الإجمالي التقريبي: ~{totalMin} دقيقة
              {showPrices && totalPrice > 0 && ` · ${totalPrice} ريال`}
            </p>
          )}
        </div>
      )}

      {showProviderChoice && (
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm">اختر مزوّد الخدمة</label>
          <select name="barberId" defaultValue="" className="input-field px-4 py-3 text-lg">
            <option value="">أول متاح (الأسرع)</option>
            {barbers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* وقت الحضور: الآن أو موعد محدّد */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm">وقت حضورك</label>
        <input type="hidden" name="whenMode" value={whenMode} />
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setWhenMode("now")}
            className="py-3 rounded-xl border-2 font-bold"
            style={{
              borderColor: whenMode === "now" ? "var(--accent)" : "var(--border)",
              background: whenMode === "now" ? "var(--surface-2)" : "transparent",
            }}
          >
            الآن مباشرة
          </button>
          <button
            type="button"
            onClick={() => setWhenMode("scheduled")}
            className="py-3 rounded-xl border-2 font-bold"
            style={{
              borderColor: whenMode === "scheduled" ? "var(--accent)" : "var(--border)",
              background: whenMode === "scheduled" ? "var(--surface-2)" : "transparent",
            }}
          >
            موعد محدّد
          </button>
        </div>
        {whenMode === "scheduled" && (
          <div className="flex flex-col gap-2 mt-1">
            {/* قبل / بعد الظهر */}
            <div className="grid grid-cols-2 gap-2">
              {([["am", "قبل الظهر ☀️"], ["pm", "بعد الظهر 🌙"]] as const).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setApptPeriod(v)}
                  className="py-3 rounded-xl border-2 font-bold"
                  style={{
                    borderColor: apptPeriod === v ? "var(--accent)" : "var(--border)",
                    background: apptPeriod === v ? "var(--surface-2)" : "transparent",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            {/* الساعة : الدقيقة */}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex flex-col gap-1">
                <span className="muted text-xs">الساعة</span>
                <select
                  value={apptH}
                  onChange={(e) => setApptH(parseInt(e.target.value, 10))}
                  className="input-field px-3 py-3 text-lg text-center"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
              <span className="text-2xl font-extrabold mt-4">:</span>
              <div className="flex-1 flex flex-col gap-1">
                <span className="muted text-xs">الدقيقة</span>
                <select
                  value={apptM}
                  onChange={(e) => setApptM(e.target.value)}
                  className="input-field px-3 py-3 text-lg text-center"
                >
                  {["00", "15", "30", "45"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-sm font-bold text-center" style={{ color: "var(--accent)" }}>
              موعدك: {apptH}:{apptM} {apptPeriod === "am" ? "قبل الظهر" : "بعد الظهر"}
            </p>
            <input type="hidden" name="scheduledTime" value={scheduledTime24} />
          </div>
        )}
      </div>

      {state.error && (
        <p className="text-red-400 text-sm font-bold text-center">{state.error}</p>
      )}

      <SubmitButton />
    </form>
  );
}
