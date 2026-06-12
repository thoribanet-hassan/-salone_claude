import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logEvent } from "@/lib/events";

// تقييم الزبون للخدمة بعد إكمالها — يُقبل مرة واحدة فقط لكل تذكرة مكتملة
export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const body = await req.json().catch(() => ({}));
  const rating = Number(body?.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { publicToken: token },
    select: { id: true, shopId: true, status: true, rating: true, source: true },
  });
  if (!ticket) return NextResponse.json({ ok: false }, { status: 404 });
  // لا يُقيَّم إلا ما اكتمل، ولا يُعاد التقييم
  if (ticket.status !== "completed" || ticket.rating != null) {
    return NextResponse.json({ ok: false, rating: ticket.rating ?? null });
  }

  await prisma.ticket.update({ where: { id: ticket.id }, data: { rating } });
  void logEvent("SERVICE_RATED", {
    shopId: ticket.shopId,
    ticketId: ticket.id,
    source: ticket.source,
    meta: { rating },
  });
  return NextResponse.json({ ok: true, rating });
}
