import type { Locale } from "@/lib/i18n";

export interface BookingMsgs {
  // صفحة الحجز
  bookTitle: string;
  bookLead: string;
  activeTicket: string; // فيه {n}
  closedTitle: string;
  closedBody: string;
  recoverLink: string;
  poweredBy: string;
  // النموذج
  name: string;
  namePh: string;
  phone: string;
  optional: string;
  servicesLabel: string;
  servicesHint: string;
  minUnit: string; // "د" المختصرة
  currency: string;
  totalApprox: string; // فيه {m}
  minuteWord: string;
  chooseProvider: string;
  firstAvailable: string;
  whenTitle: string;
  now: string;
  scheduled: string;
  chooseSlot: string;
  allBooked: string;
  noSlots: string;
  yourAppt: string; // فيه {label}
  submit: string;
  submitting: string;
  amShort: string; // علامة صباح في الخانات
  pmShort: string;
  // أخطاء إجراء الحجز
  errName: string;
  errService: string;
  errShop: string;
  errClosed: string;
  errServiceInvalid: string;
  errProvider: string;
  errApptTime: string;
  errApptFormat: string;
  errApptPast: string;
  errSlotTaken: string;
}

export const BOOKING: Record<Locale, BookingMsgs> = {
  ar: {
    bookTitle: "احجز دورك",
    bookLead: "أدخل اسمك واحجز رقمك في الطابور — بدون أي تطبيق.",
    activeTicket: "لديك دور حالي (رقم {n}) — تابع دورك ←",
    closedTitle: "الاستقبال متوقف حالياً",
    closedBody: "نعتذر منك، استقبال العملاء متوقف حالياً في هذا الفرع.",
    recoverLink: "حجزت سابقاً؟ استرجع تذكرتك",
    poweredBy: "مدعوم بنظام «دورك»",
    name: "اسمك",
    namePh: "اكتب اسمك",
    phone: "الجوال",
    optional: "(اختياري)",
    servicesLabel: "الخدمات المطلوبة",
    servicesHint: "(يمكنك اختيار أكثر من واحدة)",
    minUnit: "د",
    currency: "ريال",
    totalApprox: "الإجمالي التقريبي: ~{m} دقيقة",
    minuteWord: "دقيقة",
    chooseProvider: "اختر مزوّد الخدمة",
    firstAvailable: "أول متاح (الأسرع)",
    whenTitle: "وقت حضورك",
    now: "الآن مباشرة",
    scheduled: "موعد محدّد",
    chooseSlot: "اختر موعداً متاحاً (المحجوزة معطّلة):",
    allBooked: "كل مواعيد اليوم محجوزة — جرّب «الآن مباشرة».",
    noSlots: "لا تتوفّر مواعيد اليوم — اختر «الآن مباشرة».",
    yourAppt: "موعدك: {label}",
    submit: "احجز دوري الآن",
    submitting: "جارٍ الحجز…",
    amShort: "ص",
    pmShort: "م",
    errName: "يرجى إدخال الاسم",
    errService: "يرجى اختيار خدمة واحدة على الأقل",
    errShop: "المحل غير موجود",
    errClosed: "نعتذر منك، استقبال العملاء متوقف حالياً في هذا الفرع",
    errServiceInvalid: "الخدمة المختارة غير متاحة، اختر غيرها",
    errProvider: "الموظف المختار غير متاح، اختر غيره",
    errApptTime: "يرجى اختيار وقت الموعد",
    errApptFormat: "صيغة الوقت غير صحيحة",
    errApptPast: "اختر وقتاً قادماً (ليس وقتاً مضى)",
    errSlotTaken: "هذا الموعد لم يعد متاحاً، اختر وقتاً آخر",
  },
  en: {
    bookTitle: "Book your turn",
    bookLead: "Enter your name and take your number in the queue — no app needed.",
    activeTicket: "You have an active turn (number {n}) — track it →",
    closedTitle: "Reception is currently closed",
    closedBody: "Sorry, this branch is not accepting customers right now.",
    recoverLink: "Booked before? Recover your ticket",
    poweredBy: "Powered by Dawrak",
    name: "Your name",
    namePh: "Type your name",
    phone: "Mobile",
    optional: "(optional)",
    servicesLabel: "Services",
    servicesHint: "(you can pick more than one)",
    minUnit: "min",
    currency: "SAR",
    totalApprox: "Approx. total: ~{m} min",
    minuteWord: "min",
    chooseProvider: "Choose a provider",
    firstAvailable: "First available (fastest)",
    whenTitle: "When are you coming?",
    now: "Right now",
    scheduled: "Specific time",
    chooseSlot: "Pick an available time (booked ones are disabled):",
    allBooked: "All of today's times are booked — try 'Right now'.",
    noSlots: "No times available today — choose 'Right now'.",
    yourAppt: "Your appointment: {label}",
    submit: "Book my turn now",
    submitting: "Booking…",
    amShort: "AM",
    pmShort: "PM",
    errName: "Please enter your name",
    errService: "Please pick at least one service",
    errShop: "Shop not found",
    errClosed: "Sorry, this branch is not accepting customers right now",
    errServiceInvalid: "The selected service is unavailable, pick another",
    errProvider: "The selected provider is unavailable, pick another",
    errApptTime: "Please choose an appointment time",
    errApptFormat: "Invalid time format",
    errApptPast: "Pick an upcoming time (not a past one)",
    errSlotTaken: "This time is no longer available, pick another",
  },
  hi: {
    bookTitle: "अपनी बारी बुक करें",
    bookLead: "अपना नाम डालें और कतार में अपना नंबर लें — कोई ऐप नहीं।",
    activeTicket: "आपकी एक सक्रिय बारी है (नंबर {n}) — देखें →",
    closedTitle: "रिसेप्शन अभी बंद है",
    closedBody: "क्षमा करें, यह शाखा अभी ग्राहक नहीं ले रही है।",
    recoverLink: "पहले बुक किया था? अपना टिकट पाएँ",
    poweredBy: "दौरक द्वारा संचालित",
    name: "आपका नाम",
    namePh: "अपना नाम लिखें",
    phone: "मोबाइल",
    optional: "(वैकल्पिक)",
    servicesLabel: "सेवाएँ",
    servicesHint: "(आप एक से ज़्यादा चुन सकते हैं)",
    minUnit: "मि",
    currency: "SAR",
    totalApprox: "अनुमानित कुल: ~{m} मिनट",
    minuteWord: "मिनट",
    chooseProvider: "एक कर्मचारी चुनें",
    firstAvailable: "पहला उपलब्ध (सबसे तेज़)",
    whenTitle: "आप कब आ रहे हैं?",
    now: "अभी तुरंत",
    scheduled: "निश्चित समय",
    chooseSlot: "उपलब्ध समय चुनें (बुक किए गए निष्क्रिय हैं):",
    allBooked: "आज के सभी समय बुक हैं — 'अभी तुरंत' आज़माएँ।",
    noSlots: "आज कोई समय उपलब्ध नहीं — 'अभी तुरंत' चुनें।",
    yourAppt: "आपका अपॉइंटमेंट: {label}",
    submit: "अभी मेरी बारी बुक करें",
    submitting: "बुक हो रहा है…",
    amShort: "AM",
    pmShort: "PM",
    errName: "कृपया अपना नाम डालें",
    errService: "कृपया कम से कम एक सेवा चुनें",
    errShop: "दुकान नहीं मिली",
    errClosed: "क्षमा करें, यह शाखा अभी ग्राहक नहीं ले रही है",
    errServiceInvalid: "चयनित सेवा उपलब्ध नहीं, दूसरी चुनें",
    errProvider: "चयनित कर्मचारी उपलब्ध नहीं, दूसरा चुनें",
    errApptTime: "कृपया अपॉइंटमेंट समय चुनें",
    errApptFormat: "समय का प्रारूप ग़लत है",
    errApptPast: "आने वाला समय चुनें (बीता हुआ नहीं)",
    errSlotTaken: "यह समय अब उपलब्ध नहीं, दूसरा चुनें",
  },
  bn: {
    bookTitle: "আপনার পালা বুক করুন",
    bookLead: "আপনার নাম লিখুন এবং সারিতে নিজের নম্বর নিন — কোনো অ্যাপ ছাড়াই।",
    activeTicket: "আপনার একটি সক্রিয় পালা আছে (নম্বর {n}) — দেখুন →",
    closedTitle: "অভ্যর্থনা এখন বন্ধ",
    closedBody: "দুঃখিত, এই শাখা এখন গ্রাহক নিচ্ছে না।",
    recoverLink: "আগে বুক করেছেন? আপনার টিকিট ফিরে পান",
    poweredBy: "দাওরাক দ্বারা পরিচালিত",
    name: "আপনার নাম",
    namePh: "আপনার নাম লিখুন",
    phone: "মোবাইল",
    optional: "(ঐচ্ছিক)",
    servicesLabel: "সেবাসমূহ",
    servicesHint: "(একাধিক বেছে নিতে পারেন)",
    minUnit: "মি",
    currency: "SAR",
    totalApprox: "আনুমানিক মোট: ~{m} মিনিট",
    minuteWord: "মিনিট",
    chooseProvider: "একজন কর্মী বেছে নিন",
    firstAvailable: "প্রথম উপলব্ধ (দ্রুততম)",
    whenTitle: "আপনি কখন আসছেন?",
    now: "এখনই",
    scheduled: "নির্দিষ্ট সময়",
    chooseSlot: "একটি উপলব্ধ সময় বেছে নিন (বুক করা নিষ্ক্রিয়):",
    allBooked: "আজকের সব সময় বুক হয়ে গেছে — 'এখনই' চেষ্টা করুন।",
    noSlots: "আজ কোনো সময় নেই — 'এখনই' বেছে নিন।",
    yourAppt: "আপনার অ্যাপয়েন্টমেন্ট: {label}",
    submit: "এখনই আমার পালা বুক করুন",
    submitting: "বুক হচ্ছে…",
    amShort: "AM",
    pmShort: "PM",
    errName: "অনুগ্রহ করে আপনার নাম লিখুন",
    errService: "অনুগ্রহ করে অন্তত একটি সেবা বেছে নিন",
    errShop: "দোকান পাওয়া যায়নি",
    errClosed: "দুঃখিত, এই শাখা এখন গ্রাহক নিচ্ছে না",
    errServiceInvalid: "নির্বাচিত সেবা উপলব্ধ নয়, অন্যটি বেছে নিন",
    errProvider: "নির্বাচিত কর্মী উপলব্ধ নয়, অন্যজন বেছে নিন",
    errApptTime: "অনুগ্রহ করে অ্যাপয়েন্টমেন্টের সময় বেছে নিন",
    errApptFormat: "সময়ের বিন্যাস ভুল",
    errApptPast: "আসন্ন সময় বেছে নিন (অতীত নয়)",
    errSlotTaken: "এই সময় আর উপলব্ধ নেই, অন্যটি বেছে নিন",
  },
};
