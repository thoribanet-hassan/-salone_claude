import { notFound } from "next/navigation";
import { displayStateFor } from "@/lib/display";
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

  return (
    <main className={`${state.theme} min-h-screen`}>
      <DisplayView slug={slug} initial={state} />
    </main>
  );
}
