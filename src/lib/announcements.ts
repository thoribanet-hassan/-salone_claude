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

// إعلان الصفحة لمنشأة معيّنة — الأكثر تخصيصاً يفوز:
// (صفحة محددة + منشآت محددة) > (صفحة محددة لكل المنشآت) > (عام + منشآت محددة) > (عام للكل)
// الصفحات بلا سياق منشأة (الرئيسية) تعرض الإعلانات المبثوثة للكل فقط
export async function announcementFor(
  page: PagePlacement,
  shopId?: bigint | null
): Promise<Announcement | null> {
  const rows = await prisma.announcement.findMany({
    where: {
      isActive: true,
      placement: { in: [page, "all"] },
      OR: [
        { shopIds: { isEmpty: true } },
        ...(shopId != null ? [{ shopIds: { has: shopId } }] : []),
      ],
    },
    orderBy: { updatedAt: "desc" },
  });

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
