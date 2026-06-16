import type { Locale } from "@/lib/i18n";
import type { AnnouncementPlacement } from "@prisma/client";

export interface DashMsgs {
  shopCode: string;
  statsLink: string;
  displayLink: string;
  qrPosterLink: string;
  logout: string;
  guideTitle: string;
  guideBody: string;
  guideBtn: string;
  serveSection: string;
  channelsTitle: string;
  channelsLead: string;
  posterScan: string;
  // الإعدادات
  settingsTitle: string;
  isOpen: string;
  staffModelHdr: string;
  allowProviderChoice: string;
  showBarberName: string;
  timeSystemHdr: string;
  queueMethod: string;
  modeAuto: string;
  modeManual: string;
  modeNone: string;
  allowScheduling: string;
  openAppts: string;
  closeAppts: string;
  slotLength: string;
  everyNMin: string;
  graceWindow: string;
  graceNone: string;
  graceNMin: string;
  displayLead: string;
  displayLeadOpt: string; // {n}
  showCountdown: string;
  showExpectedTime: string;
  servicesDisplayHdr: string;
  allowServiceChoice: string;
  showPrices: string;
  showPeopleAhead: string;
  saveSettings: string;
  // الموظفون
  staffTitle: string;
  of: string;
  unlimited: string;
  managerBadge: string;
  loginCodeLabel: string;
  giveCodeHint: string; // {code}
  statusLabel: string;
  stBusy: string;
  stAvailable: string;
  stUnavailable: string;
  tasksLabel: string;
  tasksPh: string;
  saveTasks: string;
  makeUnavailable: string;
  makeAvailable: string;
  regenCode: string;
  walkinYes: string; // مخوّل بإضافة عملاء (اضغط للسحب)
  walkinNo: string; // غير مخوّل (اضغط للمنح)
  disableAccount: string;
  enableAccount: string;
  deleteForever: string;
  addStaffNamePh: string;
  addStaffTasksPh: string;
  avgTimePh: string;
  addStaffBtn: string;
  addStaffHint: string;
  // الخدمات
  servicesTitle: string;
  minShort: string;
  delete: string;
  priceLabel: string;
  currency: string;
  savePrice: string;
  addServiceNamePh: string;
  minutePh: string;
  pricePh: string;
  addServiceHint: string;
  // المصفوفة
  matrixTitle: string;
  matrixLead: string;
  save: string;
  // إعلاناتي
  myAdsTitle: string;
  myAdsLead: string;
  newAd: string;
  myAdsList: string;
  active: string;
  adTextPh: string;
  linkPh: string;
  removeMedia: string;
  saveEdits: string;
  addAd: string;
  // هوية المنشأة
  identityTitle: string;
  identityLead: string;
  cityLabel: string;
  cityPh: string;
  logoLabel: string;
  logoHint: string;
  removeLogo: string;
  saveIdentity: string;
  // كلمة المرور
  pwTitle: string;
  pwLead: string;
  pwCurrent: string;
  pwNew: string;
  pwConfirm: string;
  pwSave: string;
  pwOk: string;
  pwBad: string;
  pwWeak: string;
  pwMismatch: string;
  poweredBy: string;
  placements: Record<Exclude<AnnouncementPlacement, "home">, string>;
}

export const DASH: Record<Locale, DashMsgs> = {
  ar: {
    shopCode: "رمز المحل:",
    statsLink: "📊 الإحصائيات",
    displayLink: "📺 شاشة العرض",
    qrPosterLink: "ملصق QR كامل",
    logout: "خروج",
    guideTitle: "دليل استخدام دورك",
    guideBody: "جديد على دورك؟ تعلّم كيف تستخدمه بكل عناصره خطوة بخطوة — مع شرح متحرك.",
    guideBtn: "افتح الدليل ←",
    serveSection: "خدمة العملاء",
    channelsTitle: "طرق دعوة عملائك للحجز",
    channelsLead: "علّق الملصق في الواجهة للحاضرين، وأرسل الرابط لعملائك ليحجزوا عن بُعد — وتعرف من أين يأتي كل عميل.",
    posterScan: "امسح وادخل لحجز دورك",
    settingsTitle: "الإعدادات",
    isOpen: "استقبال العملاء مفتوح",
    staffModelHdr: "نموذج الموظفين",
    allowProviderChoice: "عدة موظفين يتقاسمون المهام (الزبون يختار الموظف) — وإلا دور واحد موحّد",
    showBarberName: "عرض اسم الموظف على تذكرة الزبون",
    timeSystemHdr: "نظام الزمن",
    queueMethod: "طريقة الدور",
    modeAuto: "بوقت المهمة (زمن تلقائي)",
    modeManual: "زمني يدوي (الموظف يحدّد)",
    modeNone: "بالرقم فقط — بدون زمن",
    allowScheduling: "السماح بالحجز في ساعة معينة (مواعيد)",
    openAppts: "فتح المواعيد",
    closeAppts: "إغلاق المواعيد",
    slotLength: "طول الخانة",
    everyNMin: "كل {n} دقيقة",
    graceWindow: "نافذة حماية الموعد",
    graceNone: "بدون",
    graceNMin: "{n} دقيقة قبله",
    displayLead: "تنبيه «استعدوا» في شاشة العرض قبل الدور بـ",
    displayLeadOpt: "{n} دقيقة",
    showCountdown: "عرض العدّاد الحي للزبون",
    showExpectedTime: "عرض الوقت المتوقع",
    servicesDisplayHdr: "الخدمات والعرض",
    allowServiceChoice: "السماح باختيار الخدمة (وإلا الخدمة الافتراضية)",
    showPrices: "عرض أسعار الخدمات للزبون",
    showPeopleAhead: "عرض عدد من قبله",
    saveSettings: "حفظ الإعدادات",
    staffTitle: "الموظفون",
    of: "من",
    unlimited: "غير محدود",
    managerBadge: "المدير",
    loginCodeLabel: "رمز دخوله:",
    giveCodeHint: "أعطِ هذا الرمز للموظف ليدخل من «دخول الموظف» برمز المحل {code}.",
    statusLabel: "الحالة:",
    stBusy: "مشغول بعميل",
    stAvailable: "متاح",
    stUnavailable: "غير متاح (لا يدخل الدور)",
    tasksLabel: "المهام:",
    tasksPh: "مهامه: قص شعر، دقن، تنظيف بشرة…",
    saveTasks: "حفظ المهام",
    makeUnavailable: "اجعله غير متاح",
    makeAvailable: "اجعله متاحاً",
    regenCode: "تجديد الرمز",
    walkinYes: "✓ يضيف عملاء",
    walkinNo: "✗ يضيف عملاء",
    disableAccount: "إيقاف الحساب",
    enableAccount: "تفعيل الحساب",
    deleteForever: "حذف نهائي",
    addStaffNamePh: "اسم الموظف الجديد",
    addStaffTasksPh: "مهامه (افصل بفاصلة): قص شعر، دقن، تنظيف بشرة…",
    avgTimePh: "مدة افتراضية (دقيقة)",
    addStaffBtn: "+ إضافة موظف",
    addStaffHint: "المهام تُنشأ تلقائياً كخدمات وتُربط بالموظف — وتستطيع تركها فارغة ليؤدي كل الخدمات.",
    servicesTitle: "الخدمات",
    minShort: "د",
    delete: "حذف",
    priceLabel: "السعر:",
    currency: "ريال",
    savePrice: "حفظ السعر",
    addServiceNamePh: "اسم أي خدمة تريدها",
    minutePh: "دقيقة",
    pricePh: "السعر (ريال)",
    addServiceHint: "اكتب أي اسم خدمة تريده، وحدّد مدّتها وسعرها.",
    matrixTitle: "زمن كل موظف لكل خدمة (دقيقة)",
    matrixLead: "تُستخدم لحساب الوقت المتبقي للزبون",
    save: "حفظ",
    myAdsTitle: "إعلانات منشأتي 📣",
    myAdsLead: "تظهر على صفحات منشأتك فقط. نص فارغ لا يُحفظ.",
    newAd: "➕ إعلان جديد",
    myAdsList: "إعلاناتي",
    active: "فعّال",
    adTextPh: "نص الإعلان…",
    linkPh: "https://… (رابط اختياري)",
    removeMedia: "إزالة الوسائط",
    saveEdits: "حفظ التعديلات",
    addAd: "إضافة الإعلان",
    identityTitle: "هوية المنشأة 🪧",
    identityLead: "شعارك ومدينتك. الشعار يظهر للزبون على صفحة الحجز وتذكرته وشاشة العرض.",
    cityLabel: "المدينة",
    cityPh: "مثال: الرياض، جدة، الدمام…",
    logoLabel: "شعار المنشأة (صورة)",
    logoHint: "صورة مربّعة تظهر أفضل (PNG/JPG، حتى 40MB).",
    removeLogo: "إزالة الشعار الحالي",
    saveIdentity: "حفظ الهوية",
    pwTitle: "كلمة المرور 🔑",
    pwLead: "غيّر كلمة مرور دخولك للوحة. إن نسيتها كلياً، تواصل مع فريق دورك لإعادة تعيينها.",
    pwCurrent: "كلمة المرور الحالية",
    pwNew: "كلمة المرور الجديدة (٦ أحرف على الأقل)",
    pwConfirm: "تأكيد كلمة المرور الجديدة",
    pwSave: "تغيير كلمة المرور",
    pwOk: "تم تغيير كلمة المرور بنجاح ✅",
    pwBad: "كلمة المرور الحالية غير صحيحة",
    pwWeak: "كلمة المرور الجديدة قصيرة جداً (٦ أحرف على الأقل)",
    pwMismatch: "كلمتا المرور الجديدتان غير متطابقتين",
    poweredBy: "مدعوم بنظام «دورك»",
    placements: { all: "كل صفحاتي", join: "صفحة الحجز", ticket: "تذكرة الانتظار", dashboard: "لوحتي", serve: "شاشة الموظف" },
  },
  en: {
    shopCode: "Shop code:",
    statsLink: "📊 Statistics",
    displayLink: "📺 Display screen",
    qrPosterLink: "Full QR poster",
    logout: "Sign out",
    guideTitle: "Dawrak user guide",
    guideBody: "New to Dawrak? Learn how to use all its parts step by step — with animated demos.",
    guideBtn: "Open the guide →",
    serveSection: "Serve customers",
    channelsTitle: "Ways to invite your customers to book",
    channelsLead: "Hang the poster up for those present, and send the link to customers to book remotely — and know where each one came from.",
    posterScan: "Scan and enter to book your turn",
    settingsTitle: "Settings",
    isOpen: "Accepting customers",
    staffModelHdr: "Staff model",
    allowProviderChoice: "Several staff share the work (customer picks the employee) — otherwise one unified queue",
    showBarberName: "Show the employee's name on the customer ticket",
    timeSystemHdr: "Time system",
    queueMethod: "Queue method",
    modeAuto: "By service time (automatic)",
    modeManual: "Manual timing (employee sets it)",
    modeNone: "Number only — no time",
    allowScheduling: "Allow booking at a specific hour (appointments)",
    openAppts: "Appointments open",
    closeAppts: "Appointments close",
    slotLength: "Slot length",
    everyNMin: "Every {n} min",
    graceWindow: "Appointment grace window",
    graceNone: "None",
    graceNMin: "{n} min before",
    displayLead: "'Get ready' alert on the display, before the turn by",
    displayLeadOpt: "{n} min",
    showCountdown: "Show the live countdown to the customer",
    showExpectedTime: "Show the expected time",
    servicesDisplayHdr: "Services & display",
    allowServiceChoice: "Allow choosing the service (otherwise the default service)",
    showPrices: "Show service prices to the customer",
    showPeopleAhead: "Show how many are ahead",
    saveSettings: "Save settings",
    staffTitle: "Staff",
    of: "of",
    unlimited: "unlimited",
    managerBadge: "Manager",
    loginCodeLabel: "Login code:",
    giveCodeHint: "Give this code to the employee to sign in via 'Staff login' with shop code {code}.",
    statusLabel: "Status:",
    stBusy: "Busy with a customer",
    stAvailable: "Available",
    stUnavailable: "Unavailable (not in the queue)",
    tasksLabel: "Tasks:",
    tasksPh: "Tasks: haircut, beard, facial…",
    saveTasks: "Save tasks",
    makeUnavailable: "Make unavailable",
    makeAvailable: "Make available",
    regenCode: "Regenerate code",
    walkinYes: "✓ Can add customers",
    walkinNo: "✗ Can add customers",
    disableAccount: "Disable account",
    enableAccount: "Enable account",
    deleteForever: "Delete permanently",
    addStaffNamePh: "New employee name",
    addStaffTasksPh: "Tasks (comma-separated): haircut, beard, facial…",
    avgTimePh: "Default duration (min)",
    addStaffBtn: "+ Add employee",
    addStaffHint: "Tasks are auto-created as services and linked to the employee — you can leave them empty so they do all services.",
    servicesTitle: "Services",
    minShort: "min",
    delete: "Delete",
    priceLabel: "Price:",
    currency: "SAR",
    savePrice: "Save price",
    addServiceNamePh: "Any service name you want",
    minutePh: "min",
    pricePh: "Price (SAR)",
    addServiceHint: "Type any service name you want, and set its duration and price.",
    matrixTitle: "Each employee's time per service (min)",
    matrixLead: "Used to estimate the customer's remaining time",
    save: "Save",
    myAdsTitle: "My business announcements 📣",
    myAdsLead: "Shown on your business pages only. Empty text isn't saved.",
    newAd: "➕ New announcement",
    myAdsList: "My announcements",
    active: "Active",
    adTextPh: "Announcement text…",
    linkPh: "https://… (optional link)",
    removeMedia: "Remove media",
    saveEdits: "Save changes",
    addAd: "Add announcement",
    identityTitle: "Business identity 🪧",
    identityLead: "Your logo and city. The logo shows to customers on the booking page, their ticket, and the display screen.",
    cityLabel: "City",
    cityPh: "e.g. Riyadh, Jeddah, Dammam…",
    logoLabel: "Business logo (image)",
    logoHint: "A square image looks best (PNG/JPG, up to 40MB).",
    removeLogo: "Remove current logo",
    saveIdentity: "Save identity",
    pwTitle: "Password 🔑",
    pwLead: "Change the password you sign in with. If you forget it entirely, contact the Dawrak team to reset it.",
    pwCurrent: "Current password",
    pwNew: "New password (at least 6 characters)",
    pwConfirm: "Confirm new password",
    pwSave: "Change password",
    pwOk: "Password changed successfully ✅",
    pwBad: "Current password is incorrect",
    pwWeak: "New password is too short (at least 6 characters)",
    pwMismatch: "The two new passwords don't match",
    poweredBy: "Powered by Dawrak",
    placements: { all: "All my pages", join: "Booking page", ticket: "Waiting ticket", dashboard: "My dashboard", serve: "Employee screen" },
  },
  hi: {
    shopCode: "शॉप कोड:",
    statsLink: "📊 आँकड़े",
    displayLink: "📺 प्रदर्शन स्क्रीन",
    qrPosterLink: "पूरा QR पोस्टर",
    logout: "साइन आउट",
    guideTitle: "दौरक उपयोग गाइड",
    guideBody: "दौरक में नए हैं? इसके हर हिस्से को चरण-दर-चरण सीखें — एनिमेटेड डेमो के साथ।",
    guideBtn: "गाइड खोलें →",
    serveSection: "ग्राहकों की सेवा",
    channelsTitle: "ग्राहकों को बुकिंग के लिए आमंत्रित करने के तरीके",
    channelsLead: "उपस्थित लोगों के लिए पोस्टर लगाएँ, और दूर से बुकिंग के लिए ग्राहकों को लिंक भेजें — और जानें हर कोई कहाँ से आया।",
    posterScan: "स्कैन करें और अपनी बारी बुक करें",
    settingsTitle: "सेटिंग्स",
    isOpen: "ग्राहक स्वीकार करना",
    staffModelHdr: "स्टाफ़ मॉडल",
    allowProviderChoice: "कई कर्मचारी काम बाँटते हैं (ग्राहक कर्मचारी चुनता है) — वरना एक साझा कतार",
    showBarberName: "ग्राहक टिकट पर कर्मचारी का नाम दिखाएँ",
    timeSystemHdr: "समय प्रणाली",
    queueMethod: "कतार विधि",
    modeAuto: "सेवा समय से (स्वचालित)",
    modeManual: "मैनुअल समय (कर्मचारी तय करता है)",
    modeNone: "केवल नंबर — बिना समय",
    allowScheduling: "निश्चित समय पर बुकिंग की अनुमति (अपॉइंटमेंट)",
    openAppts: "अपॉइंटमेंट शुरू",
    closeAppts: "अपॉइंटमेंट बंद",
    slotLength: "स्लॉट अवधि",
    everyNMin: "हर {n} मिनट",
    graceWindow: "अपॉइंटमेंट सुरक्षा विंडो",
    graceNone: "कोई नहीं",
    graceNMin: "{n} मिनट पहले",
    displayLead: "प्रदर्शन स्क्रीन पर 'तैयार हो जाइए' बारी से पहले",
    displayLeadOpt: "{n} मिनट",
    showCountdown: "ग्राहक के लिए लाइव काउंटडाउन दिखाएँ",
    showExpectedTime: "अनुमानित समय दिखाएँ",
    servicesDisplayHdr: "सेवाएँ और प्रदर्शन",
    allowServiceChoice: "सेवा चुनने की अनुमति (वरना डिफ़ॉल्ट सेवा)",
    showPrices: "ग्राहक को सेवा मूल्य दिखाएँ",
    showPeopleAhead: "कितने आगे हैं दिखाएँ",
    saveSettings: "सेटिंग्स सहेजें",
    staffTitle: "कर्मचारी",
    of: "में से",
    unlimited: "असीमित",
    managerBadge: "मैनेजर",
    loginCodeLabel: "लॉगिन कोड:",
    giveCodeHint: "यह कोड कर्मचारी को दें ताकि वह शॉप कोड {code} के साथ 'कर्मचारी लॉगिन' से प्रवेश करे।",
    statusLabel: "स्थिति:",
    stBusy: "ग्राहक के साथ व्यस्त",
    stAvailable: "उपलब्ध",
    stUnavailable: "अनुपलब्ध (कतार में नहीं)",
    tasksLabel: "कार्य:",
    tasksPh: "कार्य: हेयरकट, दाढ़ी, फेशियल…",
    saveTasks: "कार्य सहेजें",
    makeUnavailable: "अनुपलब्ध करें",
    makeAvailable: "उपलब्ध करें",
    regenCode: "कोड बदलें",
    walkinYes: "✓ ग्राहक जोड़ सकता है",
    walkinNo: "✗ ग्राहक जोड़ सकता है",
    disableAccount: "खाता बंद करें",
    enableAccount: "खाता चालू करें",
    deleteForever: "स्थायी रूप से हटाएँ",
    addStaffNamePh: "नए कर्मचारी का नाम",
    addStaffTasksPh: "कार्य (कॉमा से अलग): हेयरकट, दाढ़ी, फेशियल…",
    avgTimePh: "डिफ़ॉल्ट अवधि (मिनट)",
    addStaffBtn: "+ कर्मचारी जोड़ें",
    addStaffHint: "कार्य स्वतः सेवाओं के रूप में बनते हैं और कर्मचारी से जुड़ते हैं — खाली छोड़ें तो वह सभी सेवाएँ करेगा।",
    servicesTitle: "सेवाएँ",
    minShort: "मि",
    delete: "हटाएँ",
    priceLabel: "मूल्य:",
    currency: "SAR",
    savePrice: "मूल्य सहेजें",
    addServiceNamePh: "कोई भी सेवा नाम",
    minutePh: "मिनट",
    pricePh: "मूल्य (SAR)",
    addServiceHint: "कोई भी सेवा नाम लिखें, और उसकी अवधि व मूल्य तय करें।",
    matrixTitle: "हर कर्मचारी का प्रति सेवा समय (मिनट)",
    matrixLead: "ग्राहक का शेष समय आँकने के लिए",
    save: "सहेजें",
    myAdsTitle: "मेरे व्यवसाय के विज्ञापन 📣",
    myAdsLead: "केवल आपके व्यवसाय पेजों पर दिखते हैं। खाली टेक्स्ट सहेजा नहीं जाता।",
    newAd: "➕ नया विज्ञापन",
    myAdsList: "मेरे विज्ञापन",
    active: "सक्रिय",
    adTextPh: "विज्ञापन टेक्स्ट…",
    linkPh: "https://… (वैकल्पिक लिंक)",
    removeMedia: "मीडिया हटाएँ",
    saveEdits: "बदलाव सहेजें",
    addAd: "विज्ञापन जोड़ें",
    identityTitle: "व्यवसाय की पहचान 🪧",
    identityLead: "आपका लोगो और शहर। लोगो ग्राहक को बुकिंग पेज, उसके टिकट और प्रदर्शन स्क्रीन पर दिखता है।",
    cityLabel: "शहर",
    cityPh: "जैसे रियाद, जेद्दा, दम्माम…",
    logoLabel: "व्यवसाय का लोगो (छवि)",
    logoHint: "वर्गाकार छवि सबसे अच्छी लगती है (PNG/JPG, 40MB तक)।",
    removeLogo: "मौजूदा लोगो हटाएँ",
    saveIdentity: "पहचान सहेजें",
    pwTitle: "पासवर्ड 🔑",
    pwLead: "जिस पासवर्ड से आप साइन इन करते हैं उसे बदलें। पूरी तरह भूल जाएँ तो रीसेट के लिए दौरक टीम से संपर्क करें।",
    pwCurrent: "मौजूदा पासवर्ड",
    pwNew: "नया पासवर्ड (कम से कम 6 अक्षर)",
    pwConfirm: "नया पासवर्ड दोबारा लिखें",
    pwSave: "पासवर्ड बदलें",
    pwOk: "पासवर्ड सफलतापूर्वक बदला गया ✅",
    pwBad: "मौजूदा पासवर्ड गलत है",
    pwWeak: "नया पासवर्ड बहुत छोटा है (कम से कम 6 अक्षर)",
    pwMismatch: "दोनों नए पासवर्ड मेल नहीं खाते",
    poweredBy: "दौरक द्वारा संचालित",
    placements: { all: "मेरे सभी पेज", join: "बुकिंग पेज", ticket: "प्रतीक्षा टिकट", dashboard: "मेरा डैशबोर्ड", serve: "कर्मचारी स्क्रीन" },
  },
  bn: {
    shopCode: "শপ কোড:",
    statsLink: "📊 পরিসংখ্যান",
    displayLink: "📺 প্রদর্শন স্ক্রিন",
    qrPosterLink: "পূর্ণ QR পোস্টার",
    logout: "সাইন আউট",
    guideTitle: "দাওরাক ব্যবহার গাইড",
    guideBody: "দাওরাকে নতুন? এর প্রতিটি অংশ ধাপে ধাপে শিখুন — অ্যানিমেটেড ডেমোসহ।",
    guideBtn: "গাইড খুলুন →",
    serveSection: "গ্রাহক সেবা",
    channelsTitle: "গ্রাহকদের বুকিংয়ে আমন্ত্রণের উপায়",
    channelsLead: "উপস্থিতদের জন্য পোস্টার লাগান, এবং দূর থেকে বুকিংয়ের জন্য গ্রাহকদের লিংক পাঠান — আর জানুন প্রত্যেকে কোথা থেকে এসেছে।",
    posterScan: "স্ক্যান করে আপনার পালা বুক করুন",
    settingsTitle: "সেটিংস",
    isOpen: "গ্রাহক গ্রহণ চালু",
    staffModelHdr: "স্টাফ মডেল",
    allowProviderChoice: "একাধিক কর্মী কাজ ভাগ করে (গ্রাহক কর্মী বেছে নেয়) — নয়তো একটি অভিন্ন সারি",
    showBarberName: "গ্রাহক টিকিটে কর্মীর নাম দেখান",
    timeSystemHdr: "সময় ব্যবস্থা",
    queueMethod: "সারি পদ্ধতি",
    modeAuto: "সেবার সময় থেকে (স্বয়ংক্রিয়)",
    modeManual: "ম্যানুয়াল সময় (কর্মী ঠিক করে)",
    modeNone: "শুধু নম্বর — সময় ছাড়া",
    allowScheduling: "নির্দিষ্ট সময়ে বুকিং অনুমতি (অ্যাপয়েন্টমেন্ট)",
    openAppts: "অ্যাপয়েন্টমেন্ট শুরু",
    closeAppts: "অ্যাপয়েন্টমেন্ট শেষ",
    slotLength: "স্লট দৈর্ঘ্য",
    everyNMin: "প্রতি {n} মিনিট",
    graceWindow: "অ্যাপয়েন্টমেন্ট সুরক্ষা উইন্ডো",
    graceNone: "কোনোটি নয়",
    graceNMin: "{n} মিনিট আগে",
    displayLead: "প্রদর্শন স্ক্রিনে 'প্রস্তুত হোন' পালার আগে",
    displayLeadOpt: "{n} মিনিট",
    showCountdown: "গ্রাহকের জন্য লাইভ কাউন্টডাউন দেখান",
    showExpectedTime: "আনুমানিক সময় দেখান",
    servicesDisplayHdr: "সেবা ও প্রদর্শন",
    allowServiceChoice: "সেবা বেছে নেওয়ার অনুমতি (নয়তো ডিফল্ট সেবা)",
    showPrices: "গ্রাহককে সেবার দাম দেখান",
    showPeopleAhead: "কতজন আগে আছে দেখান",
    saveSettings: "সেটিংস সংরক্ষণ করুন",
    staffTitle: "কর্মী",
    of: "এর মধ্যে",
    unlimited: "সীমাহীন",
    managerBadge: "ম্যানেজার",
    loginCodeLabel: "লগইন কোড:",
    giveCodeHint: "এই কোডটি কর্মীকে দিন যাতে তিনি শপ কোড {code} দিয়ে 'কর্মী লগইন' থেকে প্রবেশ করেন।",
    statusLabel: "অবস্থা:",
    stBusy: "গ্রাহকের সাথে ব্যস্ত",
    stAvailable: "উপলব্ধ",
    stUnavailable: "অনুপলব্ধ (সারিতে নয়)",
    tasksLabel: "কাজ:",
    tasksPh: "কাজ: চুল কাটা, দাড়ি, ফেসিয়াল…",
    saveTasks: "কাজ সংরক্ষণ",
    makeUnavailable: "অনুপলব্ধ করুন",
    makeAvailable: "উপলব্ধ করুন",
    regenCode: "কোড বদলান",
    walkinYes: "✓ গ্রাহক যোগ করতে পারে",
    walkinNo: "✗ গ্রাহক যোগ করতে পারে",
    disableAccount: "অ্যাকাউন্ট বন্ধ",
    enableAccount: "অ্যাকাউন্ট চালু",
    deleteForever: "স্থায়ীভাবে মুছুন",
    addStaffNamePh: "নতুন কর্মীর নাম",
    addStaffTasksPh: "কাজ (কমা দিয়ে): চুল কাটা, দাড়ি, ফেসিয়াল…",
    avgTimePh: "ডিফল্ট সময়কাল (মিনিট)",
    addStaffBtn: "+ কর্মী যোগ করুন",
    addStaffHint: "কাজগুলো স্বয়ংক্রিয়ভাবে সেবা হিসেবে তৈরি হয়ে কর্মীর সাথে যুক্ত হয় — খালি রাখলে তিনি সব সেবা করবেন।",
    servicesTitle: "সেবাসমূহ",
    minShort: "মি",
    delete: "মুছুন",
    priceLabel: "দাম:",
    currency: "SAR",
    savePrice: "দাম সংরক্ষণ",
    addServiceNamePh: "যেকোনো সেবার নাম",
    minutePh: "মিনিট",
    pricePh: "দাম (SAR)",
    addServiceHint: "যেকোনো সেবার নাম লিখুন, এবং এর সময়কাল ও দাম ঠিক করুন।",
    matrixTitle: "প্রতি কর্মীর প্রতি সেবার সময় (মিনিট)",
    matrixLead: "গ্রাহকের বাকি সময় হিসাব করতে ব্যবহৃত",
    save: "সংরক্ষণ",
    myAdsTitle: "আমার ব্যবসার বিজ্ঞাপন 📣",
    myAdsLead: "শুধু আপনার ব্যবসার পেজে দেখায়। খালি টেক্সট সংরক্ষণ হয় না।",
    newAd: "➕ নতুন বিজ্ঞাপন",
    myAdsList: "আমার বিজ্ঞাপন",
    active: "সক্রিয়",
    adTextPh: "বিজ্ঞাপনের টেক্সট…",
    linkPh: "https://… (ঐচ্ছিক লিংক)",
    removeMedia: "মিডিয়া সরান",
    saveEdits: "পরিবর্তন সংরক্ষণ",
    addAd: "বিজ্ঞাপন যোগ করুন",
    identityTitle: "ব্যবসার পরিচিতি 🪧",
    identityLead: "আপনার লোগো ও শহর। লোগো গ্রাহককে বুকিং পেজ, তার টিকিট ও প্রদর্শন স্ক্রিনে দেখায়।",
    cityLabel: "শহর",
    cityPh: "যেমন রিয়াদ, জেদ্দা, দাম্মাম…",
    logoLabel: "ব্যবসার লোগো (ছবি)",
    logoHint: "বর্গাকার ছবি সবচেয়ে ভালো দেখায় (PNG/JPG, ৪০MB পর্যন্ত)।",
    removeLogo: "বর্তমান লোগো সরান",
    saveIdentity: "পরিচিতি সংরক্ষণ",
    pwTitle: "পাসওয়ার্ড 🔑",
    pwLead: "যে পাসওয়ার্ড দিয়ে সাইন ইন করেন তা পরিবর্তন করুন। সম্পূর্ণ ভুলে গেলে রিসেটের জন্য দাওরাক টিমের সাথে যোগাযোগ করুন।",
    pwCurrent: "বর্তমান পাসওয়ার্ড",
    pwNew: "নতুন পাসওয়ার্ড (অন্তত ৬ অক্ষর)",
    pwConfirm: "নতুন পাসওয়ার্ড নিশ্চিত করুন",
    pwSave: "পাসওয়ার্ড পরিবর্তন",
    pwOk: "পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে ✅",
    pwBad: "বর্তমান পাসওয়ার্ড সঠিক নয়",
    pwWeak: "নতুন পাসওয়ার্ড খুব ছোট (অন্তত ৬ অক্ষর)",
    pwMismatch: "দুটি নতুন পাসওয়ার্ড মিলছে না",
    poweredBy: "দাওরাক দ্বারা পরিচালিত",
    placements: { all: "আমার সব পেজ", join: "বুকিং পেজ", ticket: "অপেক্ষা টিকিট", dashboard: "আমার ড্যাশবোর্ড", serve: "কর্মী স্ক্রিন" },
  },
};
