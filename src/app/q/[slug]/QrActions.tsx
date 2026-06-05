"use client";

import { useState } from "react";

interface Props {
  slug: string;
  shopName: string;
  joinUrl: string;
}

export default function QrActions({ slug, shopName, joinUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* تجاهل */
    }
  };

  // مشاركة عبر واتساب — يفتح محادثة برسالة جاهزة تحوي الرابط
  const shareWhatsApp = () => {
    const text = `احجز دورك في ${shopName} مباشرةً من جوالك:\n${joinUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: shopName, text: "احجز دورك", url: joinUrl });
      } catch {
        /* أُلغيت المشاركة */
      }
    } else {
      copyLink();
    }
  };

  return (
    <div className="no-print flex flex-col gap-3 w-full">
      <div className="grid grid-cols-2 gap-3">
        <a
          href={`/api/qr/${slug}?format=svg`}
          download={`qr-${slug}.svg`}
          className="btn-accent text-center py-3"
        >
          تنزيل SVG (للطباعة)
        </a>
        <a
          href={`/api/qr/${slug}?format=png`}
          download={`qr-${slug}.png`}
          className="btn-accent text-center py-3"
        >
          تنزيل PNG
        </a>
      </div>

      <button onClick={() => window.print()} className="surface py-3 font-bold">
        🖨️ طباعة الملصق
      </button>

      <button onClick={shareWhatsApp} className="surface py-3 font-bold">
        مشاركة عبر واتساب
      </button>

      <button onClick={nativeShare} className="surface py-3 font-bold">
        مشاركة من صفحتي
      </button>

      <button onClick={copyLink} className="surface py-3 font-bold">
        {copied ? "✓ تم نسخ الرابط" : "نسخ الرابط"}
      </button>

      <p className="muted text-center text-xs break-all mt-1">{joinUrl}</p>
    </div>
  );
}
