import { NextResponse } from "next/server";
import { getTicketState } from "@/lib/ticketState";

// نقطة المزامنة: تُرجع آخر حالة للتذكرة من قاعدة البيانات (للـ polling وإعادة المزامنة)
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const state = await getTicketState(token);
  if (!state) {
    return NextResponse.json({ found: false }, { status: 404 });
  }
  return NextResponse.json(state, {
    headers: { "Cache-Control": "no-store" },
  });
}
