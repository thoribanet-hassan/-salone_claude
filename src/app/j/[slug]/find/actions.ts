"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { serviceDateFor } from "@/lib/queue";

export interface FindState {
  error?: string;
}

// استرجاع التذكرة بالاسم أو الهاتف — ضمن تذاكر هذا المحل النشطة اليوم فقط
export async function findTicketAction(
  _prev: FindState,
  formData: FormData
): Promise<FindState> {
  const slug = String(formData.get("slug") ?? "");
  const name = String(formData.get("customerName") ?? "").trim();
  const phone = String(formData.get("customerPhone") ?? "").trim();

  if (!name && !phone) return { error: "أدخل الاسم أو رقم الهاتف" };

  const shop = await prisma.shop.findUnique({ where: { slug } });
  if (!shop) return { error: "المحل غير موجود" };

  const today = serviceDateFor(shop.timezone);
  const base = {
    shopId: shop.id,
    serviceDate: today,
    status: { in: ["waiting", "serving"] as const },
  };

  // الهاتف مفتاح دقيق ← يُقدَّم إن وُجد
  if (phone) {
    const matches = await prisma.ticket.findMany({
      where: { ...base, customerPhone: phone },
      orderBy: { createdAt: "desc" },
    });
    if (matches.length === 0)
      return { error: "لم نجد تذكرة نشطة بهذا الرقم اليوم" };
    redirect(`/t/${matches[0].publicToken}`);
  }

  // بحث بالاسم (غير حسّاس لحالة الأحرف)
  const matches = await prisma.ticket.findMany({
    where: { ...base, customerName: { equals: name, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
  });

  if (matches.length === 0) return { error: "لم نجد تذكرة نشطة بهذا الاسم اليوم" };
  if (matches.length > 1)
    return {
      error: "وُجد أكثر من حجز بنفس الاسم. من فضلك أدخل رقم هاتفك للتمييز.",
    };

  redirect(`/t/${matches[0].publicToken}`);
}
