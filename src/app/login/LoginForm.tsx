"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "./actions";
import type { AuthMsgs } from "@/i18n/auth";

function SubmitButton({ label, loading }: { label: string; loading: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-accent w-full py-4 text-lg mt-2">
      {pending ? loading : label}
    </button>
  );
}

export default function LoginForm({ t }: { t: AuthMsgs }) {
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
          {t.tabManager}
        </button>
        <button
          type="button"
          onClick={() => setMode("barber")}
          className={mode === "barber" ? "btn-accent py-3 font-bold" : "surface py-3 font-bold"}
        >
          {t.tabStaff}
        </button>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="mode" value={mode} />

        {mode === "manager" ? (
          <>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">{t.email}</label>
              <input name="email" type="email" autoComplete="email" placeholder="you@example.com" className="input-field px-4 py-3 text-lg" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">{t.password}</label>
              <input name="password" type="password" autoComplete="current-password" placeholder="••••••••" className="input-field px-4 py-3 text-lg" />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">{t.shopCode}</label>
              <input name="shopCode" placeholder="QS-1001" className="input-field px-4 py-3 text-lg" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">{t.loginCode}</label>
              <input name="loginCode" inputMode="numeric" placeholder="1111" className="input-field px-4 py-3 text-lg" />
            </div>
          </>
        )}

        {state.error && <p className="text-red-400 text-sm font-bold text-center">{state.error}</p>}

        <SubmitButton label={mode === "manager" ? t.loginManager : t.loginStaff} loading={t.loggingIn} />
      </form>
    </div>
  );
}
