// منطق الاشتراك: تجربة مجانية متدحرجة (٣٠ يوماً من التسجيل) ثم قفل حتى التفعيل.
// نفس الحقول تخدم التفعيل اليدوي والدفع الإلكتروني لاحقاً — يتغيّر فقط مَن يضبط paidUntil.

export const TRIAL_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface ShopSub {
  trialEndsAt: Date;
  paidUntil: Date | null;
}

export interface Access {
  locked: boolean;
  state: "trial" | "active" | "expired";
  until: Date; // تاريخ الانتهاء الفعّال
  daysLeft: number; // أيام متبقية قبل القفل (0 إن مقفل)
  expiringSoon: boolean; // ≤ 7 أيام
}

export function shopAccess(shop: ShopSub): Access {
  const now = Date.now();
  const paid = !!shop.paidUntil && shop.paidUntil.getTime() > now;
  const trial = shop.trialEndsAt.getTime() > now;
  const until = paid ? shop.paidUntil! : shop.trialEndsAt;
  const locked = !paid && !trial;
  const state: Access["state"] = paid ? "active" : trial ? "trial" : "expired";
  const daysLeft = locked ? 0 : Math.max(0, Math.ceil((until.getTime() - now) / DAY_MS));
  return { locked, state, until, daysLeft, expiringSoon: !locked && daysLeft <= 7 };
}

// تاريخ نهاية التجربة لمنشأة جديدة
export function trialEnd(from: Date = new Date()): Date {
  return new Date(from.getTime() + TRIAL_DAYS * DAY_MS);
}

// ===== إعدادات التواصل/الدفع من متغيّرات البيئة (قابلة للتغيير بلا إعادة بناء) =====

// رقم واتساب الدعم بصيغة دولية بلا رموز (يُضبط في SUPPORT_WHATSAPP)
export function supportWhatsApp(text?: string): string | null {
  const num = process.env.SUPPORT_WHATSAPP?.replace(/\D/g, "");
  if (!num) return null;
  return text ? `https://wa.me/${num}?text=${encodeURIComponent(text)}` : `https://wa.me/${num}`;
}

// بيانات التحويل البنكي تُعرض في شاشة التجديد (نص حر متعدد الأسطر في BANK_DETAILS)
export function bankDetails(): string | null {
  return process.env.BANK_DETAILS?.trim() || null;
}
