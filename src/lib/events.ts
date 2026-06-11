import { headers, cookies } from "next/headers";
import type { EventType, Prisma } from "@prisma/client";
import { prisma } from "./db";

export interface EventInput {
  shopId?: bigint | null;
  ticketId?: bigint | null;
  visitorId?: string | null;
  source?: string | null;
  meta?: Prisma.InputJsonValue;
}

// تسجيل حدث قياس — لا يُعطّل المسار الرئيسي أبداً: الفشل يُسجَّل في اللوج ويُبتلع
export async function logEvent(type: EventType, input: EventInput = {}): Promise<void> {
  try {
    await prisma.event.create({
      data: {
        type,
        shopId: input.shopId ?? null,
        ticketId: input.ticketId ?? null,
        visitorId: input.visitorId ?? null,
        source: input.source ?? null,
        meta: input.meta,
      },
    });
  } catch (err) {
    console.error("event log failed:", type, err);
  }
}

// معرّف الزائر المجهول — يزرعه الميدل وير كوكي + هيدر (الهيدر يغطي أول طلب قبل وصول الكوكي)
export async function visitorIdFrom(): Promise<string | null> {
  const fromHeader = (await headers()).get("x-visitor-id");
  if (fromHeader) return fromHeader;
  return (await cookies()).get("dwk_vid")?.value ?? null;
}

const SOURCE_RE = /^[a-z0-9_-]{1,32}$/;

export function sanitizeSource(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const v = raw.trim().toLowerCase();
  return SOURCE_RE.test(v) ? v : null;
}

// مصدر الدخول الملتقط من ?source= (يحفظه الميدل وير في كوكي قصير العمر)
export async function sourceFrom(): Promise<string | null> {
  return sanitizeSource((await cookies()).get("dwk_src")?.value);
}
