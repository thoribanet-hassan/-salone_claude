import { announcementFor, type PagePlacement } from "@/lib/announcements";

// شريط إعلان المؤسس — يظهر فقط إن وُجد إعلان فعّال لهذه الصفحة (أو إعلان عام)
// shopId يحدد أي إعلانات المنشآت المستهدفة تنطبق هنا (بدونه: المبثوث للكل فقط)
export default async function AnnouncementBanner({
  page,
  shopId,
  className,
}: {
  page: PagePlacement;
  shopId?: bigint | null;
  className?: string;
}) {
  const a = await announcementFor(page, shopId);
  if (!a || !a.text.trim()) return null;

  const banner = (
    <div
      className="surface p-4 text-center text-sm font-bold overflow-hidden"
      style={{ borderColor: "var(--accent)", borderWidth: "1.5px" }}
    >
      {a.mediaUrl && a.mediaType === "image" && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={a.mediaUrl}
          alt=""
          className="w-full max-h-56 object-cover rounded mb-3"
        />
      )}
      {a.mediaUrl && a.mediaType === "video" && (
        <video
          src={a.mediaUrl}
          className="w-full max-h-64 rounded mb-3"
          controls
          muted
          playsInline
          preload="metadata"
        />
      )}
      📢 {a.text}
      {a.linkUrl && (
        <span className="block mt-1 text-xs underline" style={{ color: "var(--accent)" }}>
          اضغط للمزيد ←
        </span>
      )}
    </div>
  );

  return (
    <div className={className}>
      {a.linkUrl ? (
        <a href={a.linkUrl} target="_blank" rel="noopener noreferrer" className="no-underline block">
          {banner}
        </a>
      ) : (
        banner
      )}
    </div>
  );
}
