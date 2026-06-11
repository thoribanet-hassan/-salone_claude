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

// حفظ إعلان (جديد أو تعديل) — صلاحية المؤسس حصراً
// الاستهداف: shopIds المختارة؛ بدون اختيار = بث لكل المنشآت
export async function saveAnnouncementAction(formData: FormData): Promise<void> {
  if (!(await isFounder())) redirect("/founder");

  const placementRaw = String(formData.get("placement") ?? "");
  const placement = PLACEMENTS.find((p) => p === placementRaw);
  if (!placement) redirect("/founder");

  const text = String(formData.get("text") ?? "").trim();
  const linkRaw = String(formData.get("linkUrl") ?? "").trim();
  const linkUrl = /^https?:\/\/\S+$/.test(linkRaw) ? linkRaw : null;
  const isActive = formData.get("isActive") === "on";
  const shopIds = formData
    .getAll("shopIds")
    .map((v) => String(v))
    .filter((v) => /^\d+$/.test(v))
    .map((v) => BigInt(v));
  const idRaw = String(formData.get("id") ?? "");

  if (!text) redirect("/founder#announcements");

  if (/^\d+$/.test(idRaw)) {
    await prisma.announcement.update({
      where: { id: BigInt(idRaw) },
      data: { placement, text, linkUrl, isActive, shopIds },
    });
  } else {
    await prisma.announcement.create({
      data: { placement, text, linkUrl, isActive, shopIds },
    });
  }
  redirect("/founder#announcements");
}

export async function deleteAnnouncementAction(formData: FormData): Promise<void> {
  if (!(await isFounder())) redirect("/founder");
  const idRaw = String(formData.get("id") ?? "");
  if (/^\d+$/.test(idRaw)) {
    await prisma.announcement.deleteMany({ where: { id: BigInt(idRaw) } });
  }
  redirect("/founder#announcements");
}
