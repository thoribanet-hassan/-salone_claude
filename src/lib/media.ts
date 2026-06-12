import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { MediaType } from "@prisma/client";

// وسائط الإعلانات تُحفظ في public/uploads/announcements وتُقدَّم كملفات ثابتة
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

export async function storeMedia(file: File): Promise<{ url: string; type: MediaType } | null> {
  const kind = MEDIA_EXT[file.type];
  if (!kind || file.size === 0 || file.size > MAX_MEDIA_BYTES) return null;
  await mkdir(UPLOADS_DIR, { recursive: true });
  const name = `${randomUUID()}.${kind.ext}`;
  await writeFile(path.join(UPLOADS_DIR, name), Buffer.from(await file.arrayBuffer()));
  return { url: `/uploads/announcements/${name}`, type: kind.type };
}

export async function removeMediaFile(url: string | null): Promise<void> {
  if (!url || !url.startsWith("/uploads/announcements/")) return;
  try {
    await unlink(path.join(process.cwd(), "public", url));
  } catch {
    // الملف غير موجود أصلاً — لا شيء يُفعل
  }
}
