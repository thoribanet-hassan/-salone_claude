import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ربط اشتراك Push المتصفحي بتذكرة — upsert على endpoint:
// نفس المتصفح بتذكرة جديدة → يُعاد ربط الاشتراك بالتذكرة الأحدث
export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const body = await req.json().catch(() => null);
  const endpoint = typeof body?.endpoint === "string" ? body.endpoint : "";
  const p256dh = typeof body?.keys?.p256dh === "string" ? body.keys.p256dh : "";
  const auth = typeof body?.keys?.auth === "string" ? body.keys.auth : "";
  if (!endpoint.startsWith("https://") || !p256dh || !auth) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { publicToken: token },
    select: { id: true, status: true },
  });
  if (!ticket || (ticket.status !== "waiting" && ticket.status !== "serving")) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    create: { ticketId: ticket.id, endpoint, p256dh, auth },
    update: { ticketId: ticket.id, p256dh, auth, lastNotifiedStage: null },
  });
  return NextResponse.json({ ok: true });
}
