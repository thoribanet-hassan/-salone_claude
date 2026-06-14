import type { Metadata } from "next";
import { Tajawal, Noto_Sans_Devanagari, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
});

// خطوط صفحة الهبوط متعددة اللغات (تُطبَّق فقط عند اختيار الهندية/البنغالية)
const deva = Noto_Sans_Devanagari({
  variable: "--font-deva",
  subsets: ["devanagari", "latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});
const bengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali", "latin"],
  weight: ["400", "700", "800"],
  display: "swap",
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
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${deva.variable} ${bengali.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
