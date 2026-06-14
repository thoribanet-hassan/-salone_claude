import AnnouncementBanner from "@/components/AnnouncementBanner";
import LandingContent from "./LandingContent";

// ديناميكية حتى يظهر إعلان المؤسس فور تغييره
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="min-h-screen">
      <LandingContent banner={<AnnouncementBanner page="home" />} />
    </main>
  );
}
