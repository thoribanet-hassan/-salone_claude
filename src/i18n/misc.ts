import type { Locale } from "@/lib/i18n";

// محلّيات Intl لكل لغة (للتواريخ والأرقام)
export const INTL_LOCALE: Record<Locale, string> = {
  ar: "ar-SA",
  en: "en-US",
  hi: "hi-IN",
  bn: "bn-BD",
};

export interface StatsMsgs {
  title: string;
  backToDashboard: string;
  prev: string;
  next: string;
  current: string;
  todayPrefix: string;
  managerBadge: string;
  did: string;
  collected: string;
  currency: string;
  monthPerPerson: string;
  colName: string;
  colDone: string;
  colRevenue: string;
  managerParen: string;
  total: string;
  dailyBreakdown: string;
  noneYet: string;
  colDay: string;
  todayBadge: string;
  unassigned: string;
}

export interface DisplayMsgs {
  soundTitle: string;
  soundOn: string;
  soundOff: string;
  reconnecting: string;
  nowServing: string;
  waitingNext: string;
  closed: string;
  numberWord: string;
  coming: string;
  autoUpdate: string;
}

export interface ChannelsMsgs {
  inStoreTitle: string;
  inStoreBody: string;
  downloadSvg: string;
  downloadPng: string;
  printPoster: string;
  remoteTitle: string;
  remoteBodySched: string;
  remoteBodyNo: string;
  shareWhatsapp: string;
  shareNative: string;
  copyLink: string;
  copied: string;
  timeSched: string;
  timeNo: string;
  whatsappMsg: string; // {shop} {time} {url}
  nativeText: string; // {shop} {time}
  posterScan: string;
  posterNoApp: string;
  posterShopCode: string;
}

export const STATS: Record<Locale, StatsMsgs> = {
  ar: { title: "📊 إحصائيات العمل", backToDashboard: "← لوحة التحكم", prev: "‹ السابق", next: "التالي ›", current: "الحالي", todayPrefix: "اليوم —", managerBadge: "المدير", did: "أنجز", collected: "حصّل", currency: "ريال", monthPerPerson: "محصلة الشهر لكل فرد", colName: "الاسم", colDone: "أنجز", colRevenue: "الإيراد (ريال)", managerParen: "(المدير)", total: "الإجمالي", dailyBreakdown: "التفصيل اليومي", noneYet: "لا إنجازات مكتملة في هذا الشهر بعد.", colDay: "اليوم", todayBadge: "اليوم", unassigned: "غير معيّن" },
  en: { title: "📊 Work statistics", backToDashboard: "← Control panel", prev: "‹ Previous", next: "Next ›", current: "Current", todayPrefix: "Today —", managerBadge: "Manager", did: "Served", collected: "earned", currency: "SAR", monthPerPerson: "Monthly total per person", colName: "Name", colDone: "Served", colRevenue: "Revenue (SAR)", managerParen: "(Manager)", total: "Total", dailyBreakdown: "Daily breakdown", noneYet: "No completed work this month yet.", colDay: "Day", todayBadge: "Today", unassigned: "Unassigned" },
  hi: { title: "📊 कार्य आँकड़े", backToDashboard: "← कंट्रोल पैनल", prev: "‹ पिछला", next: "अगला ›", current: "वर्तमान", todayPrefix: "आज —", managerBadge: "मैनेजर", did: "किए", collected: "कमाए", currency: "SAR", monthPerPerson: "प्रति व्यक्ति मासिक कुल", colName: "नाम", colDone: "किए", colRevenue: "आय (SAR)", managerParen: "(मैनेजर)", total: "कुल", dailyBreakdown: "दैनिक विवरण", noneYet: "इस महीने अभी कोई पूर्ण कार्य नहीं।", colDay: "दिन", todayBadge: "आज", unassigned: "अनिर्दिष्ट" },
  bn: { title: "📊 কাজের পরিসংখ্যান", backToDashboard: "← কন্ট্রোল প্যানেল", prev: "‹ পূর্ববর্তী", next: "পরবর্তী ›", current: "বর্তমান", todayPrefix: "আজ —", managerBadge: "ম্যানেজার", did: "করেছেন", collected: "আয়", currency: "SAR", monthPerPerson: "প্রতি ব্যক্তি মাসিক মোট", colName: "নাম", colDone: "করেছেন", colRevenue: "আয় (SAR)", managerParen: "(ম্যানেজার)", total: "মোট", dailyBreakdown: "দৈনিক বিবরণ", noneYet: "এই মাসে এখনও কোনো সম্পন্ন কাজ নেই।", colDay: "দিন", todayBadge: "আজ", unassigned: "অনির্দিষ্ট" },
};

export const DISPLAY: Record<Locale, DisplayMsgs> = {
  ar: { soundTitle: "نغمة عند نداء رقم جديد", soundOn: "🔔 الصوت مُفعّل", soundOff: "🔕 فعّل الصوت", reconnecting: "إعادة الاتصال…", nowServing: "الآن يُخدَم", waitingNext: "بانتظار نداء الدور التالي", closed: "الاستقبال متوقف حالياً", numberWord: "رقم", coming: "القادمون", autoUpdate: "تتحدّث الشاشة تلقائياً — مدعوم بنظام «دورك»" },
  en: { soundTitle: "Tone when a new number is called", soundOn: "🔔 Sound on", soundOff: "🔕 Enable sound", reconnecting: "Reconnecting…", nowServing: "Now serving", waitingNext: "Waiting to call the next turn", closed: "Reception is closed", numberWord: "Number", coming: "Coming up", autoUpdate: "The screen updates automatically — Powered by Dawrak" },
  hi: { soundTitle: "नया नंबर बुलाने पर टोन", soundOn: "🔔 ध्वनि चालू", soundOff: "🔕 ध्वनि चालू करें", reconnecting: "पुनः कनेक्ट हो रहा…", nowServing: "अभी सेवा में", waitingNext: "अगली बारी बुलाने की प्रतीक्षा", closed: "रिसेप्शन बंद है", numberWord: "नंबर", coming: "आने वाले", autoUpdate: "स्क्रीन स्वतः अपडेट होती है — दौरक द्वारा संचालित" },
  bn: { soundTitle: "নতুন নম্বর ডাকলে টোন", soundOn: "🔔 শব্দ চালু", soundOff: "🔕 শব্দ চালু করুন", reconnecting: "পুনঃসংযোগ হচ্ছে…", nowServing: "এখন সেবা চলছে", waitingNext: "পরের পালা ডাকার অপেক্ষায়", closed: "অভ্যর্থনা বন্ধ", numberWord: "নম্বর", coming: "আসন্ন", autoUpdate: "স্ক্রিন স্বয়ংক্রিয়ভাবে আপডেট হয় — দাওরাক দ্বারা পরিচালিত" },
};

export const CHANNELS: Record<Locale, ChannelsMsgs> = {
  ar: {
    inStoreTitle: "🏪 في المحل — ملصق QR للواجهة",
    inStoreBody: "علّقه عند المدخل؛ الزبون الحاضر يمسحه ويأخذ دوره فوراً.",
    downloadSvg: "تنزيل SVG",
    downloadPng: "تنزيل PNG",
    printPoster: "🖨️ طباعة الملصق",
    remoteTitle: "📲 عن بُعد — ادعُ عملاءك للحجز",
    remoteBodySched: "أرسل رابط الحجز لعملائك ليحجزوا دورهم ويختاروا موعداً مناسباً قبل وصولهم — يصلهم تنبيه عند اقتراب دورهم.",
    remoteBodyNo: "أرسل رابط الحجز لعملائك ليحجزوا دورهم قبل وصولهم — يصلهم تنبيه عند اقتراب دورهم.",
    shareWhatsapp: "🟢 مشاركة عبر واتساب",
    shareNative: "مشاركة…",
    copyLink: "نسخ رابط الحجز",
    copied: "✓ تم النسخ",
    timeSched: "الآن أو في الوقت الذي يناسبك",
    timeNo: "بسهولة من جوالك",
    whatsappMsg: "مرحباً 👋\nاحجز دورك في {shop} {time} — بدون أي تطبيق، من جوالك مباشرةً:\n{url}",
    nativeText: "احجز دورك في {shop} {time}",
    posterScan: "امسح وادخل لحجز دورك",
    posterNoApp: "بدون أي تطبيق — من متصفح جوالك مباشرةً",
    posterShopCode: "رمز المحل:",
  },
  en: {
    inStoreTitle: "🏪 In-store — QR poster for the storefront",
    inStoreBody: "Hang it at the entrance; the present customer scans it and takes a turn instantly.",
    downloadSvg: "Download SVG",
    downloadPng: "Download PNG",
    printPoster: "🖨️ Print the poster",
    remoteTitle: "📲 Remotely — invite your customers to book",
    remoteBodySched: "Send the booking link to your customers to take a turn and pick a suitable time before arriving — they get an alert as their turn nears.",
    remoteBodyNo: "Send the booking link to your customers to take a turn before arriving — they get an alert as their turn nears.",
    shareWhatsapp: "🟢 Share via WhatsApp",
    shareNative: "Share…",
    copyLink: "Copy booking link",
    copied: "✓ Copied",
    timeSched: "now or at a time that suits you",
    timeNo: "easily from your phone",
    whatsappMsg: "Hello 👋\nBook your turn at {shop} {time} — no app, straight from your phone:\n{url}",
    nativeText: "Book your turn at {shop} {time}",
    posterScan: "Scan and enter to book your turn",
    posterNoApp: "No app — straight from your phone's browser",
    posterShopCode: "Shop code:",
  },
  hi: {
    inStoreTitle: "🏪 दुकान में — स्टोरफ्रंट के लिए QR पोस्टर",
    inStoreBody: "इसे प्रवेश द्वार पर लगाएँ; मौजूद ग्राहक स्कैन करके तुरंत बारी लेता है।",
    downloadSvg: "SVG डाउनलोड",
    downloadPng: "PNG डाउनलोड",
    printPoster: "🖨️ पोस्टर प्रिंट करें",
    remoteTitle: "📲 दूर से — ग्राहकों को बुकिंग के लिए आमंत्रित करें",
    remoteBodySched: "ग्राहकों को बुकिंग लिंक भेजें ताकि वे बारी लें और पहुँचने से पहले उपयुक्त समय चुनें — बारी पास आने पर उन्हें अलर्ट मिलता है।",
    remoteBodyNo: "ग्राहकों को बुकिंग लिंक भेजें ताकि वे पहुँचने से पहले बारी लें — बारी पास आने पर उन्हें अलर्ट मिलता है।",
    shareWhatsapp: "🟢 व्हाट्सएप से साझा करें",
    shareNative: "साझा करें…",
    copyLink: "बुकिंग लिंक कॉपी करें",
    copied: "✓ कॉपी हुआ",
    timeSched: "अभी या अपने अनुकूल समय पर",
    timeNo: "अपने फ़ोन से आसानी से",
    whatsappMsg: "नमस्ते 👋\n{shop} में अपनी बारी बुक करें {time} — बिना ऐप, सीधे अपने फ़ोन से:\n{url}",
    nativeText: "{shop} में अपनी बारी बुक करें {time}",
    posterScan: "स्कैन करें और अपनी बारी बुक करें",
    posterNoApp: "बिना ऐप — सीधे अपने फ़ोन ब्राउज़र से",
    posterShopCode: "शॉप कोड:",
  },
  bn: {
    inStoreTitle: "🏪 দোকানে — স্টোরফ্রন্টের জন্য QR পোস্টার",
    inStoreBody: "এটি প্রবেশপথে লাগান; উপস্থিত গ্রাহক স্ক্যান করে সঙ্গে সঙ্গে পালা নেয়।",
    downloadSvg: "SVG ডাউনলোড",
    downloadPng: "PNG ডাউনলোড",
    printPoster: "🖨️ পোস্টার প্রিন্ট করুন",
    remoteTitle: "📲 দূর থেকে — গ্রাহকদের বুকিংয়ে আমন্ত্রণ জানান",
    remoteBodySched: "গ্রাহকদের বুকিং লিংক পাঠান যাতে তারা পালা নেয় এবং পৌঁছানোর আগে সুবিধামতো সময় বেছে নেয় — পালা কাছে এলে তারা সতর্কতা পায়।",
    remoteBodyNo: "গ্রাহকদের বুকিং লিংক পাঠান যাতে তারা পৌঁছানোর আগে পালা নেয় — পালা কাছে এলে তারা সতর্কতা পায়।",
    shareWhatsapp: "🟢 হোয়াটসঅ্যাপে শেয়ার করুন",
    shareNative: "শেয়ার…",
    copyLink: "বুকিং লিংক কপি করুন",
    copied: "✓ কপি হয়েছে",
    timeSched: "এখন বা আপনার সুবিধামতো সময়ে",
    timeNo: "সহজে আপনার ফোন থেকে",
    whatsappMsg: "হ্যালো 👋\n{shop}-এ আপনার পালা বুক করুন {time} — অ্যাপ ছাড়াই, সরাসরি আপনার ফোন থেকে:\n{url}",
    nativeText: "{shop}-এ আপনার পালা বুক করুন {time}",
    posterScan: "স্ক্যান করে আপনার পালা বুক করুন",
    posterNoApp: "অ্যাপ ছাড়াই — সরাসরি আপনার ফোন ব্রাউজার থেকে",
    posterShopCode: "শপ কোড:",
  },
};
