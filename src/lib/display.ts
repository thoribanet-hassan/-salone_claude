import { prisma } from "./db";
import { serviceDateFor, queueSortKeyMs, DEFAULT_GRACE_MINUTES } from "./queue";
import { themeFor } from "./theme";

export interface DisplayState {
  found: boolean;
  shopName: string;
  facilityLabel: string;
  theme: string;
  isOpen: boolean;
  serving: { number: number; barber: string | null }[];
  imminent: number[]; // حان دورهم / استعدوا — القسم العلوي الوامض
  waiting: number[]; // بقية القادمين بالترتيب
  syncedAt: number;
}

const WAITING_SHOWN = 8; // كم رقماً قادماً نعرض (بعد الوامضين)
const IMMINENT_SHOWN = 6; // أقصى عدد أرقام في القسم الوامض (تفادي الازدحام)
const DEFAULT_LEAD_MINUTES = 3; // الافتراضي إن لم تُضبط العتبة على المنشأة

// حالة شاشة العرض داخل المنشأة (تلفزيون): مَن يُخدَم الآن + مَن حان دوره + القادمون
export async function displayStateFor(slug: string): Promise<DisplayState | null> {
  const shop = await prisma.shop.findUnique({
    where: { slug },
    include: { settings: true },
  });
  if (!shop) return null;

  const today = serviceDateFor(shop.timezone);
  const [serving, waiting, providers] = await Promise.all([
    prisma.ticket.findMany({
      where: { shopId: shop.id, status: "serving", serviceDate: today },
      include: { barber: true },
      orderBy: { startedAt: "asc" },
    }),
    prisma.ticket.findMany({
      where: { shopId: shop.id, status: "waiting", serviceDate: today },
      select: { ticketNumber: true, scheduledAt: true, createdAt: true, estDuration: true, readyAt: true },
    }),
    // المزوّدون النشطون (المدير مزوّد أيضاً) — لتقدير وقت التفرّغ وعدد «التالين»
    prisma.user.findMany({
      where: { shopId: shop.id, role: { in: ["manager", "barber"] }, isActive: true },
      select: { id: true, status: true },
    }),
  ]);

  const grace = (shop.settings?.appointmentGraceMinutes ?? DEFAULT_GRACE_MINUTES) * 60_000;
  const sorted = [...waiting].sort((a, b) => queueSortKeyMs(a, grace) - queueSortKeyMs(b, grace));

  const mode = shop.settings?.countdownMode ?? "auto";
  const now = Date.now();
  const leadMinutes = shop.settings?.displayLeadMinutes ?? DEFAULT_LEAD_MINUTES;
  const thresholdMs = leadMinutes * 60_000;
  const imminentNums = new Set<number>();

  // تجاوز يدوي في كل الأوضاع: زبون حدّد له الموظف جاهزيته وحان وقتها (أو فات)
  for (const t of sorted) {
    if (t.readyAt && t.readyAt.getTime() - now <= thresholdMs) imminentNums.add(t.ticketNumber);
  }

  // متى يصبح الموعد المستقبلي مؤهَّلاً للظهور كـ«تالٍ» (لا نومض موعد الساعة ٣ في الـ١)
  const eligible = (t: { scheduledAt: Date | null }) =>
    !t.scheduledAt || t.scheduledAt.getTime() - now <= thresholdMs;

  if (mode === "auto") {
    // تقدير زمني: نحاكي وقت تفرّغ كل مزوّد ونحسب متى يبدأ دور كل منتظر
    const free = providers
      .filter((p) => p.status !== "unavailable")
      .map((p) => {
        const srv = serving.find((s) => s.barberId === p.id);
        if (srv?.startedAt) return Math.max(now, srv.startedAt.getTime() + srv.estDuration * 60_000);
        return now; // متاح الآن
      });
    if (free.length > 0) {
      for (const t of sorted) {
        let i = 0;
        for (let k = 1; k < free.length; k++) if (free[k] < free[i]) i = k;
        let start = free[i];
        if (t.scheduledAt) start = Math.max(start, t.scheduledAt.getTime());
        if (start - now <= thresholdMs) imminentNums.add(t.ticketNumber);
        free[i] = start + t.estDuration * 60_000;
      }
    }
  } else {
    // «بالرقم فقط» أو الوقت اليدوي: التالون مباشرةً (بعدد المزوّدين النشطين)
    const nextUpCount = Math.max(1, providers.filter((p) => p.status !== "unavailable").length);
    let taken = 0;
    for (const t of sorted) {
      if (taken >= nextUpCount) break;
      if (!eligible(t)) continue;
      imminentNums.add(t.ticketNumber);
      taken++;
    }
  }

  const imminent = sorted
    .filter((t) => imminentNums.has(t.ticketNumber))
    .slice(0, IMMINENT_SHOWN)
    .map((t) => t.ticketNumber);
  const imminentSet = new Set(imminent);
  const waitingRest = sorted
    .filter((t) => !imminentSet.has(t.ticketNumber))
    .slice(0, WAITING_SHOWN)
    .map((t) => t.ticketNumber);

  return {
    found: true,
    shopName: shop.name,
    facilityLabel: shop.facilityLabel || themeFor(shop.facilityType).label,
    theme: themeFor(shop.facilityType).className,
    isOpen: !!shop.settings?.isOpen,
    serving: serving.map((t) => ({ number: t.ticketNumber, barber: t.barber?.name ?? null })),
    imminent,
    waiting: waitingRest,
    syncedAt: Date.now(),
  };
}
