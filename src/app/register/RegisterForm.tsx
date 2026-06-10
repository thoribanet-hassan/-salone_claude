"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerAction, type RegisterState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-accent w-full py-4 text-lg mt-2">
      {pending ? "جارٍ الإنشاء…" : "إنشاء المنشأة والدخول"}
    </button>
  );
}

export default function RegisterForm() {
  const [state, formAction] = useActionState<RegisterState, FormData>(registerAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm">نوع المنشأة</label>
        <input
          name="facilityLabel"
          required
          placeholder="اكتب نوعها: حلاق، صالون نسائي، مطعم، عيادة، كوفي، مستوصف…"
          className="input-field px-4 py-3 text-lg"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm">اسم المنشأة</label>
        <input name="shopName" required placeholder="مثال: صالون النخبة / مطعم الذوّاقة" className="input-field px-4 py-3 text-lg" />
      </div>
      <p className="muted text-xs -mt-2">كل التفاصيل الأخرى (الموظفون، نظام الزمن، المواعيد…) تُضبط لاحقاً من لوحة التحكم.</p>
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
