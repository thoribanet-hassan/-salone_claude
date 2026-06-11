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

// إعلان الصفحة: المخصص للموضع يغلب الإعلان العام
export async function announcementFor(page: PagePlacement): Promise<Announcement | null> {
  const rows = await prisma.announcement.findMany({
    where: { isActive: true, placement: { in: [page, "all"] } },
  });
  return (
    rows.find((r) => r.placement === page) ??
    rows.find((r) => r.placement === "all") ??
    null
  );
}
