"use server";

import { redirect } from "next/navigation";
import {
  verifyFounderPassword,
  setFounderSession,
  clearFounderSession,
  isFounder,
} from "@/lib/founder";
import { prisma } from "@/lib/db";
import type { AnnouncementPlacement } from "@prisma/client";

const PLACEMENTS: AnnouncementPlacement[] = ["all", "home", "join", "ticket", "dashboard", "serve"];

export async function founderLoginAction(formData: FormData): Promise<void> {
  const pw = String(formData.get("password") ?? "");
  if (!verifyFounderPassword(pw)) redirect("/founder?e=1");
  await setFounderSession();
  redirect("/founder");
}

export async function founderLogoutAction(): Promise<void> {
  await clearFounderSession();
  redirect("/founder");
}

// حفظ/تحديث إعلان موضعٍ ما — صلاحية المؤسس حصراً؛ نص فارغ = حذف الإعلان
export async function saveAnnouncementAction(formData: FormData): Promise<void> {
  if (!(await isFounder())) redirect("/founder");

  const placementRaw = String(formData.get("placement") ?? "");
  const placement = PLACEMENTS.find((p) => p === placementRaw);
  if (!placement) redirect("/founder");

  const text = String(formData.get("text") ?? "").trim();
  const linkRaw = String(formData.get("linkUrl") ?? "").trim();
  const linkUrl = /^https?:\/\/\S+$/.test(linkRaw) ? linkRaw : null;
  const isActive = formData.get("isActive") === "on";

  if (!text) {
    await prisma.announcement.deleteMany({ where: { placement } });
  } else {
    await prisma.announcement.upsert({
      where: { placement },
      create: { placement, text, linkUrl, isActive },
      update: { text, linkUrl, isActive },
    });
  }
  redirect("/founder#announcements");
}
