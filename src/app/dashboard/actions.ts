"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { generateLoginCode } from "@/lib/shop";
import { setBarberStatus } from "@/lib/queue";
import type { CountdownMode } from "@prisma/client";

async function requireManager() {
  const s = await getSession();
  if (!s || s.role !== "manager") redirect("/login");
  return { userId: BigInt(s.userId), shopId: BigInt(s.shopId) };
}

const PLAN_LIMITS: Record<string, number> = {
  basic: 3,
  pro: 7,
  premium: 15,
  enterprise: Infinity,
};

// مزامنة مهام موظف من نص حر ("قص شعر، دقن، تنظيف بشرة"):
// تنشئ الخدمة إن لم توجد، تربطها بالموظف، وعند replace تفك ما لم يعد مذكوراً
async function syncStaffTasks(
  shopId: bigint,
  staffId: bigint,
  tasksText: string,
  replace: boolean
) {
  const names = [
    ...new Set(
      tasksText
        .split(/[،,\n]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    ),
  ];
  const linked: bigint[] = [];
  for (const name of names) {
    let svc = await prisma.service.findFirst({ where: { shopId, name } });
    if (!svc) {
      const count = await prisma.service.count({ where: { shopId } });
      svc = await prisma.service.create({
        data: { shopId, name, defaultDuration: 20, position: count + 1 },
      });
    }
    await prisma.barberService.upsert({
      where: { barberId_serviceId: { barberId: staffId, serviceId: svc.id } },
      update: {},
      create: { barberId: staffId, serviceId: svc.id, duration: svc.defaultDuration },
    });
    linked.push(svc.id);
  }
  if (replace) {
    await prisma.barberService.deleteMany({
      where: { barberId: staffId, serviceId: { notIn: linked } },
    });
  }
}

// ===== الموظفون =====
export async function addBarberAction(formData: FormData) {
  const { shopId } = await requireManager();
  const name = String(formData.get("name") ?? "").trim();
  const avg = parseInt(String(formData.get("avgServiceTime") ?? "20"), 10) || 20;
  const tasksText = String(formData.get("tasks") ?? "").trim();
  if (!name) return;

  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  const activeCount = await prisma.user.count({
    where: { shopId, role: "barber", isActive: true },
  });
  if (activeCount >= (PLAN_LIMITS[shop?.plan ?? "basic"] ?? 3)) return; // وصل الحد

  const loginCode = await generateLoginCode(shopId);
  const barber = await prisma.user.create({
    data: { shopId, name, role: "barber", avgServiceTime: avg, loginCode, status: "available" },
  });
  if (tasksText) {
    // مهامه المكتوبة نصياً — تُنشأ كخدمات وتُربط به
    await syncStaffTasks(shopId, barber.id, tasksText, false);
  } else {
    // لا مهام محددة ← اربطه بكل الخدمات الموجودة
    const services = await prisma.service.findMany({ where: { shopId } });
    if (services.length) {
      await prisma.barberService.createMany({
        data: services.map((s) => ({ barberId: barber.id, serviceId: s.id, duration: s.defaultDuration })),
      });
    }
  }
  revalidatePath("/dashboard");
}

// تعديل مهام موظف/مدير (نص حر، يستبدل القائمة الحالية)
export async function setTasksAction(formData: FormData) {
  const { shopId } = await requireManager();
  const staffId = BigInt(String(formData.get("barberId")));
  const tasksText = String(formData.get("tasks") ?? "");
  await syncStaffTasks(shopId, staffId, tasksText, true);
  revalidatePath("/dashboard");
  revalidatePath("/j/[slug]", "page");
}

export async function regenerateCodeAction(formData: FormData) {
  const { shopId } = await requireManager();
  const barberId = BigInt(String(formData.get("barberId")));
  const code = await generateLoginCode(shopId);
  await prisma.user.update({ where: { id: barberId }, data: { loginCode: code } });
  revalidatePath("/dashboard");
}

// توفّر مؤقّت (غداء/مشوار): متاح ⇄ غير متاح — لا يمسّ الحساب
export async function setAvailabilityAction(formData: FormData) {
  await requireManager();
  const barberId = BigInt(String(formData.get("barberId")));
  const to = String(formData.get("to")) === "available" ? "available" : "unavailable";
  await setBarberStatus(barberId, to);
  revalidatePath("/dashboard");
}

export async function toggleBarberAction(formData: FormData) {
  await requireManager();
  const barberId = BigInt(String(formData.get("barberId")));
  const b = await prisma.user.findUnique({ where: { id: barberId } });
  if (b) await prisma.user.update({ where: { id: barberId }, data: { isActive: !b.isActive } });
  revalidatePath("/dashboard");
}

export async function deleteBarberAction(formData: FormData) {
  const { userId } = await requireManager();
  const barberId = BigInt(String(formData.get("barberId")));
  if (barberId === userId) return; // لا يحذف المدير نفسه
  await prisma.user.delete({ where: { id: barberId } });
  revalidatePath("/dashboard");
}

// ===== الخدمات =====
export async function addServiceAction(formData: FormData) {
  const { shopId } = await requireManager();
  const name = String(formData.get("name") ?? "").trim();
  const dur = parseInt(String(formData.get("defaultDuration") ?? "20"), 10) || 20;
  const price = Math.max(0, parseInt(String(formData.get("price") ?? "0"), 10) || 0);
  if (!name) return;
  const count = await prisma.service.count({ where: { shopId } });
  const service = await prisma.service.create({
    data: { shopId, name, defaultDuration: dur, price, position: count + 1 },
  });
  const barbers = await prisma.user.findMany({ where: { shopId, role: "barber" } });
  if (barbers.length) {
    await prisma.barberService.createMany({
      data: barbers.map((b) => ({ barberId: b.id, serviceId: service.id, duration: dur })),
    });
  }
  revalidatePath("/dashboard");
}

export async function deleteServiceAction(formData: FormData) {
  await requireManager();
  const serviceId = BigInt(String(formData.get("serviceId")));
  await prisma.service.delete({ where: { id: serviceId } });
  revalidatePath("/dashboard");
}

export async function setPriceAction(formData: FormData) {
  await requireManager();
  const serviceId = BigInt(String(formData.get("serviceId")));
  const price = Math.max(0, parseInt(String(formData.get("price") ?? "0"), 10) || 0);
  await prisma.service.update({ where: { id: serviceId }, data: { price } });
  revalidatePath("/dashboard");
  revalidatePath("/j/[slug]", "page");
}

export async function setDurationAction(formData: FormData) {
  await requireManager();
  const barberId = BigInt(String(formData.get("barberId")));
  const serviceId = BigInt(String(formData.get("serviceId")));
  const dur = parseInt(String(formData.get("duration") ?? "20"), 10) || 20;
  await prisma.barberService.upsert({
    where: { barberId_serviceId: { barberId, serviceId } },
    update: { duration: dur },
    create: { barberId, serviceId, duration: dur },
  });
  revalidatePath("/dashboard");
}

// ===== الإعدادات =====
export async function updateSettingsAction(formData: FormData) {
  const { shopId } = await requireManager();
  const b = (k: string) => formData.get(k) === "on";
  const modeRaw = String(formData.get("countdownMode"));
  const mode = (["auto", "manual", "none"].includes(modeRaw) ? modeRaw : "auto") as CountdownMode;
  const time = (k: string, def: string) => {
    const v = String(formData.get(k) ?? "");
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(v) ? v : def;
  };
  const clampInt = (k: string, def: number, min: number, max: number) => {
    const n = parseInt(String(formData.get(k)), 10);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def;
  };
  await prisma.shopSettings.update({
    where: { shopId },
    data: {
      isOpen: b("isOpen"),
      allowProviderChoice: b("allowProviderChoice"),
      allowServiceChoice: b("allowServiceChoice"),
      allowScheduling: b("allowScheduling"),
      showPrices: b("showPrices"),
      showExpectedTime: b("showExpectedTime"),
      showPeopleAhead: b("showPeopleAhead"),
      showBarberName: b("showBarberName"),
      showCountdown: b("showCountdown"),
      countdownMode: mode,
      openTime: time("openTime", "09:00"),
      closeTime: time("closeTime", "22:00"),
      slotMinutes: clampInt("slotMinutes", 30, 5, 240),
      appointmentGraceMinutes: clampInt("appointmentGraceMinutes", 15, 0, 120),
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/j/[slug]", "page");
}
