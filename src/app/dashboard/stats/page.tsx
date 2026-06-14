import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { themeFor } from "@/lib/theme";
import { serviceDateFor } from "@/lib/queue";
import { getServerLocale } from "@/lib/locale-server";
import { dirFor, fontVarFor } from "@/lib/i18n";
import { STATS, INTL_LOCALE } from "@/i18n/misc";
import LangSwitcher from "@/components/LangSwitcher";

export const metadata = { title: "إحصائيات العمل | دورك" };
export const dynamic = "force-dynamic";

// "2026-06" → بداية الشهر ونهايته (تواريخ خدمة UTC-midnight مثل serviceDate)
function monthRange(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 1));
  return { start, end };
}

function shiftMonth(ym: string, delta: number) {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "manager") redirect("/login");
  const shopId = BigInt(session.shopId);

  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    include: {
      users: {
        where: { role: { in: ["manager", "barber"] } },
        orderBy: [{ role: "asc" }, { createdAt: "asc" }],
      },
    },
  });
  if (!shop) redirect("/login");
  const theme = themeFor(shop.facilityType);
  const locale = await getServerLocale();
  const t = STATS[locale];
  const il = INTL_LOCALE[locale];
  const fmtMonth = new Intl.DateTimeFormat(il, { month: "long", year: "numeric", timeZone: "UTC" });
  const fmtDay = new Intl.DateTimeFormat(il, { weekday: "long", day: "numeric", timeZone: "UTC" });
  const nf = new Intl.NumberFormat(il);

  const today = serviceDateFor(shop.timezone); // UTC-midnight لليوم المحلي
  const todayYm = today.toISOString().slice(0, 7);
  const { month: rawMonth } = await searchParams;
  const ym = /^\d{4}-\d{2}$/.test(rawMonth ?? "") ? (rawMonth as string) : todayYm;
  const { start, end } = monthRange(ym);

  // كل تذاكر الشهر المكتملة — التجميع في الذاكرة (أحجام صغيرة لكل محل)
  const tickets = await prisma.ticket.findMany({
    where: { shopId, status: "completed", serviceDate: { gte: start, lt: end } },
    select: { barberId: true, totalPrice: true, serviceDate: true },
  });

  type Agg = { count: number; revenue: number };
  const zero = (): Agg => ({ count: 0, revenue: 0 });
  const add = (a: Agg, t: { totalPrice: number }) => {
    a.count += 1;
    a.revenue += t.totalPrice;
  };

  const todayKey = today.toISOString();
  const byStaffMonth = new Map<string, Agg>();
  const byStaffToday = new Map<string, Agg>();
  const byDay = new Map<string, Agg>();
  const monthTotal = zero();

  for (const t of tickets) {
    const sid = t.barberId?.toString() ?? "unassigned";
    if (!byStaffMonth.has(sid)) byStaffMonth.set(sid, zero());
    add(byStaffMonth.get(sid)!, t);
    const dayKey = t.serviceDate.toISOString();
    if (!byDay.has(dayKey)) byDay.set(dayKey, zero());
    add(byDay.get(dayKey)!, t);
    if (dayKey === todayKey) {
      if (!byStaffToday.has(sid)) byStaffToday.set(sid, zero());
      add(byStaffToday.get(sid)!, t);
    }
    add(monthTotal, t);
  }

  const days = [...byDay.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1)); // الأحدث أولاً
  const isCurrentMonth = ym === todayYm;
  // صف لكل فرد + "غير معيّن" إن وُجد
  const staffRows = [
    ...shop.users.map((u) => ({
      id: u.id.toString(),
      name: u.name,
      isManager: u.role === "manager",
    })),
    ...(byStaffMonth.has("unassigned")
      ? [{ id: "unassigned", name: t.unassigned, isManager: false }]
      : []),
  ];

  return (
    <main
      className={`${theme.className} min-h-dvh px-4 py-6`}
      dir={dirFor(locale)}
      lang={locale}
      style={{ fontFamily: fontVarFor(locale) }}
    >
      <div className="mx-auto max-w-2xl flex flex-col gap-5">
        <div className="flex justify-center">
          <LangSwitcher current={locale} />
        </div>
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">{t.title}</h1>
            <p className="muted text-sm">{shop.name}</p>
          </div>
          <Link href="/dashboard" className="surface px-3 py-2 text-sm font-bold no-underline">
            {t.backToDashboard}
          </Link>
        </header>

        {/* تنقّل الشهور */}
        <div className="surface p-3 flex items-center justify-between">
          <Link href={`/dashboard/stats?month=${shiftMonth(ym, -1)}`} className="px-3 py-1 rounded surface no-underline font-bold">
            {t.prev}
          </Link>
          <span className="font-extrabold">{fmtMonth.format(start)}</span>
          {isCurrentMonth ? (
            <span className="px-3 py-1 muted text-sm">{t.current}</span>
          ) : (
            <Link href={`/dashboard/stats?month=${shiftMonth(ym, 1)}`} className="px-3 py-1 rounded surface no-underline font-bold">
              {t.next}
            </Link>
          )}
        </div>

        {/* إنجاز اليوم لكل فرد */}
        {isCurrentMonth && (
          <section className="surface p-5">
            <h2 className="font-extrabold mb-3">{t.todayPrefix} {fmtDay.format(today)}</h2>
            <div className="flex flex-col gap-2">
              {staffRows.map((s) => {
                const a = byStaffToday.get(s.id) ?? zero();
                return (
                  <div key={s.id} className="surface p-3 flex items-center justify-between" style={{ background: "var(--surface-2)" }}>
                    <span className="font-bold">
                      {s.name}
                      {s.isManager && (
                        <span className="text-xs font-bold mr-2 px-2 py-0.5 rounded" style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}>
                          {t.managerBadge}
                        </span>
                      )}
                    </span>
                    <span className="text-sm">
                      {t.did} <span className="font-extrabold" style={{ color: "var(--accent)" }}>{nf.format(a.count)}</span>
                      {" · "}{t.collected} <span className="font-extrabold" style={{ color: "var(--accent)" }}>{nf.format(a.revenue)}</span> {t.currency}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* محصلة الشهر لكل فرد */}
        <section className="surface p-5">
          <h2 className="font-extrabold mb-3">{t.monthPerPerson}</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="muted text-start">
                <th className="py-2 font-bold">{t.colName}</th>
                <th className="py-2 font-bold">{t.colDone}</th>
                <th className="py-2 font-bold">{t.colRevenue}</th>
              </tr>
            </thead>
            <tbody>
              {staffRows.map((s) => {
                const a = byStaffMonth.get(s.id) ?? zero();
                return (
                  <tr key={s.id} style={{ borderTop: "1px solid var(--border)" }}>
                    <td className="py-2 font-bold">
                      {s.name}
                      {s.isManager && <span className="muted text-xs"> {t.managerParen}</span>}
                    </td>
                    <td className="py-2">{nf.format(a.count)}</td>
                    <td className="py-2">{nf.format(a.revenue)}</td>
                  </tr>
                );
              })}
              <tr style={{ borderTop: "2px solid var(--border)" }}>
                <td className="py-2 font-extrabold">{t.total}</td>
                <td className="py-2 font-extrabold" style={{ color: "var(--accent)" }}>{nf.format(monthTotal.count)}</td>
                <td className="py-2 font-extrabold" style={{ color: "var(--accent)" }}>{nf.format(monthTotal.revenue)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* التفصيل اليومي */}
        <section className="surface p-5">
          <h2 className="font-extrabold mb-3">{t.dailyBreakdown}</h2>
          {days.length === 0 ? (
            <p className="muted text-sm">{t.noneYet}</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="muted text-start">
                  <th className="py-2 font-bold">{t.colDay}</th>
                  <th className="py-2 font-bold">{t.colDone}</th>
                  <th className="py-2 font-bold">{t.colRevenue}</th>
                </tr>
              </thead>
              <tbody>
                {days.map(([dayKey, a]) => (
                  <tr key={dayKey} style={{ borderTop: "1px solid var(--border)" }}>
                    <td className="py-2 font-bold">
                      {fmtDay.format(new Date(dayKey))}
                      {dayKey === todayKey && (
                        <span className="text-xs font-bold mr-2 px-2 py-0.5 rounded" style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}>
                          {t.todayBadge}
                        </span>
                      )}
                    </td>
                    <td className="py-2">{nf.format(a.count)}</td>
                    <td className="py-2">{nf.format(a.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}
