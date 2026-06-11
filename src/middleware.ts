import { NextResponse, type NextRequest } from "next/server";

// مسارات الزبائن فقط: كوكي زائر مجهول (لقياس العودة والتسرّب)
// + التقاط مصدر الدخول ?source= من روابط/QR في كوكي قصير العمر
export function middleware(req: NextRequest) {
  const existing = req.cookies.get("dwk_vid")?.value;
  const vid = existing ?? crypto.randomUUID();

  // نمرّر المعرّف هيدراً ليقرأه نفس الطلب (الكوكي لا يصل إلا في الطلب التالي)
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-visitor-id", vid);
  const res = NextResponse.next({ request: { headers: requestHeaders } });

  if (!existing) {
    res.cookies.set("dwk_vid", vid, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      httpOnly: true,
    });
  }

  const source = req.nextUrl.searchParams.get("source");
  if (source && /^[a-z0-9_-]{1,32}$/i.test(source)) {
    res.cookies.set("dwk_src", source.toLowerCase(), {
      path: "/",
      maxAge: 60 * 60 * 12,
      sameSite: "lax",
      httpOnly: true,
    });
  }

  return res;
}

export const config = { matcher: ["/j/:path*", "/t/:path*"] };
