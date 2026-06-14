import { notFound } from "next/navigation";
import { displayStateFor } from "@/lib/display";
import { getServerLocale } from "@/lib/locale-server";
import { dirFor, fontVarFor } from "@/lib/i18n";
import { DISPLAY } from "@/i18n/misc";
import DisplayView from "./DisplayView";

export const dynamic = "force-dynamic";
export const metadata = { title: "شاشة العرض | دورك" };

export default async function DisplayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const state = await displayStateFor(slug);
  if (!state) notFound();

  const locale = await getServerLocale();

  return (
    <main
      className={`${state.theme} min-h-screen`}
      dir={dirFor(locale)}
      lang={locale}
      style={{ fontFamily: fontVarFor(locale) }}
    >
      <DisplayView slug={slug} initial={state} t={DISPLAY[locale]} locale={locale} />
    </main>
  );
}
