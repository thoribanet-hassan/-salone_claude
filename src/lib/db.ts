import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma client كـ singleton لتفادي تعدد الاتصالات أثناء التطوير (HMR)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// محوّل pg (JavaScript خالص، بلا محرّك ثنائي) — الأنسب لبيئة serverless مثل Vercel
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Next.js لا يستطيع تحويل BigInt إلى JSON — نحوّله لرقم/نص بأمان
export function serialize<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, v) =>
      typeof v === "bigint" ? v.toString() : v
    )
  );
}
