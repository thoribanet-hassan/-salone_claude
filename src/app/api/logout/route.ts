import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";
import { appBaseUrl } from "@/lib/url";

export async function GET() {
  await clearSession();
  return NextResponse.redirect(`${appBaseUrl()}/login`);
}
