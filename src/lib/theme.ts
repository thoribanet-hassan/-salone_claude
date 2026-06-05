// نظام التصميم المزدوج — يُختار الثيم آلياً من نوع المنشأة
import type { FacilityType } from "@prisma/client";

export type ThemeKey = "barber" | "salon" | "general";

export interface ThemeConfig {
  key: ThemeKey;
  className: string; // يُضاف على عنصر الجذر
  label: string;
  // المصطلحات (مذكّر/مؤنّث وحسب نوع المنشأة)
  terms: {
    provider: string; // "الحلاق" / "الأخصائية"
    providerPlural: string; // "الحلاقين" / "الأخصائيات"
    seat: string; // "كرسي الحلاقة" / "مقعد الخدمة"
    yourTurn: string; // رسالة "حان دورك"
    getReady: string; // رسالة "اقترب دورك"
  };
}

export const FACILITY_TO_THEME: Record<FacilityType, ThemeKey> = {
  male_barber: "barber",
  female_salon: "salon",
  general: "general",
};

// الأنواع التي يختار فيها الزبون موظفاً محدداً (طابور عام = حجز موحّد بلا اختيار)
export function allowsProviderChoice(facilityType: FacilityType): boolean {
  return facilityType !== "general";
}

export const THEMES: Record<ThemeKey, ThemeConfig> = {
  barber: {
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
  salon: {
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
  general: {
    key: "general",
    className: "theme-general",
    label: "طابور عام",
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
  return THEMES[FACILITY_TO_THEME[facilityType]];
}
