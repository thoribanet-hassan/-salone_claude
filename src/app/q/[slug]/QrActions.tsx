"use client";

import { useState } from "react";

interface Props {
  slug: string;
  shopName: string;
  joinUrl: string; // الرابط الأساسي (بلا وسم) — للعرض النصي
  remoteUrl: string; // رابط الحجز عن بُعد (?source=remote)
  whatsappUrl: string; // رابط واتساب (?source=whatsapp)
  allowScheduling: boolean;
}

export default function QrActions({
  slug,
  shopName,
  joinUrl,
  remoteUrl,
  whatsappUrl,
  allowScheduling,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copyRemote = async () => {
    try {
      await navigator.clipboard.writeText(remoteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* تجاهل */
    }
  };

  const timePhrase = allowScheduling ? "الآن أو في الوقت الذي يناسبك" : "بسهولة من جوالك";

  // مشاركة عبر واتساب المنشأة — رسالة جاهزة تدعو للحجز عن بُعد
  const shareWhatsApp = () => {
    const text = `مرحباً 👋\nاحجز دورك في ${shopName} ${timePhrase} — بدون أي تطبيق، من جوالك مباشرةً:\n${whatsappUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shopName,
          text: `احجز دورك في ${shopName} ${timePhrase}`,
          url: remoteUrl,
        });
      } catch {
        /* أُلغيت المشاركة */
      }
    } else {
      copyRemote();
    }
  };

  return (
    <div className="no-print flex flex-col gap-4 w-full">
      {/* القناة 1: داخل المحل (الملصق) */}
      <div className="surface p-4 flex flex-col gap-3">
        <p className="font-extrabold text-sm">🏪 في المحل — ملصق QR للواجهة</p>
        <p className="muted text-xs -mt-1">
          علّقه عند المدخل؛ الزبون الحاضر يمسحه ويأخذ دوره فوراً.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`/api/qr/${slug}?format=svg`}
            download={`qr-${slug}.svg`}
            className="btn-accent text-center py-3 text-sm"
          >
            تنزيل SVG
          </a>
          <a
            href={`/api/qr/${slug}?format=png`}
            download={`qr-${slug}.png`}
            className="btn-accent text-center py-3 text-sm"
          >
            تنزيل PNG
          </a>
        </div>
        <button onClick={() => window.print()} className="surface py-3 font-bold text-sm">
          🖨️ طباعة الملصق
        </button>
      </div>

      {/* القناة 2: عن بُعد (مشاركة الرابط) */}
      <div className="surface p-4 flex flex-col gap-3">
        <p className="font-extrabold text-sm">📲 عن بُعد — ادعُ عملاءك للحجز</p>
        <p className="muted text-xs -mt-1">
          أرسل رابط الحجز لعملائك ليحجزوا دورهم {allowScheduling ? "ويختاروا موعداً مناسباً " : ""}
          قبل وصولهم — يصلهم تنبيه عند اقتراب دورهم.
        </p>
        <button onClick={shareWhatsApp} className="btn-accent py-3 font-bold text-sm">
          🟢 مشاركة عبر واتساب
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={nativeShare} className="surface py-3 font-bold text-sm">
            مشاركة…
          </button>
          <button onClick={copyRemote} className="surface py-3 font-bold text-sm">
            {copied ? "✓ تم النسخ" : "نسخ رابط الحجز"}
          </button>
        </div>
        <p className="muted text-center text-xs break-all">{joinUrl}</p>
      </div>
    </div>
  );
}
