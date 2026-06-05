"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { findTicketAction, type FindState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-accent w-full py-4 text-lg mt-2">
      {pending ? "جارٍ البحث…" : "استرجع تذكرتي"}
    </button>
  );
}

export default function FindForm({ slug }: { slug: string }) {
  const [state, formAction] = useActionState<FindState, FormData>(findTicketAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="slug" value={slug} />

      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm">اسمك</label>
        <input
          name="customerName"
          placeholder="الاسم الذي حجزت به"
          className="input-field px-4 py-3 text-lg"
        />
      </div>

      <div className="text-center muted text-sm">أو</div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm">رقم الجوال</label>
        <input
          name="customerPhone"
          type="tel"
          inputMode="tel"
          placeholder="05xxxxxxxx"
          className="input-field px-4 py-3 text-lg"
        />
      </div>

      {state.error && (
        <p className="text-red-400 text-sm font-bold text-center">{state.error}</p>
      )}

      <SubmitButton />
    </form>
  );
}
