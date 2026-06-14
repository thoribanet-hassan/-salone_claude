import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { themeFor } from "@/lib/theme";
import { logEvent, visitorIdFrom, sanitizeSource, sourceFrom } from "@/lib/events";
import { availableSlotsFor } from "@/lib/slots";
import { getServerLocale } from "@/lib/locale-server";
import { dirFor, fontVarFor } from "@/lib/i18n";
import { BOOKING } from "@/i18n/booking";
import LangSwitcher from "@/components/LangSwitcher";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import BookingForm from "./BookingForm";

// لا تخزين مؤقت — تظهر الخدمات/الحالة المحدّثة فوراً للزبون
export const dynamic = "force-dynamic";

export default async function JoinPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ source?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const shop = await prisma.shop.findUnique({
    where: { slug },
    include: {
      settings: true,
      users: {
        // المدير حلاق أيضاً → نعدّه مزوّد خدمة
        where: { role: { in: ["manager", "barber"] }, isActive: true },
        orderBy: { name: "asc" },
      },
      services: {
        where: { isActive: true },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!shop) notFound();

  // قياس: فتح صفحة الحجز (مسح QR أو رابط مباشر)
  void logEvent("QR_SCANNED", {
    shopId: shop.id,
    visitorId: await visitorIdFrom(),
    source: sanitizeSource(sp.source) ?? (await sourceFrom()),
  });

  // استرجاع تلقائي: إن كان للزبون دور نشط محفوظ في الكوكي، نعرض له رابط متابعته فوراً
  const lastToken = (await cookies()).get("last_ticket")?.value;
  let activeTicket: { publicToken: string; ticketNumber: number } | null = null;
  if (lastToken) {
    const t = await prisma.ticket.findUnique({
      where: { publicToken: lastToken },
      select: { publicToken: true, ticketNumber: true, shopId: true, status: true },
    });
    if (t && t.shopId === shop.id && (t.status === "waiting" || t.status === "serving")) {
      activeTicket = { publicToken: t.publicToken, ticketNumber: t.ticketNumber };
    }
  }

  const theme = themeFor(shop.facilityType);
  const activeBarbers = shop.users;
  const availableBarbers = activeBarbers.filter((b) => b.status === "available");
  const canBook =
    !!shop.settings?.isOpen &&
    activeBarbers.length > 0 &&
    availableBarbers.length > 0 &&
    shop.services.length > 0;

  const locale = await getServerLocale();
  const t = BOOKING[locale];

  // خانات المواعيد المتاحة لليوم (تُولَّد فقط إن فُعّلت المواعيد)
  const slots = shop.settings?.allowScheduling
    ? await availableSlotsFor(shop, t.amShort, t.pmShort)
    : [];

  return (
    <main
      className={`${theme.className} min-h-screen flex flex-col items-center px-5 py-8`}
      dir={dirFor(locale)}
      lang={locale}
      style={{ fontFamily: fontVarFor(locale) }}
    >
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex justify-center">
          <LangSwitcher current={locale} />
        </div>
        <header className="text-center">
          <p className="muted text-sm mb-1">{shop.facilityLabel || theme.label}</p>
          <h1 className="text-3xl font-extrabold">{shop.name}</h1>
        </header>

        <AnnouncementBanner page="join" shopId={shop.id} />

        {activeTicket && (
          <a
            href={`/t/${activeTicket.publicToken}`}
            className="btn-accent text-center py-4 px-4 no-underline"
          >
            {t.activeTicket.replace("{n}", String(activeTicket.ticketNumber))}
          </a>
        )}

        <div className="surface p-6">
          {canBook ? (
            <>
              <h2 className="text-xl font-bold mb-1">{t.bookTitle}</h2>
              <p className="muted text-sm mb-5">{t.bookLead}</p>
              <BookingForm
                slug={shop.slug}
                t={t}
                showProviderChoice={!!shop.settings?.allowProviderChoice}
                barbers={availableBarbers.map((b) => ({
                  id: b.id.toString(),
                  name: b.name,
                }))}
                allowServiceChoice={!!shop.settings?.allowServiceChoice}
                allowScheduling={!!shop.settings?.allowScheduling}
                slots={slots}
                showPrices={!!shop.settings?.showPrices}
                services={shop.services.map((s) => ({
                  id: s.id.toString(),
                  name: s.name,
                  duration: s.defaultDuration,
                  price: s.price,
                }))}
              />
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-lg font-bold mb-2">{t.closedTitle}</p>
              <p className="muted">{t.closedBody}</p>
            </div>
          )}
        </div>

        <a
          href={`/j/${shop.slug}/find`}
          className="surface text-center py-3 font-bold no-underline"
        >
          {t.recoverLink}
        </a>

        <p className="muted text-center text-xs">{t.poweredBy}</p>
      </div>
    </main>
  );
}
