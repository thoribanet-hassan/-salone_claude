"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { createTicket, scheduledAtFromLocal } from "@/lib/queue";
import { logEvent, visitorIdFrom, sourceFrom } from "@/lib/events";
import { getServerLocale } from "@/lib/locale-server";
import { BOOKING } from "@/i18n/booking";
import { SUB } from "@/i18n/subscription";
import { shopAccess } from "@/lib/subscription";

export interface BookingState {
  error?: string;
}

// إجراء حجز الدور — يتحقق من قواعد التشغيل ثم يولّد التذكرة ويوجّه لشاشتها
export async function createBookingAction(
  _prev: BookingState,
  formData: FormData
): Promise<BookingState> {
  const slug = String(formData.get("slug") ?? "");
  const customerName = String(formData.get("customerName") ?? "").trim();
  const phoneRaw = String(formData.get("customerPhone") ?? "").trim();
  const barberRaw = String(formData.get("barberId") ?? ""); // "" = أول حلاق متاح
  const whenMode = String(formData.get("whenMode") ?? "now"); // now | scheduled
  const scheduledTime = String(formData.get("scheduledTime") ?? "").trim(); // HH:MM
  // قد تُختار خدمة واحدة أو أكثر
  const serviceRawList = formData.getAll("serviceIds").map((v) => String(v)).filter(Boolean);

  const locale = await getServerLocale();
  const e = BOOKING[locale]; // رسائل الأخطاء بلغة الزائر

  if (!customerName) return { error: e.errName };
  if (serviceRawList.length === 0) return { error: e.errService };

  const shop = await prisma.shop.findUnique({
    where: { slug },
    include: { settings: true },
  });
  if (!shop) return { error: e.errShop };
  if (shopAccess(shop).locked) return { error: SUB[locale].lockedBody }; // اشتراك منتهٍ

  const isScheduled = whenMode === "scheduled";

  // قواعد منع الحجز (المدير مزوّد خدمة أيضاً)
  const activeBarbers = await prisma.user.findMany({
    where: { shopId: shop.id, role: { in: ["manager", "barber"] }, isActive: true },
  });
  const availableBarbers = activeBarbers.filter((b) => b.status === "available");

  if (!shop.settings?.isOpen || activeBarbers.length === 0) {
    return { error: e.errClosed };
  }
  // الحجز الفوري يتطلب موظفاً متاحاً الآن؛ الموعد المسبق لا (سيُخدَم لاحقاً)
  if (!isScheduled && availableBarbers.length === 0) {
    return { error: e.errClosed };
  }

  // التحقق من الخدمات المختارة (نشطة وتابعة لهذا المحل)
  const validServices = await prisma.service.findMany({
    where: { id: { in: serviceRawList.map((s) => BigInt(s)) }, shopId: shop.id, isActive: true },
  });
  if (validServices.length === 0) return { error: e.errServiceInvalid };

  // حلاق محدد أم pool مشترك — الموعد المسبق يقبل أي موظف نشط، الفوري يتطلب متاحاً الآن
  let barberId: bigint | null = null;
  if (barberRaw) {
    const pool = isScheduled ? activeBarbers : availableBarbers;
    const chosen = pool.find((b) => b.id.toString() === barberRaw);
    if (!chosen) return { error: e.errProvider };
    barberId = chosen.id;
  }

  // موعد محدّد (إن اختاره الزبون) — يجب أن يكون في المستقبل اليوم وخانته غير ممتلئة
  let scheduledAt: Date | null = null;
  if (isScheduled) {
    if (!scheduledTime) return { error: e.errApptTime };
    scheduledAt = scheduledAtFromLocal(shop.timezone, scheduledTime);
    if (!scheduledAt) return { error: e.errApptFormat };
    if (scheduledAt.getTime() <= Date.now() + 60_000)
      return { error: e.errApptPast };
    // حصرية الخانة: سعتها = عدد المزوّدين النشطين (يحمي من الحجز المزدوج)
    const taken = await prisma.ticket.count({
      where: { shopId: shop.id, status: { in: ["waiting", "serving"] }, scheduledAt },
    });
    if (taken >= activeBarbers.length) {
      return { error: e.errSlotTaken };
    }
  }

  const visitorId = await visitorIdFrom();
  const source = await sourceFrom();

  const ticket = await createTicket({
    shopId: shop.id,
    barberId,
    serviceIds: validServices.map((s) => s.id),
    customerName,
    customerPhone: phoneRaw || null,
    timezone: shop.timezone,
    scheduledAt,
    source,
  });

  // قياس: إنشاء دور (+ موعد إن حُدّد وقت)
  void logEvent("TICKET_CREATED", {
    shopId: shop.id,
    ticketId: ticket.id,
    visitorId,
    source,
    meta: {
      barberChosen: !!barberId,
      servicesCount: validServices.length,
      scheduled: !!scheduledAt,
      estDuration: ticket.estDuration,
      totalPrice: ticket.totalPrice,
    },
  });
  if (scheduledAt) {
    void logEvent("APPOINTMENT_CREATED", {
      shopId: shop.id,
      ticketId: ticket.id,
      visitorId,
      source,
    });
  }

  // ربط التذكرة بالجهاز لاستعادتها لاحقاً
  const jar = await cookies();
  jar.set("last_ticket", ticket.publicToken, {
    path: "/",
    maxAge: 60 * 60 * 12,
    httpOnly: false,
    sameSite: "lax",
  });

  redirect(`/t/${ticket.publicToken}`);
}
