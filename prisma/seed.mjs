// بذرة بيانات تجريبية: محلّان (حلاق رجالي + صالون نسائي) مع حلاقين
import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto";
const prisma = new PrismaClient();

// نفس خوارزمية auth.ts لتشفير كلمة المرور
function hashPassword(pw) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(pw, salt, 64).toString("hex")}`;
}
// كلمة مرور المديرين التجريبيين
const DEMO_PW = hashPassword("salon123");

async function main() {
  // محل حلاقة رجالي
  const barberShop = await prisma.shop.upsert({
    where: { slug: "barber-elite" },
    update: {},
    create: {
      name: "صالون النخبة للحلاقة",
      ownerName: "أحمد",
      facilityType: "male_barber",
      shopCode: "QS-1001",
      slug: "barber-elite",
      plan: "basic",
      timezone: "Asia/Riyadh",
      settings: { create: { isOpen: true } },
      users: {
        create: [
          { name: "أحمد (المدير)", email: "ahmed@demo.test", passwordHash: DEMO_PW, role: "manager", status: "available", avgServiceTime: 20 },
          { name: "خالد", role: "barber", loginCode: "1111", status: "available", avgServiceTime: 20 },
          { name: "سعد", role: "barber", loginCode: "2222", status: "available", avgServiceTime: 30 },
        ],
      },
    },
  });

  // صالون تجميل نسائي
  const salonShop = await prisma.shop.upsert({
    where: { slug: "bareeq-salon" },
    update: {},
    create: {
      name: "صالون بريق الفخامة",
      ownerName: "نورة",
      facilityType: "female_salon",
      shopCode: "QS-1002",
      slug: "bareeq-salon",
      plan: "pro",
      timezone: "Asia/Riyadh",
      settings: { create: { isOpen: true } },
      users: {
        create: [
          { name: "نورة (المديرة)", email: "noura@demo.test", passwordHash: DEMO_PW, role: "manager", status: "available", avgServiceTime: 25 },
          { name: "سارة", role: "barber", loginCode: "3333", status: "available", avgServiceTime: 25 },
        ],
      },
    },
  });

  console.log("✓ Seeded:", barberShop.slug, "+", salonShop.slug);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
