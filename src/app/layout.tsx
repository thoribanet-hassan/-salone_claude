import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "دورك | نظام إدارة الانتظار في الأماكن المزدحمة",
  description: "«دورك» — نظام إدارة الانتظار في الأماكن المزدحمة: حلاقين، صالونات، مطاعم، عيادات وغيرها — عبر QR وبدون أي تطبيق",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
