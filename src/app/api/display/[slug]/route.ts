import { NextResponse } from "next/server";
import { displayStateFor } from "@/lib/display";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const state = await displayStateFor(slug);
  if (!state) return NextResponse.json({ found: false }, { status: 404 });
  return NextResponse.json(state, { headers: { "Cache-Control": "no-store" } });
}
