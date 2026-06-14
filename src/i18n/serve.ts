import type { Locale } from "@/lib/i18n";

export interface ServeMsgs {
  backToDashboard: string;
  yourStatus: string;
  busy: string;
  available: string;
  unavailable: string;
  currentCustomer: string;
  noCustomer: string;
  waiting: string;
  complete: string;
  skip: string;
  callNext: string;
  readyManual: string;
  readyAuto: string;
  time: string;
  minutesWord: string;
  notifyNext: string; // فيه {n}
  skippedToday: string;
  restore: string;
  logout: string;
  // أخطاء (تطابق قيم queue.ts العربية للتعريب العكسي)
  errSession: string;
  errBarberMissing: string;
  errAlreadyServing: string;
  errNotAvailable: string;
  errNoCustomers: string;
}

export const SERVE: Record<Locale, ServeMsgs> = {
  ar: {
    backToDashboard: "← لوحة التحكم",
    yourStatus: "حالتك",
    busy: "مشغول",
    available: "متاح ✓",
    unavailable: "غير متاح",
    currentCustomer: "العميل الحالي",
    noCustomer: "لا يوجد عميل قيد الخدمة",
    waiting: "في الانتظار",
    complete: "✓ إنهاء الخدمة",
    skip: "تخطّي العميل",
    callNext: "العميل التالي ←",
    readyManual: "طاولة ستفرغ قريباً؟ حدّد الوقت ونبّه العميل التالي:",
    readyAuto: "أوشكت على الإنهاء؟ قلّص وقت العميل التالي (تصله نغمة):",
    time: "الوقت",
    minutesWord: "دقيقة",
    notifyNext: "نبّه العميل التالي ({n} دقيقة)",
    skippedToday: "عملاء تم تخطّيهم اليوم",
    restore: "إعادة للطابور",
    logout: "تسجيل الخروج",
    errSession: "انتهت الجلسة",
    errBarberMissing: "الحلاق غير موجود",
    errAlreadyServing: "أنهِ العميل الحالي أولاً",
    errNotAvailable: "غيّر حالتك إلى متاح أولاً",
    errNoCustomers: "لا يوجد عملاء في الانتظار",
  },
  en: {
    backToDashboard: "← Control panel",
    yourStatus: "Your status",
    busy: "Busy",
    available: "Available ✓",
    unavailable: "Unavailable",
    currentCustomer: "Current customer",
    noCustomer: "No customer being served",
    waiting: "waiting",
    complete: "✓ Complete service",
    skip: "Skip customer",
    callNext: "Next customer →",
    readyManual: "A table freeing up soon? Set the time and notify the next customer:",
    readyAuto: "About to finish? Shorten the next customer's time (they get a tone):",
    time: "Time",
    minutesWord: "min",
    notifyNext: "Notify next customer ({n} min)",
    skippedToday: "Customers skipped today",
    restore: "Back to queue",
    logout: "Sign out",
    errSession: "Session ended",
    errBarberMissing: "Provider not found",
    errAlreadyServing: "Finish the current customer first",
    errNotAvailable: "Set yourself to available first",
    errNoCustomers: "No customers waiting",
  },
  hi: {
    backToDashboard: "← कंट्रोल पैनल",
    yourStatus: "आपकी स्थिति",
    busy: "व्यस्त",
    available: "उपलब्ध ✓",
    unavailable: "अनुपलब्ध",
    currentCustomer: "वर्तमान ग्राहक",
    noCustomer: "कोई ग्राहक सेवा में नहीं",
    waiting: "प्रतीक्षा में",
    complete: "✓ सेवा पूरी करें",
    skip: "ग्राहक छोड़ें",
    callNext: "अगला ग्राहक →",
    readyManual: "टेबल जल्द खाली होगी? समय तय करें और अगले ग्राहक को सूचित करें:",
    readyAuto: "ख़त्म होने वाला है? अगले ग्राहक का समय घटाएँ (उसे टोन मिलेगी):",
    time: "समय",
    minutesWord: "मिनट",
    notifyNext: "अगले ग्राहक को सूचित करें ({n} मिनट)",
    skippedToday: "आज छोड़े गए ग्राहक",
    restore: "कतार में वापस",
    logout: "साइन आउट",
    errSession: "सत्र समाप्त",
    errBarberMissing: "कर्मचारी नहीं मिला",
    errAlreadyServing: "पहले वर्तमान ग्राहक पूरा करें",
    errNotAvailable: "पहले खुद को उपलब्ध करें",
    errNoCustomers: "कोई ग्राहक प्रतीक्षा में नहीं",
  },
  bn: {
    backToDashboard: "← কন্ট্রোল প্যানেল",
    yourStatus: "আপনার অবস্থা",
    busy: "ব্যস্ত",
    available: "উপলব্ধ ✓",
    unavailable: "অনুপলব্ধ",
    currentCustomer: "বর্তমান গ্রাহক",
    noCustomer: "কোনো গ্রাহক সেবায় নেই",
    waiting: "অপেক্ষমাণ",
    complete: "✓ সেবা সম্পন্ন করুন",
    skip: "গ্রাহক এড়িয়ে যান",
    callNext: "পরের গ্রাহক →",
    readyManual: "টেবিল শীঘ্রই খালি হবে? সময় ঠিক করে পরের গ্রাহককে জানান:",
    readyAuto: "শেষ হতে চলেছে? পরের গ্রাহকের সময় কমান (তিনি একটি টোন পাবেন):",
    time: "সময়",
    minutesWord: "মিনিট",
    notifyNext: "পরের গ্রাহককে জানান ({n} মিনিট)",
    skippedToday: "আজ এড়ানো গ্রাহক",
    restore: "সারিতে ফেরান",
    logout: "সাইন আউট",
    errSession: "সেশন শেষ",
    errBarberMissing: "কর্মী পাওয়া যায়নি",
    errAlreadyServing: "আগে বর্তমান গ্রাহক সম্পন্ন করুন",
    errNotAvailable: "আগে নিজেকে উপলব্ধ করুন",
    errNoCustomers: "কোনো গ্রাহক অপেক্ষায় নেই",
  },
};

// تعريب سبب فشل «نادِ التالي» الآتي من منطق الطابور (نصّه عربي) — تطابق بقيم ar
export function localizeServeReason(reasonAr: string, locale: Locale): string {
  const ar = SERVE.ar;
  const map: [string, keyof ServeMsgs][] = [
    [ar.errBarberMissing, "errBarberMissing"],
    [ar.errAlreadyServing, "errAlreadyServing"],
    [ar.errNotAvailable, "errNotAvailable"],
    [ar.errNoCustomers, "errNoCustomers"],
  ];
  const hit = map.find(([s]) => s === reasonAr);
  return hit ? SERVE[locale][hit[1]] : reasonAr;
}
