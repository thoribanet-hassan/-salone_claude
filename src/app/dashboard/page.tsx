import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { themeFor } from "@/lib/theme";
import { joinUrlFor } from "@/lib/url";
import { serviceDateFor } from "@/lib/queue";
import ServeView from "../serve/ServeView";
import QrActions from "../q/[slug]/QrActions";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import {
  addBarberAction,
  setTasksAction,
  regenerateCodeAction,
  toggleBarberAction,
  setAvailabilityAction,
  deleteBarberAction,
  addServiceAction,
  deleteServiceAction,
  setPriceAction,
  setDurationAction,
  updateSettingsAction,
  saveShopAnnouncementAction,
  deleteShopAnnouncementAction,
} from "./actions";

const SHOP_AD_LABELS: Record<string, string> = {
  all: "كل صفحاتي",
  join: "صفحة الحجز",
  ticket: "تذكرة الانتظار",
  dashboard: "لوحتي",
  serve: "شاشة الموظف",
};

export const metadata = { title: "لوحة التحكم | دورك" };

interface ShopAd {
  id: string;
  placement: string;
  text: string;
  linkUrl: string | null;
  isActive: boolean;
  mediaUrl: string | null;
  mediaType: string | null;
}

// نموذج إعلان منشأة (جديد أو تعديل) — زر الحذف عبر formAction
function ShopAdForm({ a }: { a: ShopAd | null }) {
  return (
    <form
      action={saveShopAnnouncementAction}
      className="flex flex-col gap-2 p-3 rounded-xl"
      style={{ border: "1px solid var(--border)" }}
    >
      {a && <input type="hidden" name="id" value={a.id} />}
      <div className="flex items-center gap-2">
        <select name="placement" defaultValue={a?.placement ?? "all"} className="input-field px-3 py-2 text-sm flex-1">
          {Object.entries(SHOP_AD_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <label className="flex items-center gap-1 text-xs muted shrink-0">
          <input type="checkbox" name="isActive" defaultChecked={a ? a.isActive : true} className="w-4 h-4" />
          فعّال
        </label>
      </div>
      <textarea name="text" rows={2} required defaultValue={a?.text ?? ""} placeholder="نص الإعلان…" className="input-field p-3 text-sm" />
      <input name="linkUrl" type="url" dir="ltr" defaultValue={a?.linkUrl ?? ""} placeholder="https://… (رابط اختياري)" className="input-field p-2 text-xs" />
      {a?.mediaUrl && (
        <div className="flex items-center gap-3">
          {a.mediaType === "video" ? (
            <video src={a.mediaUrl} className="h-14 rounded" muted playsInline preload="metadata" />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={a.mediaUrl} alt="" className="h-14 rounded object-cover" />
          )}
          <label className="flex items-center gap-2 text-xs muted">
            <input type="checkbox" name="removeMedia" className="w-4 h-4" />
            إزالة الوسائط
          </label>
        </div>
      )}
      <input
        name="media"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
        className="input-field p-2 text-xs"
      />
      <div className="flex gap-2">
        <button type="submit" className="btn-accent py-2 text-sm flex-1">
          {a ? "حفظ التعديلات" : "إضافة الإعلان"}
        </button>
        {a && (
          <button formAction={deleteShopAnnouncementAction} className="surface px-4 py-2 text-sm font-bold" style={{ color: "#dc2626" }}>
            حذف
          </button>
        )}
      </div>
    </form>
  );
}

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
        // المدير ضمن الطاقم — يمارس مهاماً مهنية مثل الموظفين
        where: { role: { in: ["manager", "barber"] } },
        orderBy: [{ role: "asc" }, { createdAt: "asc" }],
        include: { barberServices: { include: { service: true } } },
      },
    },
  });
  if (!shop) redirect("/login");

  // المدير حلاق أيضاً — نجلب حالة خدمته ليتحكّم من نفس اللوحة
  const managerId = BigInt(session.userId);
  const [manager, current, waitingAssigned, waitingPool] = await Promise.all([
    prisma.user.findUnique({ where: { id: managerId } }),
    prisma.ticket.findFirst({ where: { barberId: managerId, status: "serving" }, include: { service: true } }),
    prisma.ticket.count({ where: { barberId: managerId, status: "waiting" } }),
    prisma.ticket.count({ where: { shopId, barberId: null, status: "waiting" } }),
  ]);

  const today = serviceDateFor(shop.timezone);
  const skipped = await prisma.ticket.findMany({
    where: { shopId, status: "skipped", serviceDate: today },
    orderBy: { completedAt: "desc" },
    take: 10,
  });

  // إعلانات المنشأة الذاتية (إن مُنحت الصلاحية)
  const shopAds = shop.canSelfAnnounce
    ? (
        await prisma.announcement.findMany({
          where: { ownerShopId: shopId },
          orderBy: { updatedAt: "desc" },
        })
      ).map((a) => ({
        id: a.id.toString(),
        placement: a.placement as string,
        text: a.text,
        linkUrl: a.linkUrl,
        isActive: a.isActive,
        mediaUrl: a.mediaUrl,
        mediaType: a.mediaType as string | null,
      }))
    : [];

  const theme = themeFor(shop.facilityType);
  const isManual = shop.settings?.countdownMode === "manual";
  const noTimes = shop.settings?.countdownMode === "none";
  const joinUrl = joinUrlFor(shop.slug);
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
          <p className="muted text-sm">{shop.facilityLabel || theme.label}</p>
          <h1 className="text-2xl font-extrabold">{shop.name}</h1>
          <p className="muted text-xs mt-1">رمز المحل: {shop.shopCode}</p>
          <div className="flex gap-2 justify-center mt-3 text-sm">
            <a href="/dashboard/stats" className="surface px-3 py-2 font-bold no-underline">📊 الإحصائيات</a>
            <a href={`/q/${shop.slug}`} className="surface px-3 py-2 font-bold no-underline">ملصق QR كامل</a>
            <a href="/api/logout" className="surface px-3 py-2 font-bold no-underline">خروج</a>
          </div>
        </header>

        <AnnouncementBanner page="dashboard" shopId={shopId} />

        {/* خدمة العملاء (المدير حلاق أيضاً) */}
        {manager && (
          <section className="surface p-5">
            <h2 className="font-extrabold mb-3">خدمة العملاء</h2>
            <ServeView
              theme={theme.className}
              shopName={shop.name}
              barberName={manager.name}
              role="manager"
              status={manager.status}
              isManual={isManual}
              noTimes={noTimes}
              waitingCount={waitingAssigned + waitingPool}
              skipped={skipped.map((t) => ({ id: t.id.toString(), ticketNumber: t.ticketNumber, customerName: t.customerName }))}
              embedded
              current={
                current
                  ? { ticketNumber: current.ticketNumber, customerName: current.customerName, serviceName: current.serviceLabel ?? current.service?.name ?? null }
                  : null
              }
            />
          </section>
        )}

        {/* رمز QR للمحل — للطباعة والتعليق والمشاركة */}
        <section className="surface p-5 flex flex-col items-center gap-3">
          <h2 className="font-extrabold self-start no-print">رمز QR للمحل</h2>
          <p className="muted text-sm self-start -mt-2 no-print">علّقه في الواجهة بعد طباعته، أو شاركه عبر واتساب وصفحتك.</p>
          {/* المنطقة القابلة للطباعة وحدها */}
          <div className="qr-print-area flex flex-col items-center gap-3 py-2">
            <p className="font-extrabold text-lg">{shop.name}</p>
            <div className="bg-white p-3 rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/api/qr/${shop.slug}?format=svg`} alt="QR" width={220} height={220} style={{ width: 220, height: 220, display: "block" }} />
            </div>
            <p className="font-bold">امسح وادخل لحجز دورك</p>
          </div>
          <QrActions slug={shop.slug} shopName={shop.name} joinUrl={joinUrl} />
        </section>

        {/* لوحة التحكم الموحّدة — كل خصائص المنشأة تُفعَّل وتُختار من هنا */}
        <section className="surface p-5">
          <h2 className="font-extrabold mb-2">الإعدادات</h2>
          <form action={updateSettingsAction} className="flex flex-col">
            <Toggle name="isOpen" label="استقبال العملاء مفتوح" checked={!!st?.isOpen} />

            <p className="font-bold text-sm mt-3 mb-1" style={{ color: "var(--accent)" }}>نموذج الموظفين</p>
            <Toggle name="allowProviderChoice" label="عدة موظفين يتقاسمون المهام (الزبون يختار الموظف) — وإلا دور واحد موحّد" checked={!!st?.allowProviderChoice} />
            <Toggle name="showBarberName" label="عرض اسم الموظف على تذكرة الزبون" checked={!!st?.showBarberName} />

            <p className="font-bold text-sm mt-3 mb-1" style={{ color: "var(--accent)" }}>نظام الزمن</p>
            <label className="flex items-center justify-between py-2 gap-2">
              <span>طريقة الدور</span>
              <select name="countdownMode" defaultValue={st?.countdownMode ?? "auto"} className="input-field px-3 py-2">
                <option value="auto">بوقت المهمة (زمن تلقائي)</option>
                <option value="manual">زمني يدوي (الموظف يحدّد)</option>
                <option value="none">بالرقم فقط — بدون زمن</option>
              </select>
            </label>
            <Toggle name="allowScheduling" label="السماح بالحجز في ساعة معينة (مواعيد)" checked={!!st?.allowScheduling} />
            {st?.allowScheduling && (
              <div className="flex flex-col gap-2 pr-2 mb-1" style={{ borderRight: "2px solid var(--border)" }}>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs muted">فتح المواعيد</span>
                    <input type="time" name="openTime" defaultValue={st?.openTime ?? "09:00"} className="input-field px-3 py-2" />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs muted">إغلاق المواعيد</span>
                    <input type="time" name="closeTime" defaultValue={st?.closeTime ?? "22:00"} className="input-field px-3 py-2" />
                  </label>
                </div>
                <label className="flex items-center justify-between gap-2">
                  <span className="text-sm">طول الخانة</span>
                  <select name="slotMinutes" defaultValue={String(st?.slotMinutes ?? 30)} className="input-field px-3 py-2">
                    {[15, 20, 30, 45, 60].map((n) => (
                      <option key={n} value={n}>كل {n} دقيقة</option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center justify-between gap-2">
                  <span className="text-sm">نافذة حماية الموعد</span>
                  <select name="appointmentGraceMinutes" defaultValue={String(st?.appointmentGraceMinutes ?? 15)} className="input-field px-3 py-2">
                    {[0, 5, 10, 15, 20, 30, 45, 60].map((n) => (
                      <option key={n} value={n}>{n === 0 ? "بدون" : `${n} دقيقة قبله`}</option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            <Toggle name="showCountdown" label="عرض العدّاد الحي للزبون" checked={!!st?.showCountdown} />
            <Toggle name="showExpectedTime" label="عرض الوقت المتوقع" checked={!!st?.showExpectedTime} />

            <p className="font-bold text-sm mt-3 mb-1" style={{ color: "var(--accent)" }}>الخدمات والعرض</p>
            <Toggle name="allowServiceChoice" label="السماح باختيار الخدمة (وإلا الخدمة الافتراضية)" checked={!!st?.allowServiceChoice} />
            <Toggle name="showPrices" label="عرض أسعار الخدمات للزبون" checked={!!st?.showPrices} />
            <Toggle name="showPeopleAhead" label="عرض عدد من قبله" checked={!!st?.showPeopleAhead} />

            <button className="btn-accent py-3 mt-3 font-bold">حفظ الإعدادات</button>
          </form>
        </section>

        {/* الطاقم: المدير والموظفون — لكلٍّ مهامه */}
        <section className="surface p-5">
          <h2 className="font-extrabold mb-3">
            الموظفون ({shop.users.filter((b) => b.isActive && b.role === "barber").length} من{" "}
            {shop.plan === "enterprise" ? "غير محدود" : ({ basic: 3, pro: 7, premium: 15 } as Record<string, number>)[shop.plan]})
          </h2>
          <div className="flex flex-col gap-3 mb-4">
            {shop.users.map((b) => (
              <div key={b.id.toString()} className="surface p-3" style={{ background: "var(--surface-2)", opacity: b.isActive ? 1 : 0.5 }}>
                <div className="flex items-center justify-between">
                  <span className="font-bold">
                    {b.name}
                    {b.role === "manager" && (
                      <span className="text-xs font-bold mr-2 px-2 py-0.5 rounded" style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}>
                        المدير
                      </span>
                    )}
                  </span>
                  {b.role === "barber" && (
                    <span className="text-sm">
                      رمز دخوله:{" "}
                      <span className="font-extrabold text-lg" style={{ color: "var(--accent)" }}>
                        {b.loginCode ?? "—"}
                      </span>
                    </span>
                  )}
                </div>
                {b.role === "barber" && (
                  <p className="muted text-xs mt-1">أعطِ هذا الرمز للموظف ليدخل من «دخول الموظف» برمز المحل {shop.shopCode}.</p>
                )}
                <p className="text-xs mt-1">
                  الحالة:{" "}
                  <span className="font-bold" style={{ color: b.status === "available" ? "var(--accent)" : "var(--text-muted)" }}>
                    {b.status === "busy" ? "مشغول بعميل" : b.status === "available" ? "متاح" : "غير متاح (لا يدخل الدور)"}
                  </span>
                </p>
                {/* مهامه — نص حر يُنشئ الخدمات ويربطها به */}
                <p className="text-xs mt-1">
                  المهام:{" "}
                  <span className="font-bold">
                    {b.barberServices.map((x) => x.service.name).join("، ") || "—"}
                  </span>
                </p>
                <form action={setTasksAction} className="flex gap-1 mt-2">
                  <input type="hidden" name="barberId" value={b.id.toString()} />
                  <input
                    name="tasks"
                    defaultValue={b.barberServices.map((x) => x.service.name).join("، ")}
                    placeholder="مهامه: قص شعر، دقن، تنظيف بشرة…"
                    className="input-field px-2 py-1 flex-1 text-sm"
                  />
                  <button className="px-2 py-1 rounded surface text-xs font-bold">حفظ المهام</button>
                </form>
                <div className="flex gap-2 mt-2 text-xs flex-wrap">
                  {/* توفّر مؤقّت: غداء/مشوار */}
                  <form action={setAvailabilityAction}>
                    <input type="hidden" name="barberId" value={b.id.toString()} />
                    <input type="hidden" name="to" value={b.status === "available" ? "unavailable" : "available"} />
                    <button className="px-2 py-1 rounded surface font-bold">
                      {b.status === "available" ? "اجعله غير متاح" : "اجعله متاحاً"}
                    </button>
                  </form>
                  {b.role === "barber" && (
                    <>
                      <form action={regenerateCodeAction}>
                        <input type="hidden" name="barberId" value={b.id.toString()} />
                        <button className="px-2 py-1 rounded surface">تجديد الرمز</button>
                      </form>
                      <form action={toggleBarberAction}>
                        <input type="hidden" name="barberId" value={b.id.toString()} />
                        <button className="px-2 py-1 rounded surface">{b.isActive ? "إيقاف الحساب" : "تفعيل الحساب"}</button>
                      </form>
                      <form action={deleteBarberAction}>
                        <input type="hidden" name="barberId" value={b.id.toString()} />
                        <button className="px-2 py-1 rounded surface text-red-400">حذف نهائي</button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <form action={addBarberAction} className="flex flex-col gap-2">
            <input name="name" required placeholder="اسم الموظف الجديد" className="input-field px-3 py-2" />
            <input
              name="tasks"
              placeholder="مهامه (افصل بفاصلة): قص شعر، دقن، تنظيف بشرة…"
              className="input-field px-3 py-2"
            />
            <input name="avgServiceTime" type="number" defaultValue={20} placeholder="مدة افتراضية (دقيقة)" className="input-field px-3 py-2" />
            <button className="btn-accent py-3 font-bold">+ إضافة موظف</button>
            <p className="muted text-xs">المهام تُنشأ تلقائياً كخدمات وتُربط بالموظف — وتستطيع تركها فارغة ليؤدي كل الخدمات.</p>
          </form>
        </section>

        {/* الخدمات */}
        <section className="surface p-5">
          <h2 className="font-extrabold mb-3">الخدمات</h2>
          <div className="flex flex-col gap-2 mb-4">
            {shop.services.map((s) => (
              <div key={s.id.toString()} className="surface p-2" style={{ background: "var(--surface-2)" }}>
                <div className="flex items-center justify-between">
                  <span className="font-bold">{s.name} <span className="muted text-xs">({s.defaultDuration}د)</span></span>
                  <form action={deleteServiceAction}>
                    <input type="hidden" name="serviceId" value={s.id.toString()} />
                    <button className="text-red-400 text-xs px-2">حذف</button>
                  </form>
                </div>
                {/* تعديل السعر */}
                <form action={setPriceAction} className="flex items-center gap-2 mt-2">
                  <input type="hidden" name="serviceId" value={s.id.toString()} />
                  <span className="muted text-xs">السعر:</span>
                  <input name="price" type="number" min={0} defaultValue={s.price} className="input-field px-2 py-1 w-24 text-sm" />
                  <span className="muted text-xs">ريال</span>
                  <button className="px-2 py-1 rounded surface text-xs font-bold">حفظ السعر</button>
                </form>
              </div>
            ))}
          </div>
          <form action={addServiceAction} className="flex flex-col gap-2">
            <input name="name" required placeholder="اسم أي خدمة تريدها" className="input-field px-3 py-2" />
            <div className="flex gap-2">
              <input name="defaultDuration" type="number" defaultValue={20} placeholder="دقيقة" className="input-field px-3 py-2 flex-1" />
              <input name="price" type="number" min={0} defaultValue={0} placeholder="السعر (ريال)" className="input-field px-3 py-2 flex-1" />
              <button className="btn-accent px-4 font-bold">+</button>
            </div>
          </form>
          <p className="muted text-xs mt-2">اكتب أي اسم خدمة تريده، وحدّد مدّتها وسعرها.</p>
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

        {shop.canSelfAnnounce && (
          <section id="myads" className="surface p-5">
            <h2 className="font-extrabold mb-1">إعلانات منشأتي 📣</h2>
            <p className="muted text-sm mb-3">
              تظهر على صفحات منشأتك فقط. نص فارغ لا يُحفظ.
            </p>
            <p className="font-bold text-sm mb-2">➕ إعلان جديد</p>
            <ShopAdForm a={null} />
            {shopAds.length > 0 && (
              <p className="font-bold text-sm mt-4 mb-2">إعلاناتي ({shopAds.length})</p>
            )}
            <div className="flex flex-col gap-3">
              {shopAds.map((a) => (
                <ShopAdForm key={a.id} a={a} />
              ))}
            </div>
          </section>
        )}

        <p className="muted text-center text-xs">مدعوم بنظام «دورك»</p>
      </div>
    </main>
  );
}
