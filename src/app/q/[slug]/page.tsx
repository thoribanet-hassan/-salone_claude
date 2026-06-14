import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { themeFor } from "@/lib/theme";
import { joinUrlFor } from "@/lib/url";
import { getServerLocale } from "@/lib/locale-server";
import { dirFor, fontVarFor } from "@/lib/i18n";
import { CHANNELS } from "@/i18n/misc";
import LangSwitcher from "@/components/LangSwitcher";
import QrActions from "./QrActions";

export default async function QrPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shop = await prisma.shop.findUnique({ where: { slug }, include: { settings: true } });
  if (!shop) notFound();

  const theme = themeFor(shop.facilityType);
  const joinUrl = joinUrlFor(slug);
  const locale = await getServerLocale();
  const t = CHANNELS[locale];

  return (
    <main
      className={`${theme.className} min-h-screen flex flex-col items-center px-5 py-8`}
      dir={dirFor(locale)}
      lang={locale}
      style={{ fontFamily: fontVarFor(locale) }}
    >
      <div className="w-full max-w-md flex flex-col gap-6 items-center">
        <div className="no-print">
          <LangSwitcher current={locale} />
        </div>
        {/* الملصق القابل للطباعة والتعليق في المحل */}
        <div id="poster" className="qr-print-area surface w-full p-8 flex flex-col items-center gap-5 text-center">
          <div>
            <p className="muted text-sm">{shop.facilityLabel || theme.label}</p>
            <h1 className="text-3xl font-extrabold mt-1">{shop.name}</h1>
          </div>

          <div className="bg-white p-4 rounded-2xl">
            {/* SVG عالي الدقة من مسار توليد الـ QR */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/qr/${slug}?format=svg`}
              alt={`QR ${shop.name}`}
              width={288}
              height={288}
              style={{ width: 288, height: 288, display: "block" }}
            />
          </div>

          <div>
            <p className="text-2xl font-extrabold" style={{ color: "var(--accent)" }}>
              {t.posterScan}
            </p>
            <p className="muted mt-1">{t.posterNoApp}</p>
          </div>

          <p className="muted text-xs">{t.posterShopCode} {shop.shopCode}</p>
        </div>

        <QrActions
          slug={slug}
          shopName={shop.name}
          joinUrl={joinUrl}
          t={t}
          remoteUrl={joinUrlFor(slug, "remote")}
          whatsappUrl={joinUrlFor(slug, "whatsapp")}
          allowScheduling={!!shop.settings?.allowScheduling}
        />
      </div>
    </main>
  );
}
