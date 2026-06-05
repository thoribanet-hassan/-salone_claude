import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { joinUrlFor } from "@/lib/url";

// يولّد QR للمحل — SVG (افتراضي، عالي الدقة للطباعة) أو PNG
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const format = new URL(req.url).searchParams.get("format") ?? "svg";

  const shop = await prisma.shop.findUnique({ where: { slug }, select: { id: true } });
  if (!shop) return NextResponse.json({ error: "not found" }, { status: 404 });

  const url = joinUrlFor(slug);
  const opts = { margin: 2, errorCorrectionLevel: "M" as const, width: 1024 };

  if (format === "png") {
    const buf = await QRCode.toBuffer(url, { ...opts, type: "png" });
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `inline; filename="qr-${slug}.png"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  const svg = await QRCode.toString(url, { ...opts, type: "svg" });
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Content-Disposition": `inline; filename="qr-${slug}.svg"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
