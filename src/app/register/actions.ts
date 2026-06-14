"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { hashPassword, setSession } from "@/lib/auth";
import { arabicToSlug, uniqueSlug, generateShopCode } from "@/lib/shop";
import { getServerLocale } from "@/lib/locale-server";
import { AUTH } from "@/i18n/auth";
import type { FacilityType } from "@prisma/client";

export interface RegisterState {
  error?: string;
}

// يستنتج المظهر/الافتراضات من النص الحر الذي كتبه صاحب المنشأة — النص نفسه هو الظاهر للزبائن
function inferFacilityType(label: string): FacilityType {
  if (/حلاق|رجالي|باربر/.test(label)) return "male_barber";
  if (/نسائي|تجميل|كوافير|مشغل|ميك ?اب|صالون/.test(label)) return "female_salon";
  if (/مطعم|كوفي|مقهى|كافيه|قهوة|بوفيه|مطبخ|حلويات/.test(label)) return "restaurant";
  if (/عيادة|مستوصف|طبي|طب|أسنان|اسنان|مجمع|مختبر|صيدلية/.test(label)) return "clinic";
  return "general";
}

// إعدادات افتراضية معقولة لكل نوع — كلها قابلة للتغيير لاحقاً من لوحة التحكم الموحّدة
const TYPE_DEFAULTS: Record<
  FacilityType,
  { providerChoice: boolean; countdownMode: "auto" | "manual" | "none"; defaultService: string }
> = {
  male_barber: { providerChoice: true, countdownMode: "auto", defaultService: "خدمة" },
  female_salon: { providerChoice: true, countdownMode: "auto", defaultService: "خدمة" },
  restaurant: { providerChoice: false, countdownMode: "manual", defaultService: "دخول الطابور" },
  clinic: { providerChoice: false, countdownMode: "none", defaultService: "كشف" },
  general: { providerChoice: false, countdownMode: "none", defaultService: "دخول الطابور" },
};

export async function registerAction(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const shopName = String(formData.get("shopName") ?? "").trim();
  const ownerName = String(formData.get("ownerName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const facilityLabel = String(formData.get("facilityLabel") ?? "").trim();
  const timezone = String(formData.get("timezone") ?? "Asia/Riyadh") || "Asia/Riyadh";

  const e = AUTH[await getServerLocale()];
  if (!shopName || !ownerName || !email || !password || !facilityLabel)
    return { error: e.regErrFields };
  if (password.length < 6) return { error: e.regErrPassword };

  const facilityType = inferFacilityType(facilityLabel);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: e.regErrEmailTaken };

  const slug = await uniqueSlug(arabicToSlug(shopName));
  const shopCode = await generateShopCode();
  const d = TYPE_DEFAULTS[facilityType];

  const shop = await prisma.shop.create({
    data: {
      name: shopName,
      ownerName,
      facilityType,
      facilityLabel,
      slug,
      shopCode,
      timezone,
      settings: {
        create: {
          isOpen: true,
          allowProviderChoice: d.providerChoice,
          showBarberName: d.providerChoice,
          countdownMode: d.countdownMode,
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
        create: { name: d.defaultService, defaultDuration: 20, position: 1 },
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
