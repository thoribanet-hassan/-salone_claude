import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { themeFor } from "@/lib/theme";
import { serviceDateFor } from "@/lib/queue";
import ServeView from "./ServeView";

export const metadata = { title: "شاشة الموظف | دورك" };

export default async function ServePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const barberId = BigInt(session.userId);
  const shopId = BigInt(session.shopId);

  const [barber, shop, current, waitingAssigned, waitingPool] = await Promise.all([
    prisma.user.findUnique({ where: { id: barberId } }),
    prisma.shop.findUnique({ where: { id: shopId }, include: { settings: true } }),
    prisma.ticket.findFirst({
      where: { barberId, status: "serving" },
      include: { service: true },
    }),
    prisma.ticket.count({ where: { barberId, status: "waiting" } }),
    prisma.ticket.count({ where: { shopId, barberId: null, status: "waiting" } }),
  ]);

  if (!barber || !shop) redirect("/login");

  const today = serviceDateFor(shop.timezone);
  const skipped = await prisma.ticket.findMany({
    where: { shopId, status: "skipped", serviceDate: today },
    orderBy: { completedAt: "desc" },
    take: 10,
  });

  const theme = themeFor(shop.facilityType);
  const isManual = shop.settings?.countdownMode === "manual";
  const noTimes = shop.settings?.countdownMode === "none";

  return (
    <main className={`${theme.className} min-h-screen flex flex-col items-center px-5 py-6`}>
      <ServeView
        theme={theme.className}
        shopName={shop.name}
        barberName={barber.name}
        role={session.role}
        status={barber.status}
        isManual={isManual}
        noTimes={noTimes}
        waitingCount={waitingAssigned + waitingPool}
        skipped={skipped.map((t) => ({
          id: t.id.toString(),
          ticketNumber: t.ticketNumber,
          customerName: t.customerName,
        }))}
        current={
          current
            ? {
                ticketNumber: current.ticketNumber,
                customerName: current.customerName,
                serviceName: current.serviceLabel ?? current.service?.name ?? null,
              }
            : null
        }
      />
    </main>
  );
}
