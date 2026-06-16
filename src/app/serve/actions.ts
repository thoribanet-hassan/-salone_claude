"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import {
  callNextCustomer,
  completeService,
  skipCurrent,
  setBarberStatus,
  markNextCustomerReady,
  restoreTicket,
  createTicket,
} from "@/lib/queue";
import { shopAccess } from "@/lib/subscription";
import { logEvent } from "@/lib/events";
import { getServerLocale } from "@/lib/locale-server";
import { SERVE, localizeServeReason } from "@/i18n/serve";

async function barberId(): Promise<bigint | null> {
  const s = await getSession();
  return s ? BigInt(s.userId) : null;
}

export async function callNextAction(): Promise<{ error?: string }> {
  const locale = await getServerLocale();
  const id = await barberId();
  if (!id) return { error: SERVE[locale].errSession };
  const r = await callNextCustomer(id);
  revalidatePath("/serve");
  return r.ok ? {} : { error: localizeServeReason(r.reason, locale) };
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

// إضافة عميل يدوياً (حضر مباشرةً أو اتصل) — المدير دائماً، والموظف إن خوّله المدير
export async function addWalkinAction(name: string): Promise<{ error?: string }> {
  const locale = await getServerLocale();
  const t = SERVE[locale];
  const s = await getSession();
  if (!s) return { error: t.errSession };

  const customerName = name.trim();
  if (!customerName) return { error: t.errWalkinName };

  // صلاحية: المدير دائماً؛ الموظف يحتاج canAddWalkin
  const me = await prisma.user.findUnique({ where: { id: BigInt(s.userId) } });
  if (!me) return { error: t.errSession };
  if (me.role !== "manager" && !me.canAddWalkin) return { error: t.errWalkinPerm };

  const shop = await prisma.shop.findUnique({
    where: { id: BigInt(s.shopId) },
    include: { settings: true },
  });
  if (!shop) return { error: t.errSession };
  if (shopAccess(shop).locked) return { error: t.errWalkinLocked }; // اشتراك منتهٍ

  // خدمة افتراضية للوقت/التسمية (أول خدمة نشطة إن وُجدت)
  const svc = await prisma.service.findFirst({
    where: { shopId: shop.id, isActive: true },
    orderBy: { position: "asc" },
  });

  const ticket = await createTicket({
    shopId: shop.id,
    barberId: null, // الطابور المشترك — يخدمه أول متاح
    serviceIds: svc ? [svc.id] : [],
    customerName,
    timezone: shop.timezone,
    source: "walkin", // وسم مصدر يميّز الإضافة اليدوية في الإحصاءات
  });

  void logEvent("TICKET_CREATED", {
    shopId: shop.id,
    ticketId: ticket.id,
    source: "walkin",
    meta: { walkin: true, byRole: me.role, estDuration: ticket.estDuration },
  });

  revalidatePath("/serve");
  revalidatePath("/dashboard");
  return {};
}

// إعادة عميل متخطّى إلى الطابور
export async function restoreAction(ticketId: string): Promise<void> {
  const s = await getSession();
  if (s) await restoreTicket(BigInt(s.shopId), BigInt(ticketId));
  revalidatePath("/serve");
  revalidatePath("/dashboard");
}
