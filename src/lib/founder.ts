import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./db";

// ===== جلسة المؤسس: كوكي موقّع HMAC بكلمة سر من متغيرات البيئة (بلا حساب superadmin) =====

const COOKIE = "founder_session";
const SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";
const SESSION_HOURS = 24 * 7;

function sign(data: string): string {
  return createHmac("sha256", SECRET).update(data).digest("base64url");
}

export function verifyFounderPassword(pw: string): boolean {
  const expected = process.env.FOUNDER_PASSWORD;
  if (!expected) return false; // بلا كلمة سر مضبوطة، اللوحة مقفلة تماماً
  const a = Buffer.from(pw);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function encodeFounderToken(): string {
  const exp = String(Date.now() + SESSION_HOURS * 3600_000);
  return `${exp}.${sign(`founder:${exp}`)}`;
}

export async function isFounder(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || sign(`founder:${exp}`) !== sig) return false;
  return Number(exp) > Date.now();
}

export async function setFounderSession(): Promise<void> {
  (await cookies()).set(COOKIE, encodeFounderToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/founder",
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function clearFounderSession(): Promise<void> {
  (await cookies()).delete({ name: COOKIE, path: "/founder" });
}

// ===== مؤشرات المنتج =====

// بداية اليوم بتوقيت الرياض (المنطقة الافتراضية للتطبيق — بلا توقيت صيفي)
export function riyadhDayStart(): Date {
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Riyadh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return new Date(`${ymd}T00:00:00+03:00`);
}

export interface SourceRow {
  source: string;
  scans: number;
  tickets: number;
}

export interface ShopActivityRow {
  name: string;
  slug: string;
  tickets7d: number;
}

export interface IdleShopRow {
  name: string;
  slug: string;
  createdAt: Date;
  lastTicketAt: Date | null;
}

export interface FounderMetrics {
  totalShops: number;
  activeShopsToday: number;
  activeShops7d: number;
  qrScansToday: number;
  qrScans7d: number;
  waitOpens7d: number;
  waitRevisits7d: number;
  ticketsToday: number;
  tickets7d: number;
  ticketsAllTime: number;
  // التحويل: من مسح/فتح صفحة الحجز إلى إنشاء دور (آخر 7 أيام)
  conversionRate7d: number | null; // تذاكر ÷ مسحات
  visitorConversion7d: { scanned: number; booked: number } | null; // زوّار فريدون
  sources: SourceRow[];
  countdownModes: { auto: number; manual: number; none: number };
  topShops: ShopActivityRow[];
  idleShops: IdleShopRow[]; // لها استخدام سابق ثم توقفت ≥7 أيام
  neverUsedShops: IdleShopRow[]; // سجلت ولم تنشئ أي تذكرة
}

export async function founderMetrics(): Promise<FounderMetrics> {
  const dayStart = riyadhDayStart();
  const weekStart = new Date(Date.now() - 7 * 24 * 3600_000);

  const [
    totalShops,
    activeToday,
    active7d,
    qrScansToday,
    qrScans7d,
    waitOpens7d,
    waitRevisits7d,
    ticketsToday,
    tickets7d,
    ticketsAllTime,
    distinctVisitors,
    scanSources,
    ticketSources,
    modeGroups,
    topShopGroups,
    shops,
  ] = await Promise.all([
    prisma.shop.count(),
    prisma.event.findMany({
      where: { createdAt: { gte: dayStart }, shopId: { not: null } },
      distinct: ["shopId"],
      select: { shopId: true },
    }),
    prisma.event.findMany({
      where: { createdAt: { gte: weekStart }, shopId: { not: null } },
      distinct: ["shopId"],
      select: { shopId: true },
    }),
    prisma.event.count({ where: { type: "QR_SCANNED", createdAt: { gte: dayStart } } }),
    prisma.event.count({ where: { type: "QR_SCANNED", createdAt: { gte: weekStart } } }),
    prisma.event.count({ where: { type: "WAIT_PAGE_OPENED", createdAt: { gte: weekStart } } }),
    prisma.event.count({ where: { type: "WAIT_PAGE_REVISITED", createdAt: { gte: weekStart } } }),
    prisma.event.count({ where: { type: "TICKET_CREATED", createdAt: { gte: dayStart } } }),
    prisma.event.count({ where: { type: "TICKET_CREATED", createdAt: { gte: weekStart } } }),
    prisma.ticket.count(),
    prisma.$queryRaw<{ scanned: bigint; booked: bigint }[]>`
      SELECT
        COUNT(DISTINCT visitor_id) FILTER (WHERE type = 'QR_SCANNED')     AS scanned,
        COUNT(DISTINCT visitor_id) FILTER (WHERE type = 'TICKET_CREATED') AS booked
      FROM events
      WHERE created_at >= ${weekStart} AND visitor_id IS NOT NULL
    `,
    prisma.event.groupBy({
      by: ["source"],
      where: { type: "QR_SCANNED", createdAt: { gte: weekStart } },
      _count: { _all: true },
    }),
    prisma.event.groupBy({
      by: ["source"],
      where: { type: "TICKET_CREATED", createdAt: { gte: weekStart } },
      _count: { _all: true },
    }),
    prisma.shopSettings.groupBy({ by: ["countdownMode"], _count: { _all: true } }),
    prisma.ticket.groupBy({
      by: ["shopId"],
      where: { createdAt: { gte: weekStart } },
      _count: { _all: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    prisma.shop.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        tickets: { select: { createdAt: true }, orderBy: { createdAt: "desc" }, take: 1 },
      },
    }),
  ]);

  // دمج مصادر المسح والتذاكر في جدول واحد (null = بدون وسم مصدر)
  const sourceMap = new Map<string, SourceRow>();
  const keyOf = (s: string | null) => s ?? "—";
  for (const r of scanSources) {
    const k = keyOf(r.source);
    sourceMap.set(k, { source: k, scans: r._count._all, tickets: 0 });
  }
  for (const r of ticketSources) {
    const k = keyOf(r.source);
    const row = sourceMap.get(k) ?? { source: k, scans: 0, tickets: 0 };
    row.tickets = r._count._all;
    sourceMap.set(k, row);
  }
  const sources = [...sourceMap.values()].sort((a, b) => b.tickets - a.tickets || b.scans - a.scans);

  const countdownModes = { auto: 0, manual: 0, none: 0 };
  for (const g of modeGroups) countdownModes[g.countdownMode] = g._count._all;

  const shopNameById = new Map(shops.map((s) => [s.id.toString(), s]));
  const topShops: ShopActivityRow[] = topShopGroups.map((g) => {
    const s = shopNameById.get(g.shopId.toString());
    return { name: s?.name ?? `#${g.shopId}`, slug: s?.slug ?? "", tickets7d: g._count._all };
  });

  const idleShops: IdleShopRow[] = [];
  const neverUsedShops: IdleShopRow[] = [];
  for (const s of shops) {
    const last = s.tickets[0]?.createdAt ?? null;
    const row = { name: s.name, slug: s.slug, createdAt: s.createdAt, lastTicketAt: last };
    if (!last) neverUsedShops.push(row);
    else if (last < weekStart) idleShops.push(row);
  }
  idleShops.sort((a, b) => (a.lastTicketAt!.getTime() - b.lastTicketAt!.getTime()));
  neverUsedShops.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const dv = distinctVisitors[0];
  return {
    totalShops,
    activeShopsToday: activeToday.length,
    activeShops7d: active7d.length,
    qrScansToday,
    qrScans7d,
    waitOpens7d,
    waitRevisits7d,
    ticketsToday,
    tickets7d,
    ticketsAllTime,
    conversionRate7d: qrScans7d > 0 ? tickets7d / qrScans7d : null,
    visitorConversion7d: dv ? { scanned: Number(dv.scanned), booked: Number(dv.booked) } : null,
    sources,
    countdownModes,
    topShops,
    idleShops,
    neverUsedShops,
  };
}
