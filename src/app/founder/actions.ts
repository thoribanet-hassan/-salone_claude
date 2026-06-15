"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  verifyFounderPassword,
  setFounderSession,
  clearFounderSession,
  isFounder,
  FOUNDER_FLASH,
} from "@/lib/founder";
import { hashPassword, generateTempPassword } from "@/lib/auth";
import { storeMedia, removeMediaFile } from "@/lib/media";
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
  const removeMedia = formData.get("removeMedia") === "on";
  const shopIds = formData
    .getAll("shopIds")
    .map((v) => String(v))
    .filter((v) => /^\d+$/.test(v))
    .map((v) => BigInt(v));
  const idRaw = String(formData.get("id") ?? "");

  if (!text) redirect("/founder#announcements");

  // وسائط جديدة (إن رُفعت) — تحل محل القديمة
  const mediaFile = formData.get("media");
  const uploaded =
    mediaFile instanceof File && mediaFile.size > 0 ? await storeMedia(mediaFile) : null;

  if (/^\d+$/.test(idRaw)) {
    const id = BigInt(idRaw);
    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) redirect("/founder#announcements");

    let mediaUrl = existing.mediaUrl;
    let mediaType = existing.mediaType;
    if (uploaded) {
      await removeMediaFile(existing.mediaUrl);
      mediaUrl = uploaded.url;
      mediaType = uploaded.type;
    } else if (removeMedia) {
      await removeMediaFile(existing.mediaUrl);
      mediaUrl = null;
      mediaType = null;
    }
    await prisma.announcement.update({
      where: { id },
      data: { placement, text, linkUrl, isActive, shopIds, mediaUrl, mediaType },
    });
  } else {
    await prisma.announcement.create({
      data: {
        placement,
        text,
        linkUrl,
        isActive,
        shopIds,
        mediaUrl: uploaded?.url ?? null,
        mediaType: uploaded?.type ?? null,
      },
    });
  }
  redirect("/founder#announcements");
}

export async function deleteAnnouncementAction(formData: FormData): Promise<void> {
  if (!(await isFounder())) redirect("/founder");
  const idRaw = String(formData.get("id") ?? "");
  if (/^\d+$/.test(idRaw)) {
    const id = BigInt(idRaw);
    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (existing) {
      await removeMediaFile(existing.mediaUrl);
      await prisma.announcement.delete({ where: { id } });
    }
  }
  redirect("/founder#announcements");
}

// تفعيل/تمديد اشتراك منشأة شهراً — المؤسس حصراً (التفعيل اليدوي بعد التحويل)
export async function activateShopAction(formData: FormData): Promise<void> {
  if (!(await isFounder())) redirect("/founder");
  const idRaw = String(formData.get("shopId") ?? "");
  if (/^\d+$/.test(idRaw)) {
    const shop = await prisma.shop.findUnique({
      where: { id: BigInt(idRaw) },
      select: { paidUntil: true },
    });
    if (shop) {
      // يمدّد من تاريخ الانتهاء الحالي إن كان مستقبلاً، وإلا من الآن
      const base =
        shop.paidUntil && shop.paidUntil.getTime() > Date.now() ? shop.paidUntil : new Date();
      const paidUntil = new Date(base.getTime() + 30 * 24 * 60 * 60 * 1000);
      await prisma.shop.update({ where: { id: BigInt(idRaw) }, data: { paidUntil } });
    }
  }
  redirect("/founder#subscriptions");
}

// إعادة تعيين كلمة مرور مدير منشأة — المؤسس حصراً (لحالة نسيان المالك كلمته)
// يولّد كلمة مؤقتة، يحدّث الـ hash، ويعرضها للمؤسس مرة واحدة عبر كوكي flash قصير العمر
export async function resetManagerPasswordAction(formData: FormData): Promise<void> {
  if (!(await isFounder())) redirect("/founder");
  const idRaw = String(formData.get("shopId") ?? "");
  if (/^\d+$/.test(idRaw)) {
    const manager = await prisma.user.findFirst({
      where: { shopId: BigInt(idRaw), role: "manager" },
      include: { shop: { select: { name: true } } },
    });
    if (manager) {
      const temp = generateTempPassword();
      await prisma.user.update({
        where: { id: manager.id },
        data: { passwordHash: hashPassword(temp) },
      });
      const payload = JSON.stringify({
        shop: manager.shop?.name ?? "",
        email: manager.email ?? "",
        temp,
      });
      (await cookies()).set(FOUNDER_FLASH, payload, {
        httpOnly: true,
        sameSite: "lax",
        path: "/founder",
        maxAge: 300, // يختفي تلقائياً بعد ٥ دقائق
      });
    }
  }
  redirect("/founder#subscriptions");
}

// منح/سحب صلاحية الإعلان الذاتي لمنشأة — المؤسس حصراً
export async function toggleSelfAnnounceAction(formData: FormData): Promise<void> {
  if (!(await isFounder())) redirect("/founder");
  const idRaw = String(formData.get("shopId") ?? "");
  if (/^\d+$/.test(idRaw)) {
    await prisma.shop.update({
      where: { id: BigInt(idRaw) },
      data: { canSelfAnnounce: formData.get("grant") === "on" },
    });
  }
  redirect("/founder#self-announce");
}
