"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { hashPassword, setSession } from "@/lib/auth";
import { arabicToSlug, uniqueSlug, generateShopCode } from "@/lib/shop";
import type { FacilityType } from "@prisma/client";

export interface RegisterState {
  error?: string;
}

const VALID: FacilityType[] = ["male_barber", "female_salon", "general"];

export async function registerAction(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const shopName = String(formData.get("shopName") ?? "").trim();
  const ownerName = String(formData.get("ownerName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const facilityType = String(formData.get("facilityType") ?? "") as FacilityType;
  const timezone = String(formData.get("timezone") ?? "Asia/Riyadh") || "Asia/Riyadh";

  if (!shopName || !ownerName || !email || !password)
    return { error: "يرجى تعبئة كل الحقول" };
  if (password.length < 6) return { error: "كلمة المرور 6 أحرف على الأقل" };
  if (!VALID.includes(facilityType)) return { error: "اختر نوع المنشأة" };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "هذا البريد مسجّل مسبقاً" };

  const slug = await uniqueSlug(arabicToSlug(shopName));
  const shopCode = await generateShopCode();
  const isGeneral = facilityType === "general";

  const shop = await prisma.shop.create({
    data: {
      name: shopName,
      ownerName,
      facilityType,
      slug,
      shopCode,
      timezone,
      settings: {
        create: {
          isOpen: true,
          allowProviderChoice: !isGeneral,
          showBarberName: !isGeneral,
          countdownMode: isGeneral ? "manual" : "auto",
        },
      },
      // المدير = حلاق أيضاً
      users: {
        create: {
          name: ownerName,
          email,
          passwordHash: hashPassword(password),
          role: "manager",
          status: "available",
          avgServiceTime: 20,
        },
      },
      // خدمة افتراضية ليعمل الحجز فوراً
      services: {
        create: { name: isGeneral ? "دخول الطابور" : "خدمة", defaultDuration: 20, position: 1 },
      },
    },
    include: { users: true, services: true },
  });

  // ربط المدير(الحلاق) بالخدمة الافتراضية في مصفوفة الأزمنة
  const manager = shop.users[0];
  await prisma.barberService.create({
    data: { barberId: manager.id, serviceId: shop.services[0].id, duration: 20 },
  });

  await setSession({
    userId: manager.id.toString(),
    shopId: shop.id.toString(),
    role: "manager",
    name: manager.name,
  });

  redirect("/dashboard");
}
