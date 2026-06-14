import GuideContent from "./GuideContent";

export const metadata = {
  title: "دليل استخدام دورك | Dawrak User Guide",
  description: "تعلّم كيف تستخدم دورك بكل عناصره — خطوة بخطوة، مع مقاطع متحركة. بالعربية والإنجليزية والهندية والبنغالية.",
};

export default function GuidePage() {
  return (
    <main className="min-h-screen">
      <GuideContent />
    </main>
  );
}
