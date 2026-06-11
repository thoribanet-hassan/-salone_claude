import { isFounder, founderMetrics } from "@/lib/founder";
import { prisma } from "@/lib/db";
import { PLACEMENT_LABELS } from "@/lib/announcements";
import type { AnnouncementPlacement } from "@prisma/client";
import {
  founderLoginAction,
  founderLogoutAction,
  saveAnnouncementAction,
} from "./actions";

export const dynamic = "force-dynamic";

const nf = new Intl.NumberFormat("ar-SA");
const pf = new Intl.NumberFormat("ar-SA", { style: "percent", maximumFractionDigits: 1 });
const df = new Intl.DateTimeFormat("ar", {
  timeZone: "Asia/Riyadh",
  month: "short",
  day: "numeric",
});

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="surface p-4 flex flex-col gap-1">
      <span className="muted text-xs">{label}</span>
      <span className="text-3xl font-extrabold" style={{ color: "var(--accent)" }}>
        {value}
      </span>
      {hint && <span className="muted text-xs">{hint}</span>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-extrabold">{title}</h2>
      {children}
    </section>
  );
}

export default async function FounderPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const authed = await isFounder();

  if (!authed) {
    const { e } = await searchParams;
    return (
      <main className="theme-general min-h-screen flex flex-col items-center justify-center px-5">
        <div className="w-full max-w-sm flex flex-col gap-4">
          <header className="text-center">
            <h1 className="text-2xl font-extrabold">دورك — لوحة المؤسس</h1>
            <p className="muted text-sm mt-1">دخول خاص</p>
          </header>
          <form action={founderLoginAction} className="surface p-6 flex flex-col gap-3">
            <label className="text-sm font-bold" htmlFor="password">
              كلمة السر
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="input-field p-3"
              placeholder="••••••••"
            />
            {e && (
              <p className="text-sm font-bold" style={{ color: "#dc2626" }}>
                كلمة السر غير صحيحة
              </p>
            )}
            <button type="submit" className="btn-accent py-3">
              دخول
            </button>
          </form>
        </div>
      </main>
    );
  }

  const m = await founderMetrics();
  const conv = m.conversionRate7d;
  const vc = m.visitorConversion7d;

  const announcements = await prisma.announcement.findMany();
  const annByPlacement = new Map(announcements.map((a) => [a.placement, a]));
  const placements = Object.keys(PLACEMENT_LABELS) as AnnouncementPlacement[];

  return (
    <main className="theme-general min-h-screen flex flex-col items-center px-5 py-8">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">لوحة المؤسس</h1>
            <p className="muted text-sm">نبض «دورك» — {nf.format(m.totalShops)} منشأة مسجلة</p>
          </div>
          <form action={founderLogoutAction}>
            <button type="submit" className="surface px-4 py-2 text-sm font-bold">
              خروج
            </button>
          </form>
        </header>

        <Section title="النشاط">
          <div className="grid grid-cols-2 gap-3">
            <Kpi label="منشآت نشطة اليوم" value={nf.format(m.activeShopsToday)} />
            <Kpi label="منشآت نشطة آخر ٧ أيام" value={nf.format(m.activeShops7d)} />
            <Kpi label="تذاكر اليوم" value={nf.format(m.ticketsToday)} />
            <Kpi
              label="تذاكر آخر ٧ أيام"
              value={nf.format(m.tickets7d)}
              hint={`الإجمالي منذ البداية: ${nf.format(m.ticketsAllTime)}`}
            />
          </div>
        </Section>

        <Section title="القمع: من المسح إلى الدور (آخر ٧ أيام)">
          <div className="grid grid-cols-2 gap-3">
            <Kpi
              label="مسحات QR"
              value={nf.format(m.qrScans7d)}
              hint={`اليوم: ${nf.format(m.qrScansToday)}`}
            />
            <Kpi
              label="فتح صفحة الانتظار"
              value={nf.format(m.waitOpens7d)}
              hint={`زيارات متكررة: ${nf.format(m.waitRevisits7d)}`}
            />
            <Kpi
              label="نسبة التحويل (تذاكر ÷ مسحات)"
              value={conv == null ? "—" : pf.format(conv)}
            />
            <Kpi
              label="زوّار فريدون: مسحوا ← حجزوا"
              value={vc ? `${nf.format(vc.scanned)} ← ${nf.format(vc.booked)}` : "—"}
              hint={
                vc && vc.scanned > 0 ? `أي ${pf.format(vc.booked / vc.scanned)} من الزوّار` : undefined
              }
            />
          </div>
        </Section>

        <Section title="مصادر الدخول (آخر ٧ أيام)">
          {m.sources.length === 0 ? (
            <p className="surface p-4 muted text-sm">لا بيانات مصادر بعد</p>
          ) : (
            <div className="surface p-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="muted text-xs">
                    <th className="text-right p-2 font-normal">المصدر</th>
                    <th className="text-left p-2 font-normal">مسحات</th>
                    <th className="text-left p-2 font-normal">تذاكر</th>
                  </tr>
                </thead>
                <tbody>
                  {m.sources.map((s) => (
                    <tr key={s.source} style={{ borderTop: "1px solid var(--border)" }}>
                      <td className="p-2 font-bold">{s.source}</td>
                      <td className="p-2 text-left">{nf.format(s.scans)}</td>
                      <td className="p-2 text-left font-bold">{nf.format(s.tickets)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        <Section title="نمط الزمن في المنشآت">
          <div className="grid grid-cols-3 gap-3">
            <Kpi label="دور فقط (بلا زمن)" value={nf.format(m.countdownModes.none)} />
            <Kpi label="وقت تقديري تلقائي" value={nf.format(m.countdownModes.auto)} />
            <Kpi label="وقت يدوي" value={nf.format(m.countdownModes.manual)} />
          </div>
        </Section>

        <Section title="أكثر المنشآت نشاطاً (آخر ٧ أيام)">
          {m.topShops.length === 0 ? (
            <p className="surface p-4 muted text-sm">لا تذاكر في آخر ٧ أيام</p>
          ) : (
            <div className="surface p-2">
              {m.topShops.map((s, i) => (
                <div
                  key={s.slug || i}
                  className="flex items-center justify-between p-2"
                  style={i > 0 ? { borderTop: "1px solid var(--border)" } : undefined}
                >
                  <span className="font-bold">
                    {i + 1}. {s.name}
                  </span>
                  <span style={{ color: "var(--accent)" }} className="font-extrabold">
                    {nf.format(s.tickets7d)} تذكرة
                  </span>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="مؤشرات الخطر">
          <div className="grid grid-cols-1 gap-3">
            <div className="surface p-4">
              <p className="font-bold mb-2">
                سجلت ولم تستخدم <span className="muted">({nf.format(m.neverUsedShops.length)})</span>
              </p>
              {m.neverUsedShops.length === 0 ? (
                <p className="muted text-sm">لا يوجد — كل المنشآت أنشأت تذاكر 🎉</p>
              ) : (
                m.neverUsedShops.map((s) => (
                  <p key={s.slug} className="text-sm py-1">
                    {s.name} <span className="muted">— سجلت {df.format(s.createdAt)}</span>
                  </p>
                ))
              )}
            </div>
            <div className="surface p-4">
              <p className="font-bold mb-2">
                خاملة ≥٧ أيام <span className="muted">({nf.format(m.idleShops.length)})</span>
              </p>
              {m.idleShops.length === 0 ? (
                <p className="muted text-sm">لا منشآت خاملة</p>
              ) : (
                m.idleShops.map((s) => (
                  <p key={s.slug} className="text-sm py-1">
                    {s.name}{" "}
                    <span className="muted">
                      — آخر تذكرة {s.lastTicketAt ? df.format(s.lastTicketAt) : "—"}
                    </span>
                  </p>
                ))
              )}
            </div>
          </div>
        </Section>

        <div id="announcements">
          <Section title="الإعلانات">
            <p className="muted text-sm -mt-2">
              الإعلان المخصص لصفحةٍ ما يَغلب الإعلان العام عليها. نص فارغ + حفظ = حذف الإعلان.
            </p>
            {placements.map((p) => {
              const a = annByPlacement.get(p);
              return (
                <form
                  key={p}
                  action={saveAnnouncementAction}
                  className="surface p-4 flex flex-col gap-2"
                >
                  <input type="hidden" name="placement" value={p} />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{PLACEMENT_LABELS[p]}</span>
                    <label className="flex items-center gap-2 text-xs muted">
                      <input
                        type="checkbox"
                        name="isActive"
                        defaultChecked={a ? a.isActive : true}
                        className="w-4 h-4"
                      />
                      فعّال
                    </label>
                  </div>
                  <textarea
                    name="text"
                    rows={2}
                    defaultValue={a?.text ?? ""}
                    placeholder="نص الإعلان…"
                    className="input-field p-3 text-sm"
                  />
                  <input
                    name="linkUrl"
                    type="url"
                    dir="ltr"
                    defaultValue={a?.linkUrl ?? ""}
                    placeholder="https://… (رابط اختياري)"
                    className="input-field p-2 text-xs"
                  />
                  <button type="submit" className="btn-accent py-2 text-sm">
                    حفظ
                  </button>
                </form>
              );
            })}
          </Section>
        </div>

        <p className="muted text-center text-xs">
          الأرقام مبنية على سجل الأحداث منذ تفعيله — «اليوم» بتوقيت الرياض
        </p>
      </div>
    </main>
  );
}
