import { notFound } from "next/navigation";
import { getTicketState } from "@/lib/ticketState";
import { prisma } from "@/lib/db";
import { logEvent, visitorIdFrom } from "@/lib/events";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import TicketView from "./TicketView";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const state = await getTicketState(token);
  if (!state) notFound();

  // قياس: فتح صفحة الانتظار — أول زيارة OPENED وما بعدها REVISITED
  // (يُسجَّل هنا فقط عند تحميل الصفحة، لا في مزامنات الـ polling)
  const t = await prisma.ticket.findUnique({
    where: { publicToken: token },
    select: { id: true, shopId: true },
  });
  if (t) {
    const visitorId = await visitorIdFrom();
    const seenBefore = visitorId
      ? await prisma.event.findFirst({
          where: { ticketId: t.id, visitorId, type: "WAIT_PAGE_OPENED" },
          select: { id: true },
        })
      : null;
    void logEvent(seenBefore ? "WAIT_PAGE_REVISITED" : "WAIT_PAGE_OPENED", {
      shopId: t.shopId,
      ticketId: t.id,
      visitorId,
    });
  }

  return (
    <main className={`${state.theme} min-h-screen flex flex-col items-center px-5 py-8`}>
      <AnnouncementBanner page="ticket" shopId={t?.shopId} className="w-full max-w-md mb-4" />
      <TicketView token={token} initial={state} />
    </main>
  );
}
