"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "./actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-accent w-full py-4 text-lg mt-2">
      {pending ? "جارٍ الدخول…" : label}
    </button>
  );
}

export default function LoginForm() {
  const [mode, setMode] = useState<"manager" | "barber">("manager");
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <div className="flex flex-col gap-5">
      {/* اختيار الدور */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMode("manager")}
          className={mode === "manager" ? "btn-accent py-3 font-bold" : "surface py-3 font-bold"}
        >
          مدير
        </button>
        <button
          type="button"
          onClick={() => setMode("barber")}
          className={mode === "barber" ? "btn-accent py-3 font-bold" : "surface py-3 font-bold"}
        >
          موظف
        </button>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="mode" value={mode} />

        {mode === "manager" ? (
          <>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">البريد الإلكتروني</label>
              <input name="email" type="email" autoComplete="email" placeholder="you@example.com" className="input-field px-4 py-3 text-lg" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">كلمة المرور</label>
              <input name="password" type="password" autoComplete="current-password" placeholder="••••••••" className="input-field px-4 py-3 text-lg" />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">رمز المحل</label>
              <input name="shopCode" placeholder="QS-1001" className="input-field px-4 py-3 text-lg" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">رمز الدخول</label>
              <input name="loginCode" inputMode="numeric" placeholder="1111" className="input-field px-4 py-3 text-lg" />
            </div>
          </>
        )}

        {state.error && <p className="text-red-400 text-sm font-bold text-center">{state.error}</p>}

        <SubmitButton label={mode === "manager" ? "دخول المدير" : "دخول الموظف"} />
      </form>
    </div>
  );
}
