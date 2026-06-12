// نافذة حماية الموعد: خلال هذه الدقائق قبل الموعد يُثبَّت صاحبه في مقدمة الطابور،
// فلا يتقدّمه أي حجز فوري (walk-in) يأتي بعد بدء النافذة، ولا يُنادى موعدٌ قبل بدئها.
// القيمة قابلة للضبط لكل منشأة (shop_settings.appointment_grace_minutes)؛ هذا الافتراضي fallback.
export const DEFAULT_GRACE_MINUTES = 15;

// مفتاح ترتيب الطابور الموحّد:
// - الحجز الفوري: لحظة المسح (created_at)
// - الموعد المحجوز: بداية نافذة حمايته (الموعد − النافذة) — فمن مسح قبل النافذة يحترم،
//   ومن مسح بعد بدئها لا يتقدّم الموعد. يطابق منطق SQL في callNextCustomer تماماً.
export function queueSortKeyMs(
  t: { scheduledAt: Date | null; createdAt: Date },
  graceMs: number
): number {
  if (t.scheduledAt) return t.scheduledAt.getTime() - graceMs;
  return t.createdAt.getTime();
}
