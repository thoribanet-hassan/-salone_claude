import type { Locale } from "@/lib/i18n";

export interface SubMsgs {
  // قفل صفحة الزبون
  lockedTitle: string;
  lockedBody: string;
  // شريط تنبيه قرب الانتهاء
  bannerSoon: string; // {n}
  renew: string;
  // شاشة التجديد (المدير)
  gateTitle: string;
  gateBody: string;
  howToRenew: string;
  bankHdr: string;
  noBank: string;
  contactWhatsapp: string;
  logout: string;
  whatsappMsgRenew: string; // {owner} {shop} {code}
  // بطاقة التواصل
  supportTitle: string;
  supportBody: string;
  supportBtn: string;
  supportMsg: string; // {owner} {shop} {code}
  // المؤسس
  stTrial: string;
  stActive: string;
  stExpired: string;
  daysLeft: string; // {n}
  activate: string;
}

export const SUB: Record<Locale, SubMsgs> = {
  ar: {
    lockedTitle: "الحجز غير متاح حالياً",
    lockedBody: "هذه المنشأة غير متاحة للحجز في الوقت الحالي.",
    bannerSoon: "تنتهي تجربتك خلال {n} يوم — جدّد للمتابعة.",
    renew: "جدّد الآن",
    gateTitle: "انتهت تجربتك المجانية",
    gateBody: "جدّد اشتراكك لمواصلة استقبال عملائك عبر دورك.",
    howToRenew: "للتجديد: حوّل قيمة الاشتراك، ثم راسلنا على واتساب لنفعّله فوراً.",
    bankHdr: "بيانات التحويل",
    noBank: "تواصل معنا على واتساب لمعرفة طريقة التجديد.",
    contactWhatsapp: "📲 تواصل عبر واتساب",
    logout: "خروج",
    whatsappMsgRenew: "مرحباً، أنا {owner} من {shop} (رمز {code}) وأريد تجديد اشتراكي في دورك.",
    supportTitle: "تواصل مع فريق دورك",
    supportBody: "دعم ومساعدة وملاحظات عبر واتساب.",
    supportBtn: "تواصل عبر واتساب",
    supportMsg: "مرحباً، أنا {owner} من {shop} (رمز {code})، ",
    stTrial: "تجربة",
    stActive: "مدفوع",
    stExpired: "منتهٍ",
    daysLeft: "{n} يوم متبقٍ",
    activate: "فعّل/مدّد شهراً",
  },
  en: {
    lockedTitle: "Booking is currently unavailable",
    lockedBody: "This business is not available for booking right now.",
    bannerSoon: "Your trial ends in {n} days — renew to continue.",
    renew: "Renew now",
    gateTitle: "Your free trial has ended",
    gateBody: "Renew your subscription to keep receiving customers via Dawrak.",
    howToRenew: "To renew: transfer the subscription fee, then message us on WhatsApp to activate it instantly.",
    bankHdr: "Transfer details",
    noBank: "Contact us on WhatsApp for renewal details.",
    contactWhatsapp: "📲 Contact via WhatsApp",
    logout: "Sign out",
    whatsappMsgRenew: "Hello, I'm {owner} from {shop} (code {code}) and I'd like to renew my Dawrak subscription.",
    supportTitle: "Contact the Dawrak team",
    supportBody: "Support, help and feedback via WhatsApp.",
    supportBtn: "Contact via WhatsApp",
    supportMsg: "Hello, I'm {owner} from {shop} (code {code}), ",
    stTrial: "Trial",
    stActive: "Paid",
    stExpired: "Expired",
    daysLeft: "{n} days left",
    activate: "Activate / extend 1 month",
  },
  hi: {
    lockedTitle: "बुकिंग अभी उपलब्ध नहीं",
    lockedBody: "यह व्यवसाय अभी बुकिंग के लिए उपलब्ध नहीं है।",
    bannerSoon: "आपकी ट्रायल {n} दिनों में समाप्त — जारी रखने के लिए नवीनीकरण करें।",
    renew: "अभी नवीनीकरण करें",
    gateTitle: "आपकी मुफ़्त ट्रायल समाप्त हो गई",
    gateBody: "दौरक के ज़रिए ग्राहक लेना जारी रखने के लिए अपना सब्सक्रिप्शन नवीनीकृत करें।",
    howToRenew: "नवीनीकरण के लिए: सब्सक्रिप्शन शुल्क ट्रांसफ़र करें, फिर इसे तुरंत सक्रिय करने के लिए हमें व्हाट्सएप पर संदेश भेजें।",
    bankHdr: "ट्रांसफ़र विवरण",
    noBank: "नवीनीकरण विवरण के लिए हमें व्हाट्सएप पर संपर्क करें।",
    contactWhatsapp: "📲 व्हाट्सएप पर संपर्क करें",
    logout: "साइन आउट",
    whatsappMsgRenew: "नमस्ते, मैं {shop} (कोड {code}) से {owner} हूँ और अपना दौरक सब्सक्रिप्शन नवीनीकृत करना चाहता/चाहती हूँ।",
    supportTitle: "दौरक टीम से संपर्क करें",
    supportBody: "व्हाट्सएप पर सहायता और प्रतिक्रिया।",
    supportBtn: "व्हाट्सएप पर संपर्क करें",
    supportMsg: "नमस्ते, मैं {shop} (कोड {code}) से {owner} हूँ, ",
    stTrial: "ट्रायल",
    stActive: "भुगतान",
    stExpired: "समाप्त",
    daysLeft: "{n} दिन शेष",
    activate: "सक्रिय / 1 माह बढ़ाएँ",
  },
  bn: {
    lockedTitle: "বুকিং এখন উপলব্ধ নয়",
    lockedBody: "এই ব্যবসা এখন বুকিংয়ের জন্য উপলব্ধ নয়।",
    bannerSoon: "আপনার ট্রায়াল {n} দিনে শেষ হচ্ছে — চালিয়ে যেতে নবায়ন করুন।",
    renew: "এখনই নবায়ন করুন",
    gateTitle: "আপনার ফ্রি ট্রায়াল শেষ হয়েছে",
    gateBody: "দাওরাকের মাধ্যমে গ্রাহক গ্রহণ চালিয়ে যেতে আপনার সাবস্ক্রিপশন নবায়ন করুন।",
    howToRenew: "নবায়নের জন্য: সাবস্ক্রিপশন ফি ট্রান্সফার করুন, তারপর তাৎক্ষণিকভাবে সক্রিয় করতে হোয়াটসঅ্যাপে আমাদের বার্তা দিন।",
    bankHdr: "ট্রান্সফার বিবরণ",
    noBank: "নবায়নের বিবরণের জন্য হোয়াটসঅ্যাপে যোগাযোগ করুন।",
    contactWhatsapp: "📲 হোয়াটসঅ্যাপে যোগাযোগ করুন",
    logout: "সাইন আউট",
    whatsappMsgRenew: "হ্যালো, আমি {shop} (কোড {code}) থেকে {owner}, আমার দাওরাক সাবস্ক্রিপশন নবায়ন করতে চাই।",
    supportTitle: "দাওরাক টিমের সাথে যোগাযোগ",
    supportBody: "হোয়াটসঅ্যাপে সহায়তা ও মতামত।",
    supportBtn: "হোয়াটসঅ্যাপে যোগাযোগ করুন",
    supportMsg: "হ্যালো, আমি {shop} (কোড {code}) থেকে {owner}, ",
    stTrial: "ট্রায়াল",
    stActive: "পরিশোধিত",
    stExpired: "মেয়াদোত্তীর্ণ",
    daysLeft: "{n} দিন বাকি",
    activate: "সক্রিয় / ১ মাস বাড়ান",
  },
};
