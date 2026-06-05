import { NextResponse } from "next/server";
import { cleanupQueues } from "@/lib/queue";

// نقطة تنظيف الطابور — يستدعيها cron دورياً (محميّة بمفتاح إن وُجد)
export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("key");
  const secret = process.env.CRON_SECRET;
  if (secret && key !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const result = await cleanupQueues();
  return NextResponse.json({ ok: true, ...result }, { headers: { "Cache-Control": "no-store" } });
}
