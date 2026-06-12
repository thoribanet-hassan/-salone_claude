import webpush from "web-push";
import { prisma } from "./db";
import { queueSortKeyMs, DEFAULT_GRACE_MINUTES } from "./queueKey";

// إعداد VAPID مرة واحدة — إن غابت المفاتيح يتعطل الإرسال بصمت (لا يكسر الطوابير)
const PUB = process.env.VAPID_PUBLIC_KEY;
const PRIV = process.env.VAPID_PRIVATE_KEY;
const SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@dawrak.shop";
const configured = !!(PUB && PRIV);
if (configured) webpush.setVapidDetails(SUBJECT, PUB!, PRIV!);

export function vapidPublicKey(): string | null {
  return PUB ?? null;
}

interface PushPayload {
  title: string;
  body: string;
  url: string;
}

// إرسال لاشتراك واحد — 404/410 = اشتراك ميت فيُحذف؛ غير ذلك يُبتلع الخطأ
async function sendTo(
  sub: { id: bigint; endpoint: string; p256dh: string; auth: string },
  payload: PushPayload
): Promise<void> {
  if (!configured) return;
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(payload),
      { TTL: 60 * 30 }
    );
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode;
    if (status === 404 || status === 410) {
      await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
    } else {
      console.error("push send failed:", status ?? err);
    }
  }
}

// إشعار مباشر لتذكرة بعينها (حان دورك / تم التخطي / حُدّد وقتك)
export async function notifyTicket(
  ticketId: bigint,
  payload: Omit<PushPayload, "url"> & { url?: string },
  stage?: number
): Promise<void> {
  if (!configured) return;
  try {
    const subs = await prisma.pushSubscription.findMany({ where: { ticketId } });
    if (subs.length === 0) return;
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { publicToken: true },
    });
    const url = payload.url ?? (ticket ? `/t/${ticket.publicToken}` : "/");
    await Promise.all(
      subs.map(async (s) => {
        await sendTo(s, { title: payload.title, body: payload.body, url });
        if (stage != null) {
          await prisma.pushSubscription
            .update({ where: { id: s.id }, data: { lastNotifiedStage: stage } })
            .catch(() => {});
        }
      })
    );
  } catch (err) {
    console.error("notifyTicket failed:", err);
  }
}

// مراحل إشعارات الاقتراب حسب الترتيب: 1=أنت التالي 2=بقي واحد 3=اقترب (2-3 أمامك)
function stageForPosition(pos: number): number | null {
  if (pos === 0) return 1;
  if (pos === 1) return 2;
  if (pos <= 3) return 3;
  return null;
}

function stageMessage(stage: number, pos: number): { title: string; body: string } {
  switch (stage) {
    case 1:
      return { title: "🔔 أنت التالي", body: "يرجى التواجد قرب نقطة الخدمة الآن" };
    case 2:
      return { title: "🔔 اقترب دورك", body: "بقي أمامك شخص واحد فقط — كن قريباً" };
    default:
      return { title: "دورك يقترب", body: `أمامك ${pos} أشخاص — يمكنك البدء بالتوجه` };
  }
}

// بعد كل تحرّك في طابور المنشأة: أشعر أصحاب الاشتراكات الذين اقتربت أدوارهم
// position يُحسب بنفس منطق queueInfoFor (نفس مسار الحلاق/الـ pool + مفتاح النافذة)
export async function notifyShopQueue(shopId: bigint): Promise<void> {
  if (!configured) return;
  try {
    const [settings, waiting] = await Promise.all([
      prisma.shopSettings.findUnique({ where: { shopId } }),
      prisma.ticket.findMany({
        where: { shopId, status: "waiting" },
        select: {
          id: true,
          publicToken: true,
          barberId: true,
          scheduledAt: true,
          createdAt: true,
        },
      }),
    ]);
    if (waiting.length === 0) return;
    const graceMs = (settings?.appointmentGraceMinutes ?? DEFAULT_GRACE_MINUTES) * 60_000;

    const subs = await prisma.pushSubscription.findMany({
      where: { ticketId: { in: waiting.map((t) => t.id) } },
    });
    if (subs.length === 0) return;
    const byTicket = new Map<string, typeof subs>();
    for (const s of subs) {
      const k = s.ticketId.toString();
      byTicket.set(k, [...(byTicket.get(k) ?? []), s]);
    }

    const now = Date.now();
    for (const t of waiting) {
      const mySubs = byTicket.get(t.id.toString());
      if (!mySubs?.length) continue;
      // صاحب موعد لم تبدأ نافذته: لا إشعارات اقتراب قبل أوانه
      if (t.scheduledAt && t.scheduledAt.getTime() - graceMs > now) continue;

      const myKey = queueSortKeyMs(t, graceMs);
      const pos = waiting.filter(
        (o) =>
          o.id !== t.id &&
          // نفس مسار queueInfoFor: حلاق محدد يطابق مساره، null يطابق الـ pool
          ((o.barberId === null && t.barberId === null) ||
            (o.barberId !== null && t.barberId !== null && o.barberId === t.barberId)) &&
          queueSortKeyMs(o, graceMs) < myKey
      ).length;

      const stage = stageForPosition(pos);
      if (stage == null) continue;
      const msg = stageMessage(stage, pos);
      for (const s of mySubs) {
        // أشعر فقط عند الاقتراب لمرحلة أقرب من آخر إشعار
        if (s.lastNotifiedStage != null && s.lastNotifiedStage <= stage) continue;
        await prisma.pushSubscription
          .update({ where: { id: s.id }, data: { lastNotifiedStage: stage } })
          .catch(() => {});
        await sendTo(s, { ...msg, url: `/t/${t.publicToken}` });
      }
    }
  } catch (err) {
    console.error("notifyShopQueue failed:", err);
  }
}
