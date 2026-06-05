import { PrismaClient } from "@prisma/client";

// Prisma client كـ singleton لتفادي تعدد الاتصالات أثناء التطوير (HMR)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
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
