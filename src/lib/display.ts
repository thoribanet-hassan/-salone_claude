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
  waiting: number[]; // أرقام التذاكر القادمة بالترتيب
  syncedAt: number;
}

const WAITING_SHOWN = 8; // كم رقماً قادماً نعرض على الشاشة

// حالة شاشة العرض داخل المنشأة (تلفزيون): مَن يُخدَم الآن + القادمون
export async function displayStateFor(slug: string): Promise<DisplayState | null> {
  const shop = await prisma.shop.findUnique({
    where: { slug },
    include: { settings: true },
  });
  if (!shop) return null;

  const today = serviceDateFor(shop.timezone);
  const [serving, waiting] = await Promise.all([
    prisma.ticket.findMany({
      where: { shopId: shop.id, status: "serving", serviceDate: today },
      include: { barber: true },
      orderBy: { startedAt: "asc" },
    }),
    prisma.ticket.findMany({
      where: { shopId: shop.id, status: "waiting", serviceDate: today },
      select: { ticketNumber: true, scheduledAt: true, createdAt: true },
    }),
  ]);

  const grace = (shop.settings?.appointmentGraceMinutes ?? DEFAULT_GRACE_MINUTES) * 60_000;
  const waitingSorted = [...waiting]
    .sort((a, b) => queueSortKeyMs(a, grace) - queueSortKeyMs(b, grace))
    .slice(0, WAITING_SHOWN)
    .map((t) => t.ticketNumber);

  return {
    found: true,
    shopName: shop.name,
    facilityLabel: shop.facilityLabel || themeFor(shop.facilityType).label,
    theme: themeFor(shop.facilityType).className,
    isOpen: !!shop.settings?.isOpen,
    serving: serving.map((t) => ({ number: t.ticketNumber, barber: t.barber?.name ?? null })),
    waiting: waitingSorted,
    syncedAt: Date.now(),
  };
}
