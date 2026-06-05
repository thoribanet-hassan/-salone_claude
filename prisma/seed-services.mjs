// بذرة الخدمات + مصفوفة أزمنة الحلاقين (idempotent: تُعيد البناء نظيفاً)
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// تعريف الخدمات وأزمنة كل حلاق (بالاسم) لكل محل
const PLAN = {
  "barber-elite": {
    services: [
      { name: "قص شعر", defaultDuration: 20, position: 1 },
      { name: "حلاقة ذقن", defaultDuration: 15, position: 2 },
      { name: "قص + ذقن", defaultDuration: 30, position: 3 },
    ],
    // زمن كل حلاق لكل خدمة (دقائق) — بالاسم
    durations: {
      "خالد": { "قص شعر": 15, "حلاقة ذقن": 10, "قص + ذقن": 25 },
      "سعد": { "قص شعر": 25, "حلاقة ذقن": 15, "قص + ذقن": 35 },
    },
  },
  "bareeq-salon": {
    services: [
      { name: "قص وتصفيف", defaultDuration: 30, position: 1 },
      { name: "صبغة", defaultDuration: 60, position: 2 },
      { name: "مكياج", defaultDuration: 45, position: 3 },
    ],
    durations: {
      "سارة": { "قص وتصفيف": 25, "صبغة": 50, "مكياج": 40 },
    },
  },
};

async function main() {
  for (const [slug, cfg] of Object.entries(PLAN)) {
    const shop = await prisma.shop.findUnique({
      where: { slug },
      include: { users: { where: { role: "barber" } } },
    });
    if (!shop) {
      console.log("skip (no shop):", slug);
      continue;
    }

    // إعادة بناء نظيفة
    await prisma.service.deleteMany({ where: { shopId: shop.id } });

    const services = [];
    for (const s of cfg.services) {
      services.push(await prisma.service.create({ data: { ...s, shopId: shop.id } }));
    }

    // مصفوفة الأزمنة: لكل حلاق، لكل خدمة
    for (const barber of shop.users) {
      const custom = cfg.durations[barber.name] || {};
      for (const svc of services) {
        const duration = custom[svc.name] ?? svc.defaultDuration;
        await prisma.barberService.upsert({
          where: { barberId_serviceId: { barberId: barber.id, serviceId: svc.id } },
          update: { duration },
          create: { barberId: barber.id, serviceId: svc.id, duration },
        });
      }
    }
    console.log(`✓ ${slug}: ${services.length} services, ${shop.users.length} barbers wired`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
