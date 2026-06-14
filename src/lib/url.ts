// الرابط الأساسي للموقع — يُربط بمتغير البيئة ليعمل على السيرفر الخارجي والجوالات (لا localhost في الإنتاج)
export function appBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

// رابط انضمام الزبون للمحل. مع source يُوسَم مصدر الدخول (in_store/whatsapp/remote)
// لتظهر قنوات الجلب مفصّلة في لوحة المؤسس
export function joinUrlFor(slug: string, source?: string): string {
  const base = `${appBaseUrl()}/j/${slug}`;
  return source ? `${base}?source=${source}` : base;
}
