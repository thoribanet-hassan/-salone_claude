"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { createTicket } from "@/lib/queue";

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
  // قد تُختار خدمة واحدة أو أكثر
  const serviceRawList = formData.getAll("serviceIds").map((v) => String(v)).filter(Boolean);

  if (!customerName) return { error: "يرجى إدخال الاسم" };
  if (serviceRawList.length === 0) return { error: "يرجى اختيار خدمة واحدة على الأقل" };

  const shop = await prisma.shop.findUnique({
    where: { slug },
    include: { settings: true },
  });
  if (!shop) return { error: "المحل غير موجود" };

  // قواعد منع الحجز (المدير مزوّد خدمة أيضاً)
  const activeBarbers = await prisma.user.findMany({
    where: { shopId: shop.id, role: { in: ["manager", "barber"] }, isActive: true },
  });
  const availableBarbers = activeBarbers.filter((b) => b.status === "available");

  if (!shop.settings?.isOpen || activeBarbers.length === 0 || availableBarbers.length === 0) {
    return { error: "نعتذر منك، استقبال العملاء متوقف حالياً في هذا الفرع" };
  }

  // التحقق من الخدمات المختارة (نشطة وتابعة لهذا المحل)
  const validServices = await prisma.service.findMany({
    where: { id: { in: serviceRawList.map((s) => BigInt(s)) }, shopId: shop.id, isActive: true },
  });
  if (validServices.length === 0) return { error: "الخدمة المختارة غير متاحة، اختر غيرها" };

  // حلاق محدد أم pool مشترك
  let barberId: bigint | null = null;
  if (barberRaw) {
    const chosen = availableBarbers.find((b) => b.id.toString() === barberRaw);
    if (!chosen) return { error: "الحلاق المختار غير متاح حالياً، اختر غيره" };
    barberId = chosen.id;
  }

  const ticket = await createTicket({
    shopId: shop.id,
    barberId,
    serviceIds: validServices.map((s) => s.id),
    customerName,
    customerPhone: phoneRaw || null,
    timezone: shop.timezone,
  });

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
