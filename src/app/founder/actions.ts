"use server";

import { redirect } from "next/navigation";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import {
  verifyFounderPassword,
  setFounderSession,
  clearFounderSession,
  isFounder,
} from "@/lib/founder";
import { prisma } from "@/lib/db";
import type { AnnouncementPlacement, MediaType } from "@prisma/client";

const PLACEMENTS: AnnouncementPlacement[] = ["all", "home", "join", "ticket", "dashboard", "serve"];

// ===== وسائط الإعلانات: تُحفظ في public/uploads/announcements وتُقدَّم كملفات ثابتة =====

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "announcements");
const MAX_MEDIA_BYTES = 40 * 1024 * 1024; // 40MB
const MEDIA_EXT: Record<string, { ext: string; type: MediaType }> = {
  "image/jpeg": { ext: "jpg", type: "image" },
  "image/png": { ext: "png", type: "image" },
  "image/webp": { ext: "webp", type: "image" },
  "image/gif": { ext: "gif", type: "image" },
  "video/mp4": { ext: "mp4", type: "video" },
  "video/webm": { ext: "webm", type: "video" },
  "video/quicktime": { ext: "mov", type: "video" },
};

async function storeMedia(file: File): Promise<{ url: string; type: MediaType } | null> {
  const kind = MEDIA_EXT[file.type];
  if (!kind || file.size === 0 || file.size > MAX_MEDIA_BYTES) return null;
  await mkdir(UPLOADS_DIR, { recursive: true });
  const name = `${randomUUID()}.${kind.ext}`;
  await writeFile(path.join(UPLOADS_DIR, name), Buffer.from(await file.arrayBuffer()));
  return { url: `/uploads/announcements/${name}`, type: kind.type };
}

async function removeMediaFile(url: string | null): Promise<void> {
  if (!url || !url.startsWith("/uploads/announcements/")) return;
  try {
    await unlink(path.join(process.cwd(), "public", url));
  } catch {
    // الملف غير موجود أصلاً — لا شيء يُفعل
  }
}

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
