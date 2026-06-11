import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // إخفاء مؤشّر وضع التطوير الخاص بـ Next.js (شعار N في الزاوية)
  devIndicators: false,
  experimental: {
    serverActions: {
      // رفع وسائط الإعلانات (صور/فيديو) من لوحة المؤسس
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
