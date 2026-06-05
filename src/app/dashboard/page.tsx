import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { themeFor } from "@/lib/theme";
import {
  addBarberAction,
  regenerateCodeAction,
  toggleBarberAction,
  deleteBarberAction,
  addServiceAction,
  deleteServiceAction,
  setDurationAction,
  updateSettingsAction,
} from "./actions";

export const metadata = { title: "لوحة التحكم | صالون" };

export default async function DashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "manager") redirect("/login");
  const shopId = BigInt(session.shopId);

  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    include: {
      settings: true,
      services: { where: { isActive: true }, orderBy: { position: "asc" } },
      users: {
        where: { role: "barber" },
        orderBy: { createdAt: "asc" },
        include: { barberServices: true },
      },
    },
  });
  if (!shop) redirect("/login");

  const theme = themeFor(shop.facilityType);
  const st = shop.settings;
  const dur = (barberId: bigint, serviceId: bigint) =>
    shop.users.find((b) => b.id === barberId)?.barberServices.find((x) => x.serviceId === serviceId)?.duration ??
    shop.services.find((s) => s.id === serviceId)?.defaultDuration ??
    20;

  const Toggle = ({ name, label, checked }: { name: string; label: string; checked: boolean }) => (
    <label className="flex items-center justify-between py-2">
      <span>{label}</span>
      <input type="checkbox" name={name} defaultChecked={checked} className="w-5 h-5" />
    </label>
  );

  return (
    <main className={`${theme.className} min-h-screen flex flex-col items-center px-4 py-6`}>
      <div className="w-full max-w-md flex flex-col gap-5">
        <header className="text-center">
          <p className="muted text-sm">{theme.label}</p>
          <h1 className="text-2xl font-extrabold">{shop.name}</h1>
          <p className="muted text-xs mt-1">رمز المحل: {shop.shopCode}</p>
          <div className="flex gap-2 justify-center mt-3 text-sm">
            <a href="/serve" className="surface px-3 py-2 font-bold no-underline">شاشة الخدمة</a>
            <a href={`/q/${shop.slug}`} className="surface px-3 py-2 font-bold no-underline">ملصق QR</a>
            <a href="/api/logout" className="surface px-3 py-2 font-bold no-underline">خروج</a>
          </div>
        </header>

        {/* الإعدادات */}
        <section className="surface p-5">
          <h2 className="font-extrabold mb-2">الإعدادات</h2>
          <form action={updateSettingsAction} className="flex flex-col">
            <Toggle name="isOpen" label="استقبال العملاء مفتوح" checked={!!st?.isOpen} />
            <Toggle name="allowProviderChoice" label="السماح باختيار الموظف (وإلا حجز موحّد)" checked={!!st?.allowProviderChoice} />
            <Toggle name="showCountdown" label="عرض العدّاد الحي" checked={!!st?.showCountdown} />
            <Toggle name="showExpectedTime" label="عرض الوقت المتوقع" checked={!!st?.showExpectedTime} />
            <Toggle name="showPeopleAhead" label="عرض عدد من قبله" checked={!!st?.showPeopleAhead} />
            <Toggle name="showBarberName" label="عرض اسم الموظف على التذكرة" checked={!!st?.showBarberName} />
            <label className="flex items-center justify-between py-2">
              <span>وضع العدّاد</span>
              <select name="countdownMode" defaultValue={st?.countdownMode ?? "auto"} className="input-field px-3 py-2">
                <option value="auto">تلقائي</option>
                <option value="manual">يدوي (مطعم/زحمة)</option>
              </select>
            </label>
            <button className="btn-accent py-3 mt-2 font-bold">حفظ الإعدادات</button>
          </form>
        </section>

        {/* الحلاقون */}
        <section className="surface p-5">
          <h2 className="font-extrabold mb-3">
            الموظفون ({shop.users.filter((b) => b.isActive).length} من{" "}
            {shop.plan === "enterprise" ? "غير محدود" : ({ basic: 3, pro: 7, premium: 15 } as Record<string, number>)[shop.plan]})
          </h2>
          <div className="flex flex-col gap-3 mb-4">
            {shop.users.map((b) => (
              <div key={b.id.toString()} className="surface p-3" style={{ background: "var(--surface-2)", opacity: b.isActive ? 1 : 0.5 }}>
                <div className="flex items-center justify-between">
                  <span className="font-bold">{b.name}</span>
                  <span className="muted text-sm">رمز: {b.loginCode ?? "—"}</span>
                </div>
                <div className="flex gap-2 mt-2 text-xs flex-wrap">
                  <form action={regenerateCodeAction}>
                    <input type="hidden" name="barberId" value={b.id.toString()} />
                    <button className="px-2 py-1 rounded surface">تجديد الرمز</button>
                  </form>
                  <form action={toggleBarberAction}>
                    <input type="hidden" name="barberId" value={b.id.toString()} />
                    <button className="px-2 py-1 rounded surface">{b.isActive ? "تعطيل" : "تفعيل"}</button>
                  </form>
                  <form action={deleteBarberAction}>
                    <input type="hidden" name="barberId" value={b.id.toString()} />
                    <button className="px-2 py-1 rounded surface text-red-400">حذف</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
          <form action={addBarberAction} className="flex flex-col gap-2">
            <input name="name" placeholder="اسم الموظف الجديد" className="input-field px-3 py-2" />
            <input name="avgServiceTime" type="number" defaultValue={20} placeholder="مدة افتراضية (دقيقة)" className="input-field px-3 py-2" />
            <button className="btn-accent py-3 font-bold">+ إضافة موظف</button>
          </form>
        </section>

        {/* الخدمات */}
        <section className="surface p-5">
          <h2 className="font-extrabold mb-3">الخدمات</h2>
          <div className="flex flex-col gap-2 mb-4">
            {shop.services.map((s) => (
              <div key={s.id.toString()} className="flex items-center justify-between surface p-2" style={{ background: "var(--surface-2)" }}>
                <span className="font-bold">{s.name} <span className="muted text-xs">({s.defaultDuration}د)</span></span>
                <form action={deleteServiceAction}>
                  <input type="hidden" name="serviceId" value={s.id.toString()} />
                  <button className="text-red-400 text-xs px-2">حذف</button>
                </form>
              </div>
            ))}
          </div>
          <form action={addServiceAction} className="flex gap-2">
            <input name="name" placeholder="اسم الخدمة" className="input-field px-3 py-2 flex-1" />
            <input name="defaultDuration" type="number" defaultValue={20} className="input-field px-3 py-2 w-20" />
            <button className="btn-accent px-3 font-bold">+</button>
          </form>
        </section>

        {/* مصفوفة الأزمنة */}
        {shop.users.length > 0 && shop.services.length > 0 && (
          <section className="surface p-5">
            <h2 className="font-extrabold mb-1">زمن كل موظف لكل خدمة (دقيقة)</h2>
            <p className="muted text-xs mb-3">تُستخدم لحساب الوقت المتبقي للزبون</p>
            <div className="flex flex-col gap-4">
              {shop.users.map((b) => (
                <div key={b.id.toString()}>
                  <p className="font-bold text-sm mb-1">{b.name}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {shop.services.map((s) => (
                      <form key={s.id.toString()} action={setDurationAction} className="flex items-center gap-1">
                        <input type="hidden" name="barberId" value={b.id.toString()} />
                        <input type="hidden" name="serviceId" value={s.id.toString()} />
                        <span className="muted text-xs flex-1 truncate">{s.name}</span>
                        <input name="duration" type="number" defaultValue={dur(b.id, s.id)} className="input-field px-2 py-1 w-14 text-center" />
                        <button className="surface px-2 py-1 text-xs">حفظ</button>
                      </form>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="muted text-center text-xs">مدعوم بنظام «صالون»</p>
      </div>
    </main>
  );
}
