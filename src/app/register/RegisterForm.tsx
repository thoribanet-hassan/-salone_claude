"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerAction, type RegisterState } from "./actions";

const TYPES = [
  { value: "male_barber", label: "حلاق رجالي", icon: "💈" },
  { value: "female_salon", label: "صالون تجميل نسائي", icon: "💅" },
  { value: "general", label: "مكان مزدحم (طابور عام)", icon: "🎫" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-accent w-full py-4 text-lg mt-2">
      {pending ? "جارٍ الإنشاء…" : "إنشاء المحل والدخول"}
    </button>
  );
}

export default function RegisterForm() {
  const [type, setType] = useState("male_barber");
  const [state, formAction] = useActionState<RegisterState, FormData>(registerAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="facilityType" value={type} />

      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm">نوع المنشأة</label>
        <div className="grid grid-cols-1 gap-2">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className="flex items-center gap-3 px-4 py-3 text-right rounded-xl border-2 transition"
              style={{
                borderColor: type === t.value ? "var(--accent)" : "var(--border)",
                background: type === t.value ? "var(--surface-2)" : "transparent",
              }}
            >
              <span className="text-2xl">{t.icon}</span>
              <span className="font-bold">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm">اسم المحل</label>
        <input name="shopName" required placeholder="مثال: صالون النخبة" className="input-field px-4 py-3 text-lg" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm">اسم المالك</label>
        <input name="ownerName" required placeholder="اسمك" className="input-field px-4 py-3 text-lg" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm">البريد الإلكتروني (للدخول)</label>
        <input name="email" type="email" required placeholder="you@example.com" className="input-field px-4 py-3 text-lg" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm">كلمة المرور</label>
        <input name="password" type="password" required minLength={6} placeholder="٦ أحرف على الأقل" className="input-field px-4 py-3 text-lg" />
      </div>

      {state.error && <p className="text-red-400 text-sm font-bold text-center">{state.error}</p>}

      <SubmitButton />
    </form>
  );
}
