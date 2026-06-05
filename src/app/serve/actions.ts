"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import {
  callNextCustomer,
  completeService,
  skipCurrent,
  setBarberStatus,
  markNextCustomerReady,
  restoreTicket,
} from "@/lib/queue";

async function barberId(): Promise<bigint | null> {
  const s = await getSession();
  return s ? BigInt(s.userId) : null;
}

export async function callNextAction(): Promise<{ error?: string }> {
  const id = await barberId();
  if (!id) return { error: "انتهت الجلسة" };
  const r = await callNextCustomer(id);
  revalidatePath("/serve");
  return r.ok ? {} : { error: r.reason };
}

export async function completeAction(): Promise<void> {
  const id = await barberId();
  if (id) await completeService(id);
  revalidatePath("/serve");
}

export async function skipAction(): Promise<void> {
  const id = await barberId();
  if (id) await skipCurrent(id);
  revalidatePath("/serve");
}

export async function toggleStatusAction(to: "available" | "unavailable"): Promise<void> {
  const id = await barberId();
  if (id) await setBarberStatus(id, to);
  revalidatePath("/serve");
}

// للوضع اليدوي (مطعم): إطلاق عدّاد العميل التالي خلال N دقيقة
export async function markReadyAction(minutes: number): Promise<void> {
  const s = await getSession();
  if (s) await markNextCustomerReady(BigInt(s.shopId), minutes);
  revalidatePath("/serve");
}

// إعادة عميل متخطّى إلى الطابور
export async function restoreAction(ticketId: string): Promise<void> {
  const s = await getSession();
  if (s) await restoreTicket(BigInt(s.shopId), BigInt(ticketId));
  revalidatePath("/serve");
  revalidatePath("/dashboard");
}
