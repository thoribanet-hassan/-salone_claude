// بذرة محل من النوع "طابور عام" — مطعم مزدحم (حجز موحّد بلا اختيار موظف)
import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto";
const prisma = new PrismaClient();

function hashPassword(pw) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(pw, salt, 64).toString("hex")}`;
}
const DEMO_PW = hashPassword("salon123");

async function main() {
  const slug = "restaurant-demo";
  await prisma.shop.deleteMany({ where: { slug } }); // إعادة بناء نظيفة

  const shop = await prisma.shop.create({
    data: {
      name: "مطعم الذوّاقة",
      ownerName: "فهد",
      facilityType: "general",
      shopCode: "QS-2001",
      slug,
      plan: "basic",
      timezone: "Asia/Riyadh",
      settings: {
        create: {
          isOpen: true,
          showBarberName: false, // طابور عام: لا يُعرض اسم موظف
          countdownMode: "manual", // المدير يطلق العدّاد عند اقتراب انصراف زبون
        },
      },
      users: {
        create: [
          { name: "فهد (المدير)", email: "fahd@demo.test", passwordHash: DEMO_PW, role: "manager", status: "available", avgServiceTime: 15 },
          // "محطات خدمة" داخلية لضبط التوازي والمدة — لا يراها الزبون
          { name: "محطة 1", role: "barber", loginCode: "7001", status: "available", avgServiceTime: 15 },
          { name: "محطة 2", role: "barber", loginCode: "7002", status: "available", avgServiceTime: 15 },
        ],
      },
    },
    include: { users: { where: { role: "barber" } } },
  });

  // خدمة واحدة موحّدة ← حجز بنقرة واحدة
  const service = await prisma.service.create({
    data: { shopId: shop.id, name: "دخول الطابور", defaultDuration: 15, position: 1 },
  });

  for (const station of shop.users) {
    await prisma.barberService.create({
      data: { barberId: station.id, serviceId: service.id, duration: 15 },
    });
  }

  console.log(`✓ ${slug}: طابور عام، ${shop.users.length} محطات، خدمة موحّدة واحدة`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
