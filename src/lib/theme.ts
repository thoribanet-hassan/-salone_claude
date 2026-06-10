// نظام الثيمات — النوع يحدّد المظهر والمصطلحات فقط؛ السلوك كله من لوحة التحكم
import type { FacilityType } from "@prisma/client";

export type ThemeKey = "barber" | "salon" | "general";

export interface ThemeConfig {
  key: ThemeKey;
  className: string; // يُضاف على عنصر الجذر
  label: string;
  // المصطلحات (مذكّر/مؤنّث وحسب نوع المنشأة)
  terms: {
    provider: string; // "الحلاق" / "الأخصائية" / "الموظف"
    providerPlural: string;
    seat: string;
    yourTurn: string; // رسالة "حان دورك"
    getReady: string; // رسالة "اقترب دورك"
  };
}

// إعداد كامل لكل نوع منشأة (المظهر مشترك أحياناً، المصطلحات خاصة)
const FACILITY_CONFIG: Record<FacilityType, ThemeConfig> = {
  male_barber: {
    key: "barber",
    className: "theme-barber",
    label: "حلاق رجالي",
    terms: {
      provider: "الحلاق",
      providerPlural: "الحلاقين",
      seat: "كرسي الحلاقة",
      yourTurn: "حان دورك، تفضّل إلى كرسي الحلاقة الآن",
      getReady: "اقترب دورك، يرجى الاستعداد",
    },
  },
  female_salon: {
    key: "salon",
    className: "theme-salon",
    label: "صالون تجميل نسائي",
    terms: {
      provider: "الأخصائية",
      providerPlural: "الأخصائيات",
      seat: "مقعد الخدمة",
      yourTurn: "حان دورك، تفضّلي إلى مقعد الخدمة الآن",
      getReady: "اقترب دورك، يرجى الاستعداد",
    },
  },
  restaurant: {
    key: "general",
    className: "theme-general",
    label: "مطعم",
    terms: {
      provider: "الموظف",
      providerPlural: "الموظفون",
      seat: "الطاولة",
      yourTurn: "حان دورك، تفضّل الآن",
      getReady: "اقترب دورك، يرجى الاستعداد",
    },
  },
  clinic: {
    key: "general",
    className: "theme-general",
    label: "عيادة",
    terms: {
      provider: "الموظف",
      providerPlural: "الموظفون",
      seat: "غرفة الكشف",
      yourTurn: "حان دورك، تفضّل الآن",
      getReady: "اقترب دورك، يرجى الاستعداد",
    },
  },
  general: {
    key: "general",
    className: "theme-general",
    label: "منشأة",
    terms: {
      provider: "الموظف",
      providerPlural: "الموظفون",
      seat: "المكتب",
      yourTurn: "حان دورك، يرجى التقدّم الآن",
      getReady: "اقترب دورك، يرجى الاستعداد",
    },
  },
};

export function themeFor(facilityType: FacilityType): ThemeConfig {
  return FACILITY_CONFIG[facilityType] ?? FACILITY_CONFIG.general;
}
