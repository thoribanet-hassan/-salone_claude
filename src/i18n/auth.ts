import type { Locale } from "@/lib/i18n";

export interface AuthMsgs {
  // التسجيل
  regTagline: string;
  regType: string;
  regTypePh: string;
  regShopName: string;
  regShopNamePh: string;
  regHint: string;
  regOwner: string;
  regOwnerPh: string;
  regCity: string;
  regCityPh: string;
  regEmail: string;
  regEmailPh: string;
  regPassword: string;
  regPasswordPh: string;
  regSubmit: string;
  regSubmitting: string;
  regErrFields: string;
  regErrPassword: string;
  regErrEmailTaken: string;
  // الدخول
  loginTagline: string;
  tabManager: string;
  tabStaff: string;
  email: string;
  password: string;
  shopCode: string;
  loginCode: string;
  loginManager: string;
  loginStaff: string;
  forgotPassword: string;
  forgotWhatsappMsg: string;
  loggingIn: string;
  noShop: string;
  errCreds: string;
  errEmailPw: string;
  errShopCodeLogin: string;
  errBadShopCode: string;
  errBadLoginCode: string;
}

export const AUTH: Record<Locale, AuthMsgs> = {
  ar: {
    regTagline: "أنشئ منشأتك وابدأ إدارة الانتظار خلال دقيقة",
    regType: "نوع المنشأة",
    regTypePh: "اكتب نوعها: حلاق، صالون نسائي، مطعم، عيادة، كوفي، مستوصف…",
    regShopName: "اسم المنشأة",
    regShopNamePh: "مثال: صالون النخبة / مطعم الذوّاقة",
    regHint: "كل التفاصيل الأخرى (الموظفون، نظام الزمن، المواعيد…) تُضبط لاحقاً من لوحة التحكم.",
    regOwner: "اسم المالك",
    regOwnerPh: "اسمك",
    regCity: "المدينة (اختياري)",
    regCityPh: "مثال: الرياض، جدة، الدمام…",
    regEmail: "البريد الإلكتروني (للدخول)",
    regEmailPh: "you@example.com",
    regPassword: "كلمة المرور",
    regPasswordPh: "٦ أحرف على الأقل",
    regSubmit: "إنشاء المنشأة والدخول",
    regSubmitting: "جارٍ الإنشاء…",
    regErrFields: "يرجى تعبئة كل الحقول",
    regErrPassword: "كلمة المرور 6 أحرف على الأقل",
    regErrEmailTaken: "هذا البريد مسجّل مسبقاً",
    loginTagline: "لوحة الإدارة والموظفين",
    tabManager: "مدير",
    tabStaff: "موظف",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    shopCode: "رمز المحل",
    loginCode: "رمز الدخول",
    loginManager: "دخول المدير",
    loginStaff: "دخول الموظف",
    forgotPassword: "نسيت كلمة المرور أو الإيميل؟",
    forgotWhatsappMsg: "السلام عليكم، نسيت بيانات دخولي للوحة دورك (كلمة المرور أو الإيميل) وأحتاج المساعدة في استرجاعها.",
    loggingIn: "جارٍ الدخول…",
    noShop: "ليس لديك منشأة؟ أنشئ منشأة جديدة",
    errCreds: "بيانات الدخول غير صحيحة",
    errEmailPw: "أدخل البريد وكلمة المرور",
    errShopCodeLogin: "أدخل رمز المحل ورمز الدخول",
    errBadShopCode: "رمز المحل غير صحيح",
    errBadLoginCode: "رمز الدخول غير صحيح أو الحساب معطّل",
  },
  en: {
    regTagline: "Create your business and start managing the queue in a minute",
    regType: "Business type",
    regTypePh: "Type it: barber, women's salon, restaurant, clinic, café…",
    regShopName: "Business name",
    regShopNamePh: "e.g. Elite Salon / Gourmet Restaurant",
    regHint: "All other details (staff, time system, appointments…) are configured later from the control panel.",
    regOwner: "Owner name",
    regOwnerPh: "Your name",
    regCity: "City (optional)",
    regCityPh: "e.g. Riyadh, Jeddah, Dammam…",
    regEmail: "Email (for login)",
    regEmailPh: "you@example.com",
    regPassword: "Password",
    regPasswordPh: "At least 6 characters",
    regSubmit: "Create business and enter",
    regSubmitting: "Creating…",
    regErrFields: "Please fill in all fields",
    regErrPassword: "Password must be at least 6 characters",
    regErrEmailTaken: "This email is already registered",
    loginTagline: "Manager & staff panel",
    tabManager: "Manager",
    tabStaff: "Staff",
    email: "Email",
    password: "Password",
    shopCode: "Shop code",
    loginCode: "Login code",
    loginManager: "Manager login",
    loginStaff: "Staff login",
    forgotPassword: "Forgot your password or email?",
    forgotWhatsappMsg: "Hello, I forgot my Dawrak dashboard login details (password or email) and need help recovering them.",
    loggingIn: "Signing in…",
    noShop: "No business yet? Create a new one",
    errCreds: "Invalid login credentials",
    errEmailPw: "Enter email and password",
    errShopCodeLogin: "Enter shop code and login code",
    errBadShopCode: "Invalid shop code",
    errBadLoginCode: "Wrong login code or the account is disabled",
  },
  hi: {
    regTagline: "अपना व्यवसाय बनाएँ और एक मिनट में कतार प्रबंधन शुरू करें",
    regType: "व्यवसाय का प्रकार",
    regTypePh: "लिखें: नाई, महिला सैलून, रेस्तराँ, क्लीनिक, कैफ़े…",
    regShopName: "व्यवसाय का नाम",
    regShopNamePh: "जैसे: एलीट सैलून / गॉरमेट रेस्तराँ",
    regHint: "बाकी सभी विवरण (कर्मचारी, समय प्रणाली, अपॉइंटमेंट…) बाद में कंट्रोल पैनल से सेट होते हैं।",
    regOwner: "मालिक का नाम",
    regOwnerPh: "आपका नाम",
    regCity: "शहर (वैकल्पिक)",
    regCityPh: "जैसे रियाद, जेद्दा, दम्माम…",
    regEmail: "ईमेल (लॉगिन के लिए)",
    regEmailPh: "you@example.com",
    regPassword: "पासवर्ड",
    regPasswordPh: "कम से कम 6 अक्षर",
    regSubmit: "व्यवसाय बनाएँ और प्रवेश करें",
    regSubmitting: "बन रहा है…",
    regErrFields: "कृपया सभी फ़ील्ड भरें",
    regErrPassword: "पासवर्ड कम से कम 6 अक्षर का हो",
    regErrEmailTaken: "यह ईमेल पहले से पंजीकृत है",
    loginTagline: "मैनेजर और स्टाफ़ पैनल",
    tabManager: "मैनेजर",
    tabStaff: "कर्मचारी",
    email: "ईमेल",
    password: "पासवर्ड",
    shopCode: "शॉप कोड",
    loginCode: "लॉगिन कोड",
    loginManager: "मैनेजर लॉगिन",
    loginStaff: "कर्मचारी लॉगिन",
    forgotPassword: "पासवर्ड या ईमेल भूल गए?",
    forgotWhatsappMsg: "नमस्ते, मैं अपने दौरक डैशबोर्ड लॉगिन विवरण (पासवर्ड या ईमेल) भूल गया हूँ और पुनर्प्राप्ति में मदद चाहिए।",
    loggingIn: "साइन इन हो रहा है…",
    noShop: "अभी कोई व्यवसाय नहीं? नया बनाएँ",
    errCreds: "लॉगिन जानकारी ग़लत है",
    errEmailPw: "ईमेल और पासवर्ड डालें",
    errShopCodeLogin: "शॉप कोड और लॉगिन कोड डालें",
    errBadShopCode: "शॉप कोड ग़लत है",
    errBadLoginCode: "लॉगिन कोड ग़लत है या खाता निष्क्रिय है",
  },
  bn: {
    regTagline: "আপনার ব্যবসা তৈরি করুন এবং এক মিনিটে সারি ব্যবস্থাপনা শুরু করুন",
    regType: "ব্যবসার ধরন",
    regTypePh: "লিখুন: নাপিত, মহিলা সেলুন, রেস্তোরাঁ, ক্লিনিক, ক্যাফে…",
    regShopName: "ব্যবসার নাম",
    regShopNamePh: "যেমন: এলিট সেলুন / গুরমে রেস্তোরাঁ",
    regHint: "বাকি সব বিবরণ (কর্মী, সময় ব্যবস্থা, অ্যাপয়েন্টমেন্ট…) পরে কন্ট্রোল প্যানেল থেকে সেট হয়।",
    regOwner: "মালিকের নাম",
    regOwnerPh: "আপনার নাম",
    regCity: "শহর (ঐচ্ছিক)",
    regCityPh: "যেমন রিয়াদ, জেদ্দা, দাম্মাম…",
    regEmail: "ইমেল (লগইনের জন্য)",
    regEmailPh: "you@example.com",
    regPassword: "পাসওয়ার্ড",
    regPasswordPh: "কমপক্ষে ৬ অক্ষর",
    regSubmit: "ব্যবসা তৈরি করে প্রবেশ করুন",
    regSubmitting: "তৈরি হচ্ছে…",
    regErrFields: "অনুগ্রহ করে সব ঘর পূরণ করুন",
    regErrPassword: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে",
    regErrEmailTaken: "এই ইমেল আগে থেকেই নিবন্ধিত",
    loginTagline: "ম্যানেজার ও স্টাফ প্যানেল",
    tabManager: "ম্যানেজার",
    tabStaff: "কর্মী",
    email: "ইমেল",
    password: "পাসওয়ার্ড",
    shopCode: "শপ কোড",
    loginCode: "লগইন কোড",
    loginManager: "ম্যানেজার লগইন",
    loginStaff: "কর্মী লগইন",
    forgotPassword: "পাসওয়ার্ড বা ইমেল ভুলে গেছেন?",
    forgotWhatsappMsg: "হ্যালো, আমি আমার দাওরাক ড্যাশবোর্ড লগইন তথ্য (পাসওয়ার্ড বা ইমেল) ভুলে গেছি এবং পুনরুদ্ধারে সাহায্য দরকার।",
    loggingIn: "সাইন ইন হচ্ছে…",
    noShop: "এখনও ব্যবসা নেই? নতুন তৈরি করুন",
    errCreds: "লগইন তথ্য ভুল",
    errEmailPw: "ইমেল ও পাসওয়ার্ড দিন",
    errShopCodeLogin: "শপ কোড ও লগইন কোড দিন",
    errBadShopCode: "শপ কোড ভুল",
    errBadLoginCode: "লগইন কোড ভুল বা অ্যাকাউন্ট নিষ্ক্রিয়",
  },
};
