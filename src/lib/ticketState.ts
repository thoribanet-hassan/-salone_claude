import { prisma } from "./db";
import { queueInfoFor } from "./queue";
import { themeFor } from "./theme";
import type { TicketStatus } from "@prisma/client";

export interface TicketState {
  found: boolean;
  publicToken: string;
  ticketNumber: number;
  customerName: string;
  status: TicketStatus;
  peopleAhead: number;
  remainingMinutes: number; // للعرض النصي
  remainingSeconds: number; // بذرة العدّاد التنازلي الحي
  countdownActive: boolean; // هل العدّاد فعّال؟ (في الوضع اليدوي لا يبدأ إلا بإطلاق المدير)
  readyAtMs: number | null; // وقت الجاهزية الذي حدّده الموظف (لكشف التغيّر وتشغيل النغمة)
  serviceName: string | null;
  totalPrice: number;
  showPrices: boolean;
  appointmentLabel: string | null;
  barberName: string | null;
  // رسالة الحالة الجاهزة للعرض
  headline: string;
  // إعدادات العرض (toggles)
  settings: {
    showExpectedTime: boolean;
    showPeopleAhead: boolean;
    showBarberName: boolean;
    showCountdown: boolean;
  };
  theme: string;
  shopName: string;
  // ختم زمني للمزامنة
  syncedAt: number;
}

export async function getTicketState(token: string): Promise<TicketState | null> {
  const ticket = await prisma.ticket.findUnique({
    where: { publicToken: token },
    include: { shop: { include: { settings: true } }, barber: true, service: true },
  });
  if (!ticket) return null;

  const theme = themeFor(ticket.shop.facilityType);
  const { peopleAhead, remainingMinutes: autoMinutes } = await queueInfoFor(ticket);
  const isManual = ticket.shop.settings?.countdownMode === "manual";
  const isNone = ticket.shop.settings?.countdownMode === "none"; // عيادة: بلا تقدير زمني

  // موعد محدّد لم يحن بعد؟
  const scheduledFuture =
    ticket.scheduledAt && ticket.scheduledAt.getTime() > Date.now()
      ? ticket.scheduledAt
      : null;

  // حساب العدّاد حسب الأولوية: تحديد الموظف > الموعد المحدّد > التلقائي/اليدوي
  let remainingMinutes = autoMinutes;
  let remainingSeconds = autoMinutes * 60;
  let countdownActive = false;
  if (ticket.status === "waiting") {
    if (ticket.readyAt) {
      const secs = Math.max(0, Math.floor((ticket.readyAt.getTime() - Date.now()) / 1000));
      remainingSeconds = secs;
      remainingMinutes = Math.ceil(secs / 60);
      countdownActive = true;
    } else if (scheduledFuture) {
      // العدّ التنازلي حتى الموعد المحدّد
      const secs = Math.max(0, Math.floor((scheduledFuture.getTime() - Date.now()) / 1000));
      remainingSeconds = secs;
      remainingMinutes = Math.ceil(secs / 60);
      countdownActive = true;
    } else if (isManual || isNone) {
      // يدوي بلا تحديد بعد، أو وضع العيادة (لا تقدير زمني إطلاقاً)
      remainingMinutes = 0;
      remainingSeconds = 0;
    } else {
      countdownActive = true; // تلقائي
    }
  }

  // نص الموعد للعرض (بتوقيت المحل)
  const appointmentLabel = ticket.scheduledAt
    ? new Intl.DateTimeFormat("ar", {
        timeZone: ticket.shop.timezone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(ticket.scheduledAt)
    : null;

  let headline: string;
  switch (ticket.status) {
    case "serving":
      headline = theme.terms.yourTurn;
      break;
    case "completed":
      headline = "انتهت خدمتك، شكراً لزيارتك 🌟";
      break;
    case "skipped":
      headline = "تم تخطّي دورك، يرجى مراجعة الموظف";
      break;
    case "cancelled":
      headline = "تم إلغاء هذه التذكرة";
      break;
    default:
      if (scheduledFuture && !ticket.readyAt) {
        headline = `موعدك المحجوز الساعة ${appointmentLabel}`;
      } else if (isManual && !ticket.readyAt) {
        headline = "أنت في الطابور، سيُحدّد وقتك قريباً";
      } else {
        headline =
          countdownActive && remainingMinutes === 0 && peopleAhead === 0
            ? theme.terms.getReady
            : peopleAhead === 0
              ? theme.terms.getReady
              : "أنت في الطابور، يرجى الانتظار";
      }
  }

  return {
    found: true,
    publicToken: ticket.publicToken,
    ticketNumber: ticket.ticketNumber,
    customerName: ticket.customerName,
    status: ticket.status,
    peopleAhead,
    remainingMinutes,
    remainingSeconds,
    countdownActive,
    readyAtMs: ticket.readyAt ? ticket.readyAt.getTime() : null,
    serviceName: ticket.serviceLabel ?? ticket.service?.name ?? null,
    totalPrice: ticket.totalPrice,
    showPrices: !!ticket.shop.settings?.showPrices,
    appointmentLabel,
    barberName: ticket.barber?.name ?? null,
    headline,
    settings: {
      showExpectedTime: !!ticket.shop.settings?.showExpectedTime,
      showPeopleAhead: !!ticket.shop.settings?.showPeopleAhead,
      showBarberName: !!ticket.shop.settings?.showBarberName,
      showCountdown: !!ticket.shop.settings?.showCountdown,
    },
    theme: theme.className,
    shopName: ticket.shop.name,
    syncedAt: Date.now(),
  };
}
