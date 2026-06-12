import { prisma } from "./db";
import type { Announcement, AnnouncementPlacement } from "@prisma/client";

// المواضع الفعلية في الصفحات (بدون "all" — فهو احتياطي يغطيها كلها)
export type PagePlacement = Exclude<AnnouncementPlacement, "all">;

export const PLACEMENT_LABELS: Record<AnnouncementPlacement, string> = {
  all: "عام — كل الصفحات",
  home: "الصفحة الرئيسية",
  join: "صفحة الحجز (الزبون)",
  ticket: "تذكرة الانتظار",
  dashboard: "لوحة المدير",
  serve: "شاشة الموظف",
};

// ضمن مجموعة مرشّحين: الأكثر تخصيصاً يفوز (صفحة محددة تغلب «all»، ومستهدِف يغلب عاماً)
function pickBest(rows: Announcement[], page: PagePlacement): Announcement | null {
  let best: Announcement | null = null;
  let bestScore = -1;
  for (const r of rows) {
    const score = (r.placement === page ? 2 : 0) + (r.shopIds.length > 0 ? 1 : 0);
    if (score > bestScore) {
      best = r;
      bestScore = score;
    }
  }
  return best;
}

// إعلان الصفحة لمنشأة معيّنة. الأولوية المطلقة للمؤسس: إن وُجد إعلان مؤسس ينطبق
// على هذه الصفحة/المنشأة يظهر هو؛ وإلا يملأ الفراغُ إعلانُ المنشأة الخاص (إن مُنحت الصلاحية).
export async function announcementFor(
  page: PagePlacement,
  shopId?: bigint | null
): Promise<Announcement | null> {
  // 1) إعلانات المؤسس (ownerShopId = null) — مستهدِفة لهذه المنشأة أو مبثوثة للكل
  const founderRows = await prisma.announcement.findMany({
    where: {
      isActive: true,
      ownerShopId: null,
      placement: { in: [page, "all"] },
      OR: [
        { shopIds: { isEmpty: true } },
        ...(shopId != null ? [{ shopIds: { has: shopId } }] : []),
      ],
    },
    orderBy: { updatedAt: "desc" },
  });
  const founder = pickBest(founderRows, page);
  if (founder) return founder;

  // 2) إعلان المنشأة الخاص (يظهر على صفحاتها فقط)
  if (shopId == null) return null;
  const shopRows = await prisma.announcement.findMany({
    where: { isActive: true, ownerShopId: shopId, placement: { in: [page, "all"] } },
    orderBy: { updatedAt: "desc" },
  });
  return pickBest(shopRows, page);
}
