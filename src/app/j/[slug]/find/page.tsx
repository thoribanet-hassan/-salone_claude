import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { themeFor } from "@/lib/theme";
import FindForm from "./FindForm";

export default async function FindPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shop = await prisma.shop.findUnique({ where: { slug } });
  if (!shop) notFound();

  const theme = themeFor(shop.facilityType);

  return (
    <main className={`${theme.className} min-h-screen flex flex-col items-center px-5 py-8`}>
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="text-center mt-4">
          <p className="muted text-sm mb-1">{shop.name}</p>
          <h1 className="text-2xl font-extrabold">استرجاع تذكرتك</h1>
        </header>

        <div className="surface p-6">
          <p className="muted text-sm mb-5">
            أدخل الاسم الذي حجزت به أو رقم جوالك لاسترجاع شاشة دورك.
          </p>
          <FindForm slug={shop.slug} />
        </div>

        <a href={`/j/${shop.slug}`} className="muted text-center text-sm no-underline">
          ← العودة لصفحة الحجز
        </a>
      </div>
    </main>
  );
}
