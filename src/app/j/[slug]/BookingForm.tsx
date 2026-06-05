"use client";

import { useActionState } from "react";
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
  const showServicePicker = allowServiceChoice && services.length > 1;
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
        <input type="hidden" name="serviceId" value={services[0]?.id ?? ""} />
      ) : (
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm">الخدمة المطلوبة</label>
          <select name="serviceId" required defaultValue="" className="input-field px-4 py-3 text-lg">
            <option value="" disabled>
              اختر الخدمة
            </option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (~{s.duration} د)
              </option>
            ))}
          </select>
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
