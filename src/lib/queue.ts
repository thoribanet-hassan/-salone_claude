import { Prisma, type Ticket } from "@prisma/client";
import { prisma } from "./db";

// تاريخ الخدمة بتوقيت المحل (لا بتوقيت الخادم) — أساس التصفير اليومي
export function serviceDateFor(timezone: string): Date {
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return new Date(`${ymd}T00:00:00.000Z`);
}

export interface CreateTicketInput {
  shopId: bigint;
  barberId: bigint | null; // null = pool "أول حلاق متاح"
  serviceIds: bigint[]; // خدمة واحدة أو أكثر — تُجمع مدّتها
  customerName: string;
  customerPhone?: string | null;
  timezone: string;
}

// يحسب مدة الخدمة المختارة بالدقائق وقت الحجز (لقطة est_duration)
// حلاق محدد ← زمنه لهذه الخدمة. pool ← متوسط أزمنة الحلاقين المتاحين لهذه الخدمة.
export async function resolveEstDuration(
  shopId: bigint,
  barberId: bigint | null,
  serviceId: bigint
): Promise<number> {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  const fallback = service?.defaultDuration ?? 20;

  if (barberId !== null) {
    const bs = await prisma.barberService.findUnique({
      where: { barberId_serviceId: { barberId, serviceId } },
    });
    return bs?.duration ?? fallback;
  }

  // pool: متوسط أزمنة المزوّدين المتاحين لهذه الخدمة (المدير مزوّد أيضاً)
  const availableIds = (
    await prisma.user.findMany({
      where: { shopId, role: { in: ["manager", "barber"] }, status: "available", isActive: true },
      select: { id: true },
    })
  ).map((b) => b.id);
  if (availableIds.length === 0) return fallback;

  const rows = await prisma.barberService.findMany({
    where: { serviceId, barberId: { in: availableIds } },
    select: { duration: true },
  });
  if (rows.length === 0) return fallback;
  return Math.round(rows.reduce((s, r) => s + r.duration, 0) / rows.length);
}

// توليد تذكرة برقم تسلسلي آمن ضد التزامن
// يعتمد على INSERT ... ON CONFLICT DO UPDATE الذي يقفل صف العدّاد ذرّياً
export async function createTicket(input: CreateTicketInput): Promise<Ticket> {
  const serviceDate = serviceDateFor(input.timezone);

  // اجمع مدد كل الخدمات المختارة + كوّن نصّ العرض
  const services = await prisma.service.findMany({
    where: { id: { in: input.serviceIds }, shopId: input.shopId },
  });
  let estDuration = 0;
  for (const sid of input.serviceIds) {
    estDuration += await resolveEstDuration(input.shopId, input.barberId, sid);
  }
  if (estDuration <= 0) estDuration = 20;
  const serviceLabel = services.map((s) => s.name).join(" + ") || null;

  return prisma.$transaction(async (tx) => {
    const rows = await tx.$queryRaw<{ last_number: number }[]>(Prisma.sql`
      INSERT INTO ticket_counters (shop_id, service_date, last_number)
      VALUES (${input.shopId}, ${serviceDate}::date, 1)
      ON CONFLICT (shop_id, service_date)
      DO UPDATE SET last_number = ticket_counters.last_number + 1
      RETURNING last_number;
    `);
    const ticketNumber = rows[0].last_number;

    return tx.ticket.create({
      data: {
        shopId: input.shopId,
        barberId: input.barberId,
        serviceId: input.serviceIds[0] ?? null,
        serviceLabel,
        customerName: input.customerName,
        customerPhone: input.customerPhone ?? null,
        serviceDate,
        ticketNumber,
        estDuration,
        status: "waiting",
      },
    });
  });
}

export interface QueueInfo {
  peopleAhead: number;
  remainingMinutes: number; // الوقت المتبقي لدور الزبون (مجموع مدد من قبله)
}

// حساب "عدد الأشخاص قبلك" والوقت المتبقي — بمدد الخدمات الحقيقية (est_duration)
export async function queueInfoFor(ticket: Ticket): Promise<QueueInfo> {
  if (ticket.status !== "waiting") return { peopleAhead: 0, remainingMinutes: 0 };

  const sharedWhere = {
    shopId: ticket.shopId,
    status: "waiting" as const,
    createdAt: { lt: ticket.createdAt },
  };

  if (ticket.barberId !== null) {
    // حالة: حلاق محدد ← مجموع مدد من قبله على نفس الحلاق
    const ahead = await prisma.ticket.findMany({
      where: { ...sharedWhere, barberId: ticket.barberId },
      select: { estDuration: true },
    });
    const remaining = ahead.reduce((s, t) => s + t.estDuration, 0);
    return { peopleAhead: ahead.length, remainingMinutes: remaining };
  }

  // حالة: pool مشترك ← مجموع مدد من قبله (بلا قسمة — أوضح وأأمن للزبون)
  const ahead = await prisma.ticket.findMany({
    where: { ...sharedWhere, barberId: null },
    select: { estDuration: true },
  });
  const sum = ahead.reduce((s, t) => s + t.estDuration, 0);
  return { peopleAhead: ahead.length, remainingMinutes: sum };
}

// إنهاء خدمة العميل الحالي وتحرير الحلاق
export async function completeService(barberId: bigint): Promise<boolean> {
  const current = await prisma.ticket.findFirst({
    where: { barberId, status: "serving" },
  });
  if (!current) return false;
  await prisma.$transaction([
    prisma.ticket.update({
      where: { id: current.id },
      data: { status: "completed", completedAt: new Date() },
    }),
    prisma.user.update({ where: { id: barberId }, data: { status: "available" } }),
  ]);
  return true;
}

// تخطّي العميل الحالي (مثلاً لم يحضر) وتحرير الحلاق
export async function skipCurrent(barberId: bigint): Promise<boolean> {
  const current = await prisma.ticket.findFirst({
    where: { barberId, status: "serving" },
  });
  if (!current) return false;
  await prisma.$transaction([
    prisma.ticket.update({
      where: { id: current.id },
      data: { status: "skipped", completedAt: new Date() },
    }),
    prisma.user.update({ where: { id: barberId }, data: { status: "available" } }),
  ]);
  return true;
}

// تنظيف الطابور: إلغاء التذاكر المهجورة (TTL) والمعلّقة
export async function cleanupQueues(): Promise<{ abandoned: number; staleServing: number }> {
  const now = new Date();
  const waitingTtl = new Date(now.getTime() - 4 * 60 * 60 * 1000); // 4 ساعات
  const servingTtl = new Date(now.getTime() - 6 * 60 * 60 * 1000); // 6 ساعات

  const abandoned = await prisma.ticket.updateMany({
    where: { status: "waiting", createdAt: { lt: waitingTtl } },
    data: { status: "cancelled", cancelledAt: now },
  });
  // خدمة بدأت ولم تُنهَ منذ مدة طويلة → تُغلق ويُحرَّر مزوّدها لاحقاً
  const staleServing = await prisma.ticket.updateMany({
    where: { status: "serving", startedAt: { lt: servingTtl } },
    data: { status: "completed", completedAt: now },
  });
  return { abandoned: abandoned.count, staleServing: staleServing.count };
}

// إعادة عميل متخطّى إلى الطابور (يحتفظ بترتيبه الزمني الأصلي)
export async function restoreTicket(shopId: bigint, ticketId: bigint): Promise<void> {
  const t = await prisma.ticket.findFirst({ where: { id: ticketId, shopId, status: "skipped" } });
  if (!t) return;
  await prisma.ticket.update({
    where: { id: ticketId },
    data: { status: "waiting", barberId: null, startedAt: null, completedAt: null, readyAt: null },
  });
}

// تبديل حالة الحلاق (متاح/غير متاح) — لا يُسمح بـ unavailable أثناء الخدمة
export async function setBarberStatus(
  barberId: bigint,
  status: "available" | "unavailable"
): Promise<void> {
  const serving = await prisma.ticket.findFirst({
    where: { barberId, status: "serving" },
  });
  if (serving) return; // أنهِ العميل أولاً
  await prisma.user.update({ where: { id: barberId }, data: { status } });
}

// الوضع اليدوي: المدير يطلق عدّاد العميل التالي عند اقتراب انصراف زبون
// يضبط ready_at = الآن + minutes على أقدم تذكرة منتظرة (العميل التالي)
export async function markNextCustomerReady(
  shopId: bigint,
  minutes: number
): Promise<Ticket | null> {
  const next = await prisma.ticket.findFirst({
    where: { shopId, status: "waiting" },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });
  if (!next) return null;
  const readyAt = new Date(Date.now() + Math.max(0, minutes) * 60_000);
  return prisma.ticket.update({ where: { id: next.id }, data: { readyAt } });
}

export type NextResult =
  | { ok: true; ticket: Ticket }
  | { ok: false; reason: string };

// سحب الحلاق للعميل التالي — يدعم الـ pool مع FOR UPDATE SKIP LOCKED
export async function callNextCustomer(barberId: bigint): Promise<NextResult> {
  const barber = await prisma.user.findUnique({ where: { id: barberId } });
  if (!barber) return { ok: false, reason: "الحلاق غير موجود" };

  const alreadyServing = await prisma.ticket.findFirst({
    where: { barberId, status: "serving" },
  });
  if (alreadyServing) return { ok: false, reason: "أنهِ العميل الحالي أولاً" };
  if (barber.status !== "available")
    return { ok: false, reason: "غيّر حالتك إلى متاح أولاً" };

  return prisma.$transaction(async (tx) => {
    // أولوية: التذاكر المسندة لهذا الحلاق ثم أقدم تذكرة في الـ pool المشترك
    const rows = await tx.$queryRaw<{ id: bigint }[]>(Prisma.sql`
      SELECT id FROM tickets
      WHERE shop_id = ${barber.shopId}
        AND status = 'waiting'
        AND (barber_id = ${barberId} OR barber_id IS NULL)
      ORDER BY COALESCE(position, 999999) ASC,
               (barber_id = ${barberId}) DESC,
               created_at ASC
      LIMIT 1
      FOR UPDATE SKIP LOCKED;
    `);
    if (rows.length === 0)
      return { ok: false, reason: "لا يوجد عملاء في الانتظار" } as NextResult;

    const ticket = await tx.ticket.update({
      where: { id: rows[0].id },
      data: { status: "serving", barberId, startedAt: new Date() },
    });
    await tx.user.update({ where: { id: barberId }, data: { status: "busy" } });
    return { ok: true, ticket } as NextResult;
  });
}
