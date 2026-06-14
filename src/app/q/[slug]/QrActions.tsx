"use client";

import { useState } from "react";
import type { ChannelsMsgs } from "@/i18n/misc";

interface Props {
  slug: string;
  shopName: string;
  joinUrl: string; // الرابط الأساسي (بلا وسم) — للعرض النصي
  remoteUrl: string; // رابط الحجز عن بُعد (?source=remote)
  whatsappUrl: string; // رابط واتساب (?source=whatsapp)
  allowScheduling: boolean;
  t: ChannelsMsgs;
}

export default function QrActions({
  slug,
  shopName,
  joinUrl,
  remoteUrl,
  whatsappUrl,
  allowScheduling,
  t,
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

  const timePhrase = allowScheduling ? t.timeSched : t.timeNo;

  // مشاركة عبر واتساب المنشأة — رسالة جاهزة تدعو للحجز عن بُعد
  const shareWhatsApp = () => {
    const text = t.whatsappMsg
      .replace("{shop}", shopName)
      .replace("{time}", timePhrase)
      .replace("{url}", whatsappUrl);
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shopName,
          text: t.nativeText.replace("{shop}", shopName).replace("{time}", timePhrase),
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
        <p className="font-extrabold text-sm">{t.inStoreTitle}</p>
        <p className="muted text-xs -mt-1">{t.inStoreBody}</p>
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`/api/qr/${slug}?format=svg`}
            download={`qr-${slug}.svg`}
            className="btn-accent text-center py-3 text-sm"
          >
            {t.downloadSvg}
          </a>
          <a
            href={`/api/qr/${slug}?format=png`}
            download={`qr-${slug}.png`}
            className="btn-accent text-center py-3 text-sm"
          >
            {t.downloadPng}
          </a>
        </div>
        <button onClick={() => window.print()} className="surface py-3 font-bold text-sm">
          {t.printPoster}
        </button>
      </div>

      {/* القناة 2: عن بُعد (مشاركة الرابط) */}
      <div className="surface p-4 flex flex-col gap-3">
        <p className="font-extrabold text-sm">{t.remoteTitle}</p>
        <p className="muted text-xs -mt-1">{allowScheduling ? t.remoteBodySched : t.remoteBodyNo}</p>
        <button onClick={shareWhatsApp} className="btn-accent py-3 font-bold text-sm">
          {t.shareWhatsapp}
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={nativeShare} className="surface py-3 font-bold text-sm">
            {t.shareNative}
          </button>
          <button onClick={copyRemote} className="surface py-3 font-bold text-sm">
            {copied ? t.copied : t.copyLink}
          </button>
        </div>
        <p className="muted text-center text-xs break-all">{joinUrl}</p>
      </div>
    </div>
  );
}
