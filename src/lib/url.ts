// الرابط الأساسي للموقع — يُربط بمتغير البيئة ليعمل على السيرفر الخارجي والجوالات (لا localhost في الإنتاج)
export function appBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

// رابط انضمام الزبون الثابت للمحل — هو ما يُشفَّر داخل الـ QR
export function joinUrlFor(slug: string): string {
  return `${appBaseUrl()}/j/${slug}`;
}
