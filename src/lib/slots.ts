import { prisma } from "./db";
import { scheduledAtFromLocal, serviceDateFor } from "./queue";

export interface SlotOption {
  time: string; // "HH:MM" (24h) — القيمة المُرسلة في النموذج
  label: string; // "٢:٣٠ م" — نص العرض
  available: boolean; // غير محجوزة وغير ماضية
  past: boolean; // مضى وقتها اليوم
}

function label12h(h24: number, m: number, am: string, pm: string): string {
  const period = h24 < 12 ? am : pm;
  let h = h24 % 12;
  if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, "0")} ${period}`;
}

interface ShopForSlots {
  id: bigint;
  timezone: string;
  settings: {
    openTime: string;
    closeTime: string;
    slotMinutes: number;
  } | null;
}

// يولّد خانات المواعيد لليوم الحالي مع حالة توفّر كل خانة.
// سعة الخانة = عدد مزوّدي الخدمة النشطين؛ خانة محجوزة بالكامل أو ماضية = غير متاحة.
export async function availableSlotsFor(
  shop: ShopForSlots,
  am = "ص",
  pm = "م"
): Promise<SlotOption[]> {
  const open = shop.settings?.openTime ?? "09:00";
  const close = shop.settings?.closeTime ?? "22:00";
  const step = shop.settings?.slotMinutes ?? 30;
  const [oh, om] = open.split(":").map(Number);
  const [ch, cm] = close.split(":").map(Number);
  const startMin = oh * 60 + om;
  const endMin = ch * 60 + cm;
  if (!Number.isFinite(startMin) || !Number.isFinite(endMin) || endMin <= startMin || step <= 0) {
    return [];
  }

  const capacity = await prisma.user.count({
    where: { shopId: shop.id, role: { in: ["manager", "barber"] }, isActive: true },
  });

  // مواعيد اليوم المحجوزة فعلاً (منتظِرة أو قيد الخدمة)
  const today = serviceDateFor(shop.timezone);
  const booked = await prisma.ticket.findMany({
    where: {
      shopId: shop.id,
      serviceDate: today,
      status: { in: ["waiting", "serving"] },
      scheduledAt: { not: null },
    },
    select: { scheduledAt: true },
  });

  // عدّ المحجوز لكل خانة عبر مطابقة "HH:MM" بتوقيت المنشأة
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: shop.timezone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const counts = new Map<string, number>();
  for (const b of booked) {
    if (!b.scheduledAt) continue;
    const hhmm = fmt.format(b.scheduledAt);
    counts.set(hhmm, (counts.get(hhmm) ?? 0) + 1);
  }

  const now = Date.now();
  const slots: SlotOption[] = [];
  for (let t = startMin; t < endMin; t += step) {
    const h = Math.floor(t / 60);
    const m = t % 60;
    const hhmm = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    const instant = scheduledAtFromLocal(shop.timezone, hhmm);
    const past = !instant || instant.getTime() <= now;
    const used = counts.get(hhmm) ?? 0;
    slots.push({
      time: hhmm,
      label: label12h(h, m, am, pm),
      available: !past && used < capacity,
      past,
    });
  }
  return slots;
}
