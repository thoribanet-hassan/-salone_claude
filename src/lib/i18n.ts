// نواة الترجمة المشتركة لكل التطبيق — العربية افتراضية، والاختيار يُحفظ في كوكي يقرؤه الخادم
export type Locale = "ar" | "en" | "hi" | "bn";

export const LOCALES: { code: Locale; label: string; short: string; rtl: boolean }[] = [
  { code: "ar", label: "العربية", short: "ع", rtl: true },
  { code: "en", label: "English", short: "EN", rtl: false },
  { code: "hi", label: "हिन्दी", short: "हि", rtl: false },
  { code: "bn", label: "বাংলা", short: "বাং", rtl: false },
];

export const DEFAULT_LOCALE: Locale = "ar";
export const LOCALE_COOKIE = "dawrak_lang";

export function isLocale(x: unknown): x is Locale {
  return typeof x === "string" && LOCALES.some((l) => l.code === x);
}

export function dirFor(l: Locale): "rtl" | "ltr" {
  return l === "ar" ? "rtl" : "ltr";
}

// متغيّر الخط لكل لغة (الهندية/البنغالية تحتاج خطّاً خاصاً)
export function fontVarFor(l: Locale): string | undefined {
  return l === "hi" ? "var(--font-deva)" : l === "bn" ? "var(--font-bengali)" : undefined;
}
