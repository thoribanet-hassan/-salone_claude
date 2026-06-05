import { prisma } from "./db";

// خريطة تحويل أساسية من العربية إلى لاتيني لتوليد الـ slug
const AR_MAP: Record<string, string> = {
  ا: "a", أ: "a", إ: "a", آ: "a", ء: "", ؤ: "o", ئ: "e", ى: "a", ة: "a",
  ب: "b", ت: "t", ث: "th", ج: "j", ح: "h", خ: "kh", د: "d", ذ: "th",
  ر: "r", ز: "z", س: "s", ش: "sh", ص: "s", ض: "d", ط: "t", ظ: "z",
  ع: "a", غ: "gh", ف: "f", ق: "q", ك: "k", ل: "l", م: "m", ن: "n",
  ه: "h", و: "w", ي: "y", ال: "al",
};

export function arabicToSlug(name: string): string {
  let out = "";
  for (const ch of name.trim()) {
    if (AR_MAP[ch] !== undefined) out += AR_MAP[ch];
    else if (/[a-zA-Z0-9]/.test(ch)) out += ch.toLowerCase();
    else if (/\s/.test(ch) || ch === "-" || ch === "_") out += "-";
    // باقي الرموز تُتجاهل
  }
  out = out
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return out || "shop";
}

// منع تكرار الـ slug بإضافة رقم تسلسلي
export async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let i = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const exists = await prisma.shop.findUnique({ where: { slug } });
    if (!exists) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
}

// رمز محل عشوائي فريد مثل QS-8923
export async function generateShopCode(): Promise<string> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const code = `QS-${Math.floor(1000 + Math.random() * 9000)}`;
    const exists = await prisma.shop.findUnique({ where: { shopCode: code } });
    if (!exists) return code;
  }
}

// رمز دخول رقمي فريد داخل المحل (4 خانات) للموظف/الحلاق
export async function generateLoginCode(shopId: bigint): Promise<string> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    const exists = await prisma.user.findFirst({ where: { shopId, loginCode: code } });
    if (!exists) return code;
  }
}
