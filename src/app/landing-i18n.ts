// ترجمات صفحة الهبوط — العربية افتراضية، والباقي يختاره الزائر من المبدّل
export type Locale = "ar" | "en" | "hi" | "bn";

export const LOCALES: { code: Locale; label: string; short: string; rtl: boolean }[] = [
  { code: "ar", label: "العربية", short: "ع", rtl: true },
  { code: "en", label: "English", short: "EN", rtl: false },
  { code: "hi", label: "हिन्दी", short: "हि", rtl: false },
  { code: "bn", label: "বাংলা", short: "বাং", rtl: false },
];

export interface Strings {
  brand: string;
  badge: string;
  tagline: string;
  heroLead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  howTitle: string;
  howLead: string;
  steps: { title: string; body: string }[];
  whyTitle: string;
  features: { title: string; body: string }[];
  audienceTitle: string;
  audience: string[];
  ctaFinalTitle: string;
  ctaFinalBody: string;
  ctaFinalBtn: string;
  footerTagline: string;
  // بطاقة الجوال التوضيحية
  phoneShop: string;
  phoneTicketLabel: string;
  phoneNumber: string;
  phoneCustomer: string;
  phoneNext: string;
  phoneAhead: string;
  phoneAheadNum: string;
}

export const T: Record<Locale, Strings> = {
  ar: {
    brand: "دورك",
    badge: "✨ مجاني خلال فترة الإطلاق",
    tagline: "نظام إدارة الانتظار في الأماكن المزدحمة",
    heroLead:
      "حرّر وقت عملائك: يمسحون رمز QR، يحجزون دورهم، ويتابعون أعمالهم بينما ننبّههم عند اقترابه. بدون تطبيق، وبدون تكدّس.",
    ctaPrimary: "أنشئ منشأتك مجاناً",
    ctaSecondary: "دخول المدير / الموظف",
    howTitle: "كيف يعمل؟",
    howLead: "ثلاث خطوات — وتكون جاهزاً",
    steps: [
      { title: "علّقه أو شاركه في أي مكان", body: "ملصق QR جاهز للطباعة في دقيقة لواجهة محلك — أو أرسل الرمز ورابط الحجز عبر واتساب وصفحاتك وأي مكان، ليحجز عملاؤك عن بُعد." },
      { title: "يمسح ويحجز بلا تطبيق", body: "يمسح الرمز أو يفتح الرابط من جوّاله بلا أي تطبيق، ويأخذ دوره الآن أو يختار موعداً في ساعة تناسبه." },
      { title: "ينتظر بحرّية ويُنبَّه", body: "يتابع دوره من جوّاله، وننبّهه بالصوت والإشعار عند اقترابه." },
    ],
    whyTitle: "لماذا دورك؟",
    features: [
      { title: "تحرير وقت العميل", body: "لا وقوف في طابور — يقضي مشواره ويعود عند دوره." },
      { title: "تقليل التكدّس", body: "لا ازدحام داخل منشأتك، وتجربة أرقى وأهدأ للجميع." },
      { title: "عملاء أوفى", body: "لا تخسر زبوناً بسبب الزحام أو طول الانتظار." },
      { title: "رؤية واضحة", body: "تعرف أداء منشأتك وموظفيك يومياً بالأرقام." },
      { title: "مواعيد وحجوزات", body: "دور فوري أو موعد محدّد بخانات، كما يناسب نشاطك." },
      { title: "بلا أجهزة", body: "يعمل من جوّال الموظف — لا حاجة لشراء حاسب." },
    ],
    audienceTitle: "لكل منشأة بها انتظار",
    audience: ["حلاقين", "صالونات نسائية", "مطاعم", "كافيهات", "عيادات", "أي منشأة بها طابور"],
    ctaFinalTitle: "جاهز تنظّم طابورك؟",
    ctaFinalBody: "ابدأ الآن مجاناً خلال فترة الإطلاق — دقائق وتكون جاهزاً لاستقبال عملائك بلا زحام.",
    ctaFinalBtn: "أنشئ منشأتك مجاناً",
    footerTagline: "نظام إدارة الانتظار في الأماكن المزدحمة",
    phoneShop: "صالون النخبة للحلاقة",
    phoneTicketLabel: "رقم تذكرتك",
    phoneNumber: "٤٢",
    phoneCustomer: "حسن",
    phoneNext: "أنت التالي — تجهّز 🎉",
    phoneAhead: "عدد الأشخاص قبلك",
    phoneAheadNum: "٠",
  },
  en: {
    brand: "Dawrak",
    badge: "✨ Free during launch",
    tagline: "Queue management for busy places",
    heroLead:
      "Free your customers' time: they scan a QR, book their turn, and go about their day — we alert them as it approaches. No app, no crowding.",
    ctaPrimary: "Create your business — free",
    ctaSecondary: "Manager / Staff login",
    howTitle: "How it works",
    howLead: "Three steps — and you're ready",
    steps: [
      { title: "Hang it or share it anywhere", body: "A print-ready QR poster in one minute for your storefront — or send the code and booking link via WhatsApp, your page, anywhere, so customers book remotely." },
      { title: "Scan & book — no app", body: "They scan the code or open the link from their phone with no app, and take their turn now or pick a time that suits them." },
      { title: "They wait freely & get alerted", body: "They follow their turn from their phone; we alert them by sound and notification as it nears." },
    ],
    whyTitle: "Why Dawrak?",
    features: [
      { title: "Free your customer's time", body: "No standing in line — they run errands and return at their turn." },
      { title: "Less crowding", body: "No congestion inside your venue — a calmer, classier experience." },
      { title: "More loyal customers", body: "Don't lose a customer to crowds or long waits." },
      { title: "Clear insight", body: "Know your venue and staff performance daily, in numbers." },
      { title: "Appointments & bookings", body: "Instant turn or a specific time slot — as your business needs." },
      { title: "No hardware", body: "Runs from staff's phone — no computer needed." },
    ],
    audienceTitle: "For every place with a queue",
    audience: ["Barbers", "Women's salons", "Restaurants", "Cafés", "Clinics", "Any place with a queue"],
    ctaFinalTitle: "Ready to organize your queue?",
    ctaFinalBody: "Start now, free during launch — minutes and you're ready to welcome customers without crowds.",
    ctaFinalBtn: "Create your business — free",
    footerTagline: "Queue management for busy places",
    phoneShop: "Elite Barber Salon",
    phoneTicketLabel: "Your ticket number",
    phoneNumber: "42",
    phoneCustomer: "Hassan",
    phoneNext: "You're next — get ready 🎉",
    phoneAhead: "People ahead of you",
    phoneAheadNum: "0",
  },
  hi: {
    brand: "Dawrak",
    badge: "✨ लॉन्च के दौरान मुफ़्त",
    tagline: "भीड़भाड़ वाली जगहों के लिए प्रतीक्षा प्रबंधन",
    heroLead:
      "अपने ग्राहकों का समय बचाएँ: वे QR स्कैन करते हैं, अपनी बारी बुक करते हैं और अपने काम पर निकल जाते हैं — बारी पास आने पर हम सूचित कर देते हैं। कोई ऐप नहीं, कोई भीड़ नहीं।",
    ctaPrimary: "अपना व्यवसाय बनाएँ — मुफ़्त",
    ctaSecondary: "मैनेजर / स्टाफ़ लॉगिन",
    howTitle: "यह कैसे काम करता है?",
    howLead: "तीन चरण — और आप तैयार हैं",
    steps: [
      { title: "लगाएँ या कहीं भी साझा करें", body: "आपके स्टोरफ्रंट के लिए एक मिनट में प्रिंट-तैयार QR पोस्टर — या कोड और बुकिंग लिंक व्हाट्सएप, अपने पेज, कहीं भी भेजें, ताकि ग्राहक दूर से बुक करें।" },
      { title: "स्कैन करें और बुक करें — कोई ऐप नहीं", body: "वे बिना किसी ऐप के फ़ोन से कोड स्कैन करते हैं या लिंक खोलते हैं, और अभी बारी लेते हैं या अपने अनुकूल समय चुनते हैं।" },
      { title: "वे आराम से प्रतीक्षा करते हैं और सूचना पाते हैं", body: "वे फ़ोन से अपनी बारी देखते हैं; पास आने पर हम ध्वनि व सूचना से सचेत करते हैं।" },
    ],
    whyTitle: "दौरक क्यों?",
    features: [
      { title: "ग्राहक का समय बचाएँ", body: "कतार में खड़े नहीं — वे काम निपटाकर अपनी बारी पर लौटते हैं।" },
      { title: "कम भीड़", body: "आपके परिसर में भीड़ नहीं — शांत और बेहतर अनुभव।" },
      { title: "अधिक वफ़ादार ग्राहक", body: "भीड़ या लंबे इंतज़ार से ग्राहक न खोएँ।" },
      { title: "स्पष्ट जानकारी", body: "अपने व्यवसाय और स्टाफ़ का प्रदर्शन रोज़ संख्याओं में जानें।" },
      { title: "अपॉइंटमेंट व बुकिंग", body: "तुरंत बारी या निश्चित समय — जैसा आपके व्यवसाय को चाहिए।" },
      { title: "कोई हार्डवेयर नहीं", body: "स्टाफ़ के फ़ोन से चलता है — कंप्यूटर की ज़रूरत नहीं।" },
    ],
    audienceTitle: "हर उस जगह के लिए जहाँ कतार है",
    audience: ["नाई", "महिला सैलून", "रेस्तराँ", "कैफ़े", "क्लीनिक", "कतार वाली कोई भी जगह"],
    ctaFinalTitle: "अपनी कतार व्यवस्थित करने को तैयार?",
    ctaFinalBody: "अभी शुरू करें, लॉन्च के दौरान मुफ़्त — कुछ ही मिनटों में बिना भीड़ ग्राहकों के लिए तैयार।",
    ctaFinalBtn: "अपना व्यवसाय बनाएँ — मुफ़्त",
    footerTagline: "भीड़भाड़ वाली जगहों के लिए प्रतीक्षा प्रबंधन",
    phoneShop: "एलीट बार्बर सैलून",
    phoneTicketLabel: "आपका टिकट नंबर",
    phoneNumber: "42",
    phoneCustomer: "हसन",
    phoneNext: "आपकी बारी — तैयार हो जाइए 🎉",
    phoneAhead: "आपसे आगे लोग",
    phoneAheadNum: "0",
  },
  bn: {
    brand: "Dawrak",
    badge: "✨ লঞ্চের সময় বিনামূল্যে",
    tagline: "ভিড়পূর্ণ স্থানের জন্য অপেক্ষা ব্যবস্থাপনা",
    heroLead:
      "আপনার গ্রাহকদের সময় বাঁচান: তারা QR স্ক্যান করে, নিজের পালা বুক করে, আর নিজের কাজে চলে যায় — পালা কাছে এলে আমরা জানিয়ে দিই। কোনো অ্যাপ নেই, ভিড় নেই।",
    ctaPrimary: "আপনার ব্যবসা তৈরি করুন — বিনামূল্যে",
    ctaSecondary: "ম্যানেজার / স্টাফ লগইন",
    howTitle: "এটি কীভাবে কাজ করে?",
    howLead: "তিন ধাপ — আর আপনি প্রস্তুত",
    steps: [
      { title: "লাগান বা যেকোনো জায়গায় শেয়ার করুন", body: "আপনার দোকানের জন্য এক মিনিটে প্রিন্ট-প্রস্তুত QR পোস্টার — অথবা কোড ও বুকিং লিংক হোয়াটসঅ্যাপ, আপনার পেজ, যেকোনো জায়গায় পাঠান, যাতে গ্রাহক দূর থেকে বুক করে।" },
      { title: "স্ক্যান করে বুক করুন — কোনো অ্যাপ নয়", body: "তারা কোনো অ্যাপ ছাড়াই ফোন থেকে কোড স্ক্যান করে বা লিংক খোলে, আর এখনই নিজের পালা নেয় বা সুবিধামতো সময় বেছে নেয়।" },
      { title: "তারা স্বাধীনভাবে অপেক্ষা করে ও বিজ্ঞপ্তি পায়", body: "তারা ফোন থেকে নিজের পালা দেখে; কাছে এলে আমরা শব্দ ও বিজ্ঞপ্তিতে জানাই।" },
    ],
    whyTitle: "কেন দাওরাক?",
    features: [
      { title: "গ্রাহকের সময় বাঁচান", body: "সারিতে দাঁড়ানো নয় — কাজ সেরে নিজের পালায় ফেরে।" },
      { title: "কম ভিড়", body: "আপনার প্রাঙ্গণে ভিড় নেই — শান্ত ও উন্নত অভিজ্ঞতা।" },
      { title: "আরও অনুগত গ্রাহক", body: "ভিড় বা দীর্ঘ অপেক্ষায় গ্রাহক হারাবেন না।" },
      { title: "স্পষ্ট তথ্য", body: "প্রতিদিন সংখ্যায় আপনার ব্যবসা ও স্টাফের পারফরম্যান্স জানুন।" },
      { title: "অ্যাপয়েন্টমেন্ট ও বুকিং", body: "তাৎক্ষণিক পালা বা নির্দিষ্ট সময় — যেমন আপনার ব্যবসার দরকার।" },
      { title: "কোনো হার্ডওয়্যার নয়", body: "স্টাফের ফোন থেকেই চলে — কম্পিউটারের দরকার নেই।" },
    ],
    audienceTitle: "সারি আছে এমন প্রতিটি স্থানের জন্য",
    audience: ["নাপিত", "মহিলা সেলুন", "রেস্তোরাঁ", "ক্যাফে", "ক্লিনিক", "সারি আছে এমন যেকোনো স্থান"],
    ctaFinalTitle: "আপনার সারি সাজাতে প্রস্তুত?",
    ctaFinalBody: "এখনই শুরু করুন, লঞ্চের সময় বিনামূল্যে — কয়েক মিনিটেই ভিড় ছাড়া গ্রাহক গ্রহণে প্রস্তুত।",
    ctaFinalBtn: "আপনার ব্যবসা তৈরি করুন — বিনামূল্যে",
    footerTagline: "ভিড়পূর্ণ স্থানের জন্য অপেক্ষা ব্যবস্থাপনা",
    phoneShop: "এলিট বার্বার সেলুন",
    phoneTicketLabel: "আপনার টিকিট নম্বর",
    phoneNumber: "42",
    phoneCustomer: "হাসান",
    phoneNext: "আপনার পালা — প্রস্তুত হোন 🎉",
    phoneAhead: "আপনার আগে লোক",
    phoneAheadNum: "0",
  },
};
