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

interface SlotOption {
  time: string; // "HH:MM"
  label: string;
  available: boolean;
  past: boolean;
}

interface Props {
  slug: string;
  barbers: BarberOption[];
  services: ServiceOption[];
  showProviderChoice: boolean;
  allowServiceChoice: boolean;
  allowScheduling: boolean; // السماح بالحجز في ساعة معينة (من لوحة التحكم)
  slots: SlotOption[]; // خانات المواعيد المتاحة وغير المتاحة
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

export default function BookingForm({ slug, barbers, services, showProviderChoice, allowServiceChoice, allowScheduling, slots, showPrices }: Props) {
  // تظهر كل الخدمات النشطة للاختيار (حتى لو واحدة). تُخفى فقط إن عطّل المدير اختيار الخدمة.
  const showServicePicker = allowServiceChoice && services.length >= 1;
  const [selected, setSelected] = useState<string[]>(
    services.length === 1 ? services.map((s) => s.id) : []
  );
  const chosen = services.filter((s) => selected.includes(s.id));
  const totalMin = chosen.reduce((sum, s) => sum + s.duration, 0);
  const totalPrice = chosen.reduce((sum, s) => sum + s.price, 0);
  const [whenMode, setWhenMode] = useState<"now" | "scheduled">("now");
  // الخانة الزمنية المختارة (HH:MM) — تُرسل في النموذج
  const [slotTime, setSlotTime] = useState<string>("");
  const hasFreeSlot = slots.some((s) => s.available);
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

      {/* وقت الحضور: الآن أو موعد محدّد — يظهر فقط إن فعّل المدير المواعيد */}
      {!allowScheduling && <input type="hidden" name="whenMode" value="now" />}
      {allowScheduling && (
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
            <input type="hidden" name="scheduledTime" value={slotTime} />
            {slots.length === 0 ? (
              <p className="muted text-sm text-center py-3">
                لا تتوفّر مواعيد اليوم — اختر «الآن مباشرة».
              </p>
            ) : !hasFreeSlot ? (
              <p className="text-sm text-center py-3 font-bold" style={{ color: "var(--accent)" }}>
                كل مواعيد اليوم محجوزة — جرّب «الآن مباشرة».
              </p>
            ) : (
              <>
                <p className="muted text-xs">اختر موعداً متاحاً (المحجوزة معطّلة):</p>
                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1">
                  {slots.map((s) => {
                    const on = slotTime === s.time;
                    return (
                      <button
                        key={s.time}
                        type="button"
                        disabled={!s.available}
                        onClick={() => setSlotTime(s.time)}
                        title={s.available ? "" : s.past ? "مضى وقته" : "محجوز"}
                        className="py-2 rounded-xl border-2 font-bold text-sm"
                        style={{
                          borderColor: on ? "var(--accent)" : "var(--border)",
                          background: on ? "var(--accent)" : "transparent",
                          color: on
                            ? "var(--accent-contrast)"
                            : s.available
                              ? "var(--text)"
                              : "var(--text-muted)",
                          opacity: s.available ? 1 : 0.4,
                          textDecoration: s.available ? "none" : "line-through",
                          cursor: s.available ? "pointer" : "not-allowed",
                        }}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
                {slotTime && (
                  <p className="text-sm font-bold text-center" style={{ color: "var(--accent)" }}>
                    موعدك: {slots.find((s) => s.time === slotTime)?.label}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
      )}

      {state.error && (
        <p className="text-red-400 text-sm font-bold text-center">{state.error}</p>
      )}

      <SubmitButton />
    </form>
  );
}
