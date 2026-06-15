# دورك (Dawrak) — حالة المشروع الشاملة

> نظام إدارة الانتظار في الأماكن المزدحمة — منصّة SaaS قائمة على QR للحجز وإدارة الطابور.
> هذا الملف نظرة عامة دائمة (architecture + ما أُنجز). للحالة اللحظية انظر [CURRENT_STATUS.md](CURRENT_STATUS.md).

آخر تحديث: 2026-06-15

---

## 1. نظرة عامة

**دورك** منصّة حجز وإدارة طابور قائمة على رمز QR، موجّهة للمنشآت السعودية المزدحمة (حلاقين، صالونات نسائية، مطاعم/كافيهات، عيادات، وأي طابور عام). الزبون يمسح QR → يحجز دوره → شاشة انتظار حيّة بلا تثبيت أي تطبيق. المدير/الموظف يديرون الطابور من لوحة تحكم على الجوال.

- **الشعار الرسمي:** «نظام إدارة الانتظار في الأماكن المزدحمة».
- **مبدأ غير قابل للتفاوض:** Zero-install — متصفّح فقط، بلا إجبار على تثبيت PWA.
- **اللغة الافتراضية:** العربية (RTL). التطبيق متعدّد اللغات (ar/en/hi/bn) مع مبدّل لغة على كل شاشة مترجمة.

---

## 2. الحالة الإنتاجية (Production)

- **الدومين الحيّ:** https://dawrak.shop (+ www) — HTTPS عبر Let's Encrypt (تجديد تلقائي).
- **الخادم الأساسي:** Hostinger VPS `31.220.111.228` (Ubuntu 24, Node 22).
  - مسار التطبيق: `/var/www/salon`، عملية PM2 باسم `salon` على المنفذ 3001.
  - nginx: `/etc/nginx/sites-available/salon` يوجّه :80/:443 → :3001، و `client_max_body_size 50m`.
  - قاعدة بيانات PostgreSQL محلية على نفس الخادم (db `salon`).
- **⚠️ تحذير تشغيلي حرج:** نفس الخادم يستضيف تطبيق **MagicAI** إنتاجي (PHP/Laravel + MySQL على 443). **يُمنع لمسه نهائياً.** انظر [DECISIONS.md](DECISIONS.md) لبروتوكول النشر الآمن.
- **نشر ثانوي (قديم/احتياطي):** Vercel + Neon Postgres (مشروع `salone-claude-qdaf` من GitHub `thoribanet-hassan/salone_claude`) — يستخدم `@prisma/adapter-pg`.

---

## 3. المنظومة التقنية (Stack)

| الطبقة | التقنية |
|---|---|
| الإطار | Next.js 16 (App Router, TypeScript, Turbopack) |
| الواجهة | React Server + Client Components، Server Actions |
| التنسيق | Tailwind v4 + متغيّرات CSS للثيمات، خصائص منطقية (ps-/text-start) لدعم RTL/LTR |
| ORM | Prisma 6 (مثبّت — Prisma 7 فيه تغييرات كاسرة) |
| قاعدة البيانات | PostgreSQL (محلياً `salon_dev`/المستخدم `Hassan`؛ إنتاجاً عبر DATABASE_URL) |
| الزمن الحقيقي | Polling كل 5 ثوانٍ + إعادة مزامنة عند العودة للتبويب (ليس WebSocket بعد) |
| الإشعارات | Web Push (مكتبة web-push + VAPID + Service Worker) |
| الصوت | Web Audio API يولّد النغمات برمجياً (بلا ملفات) — `src/lib/sound.ts` |

---

## 4. بنية i18n (تعدّد اللغات)

- اللغات: `ar` (افتراضي، RTL) / `en` / `hi` / `bn`.
- النواة: `src/lib/i18n.ts` (Locale, LOCALES, dirFor, fontVarFor, `LOCALE_COOKIE="dawrak_lang"`, `DEFAULT_LOCALE="ar"`).
- الخادم يقرأ اللغة من الكوكي عبر `getServerLocale()` في `src/lib/locale-server.ts`.
- `src/components/LangSwitcher.tsx`: حبوب اختيار اللغة، تضبط الكوكي + localStorage ثم `location.reload()`.
- **النمط:** كل صفحة تغلّف محتواها في `<div/main dir lang style={{fontFamily}}>` (لا يُقلب html العام في layout) — فتظلّ الصفحات غير المترجمة عربيةً سليمة حتى تصلها موجتها (آمن تدريجياً).
- الخطوط (في layout.tsx): Tajawal (ar/en)، Noto Sans Devanagari (hi، `--font-deva`)، Noto Sans Bengali (bn، `--font-bengali`).
- القواميس لكل ميزة في `src/i18n/<feature>.ts` (booking, auth, dashboard, serve, misc, subscription...).
- ملاحظة: أسماء المنشآت/الخدمات تبقى كما أدخلها المالك (بيانات، لا تُترجم).

---

## 5. الميزات المُنجزة (كلها منشورة حيّة)

### رحلة الزبون
- `/j/[slug]` — صفحة الحجز (اختيار الخدمات/الموظف/الموعد حسب الإعدادات).
- `/t/[token]` — شاشة الانتظار الحيّة مع عدّاد تنازلي + مراحل القرب.
- `/j/[slug]/find` — استرجاع التذكرة بالاسم أو الجوال (تذاكر اليوم النشطة فقط).
- استرجاع تلقائي عبر كوكي `last_ticket`.

### الحجز والطابور
- خدمات متعددة لكل حجز + مصفوفة مدد لكل موظف×خدمة (المصدر الموثوق للزمن).
- عدّاد تنازلي حيّ مثبّت على طابع زمني (لا يقفز).
- أسعار خدمات اختيارية + إجمالي التكلفة.
- **المواعيد:** «الآن» مقابل «موعد محدّد» بشبكة خانات حصرية (الخانة المحجوزة تُعطّل)؛ سعة الخانة = عدد المزوّدين النشطين.
- **نافذة السماح (Grace):** تحمي المواعيد المحجوزة من تجاوز walk-ins (`queueSortKeyMs`).
- أنماط العدّاد: `auto` (من المدد) / `manual` (الموظف يحدّد) / `none` (عيادة — بالرقم فقط).

### مراحل القرب على شاشة الانتظار
- العتبات (مؤكَّدة من المستخدم): بعيد=4+ / يقترب=2-3 / جاهز=1 / التالي=0 / يُخدَم.
- تصعيد بصري (هالة/نبض/تكبير) + صوت + اهتزاز، يحترم prefers-reduced-motion.

### لوحات التحكم
- `/dashboard` — المدير (إعدادات، موظفون، خدمات، مصفوفة مدد، QR، إحصاءات مضمّنة، إعلانات المحل، بطاقة دليل الاستخدام، بطاقة دعم واتساب).
- `/serve` — شاشة الموظف (نادِ التالي / إكمال / تخطّي / تبديل التوفر).
- `/dashboard/stats` — إحصاءات لكل موظف (عدد مكتمل + إيراد) يومي/شهري.
- `/display/[slug]` — شاشة عرض داخلية (TV) تُظهر «الآن يُخدَم» + القادمون.
- `/founder` — لوحة المؤسس (محميّة بكلمة مرور من البيئة): مقاييس المنتج، الإعلانات، صلاحيات البث الذاتي، الاشتراكات.

### القياس والتحليلات
- جدول `events` (append-only، بلا FKs): QR_SCANNED، WAIT_PAGE_OPENED/REVISITED، TICKET_CREATED/CANCELLED/CALLED، SERVICE_STARTED/COMPLETED، NO_SHOW، APPOINTMENT_CREATED، SERVICE_RATED.
- كوكي زائر مجهول `dwk_vid` + إسناد المصدر `?source=` (in_store/whatsapp/remote).

### قنوات الدعوة
- «في المحل» (QR ?source=in_store) + «عن بُعد» (واتساب ?source=whatsapp / رابط ?source=remote).

### الإعلانات
- إعلانات المؤسس على كل الصفحات مع استهداف منشآت محدّدة + وسائط (صورة/فيديو).
- بث ذاتي مفوَّض: المؤسس يمنح منشأةً حقّ بثّ إعلاناتها على صفحاتها فقط (أولوية المؤسس مطلقة).

### الإشعارات
- Web Push («نبّهني عند اقتراب دوري») — أندرويد/كروم أولاً؛ iOS يحصل على رسالة «أبقِ الصفحة مفتوحة». **بانتظار اختبار جهاز حقيقي.**
- نغمات + اهتزاز متصاعد على شاشة الانتظار.

### التقييم
- تقييم سريع بعد الخدمة (1-5 نجوم) → حدث SERVICE_RATED + متوسط في لوحة المؤسس.

### التسجيل والمصادقة
- `/register` — تسجيل ذاتي (نوع المنشأة نص حر + الاسم) ينشئ منشأة + مدير(=موظف) + خدمة افتراضية.
- `src/lib/auth.ts` — scrypt + كوكي `salon_session` موقّع بـ HMAC + `generateTempPassword()`.
- `/login` — مدير (إيميل+كلمة) أو موظف (رمز المحل + رمز الدخول).
- **استعادة كلمة المرور:** المدير يغيّر كلمته من بطاقة في `/dashboard` (تتطلب الحالية)؛ والمؤسس يعيد تعيين كلمة مدير منشأة من `/founder` (كلمة مؤقتة عبر كوكي flash) لحالة النسيان الكامل.

### صفحة الهبوط والدليل
- `/` — صفحة هبوط جذّابة (رسوم SVG، متعددة اللغات ar/en/hi/bn).
- `/guide` — دليل استخدام تفاعلي بعروض متحركة (متعدد اللغات).

### الاشتراك (التحصيل)
- قفل بعد تجربة مجانية ٣٠ يوماً متدحرجة. التفاصيل في [CURRENT_STATUS.md](CURRENT_STATUS.md) و [DECISIONS.md](DECISIONS.md).

---

## 6. خريطة الملفات الأساسية

| الملف | الدور |
|---|---|
| `src/lib/i18n.ts` / `locale-server.ts` | نواة تعدّد اللغات |
| `src/components/LangSwitcher.tsx` | مبدّل اللغة المشترك |
| `src/lib/subscription.ts` | منطق التجربة/القفل (`shopAccess`, `trialEnd`, `supportWhatsApp`, `bankDetails`) |
| `src/i18n/subscription.ts` | قاموس SUB (ar/en/hi/bn) |
| `src/lib/queue.ts` / `queueKey.ts` | ترتيب الطابور (`queueSortKeyMs`) ونداء التالي |
| `src/lib/slots.ts` | توليد خانات المواعيد |
| `src/lib/events.ts` | تسجيل الأحداث + الزائر + المصدر |
| `src/lib/push.ts` | خط Web Push (VAPID) |
| `src/lib/announcements.ts` / `media.ts` | حلّ الإعلانات + رفع الوسائط |
| `src/lib/founder.ts` | جلسة + مقاييس المؤسس |
| `src/lib/theme.ts` | إعدادات الثيم لكل نوع منشأة |
| `prisma/schema.prisma` | النموذج (22 هجرة حتى الآن) |

---

## 7. الهجرات (Prisma Migrations) — 22 هجرة

من `init` (2026-06-04) حتى `subscription_trial_lock` (2026-06-15). أبرزها:
services_and_durations، appointments، appointment_slots_and_hours، events_and_ticket_source، announcements (+targeting +media +shop_owned)، service_rating، push_subscriptions، subscription_trial_lock.

---

## 8. متغيّرات البيئة (.env)

DATABASE_URL، DIRECT_URL، APP_URL، NEXT_PUBLIC_APP_URL، SESSION_SECRET، FOUNDER_PASSWORD، VAPID_PUBLIC_KEY، VAPID_PRIVATE_KEY، VAPID_SUBJECT، SUPPORT_WHATSAPP، BANK_DETAILS.

> ملاحظة: `NEXT_PUBLIC_APP_URL` يُحقَن وقت البناء → يلزم `npm run build` (لا مجرد restart) بعد تغييره.

---

## 9. روابط ودخول التجربة

- الحجز: https://dawrak.shop/j/barber-elite
- دخول مدير تجريبي: ahmed@demo.test / salon123
- لوحة المؤسس: https://dawrak.shop/founder
- منشآت تجريبية: barber-elite (حلاقة)، bareeq-salon (صالون)، restaurant-demo (مطعم).
