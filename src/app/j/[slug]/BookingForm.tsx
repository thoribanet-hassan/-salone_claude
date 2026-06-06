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
}

interface Props {
  slug: string;
  barbers: BarberOption[];
  services: ServiceOption[];
  showProviderChoice: boolean;
  allowServiceChoice: boolean;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-accent w-full py-4 text-lg mt-2">
      {pending ? "جارٍ الحجز…" : "احجز دوري الآن"}
    </button>
  );
}

export default function BookingForm({ slug, barbers, services, showProviderChoice, allowServiceChoice }: Props) {
  // تظهر كل الخدمات النشطة للاختيار (حتى لو واحدة). تُخفى فقط إن عطّل المدير اختيار الخدمة.
  const showServicePicker = allowServiceChoice && services.length >= 1;
  const [selected, setSelected] = useState<string[]>(
    services.length === 1 ? services.map((s) => s.id) : []
  );
  const totalMin = services
    .filter((s) => selected.includes(s.id))
    .reduce((sum, s) => sum + s.duration, 0);
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
                  <span className="muted text-sm">~{s.duration} د</span>
                </label>
              );
            })}
          </div>
          {totalMin > 0 && (
            <p className="text-sm font-bold" style={{ color: "var(--accent)" }}>
              المدة الإجمالية التقريبية: ~{totalMin} دقيقة
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

      {state.error && (
        <p className="text-red-400 text-sm font-bold text-center">{state.error}</p>
      )}

      <SubmitButton />
    </form>
  );
}
