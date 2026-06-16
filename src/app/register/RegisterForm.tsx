"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerAction, type RegisterState } from "./actions";
import type { AuthMsgs } from "@/i18n/auth";

function SubmitButton({ t }: { t: AuthMsgs }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-accent w-full py-4 text-lg mt-2">
      {pending ? t.regSubmitting : t.regSubmit}
    </button>
  );
}

export default function RegisterForm({ t }: { t: AuthMsgs }) {
  const [state, formAction] = useActionState<RegisterState, FormData>(registerAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm">{t.regType}</label>
        <input
          name="facilityLabel"
          required
          placeholder={t.regTypePh}
          className="input-field px-4 py-3 text-lg"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm">{t.regShopName}</label>
        <input name="shopName" required placeholder={t.regShopNamePh} className="input-field px-4 py-3 text-lg" />
      </div>
      <p className="muted text-xs -mt-2">{t.regHint}</p>
      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm">{t.regOwner}</label>
        <input name="ownerName" required placeholder={t.regOwnerPh} className="input-field px-4 py-3 text-lg" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm">{t.regCity}</label>
        <input name="city" placeholder={t.regCityPh} className="input-field px-4 py-3 text-lg" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm">{t.regEmail}</label>
        <input name="email" type="email" required placeholder={t.regEmailPh} className="input-field px-4 py-3 text-lg" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm">{t.regPassword}</label>
        <input name="password" type="password" required minLength={6} placeholder={t.regPasswordPh} className="input-field px-4 py-3 text-lg" />
      </div>

      {state.error && <p className="text-red-400 text-sm font-bold text-center">{state.error}</p>}

      <SubmitButton t={t} />
    </form>
  );
}
