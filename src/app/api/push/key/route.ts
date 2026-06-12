import { NextResponse } from "next/server";
import { vapidPublicKey } from "@/lib/push";

// المفتاح العام لاشتراك المتصفح في Push (لا يحتاج رفع سرية)
export async function GET() {
  const key = vapidPublicKey();
  if (!key) return NextResponse.json({ key: null }, { status: 503 });
  return NextResponse.json({ key });
}
