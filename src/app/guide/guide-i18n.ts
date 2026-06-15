// ترجمات دليل الاستخدام — نفس لغات صفحة الهبوط (ar/en/hi/bn) ونفس اختيار اللغة المحفوظ
import type { Locale } from "../landing-i18n";

export interface GuideSection {
  title: string;
  paras: string[];
  bullets?: string[];
  tip?: string;
  demo?: "flow" | "stages" | "queue";
  demoCaption?: string;
}

export interface GuideStrings {
  title: string;
  subtitle: string;
  toc: string;
  sections: GuideSection[];
  flow: { icon: string; label: string }[];
  stages: { ahead: string; msg: string }[];
  ticketLabel: string;
  ticketNum: string;
  aheadLabel: string;
  nowServing: string;
  coming: string;
  ctaTitle: string;
  ctaBtn: string;
  ctaDash: string;
  footer: string;
}

export const G: Record<Locale, GuideStrings> = {
  ar: {
    title: "دليل استخدام دورك",
    subtitle: "تعلّم كل عناصر دورك خطوة بخطوة — مع مقاطع متحركة توضيحية",
    toc: "المحتويات",
    sections: [
      {
        title: "ما هو دورك؟",
        paras: [
          "دورك نظام لإدارة الانتظار في الأماكن المزدحمة. يأخذ عميلك دوره من جوّاله عبر مسح رمز QR — بدون أي تطبيق — ثم يتابع أعماله بينما ننبّهه عند اقتراب دوره. النتيجة: لا تكدّس داخل محلك، وعملاء أكثر رضاً، وتحكّم أوضح بوقتك.",
        ],
        demo: "flow",
        demoCaption: "رحلة العميل في ثلاث خطوات",
      },
      {
        title: "أنشئ منشأتك",
        paras: [
          "افتح صفحة الإنشاء واكتب نوع المنشأة (حلاق، صالون، مطعم، عيادة…) واسمها. يُنشأ حسابك فوراً وتدخل لوحة التحكم. النوع يحدّد المظهر والمصطلحات فقط، وكل السلوك تضبطه أنت لاحقاً.",
        ],
        tip: "سجّل ببريدك وكلمة مرور — هذا حساب المدير الذي تدير منه كل شيء.",
      },
      {
        title: "اضبط منشأتك (لوحة التحكم)",
        paras: ["من لوحة المدير تتحكّم بكل شيء من مكان واحد:"],
        bullets: [
          "استقبال العملاء مفتوح/مغلق — أوقف الحجز خارج الدوام بضغطة.",
          "نموذج الموظفين — هل يختار العميل الموظف أم دور واحد موحّد؟ وهل يظهر اسم الموظف على التذكرة؟",
          "نظام الزمن — ثلاث طرق: بالرقم فقط (بلا زمن)، أو زمني تلقائي (يُحسب من مدد الخدمات)، أو يدوي (الموظف يحدّد الوقت).",
          "المواعيد — فعّل الحجز في ساعة محدّدة، واضبط ساعات العمل وطول الخانة ونافذة حماية الموعد.",
          "الأسعار والعرض — أظهِر الأسعار وعدد المنتظرين والعدّاد الحي للعميل.",
        ],
        tip: "ابدأ بسيطاً: «بالرقم فقط» يكفي معظم المحلات، وفعّل المواعيد لاحقاً عند الحاجة.",
      },
      {
        title: "أضف موظفيك وخدماتك",
        paras: [
          "في قسم الموظفين أضف كل موظف ويحصل على رمز دخول خاص يدخل به لشاشته. وفي قسم الخدمات أضف خدماتك وأسعارها ومدّتها. يمكنك تحديد مدّة كل خدمة لكل موظف لحساب الوقت بدقة. المدير نفسه يُعدّ موظفاً ويستقبل العملاء.",
        ],
        tip: "رمز الدخول يُسلَّم للموظف مع رمز المحل ليفتح شاشته من أي جوال.",
      },
      {
        title: "ادعُ عملاءك للحجز",
        paras: ["لديك قناتان، وكلتاهما تُقاس تلقائياً لتعرف مصدر كل عميل:"],
        bullets: [
          "في المحل: نزّل ملصق QR (جاهز للطباعة في دقيقة) وعلّقه عند المدخل — الزبون الحاضر يمسحه ويأخذ دوره.",
          "عن بُعد: شارك الرمز أو رابط الحجز عبر واتساب أو صفحاتك أو أي مكان — ليحجز عملاؤك قبل وصولهم.",
        ],
        tip: "القناتان توصلان لنفس صفحة الحجز؛ الفرق فقط أنك تعرف من أين جاء كل عميل من إحصائياتك.",
      },
      {
        title: "كيف يحجز عميلك",
        paras: [
          "يفتح العميل الرابط، يكتب اسمه، يختار الخدمة (والموظف إن سمحت)، ثم: دور فوري الآن، أو — إن فعّلت المواعيد — موعد في ساعة محدّدة يختاره من خانات متاحة (المحجوزة تظهر معطّلة فلا تُحجز مرتين). كل ذلك من المتصفح بلا أي تطبيق.",
        ],
      },
      {
        title: "شاشة انتظار العميل",
        paras: [
          "بعد الحجز يرى العميل شاشة حيّة تتحدّث تلقائياً: رقمه، عدد من قبله، والوقت المتوقع. وكلما اقترب دوره تتدرّج البطاقة لوناً وحركةً، مع تنبيه صوتي واهتزاز، وإشعار على جواله إن فعّله — حتى لو أغلق الصفحة (أندرويد).",
        ],
        demo: "stages",
        demoCaption: "تتدرّج الشاشة تلقائياً: بعيد ← اقترب ← استعد ← أنت التالي ← حان دورك",
        tip: "على أندرويد يظهر زر «نبّهني عند اقتراب دوري» للإشعار والصفحة مغلقة؛ على آيفون يُبقي العميل الصفحة مفتوحة ويُنبَّه بالصوت.",
      },
      {
        title: "شاشة الموظف: الاستقبال والخدمة",
        paras: [
          "لكل موظف شاشته الخاصة منفصلة عن لوحة المدير. يدخل إليها من صفحة الدخول ← تبويب «موظف»، بكتابة رمز المحل ورمز دخوله الخاص — من أي جوال وبدون أي تطبيق. (رموز الدخول يُنشئها المدير في قسم الموظفين.)",
          "يضبط الموظف حالته بنفسه: «متاح» لاستقبال العملاء، أو «غير متاح» عند الاستراحة فلا يُسحب له عميل، وتظهر «مشغول» تلقائياً أثناء خدمته لعميل.",
          "ومن أزرار شاشته: نادِ العميل التالي فيُسحب أقدم عميل ويُنبَّه أن دوره حان، ثم أنهِ الخدمة ليتقدّم الطابور تلقائياً. إن لم يحضر العميل تخطّاه (ويظهر في قائمة المتخطّين مع إمكانية إعادته للطابور). في الوضع اليدوي يحدّد للعميل التالي وقت جاهزيته بمنزلق بسيط فتصله نغمة.",
        ],
        demo: "queue",
        demoCaption: "عند إنهاء كل عميل يتقدّم الطابور والرقم التالي يُنادى",
        tip: "المدير نفسه موظفٌ أيضاً، ويستقبل العملاء بنفس الأزرار من داخل لوحته مباشرةً.",
      },
      {
        title: "شاشة العرض للمحل",
        paras: [
          "افتح شاشة العرض على تلفزيون أو جهاز لوحي داخل محلك — تعرض بأرقام كبيرة من يُخدَم الآن والأرقام القادمة، وتُحدّث نفسها تلقائياً مع نغمة عند نداء رقم جديد. مثالية للمطاعم والعيادات.",
        ],
        tip: "رابط الشاشة: /display/رمز-محلك — افتحه على الشاشة واتركه.",
      },
      {
        title: "إحصائياتك",
        paras: [
          "صفحة الإحصائيات تعرض لكل موظف عدد من خدمهم وإيرادهم اليوم، وإجماليات الشهر، وتفصيل الأيام — لتعرف أداء محلك وموظفيك بالأرقام، وتتنقّل بين الشهور.",
        ],
      },
      {
        title: "إعلانات منشأتك",
        paras: [
          "إن مُنحت الصلاحية، يظهر في لوحتك قسم «إعلانات منشأتي» لبثّ إعلان (نص + صورة/فيديو + رابط) على صفحات منشأتك — كعرض اليوم أو تنبيه. تختار الصفحة التي يظهر فيها ومدّة تفعيله.",
        ],
      },
      {
        title: "التواصل مع فريق دورك",
        paras: [
          "في لوحتك بطاقة «تواصل مع فريق دورك» تفتح محادثة واتساب مباشرة مع فريق الدعم — للمساعدة أو الاستفسار أو الملاحظات أو طلب التجديد. الرسالة تأتي معبّأة باسم منشأتك ورمزها تلقائياً، فيردّ عليك الفريق بسرعة ويعرف من أنت.",
        ],
        tip: "إن انتهت تجربتك المجانية، تظهر نفس قناة الواتساب في شاشة التجديد لتتواصل وتُفعّل اشتراكك فوراً.",
      },
      {
        title: "كلمة المرور وأمان حسابك",
        paras: [
          "تغيّر كلمة مرور دخولك في أي وقت من بطاقة «كلمة المرور 🔑» أسفل لوحة التحكم: اكتب كلمتك الحالية، ثم الجديدة مرتين، واضغط «تغيير كلمة المرور».",
          "وإن نسيتها كلياً ولم تستطع الدخول، تواصل مع فريق دورك عبر واتساب ليُعيد تعيينها لك بكلمة مؤقتة تدخل بها ثم تغيّرها فوراً من البطاقة نفسها.",
        ],
        tip: "اختر كلمة مرور قوية (٦ أحرف فأكثر) ولا تشاركها مع موظفيك — لكل موظف رمز دخول خاص منفصل عن حساب المدير.",
      },
    ],
    flow: [
      { icon: "📱", label: "يمسح الرمز أو يفتح الرابط" },
      { icon: "🎫", label: "يأخذ رقمه في الطابور" },
      { icon: "🔔", label: "يُنبَّه عند اقتراب دوره" },
    ],
    stages: [
      { ahead: "٤", msg: "تابع أعمالك بحرّية — سننبّهك عند اقتراب دورك ✨" },
      { ahead: "٢", msg: "اقترب دورك، يرجى الاستعداد" },
      { ahead: "١", msg: "بقي شخص واحد أمامك — كن قريباً 🔔" },
      { ahead: "٠", msg: "أنت التالي! اقترب من نقطة الخدمة 🎉" },
      { ahead: "٠", msg: "حان دورك الآن، تفضّل 🎊" },
    ],
    ticketLabel: "رقم تذكرتك",
    ticketNum: "٤٢",
    aheadLabel: "عدد الأشخاص قبلك",
    nowServing: "الآن يُخدَم",
    coming: "القادمون",
    ctaTitle: "جاهز تبدأ؟",
    ctaBtn: "أنشئ منشأتك مجاناً",
    ctaDash: "أو ادخل لوحة التحكم ←",
    footer: "مدعوم بنظام «دورك»",
  },

  en: {
    title: "Dawrak User Guide",
    subtitle: "Learn every part of Dawrak step by step — with short animated demos",
    toc: "Contents",
    sections: [
      {
        title: "What is Dawrak?",
        paras: [
          "Dawrak is a queue-management system for busy places. Your customer takes their turn from their phone by scanning a QR code — with no app — then goes about their day while we alert them as their turn approaches. The result: no crowding inside your shop, happier customers, and clearer control over your time.",
        ],
        demo: "flow",
        demoCaption: "The customer journey in three steps",
      },
      {
        title: "Create your business",
        paras: [
          "Open the sign-up page and enter your business type (barber, salon, restaurant, clinic…) and its name. Your account is created instantly and you enter the control panel. The type only sets the look and wording; you configure all behavior afterwards.",
        ],
        tip: "Sign up with your email and a password — this is the manager account you run everything from.",
      },
      {
        title: "Set up your business (control panel)",
        paras: ["From the manager dashboard you control everything in one place:"],
        bullets: [
          "Accepting customers on/off — pause booking outside working hours with one tap.",
          "Staff model — does the customer pick the employee, or one unified queue? And does the employee's name show on the ticket?",
          "Time system — three modes: number only (no time), automatic timing (from service durations), or manual (the employee sets the time).",
          "Appointments — enable booking at a specific hour, and set working hours, slot length, and the appointment grace window.",
          "Prices & display — show prices, the number waiting, and the live countdown to the customer.",
        ],
        tip: "Start simple: 'number only' is enough for most shops; enable appointments later when needed.",
      },
      {
        title: "Add your staff and services",
        paras: [
          "In the Staff section add each employee, who gets a private login code for their own screen. In the Services section add your services with their prices and durations. You can set each service's duration per employee for accurate timing. The manager is also a service provider and serves customers.",
        ],
        tip: "Give the login code to the employee along with the shop code so they can open their screen from any phone.",
      },
      {
        title: "Invite your customers to book",
        paras: ["You have two channels, and both are measured automatically so you know where each customer came from:"],
        bullets: [
          "In-store: download the QR poster (print-ready in one minute) and hang it at the entrance — the present customer scans it and takes a turn.",
          "Remotely: share the code or booking link via WhatsApp, your pages, or anywhere — so customers book before they arrive.",
        ],
        tip: "Both channels lead to the same booking page; the only difference is that your stats tell you where each customer came from.",
      },
      {
        title: "How your customer books",
        paras: [
          "The customer opens the link, enters their name, picks the service (and the employee if you allow it), then: an instant turn now, or — if you enabled appointments — a booking at a specific hour chosen from available slots (booked ones show disabled so they can't be double-booked). All from the browser, with no app.",
        ],
      },
      {
        title: "The customer's waiting screen",
        paras: [
          "After booking, the customer sees a live screen that updates automatically: their number, how many are ahead, and the estimated time. As their turn nears, the card escalates in color and motion, with a sound alert and vibration, and a notification on their phone if enabled — even if they closed the page (Android).",
        ],
        demo: "stages",
        demoCaption: "The screen escalates automatically: far → approaching → get ready → you're next → your turn",
        tip: "On Android a 'Notify me as my turn nears' button appears for alerts with the page closed; on iPhone the customer keeps the page open and is alerted by sound.",
      },
      {
        title: "The employee screen: receiving & serving",
        paras: [
          "Each employee has their own screen, separate from the manager dashboard. They open it from the login page → 'Staff' tab, by entering the shop code and their own login code — from any phone, with no app. (Login codes are created by the manager in the Staff section.)",
          "The employee sets their own status: 'Available' to receive customers, 'Unavailable' during a break so no customer is pulled to them, and 'Busy' shows automatically while serving a customer.",
          "From their screen's buttons: Call next customer pulls the oldest customer and alerts them their turn has come, then Complete service advances the queue automatically. If the customer doesn't show, Skip them (they appear in the skipped list and can be restored to the queue). In manual mode the employee sets the next customer's ready time with a simple slider, and a tone reaches them.",
        ],
        demo: "queue",
        demoCaption: "As each customer is completed, the queue advances and the next number is called",
        tip: "The manager is an employee too, and serves customers with the same buttons right from their dashboard.",
      },
      {
        title: "The in-store display screen",
        paras: [
          "Open the display screen on a TV or tablet inside your shop — it shows in large numbers who is being served now and the upcoming numbers, and refreshes itself automatically with a tone when a new number is called. Ideal for restaurants and clinics.",
        ],
        tip: "Display link: /display/your-shop-code — open it on the screen and leave it.",
      },
      {
        title: "Your statistics",
        paras: [
          "The Statistics page shows, per employee, how many they served and their revenue today, monthly totals, and a day-by-day breakdown — so you know your shop's and staff's performance in numbers, and move between months.",
        ],
      },
      {
        title: "Your business announcements",
        paras: [
          "If granted permission, a 'My business announcements' section appears in your dashboard to broadcast an announcement (text + image/video + link) on your business pages — like today's offer or a notice. You choose which page it appears on and how long it stays active.",
        ],
      },
      {
        title: "Contact the Dawrak team",
        paras: [
          "Your dashboard has a 'Contact the Dawrak team' card that opens a WhatsApp chat directly with support — for help, questions, feedback, or to renew. The message comes pre-filled with your business name and code automatically, so the team replies quickly and knows who you are.",
        ],
        tip: "If your free trial ends, the same WhatsApp channel appears on the renewal screen so you can reach out and activate your subscription instantly.",
      },
      {
        title: "Your password & account security",
        paras: [
          "Change your sign-in password anytime from the 'Password 🔑' card at the bottom of the dashboard: enter your current password, then the new one twice, and tap 'Change password'.",
          "And if you forget it entirely and can't sign in, contact the Dawrak team on WhatsApp to reset it for you with a temporary password — sign in with it, then change it right away from the same card.",
        ],
        tip: "Choose a strong password (6+ characters) and don't share it with your staff — each employee has their own login code, separate from the manager account.",
      },
    ],
    flow: [
      { icon: "📱", label: "Scans the code or opens the link" },
      { icon: "🎫", label: "Takes their number in the queue" },
      { icon: "🔔", label: "Gets alerted as their turn nears" },
    ],
    stages: [
      { ahead: "4", msg: "Go about your day freely — we'll alert you as your turn nears ✨" },
      { ahead: "2", msg: "Your turn is approaching, please get ready" },
      { ahead: "1", msg: "One person left ahead of you — stay close 🔔" },
      { ahead: "0", msg: "You're next! Come near the service point 🎉" },
      { ahead: "0", msg: "It's your turn now, please come 🎊" },
    ],
    ticketLabel: "Your ticket number",
    ticketNum: "42",
    aheadLabel: "People ahead of you",
    nowServing: "Now serving",
    coming: "Coming up",
    ctaTitle: "Ready to start?",
    ctaBtn: "Create your business — free",
    ctaDash: "Or enter the control panel →",
    footer: "Powered by Dawrak",
  },

  hi: {
    title: "दौरक उपयोग गाइड",
    subtitle: "दौरक के हर हिस्से को चरण-दर-चरण सीखें — छोटे एनिमेटेड डेमो के साथ",
    toc: "विषय-सूची",
    sections: [
      {
        title: "दौरक क्या है?",
        paras: [
          "दौरक भीड़भाड़ वाली जगहों के लिए कतार-प्रबंधन प्रणाली है। आपका ग्राहक QR कोड स्कैन करके अपने फ़ोन से बारी लेता है — बिना किसी ऐप के — फिर अपने काम पर निकल जाता है, और बारी पास आने पर हम सूचित कर देते हैं। नतीजा: आपकी दुकान में भीड़ नहीं, ग्राहक ज़्यादा खुश, और आपके समय पर बेहतर नियंत्रण।",
        ],
        demo: "flow",
        demoCaption: "तीन चरणों में ग्राहक की यात्रा",
      },
      {
        title: "अपना व्यवसाय बनाएँ",
        paras: [
          "साइन-अप पेज खोलें और अपने व्यवसाय का प्रकार (नाई, सैलून, रेस्तराँ, क्लीनिक…) और नाम डालें। आपका खाता तुरंत बन जाता है और आप कंट्रोल पैनल में प्रवेश करते हैं। प्रकार केवल रूप और शब्दावली तय करता है; सारा व्यवहार आप बाद में सेट करते हैं।",
        ],
        tip: "अपने ईमेल और पासवर्ड से साइन अप करें — यही मैनेजर खाता है जिससे आप सब कुछ चलाते हैं।",
      },
      {
        title: "अपना व्यवसाय सेट करें (कंट्रोल पैनल)",
        paras: ["मैनेजर डैशबोर्ड से आप एक ही जगह से सब कुछ नियंत्रित करते हैं:"],
        bullets: [
          "ग्राहक स्वीकार करना चालू/बंद — कार्य समय के बाहर बुकिंग एक टैप में रोकें।",
          "स्टाफ़ मॉडल — ग्राहक कर्मचारी चुनता है या एक साझा कतार? और क्या टिकट पर कर्मचारी का नाम दिखे?",
          "समय प्रणाली — तीन तरीके: केवल नंबर (बिना समय), स्वचालित समय (सेवाओं की अवधि से), या मैनुअल (कर्मचारी समय तय करता है)।",
          "अपॉइंटमेंट — निश्चित समय पर बुकिंग चालू करें, और कार्य समय, स्लॉट अवधि व अपॉइंटमेंट सुरक्षा-विंडो सेट करें।",
          "मूल्य व प्रदर्शन — कीमतें, प्रतीक्षा करने वालों की संख्या, और ग्राहक के लिए लाइव काउंटडाउन दिखाएँ।",
        ],
        tip: "सरल शुरू करें: 'केवल नंबर' अधिकांश दुकानों के लिए काफ़ी है; ज़रूरत होने पर बाद में अपॉइंटमेंट चालू करें।",
      },
      {
        title: "अपने कर्मचारी व सेवाएँ जोड़ें",
        paras: [
          "स्टाफ़ अनुभाग में हर कर्मचारी जोड़ें, जिसे अपनी स्क्रीन के लिए एक निजी लॉगिन कोड मिलता है। सेवाएँ अनुभाग में अपनी सेवाएँ उनकी कीमतों व अवधि के साथ जोड़ें। सटीक समय के लिए आप हर सेवा की अवधि हर कर्मचारी के अनुसार तय कर सकते हैं। मैनेजर भी एक सेवा-प्रदाता है और ग्राहकों की सेवा करता है।",
        ],
        tip: "लॉगिन कोड कर्मचारी को शॉप कोड के साथ दें ताकि वह किसी भी फ़ोन से अपनी स्क्रीन खोल सके।",
      },
      {
        title: "अपने ग्राहकों को बुकिंग के लिए आमंत्रित करें",
        paras: ["आपके पास दो चैनल हैं, और दोनों स्वतः मापे जाते हैं ताकि आप जानें कि हर ग्राहक कहाँ से आया:"],
        bullets: [
          "दुकान में: QR पोस्टर डाउनलोड करें (एक मिनट में प्रिंट-तैयार) और प्रवेश द्वार पर लगाएँ — मौजूद ग्राहक स्कैन करके बारी लेता है।",
          "दूर से: कोड या बुकिंग लिंक व्हाट्सएप, अपने पेज या कहीं भी साझा करें — ताकि ग्राहक पहुँचने से पहले बुक करें।",
        ],
        tip: "दोनों चैनल एक ही बुकिंग पेज पर ले जाते हैं; फ़र्क़ बस यह कि आपके आँकड़े बताते हैं कि हर ग्राहक कहाँ से आया।",
      },
      {
        title: "आपका ग्राहक कैसे बुक करता है",
        paras: [
          "ग्राहक लिंक खोलता है, नाम डालता है, सेवा चुनता है (और कर्मचारी, यदि आप अनुमति दें), फिर: अभी तुरंत बारी, या — यदि आपने अपॉइंटमेंट चालू किया — उपलब्ध स्लॉट से निश्चित समय की बुकिंग (बुक हो चुके स्लॉट निष्क्रिय दिखते हैं ताकि दोबारा बुक न हों)। सब कुछ ब्राउज़र से, बिना किसी ऐप के।",
        ],
      },
      {
        title: "ग्राहक की प्रतीक्षा स्क्रीन",
        paras: [
          "बुकिंग के बाद ग्राहक एक लाइव स्क्रीन देखता है जो स्वतः अपडेट होती है: उसका नंबर, कितने आगे हैं, और अनुमानित समय। बारी पास आते ही कार्ड रंग व गति में बढ़ता है, ध्वनि-अलर्ट और कंपन के साथ, और सक्षम होने पर फ़ोन पर सूचना — भले ही उसने पेज बंद कर दिया हो (एंड्रॉइड)।",
        ],
        demo: "stages",
        demoCaption: "स्क्रीन स्वतः बढ़ती है: दूर → पास → तैयार हो → आप अगले → आपकी बारी",
        tip: "एंड्रॉइड पर 'बारी पास आने पर सूचित करें' बटन दिखता है ताकि पेज बंद होने पर भी अलर्ट मिले; आईफ़ोन पर ग्राहक पेज खुला रखता है और ध्वनि से सूचित होता है।",
      },
      {
        title: "कर्मचारी स्क्रीन: स्वागत व सेवा",
        paras: [
          "हर कर्मचारी की अपनी स्क्रीन होती है, मैनेजर डैशबोर्ड से अलग। वह इसे लॉगिन पेज → 'कर्मचारी' टैब से खोलता है, शॉप कोड और अपना लॉगिन कोड डालकर — किसी भी फ़ोन से, बिना ऐप के। (लॉगिन कोड मैनेजर स्टाफ़ अनुभाग में बनाता है।)",
          "कर्मचारी अपनी स्थिति खुद तय करता है: 'उपलब्ध' ग्राहक लेने के लिए, 'अनुपलब्ध' विराम के दौरान ताकि कोई ग्राहक उसे न मिले, और सेवा के दौरान स्वतः 'व्यस्त' दिखता है।",
          "उसकी स्क्रीन के बटन: अगला ग्राहक बुलाएँ सबसे पुराने ग्राहक को खींचता है और उसे सूचित करता है कि बारी आ गई, फिर सेवा पूरी करें कतार को स्वतः आगे बढ़ाता है। यदि ग्राहक न आए तो उसे छोड़ें (वह छोड़े गए सूची में दिखता है और कतार में वापस लाया जा सकता है)। मैनुअल मोड में कर्मचारी अगले ग्राहक का तैयारी-समय एक सरल स्लाइडर से तय करता है और उसे एक टोन मिलती है।",
        ],
        demo: "queue",
        demoCaption: "हर ग्राहक पूरा होने पर कतार आगे बढ़ती है और अगला नंबर बुलाया जाता है",
        tip: "मैनेजर भी एक कर्मचारी है, और उन्हीं बटनों से अपने डैशबोर्ड से सीधे ग्राहकों की सेवा करता है।",
      },
      {
        title: "दुकान की प्रदर्शन स्क्रीन",
        paras: [
          "अपनी दुकान में टीवी या टैबलेट पर प्रदर्शन स्क्रीन खोलें — यह बड़े अंकों में दिखाती है कि अभी किसकी सेवा हो रही है और आने वाले नंबर, और नया नंबर बुलाने पर टोन के साथ स्वतः रिफ़्रेश होती है। रेस्तराँ व क्लीनिक के लिए आदर्श।",
        ],
        tip: "प्रदर्शन लिंक: /display/आपका-शॉप-कोड — इसे स्क्रीन पर खोलें और छोड़ दें।",
      },
      {
        title: "आपके आँकड़े",
        paras: [
          "आँकड़े पेज हर कर्मचारी के लिए दिखाता है कि उसने आज कितनों की सेवा की और उसकी आय, महीने के कुल, और दिन-वार विवरण — ताकि आप अपनी दुकान और स्टाफ़ का प्रदर्शन संख्याओं में जानें, और महीनों के बीच जाएँ।",
        ],
      },
      {
        title: "आपके व्यवसाय के विज्ञापन",
        paras: [
          "अनुमति मिलने पर आपके डैशबोर्ड में 'मेरे व्यवसाय के विज्ञापन' अनुभाग दिखता है ताकि आप अपने व्यवसाय पेजों पर विज्ञापन (टेक्स्ट + छवि/वीडियो + लिंक) प्रसारित करें — जैसे आज का ऑफ़र या सूचना। आप चुनते हैं कि यह किस पेज पर दिखे और कितने समय तक सक्रिय रहे।",
        ],
      },
      {
        title: "दौरक टीम से संपर्क",
        paras: [
          "आपके डैशबोर्ड में 'दौरक टीम से संपर्क करें' कार्ड है जो सीधे व्हाट्सएप पर सहायता टीम से चैट खोलता है — मदद, सवाल, प्रतिक्रिया, या नवीनीकरण के लिए। संदेश आपके व्यवसाय के नाम और कोड के साथ स्वतः भरा आता है, ताकि टीम जल्दी जवाब दे और जाने आप कौन हैं।",
        ],
        tip: "यदि आपकी मुफ़्त ट्रायल समाप्त हो जाए, वही व्हाट्सएप चैनल नवीनीकरण स्क्रीन पर दिखता है ताकि आप संपर्क करके अपना सब्सक्रिप्शन तुरंत सक्रिय करें।",
      },
      {
        title: "आपका पासवर्ड व खाता सुरक्षा",
        paras: [
          "डैशबोर्ड के नीचे 'पासवर्ड 🔑' कार्ड से अपना साइन-इन पासवर्ड कभी भी बदलें: अपना मौजूदा पासवर्ड डालें, फिर नया दो बार, और 'पासवर्ड बदलें' दबाएँ।",
          "और यदि आप इसे पूरी तरह भूल जाएँ और साइन इन न कर पाएँ, तो दौरक टीम से व्हाट्सएप पर संपर्क करें ताकि वे आपके लिए एक अस्थायी पासवर्ड से इसे रीसेट करें — उससे साइन इन करें, फिर उसी कार्ड से तुरंत बदल लें।",
        ],
        tip: "मज़बूत पासवर्ड चुनें (6+ अक्षर) और इसे अपने कर्मचारियों से साझा न करें — हर कर्मचारी का अपना लॉगिन कोड होता है, मैनेजर खाते से अलग।",
      },
    ],
    flow: [
      { icon: "📱", label: "कोड स्कैन करता है या लिंक खोलता है" },
      { icon: "🎫", label: "कतार में अपना नंबर लेता है" },
      { icon: "🔔", label: "बारी पास आने पर सूचित होता है" },
    ],
    stages: [
      { ahead: "4", msg: "बेफ़िक्र अपने काम करें — बारी पास आने पर हम सूचित करेंगे ✨" },
      { ahead: "2", msg: "आपकी बारी पास है, कृपया तैयार हो जाइए" },
      { ahead: "1", msg: "आपसे आगे सिर्फ़ एक व्यक्ति — पास रहें 🔔" },
      { ahead: "0", msg: "आप अगले हैं! सेवा बिंदु के पास आएँ 🎉" },
      { ahead: "0", msg: "अब आपकी बारी है, कृपया आइए 🎊" },
    ],
    ticketLabel: "आपका टिकट नंबर",
    ticketNum: "42",
    aheadLabel: "आपसे आगे लोग",
    nowServing: "अभी सेवा में",
    coming: "आने वाले",
    ctaTitle: "शुरू करने को तैयार?",
    ctaBtn: "अपना व्यवसाय बनाएँ — मुफ़्त",
    ctaDash: "या कंट्रोल पैनल में जाएँ →",
    footer: "दौरक द्वारा संचालित",
  },

  bn: {
    title: "দাওরাক ব্যবহার গাইড",
    subtitle: "দাওরাকের প্রতিটি অংশ ধাপে ধাপে শিখুন — ছোট অ্যানিমেটেড ডেমোসহ",
    toc: "সূচিপত্র",
    sections: [
      {
        title: "দাওরাক কী?",
        paras: [
          "দাওরাক ভিড়পূর্ণ স্থানের জন্য একটি সারি-ব্যবস্থাপনা সিস্টেম। আপনার গ্রাহক QR কোড স্ক্যান করে নিজের ফোন থেকে পালা নেয় — কোনো অ্যাপ ছাড়াই — তারপর নিজের কাজে চলে যায়, আর পালা কাছে এলে আমরা জানিয়ে দিই। ফলাফল: আপনার দোকানে ভিড় নেই, গ্রাহক বেশি সন্তুষ্ট, আর আপনার সময়ে স্পষ্ট নিয়ন্ত্রণ।",
        ],
        demo: "flow",
        demoCaption: "তিন ধাপে গ্রাহকের যাত্রা",
      },
      {
        title: "আপনার ব্যবসা তৈরি করুন",
        paras: [
          "সাইন-আপ পেজ খুলুন এবং আপনার ব্যবসার ধরন (নাপিত, সেলুন, রেস্তোরাঁ, ক্লিনিক…) ও নাম লিখুন। আপনার অ্যাকাউন্ট সঙ্গে সঙ্গে তৈরি হয় এবং আপনি কন্ট্রোল প্যানেলে প্রবেশ করেন। ধরন শুধু চেহারা ও পরিভাষা ঠিক করে; সব আচরণ আপনি পরে সেট করেন।",
        ],
        tip: "আপনার ইমেল ও পাসওয়ার্ড দিয়ে সাইন আপ করুন — এটিই ম্যানেজার অ্যাকাউন্ট যা দিয়ে আপনি সব চালান।",
      },
      {
        title: "আপনার ব্যবসা সেট করুন (কন্ট্রোল প্যানেল)",
        paras: ["ম্যানেজার ড্যাশবোর্ড থেকে আপনি এক জায়গা থেকে সব নিয়ন্ত্রণ করেন:"],
        bullets: [
          "গ্রাহক গ্রহণ চালু/বন্ধ — কর্মঘণ্টার বাইরে বুকিং এক ট্যাপে থামান।",
          "স্টাফ মডেল — গ্রাহক কর্মী বেছে নেয়, নাকি একটি অভিন্ন সারি? আর টিকিটে কি কর্মীর নাম দেখাবে?",
          "সময় ব্যবস্থা — তিন উপায়: শুধু নম্বর (সময় ছাড়া), স্বয়ংক্রিয় সময় (সেবার সময়কাল থেকে), বা ম্যানুয়াল (কর্মী সময় ঠিক করে)।",
          "অ্যাপয়েন্টমেন্ট — নির্দিষ্ট সময়ে বুকিং চালু করুন, এবং কর্মঘণ্টা, স্লট দৈর্ঘ্য ও অ্যাপয়েন্টমেন্ট সুরক্ষা-উইন্ডো সেট করুন।",
          "দাম ও প্রদর্শন — দাম, অপেক্ষমাণ সংখ্যা, এবং গ্রাহকের জন্য লাইভ কাউন্টডাউন দেখান।",
        ],
        tip: "সহজভাবে শুরু করুন: 'শুধু নম্বর' বেশিরভাগ দোকানের জন্য যথেষ্ট; প্রয়োজনে পরে অ্যাপয়েন্টমেন্ট চালু করুন।",
      },
      {
        title: "আপনার কর্মী ও সেবা যোগ করুন",
        paras: [
          "স্টাফ বিভাগে প্রতিটি কর্মী যোগ করুন, যিনি নিজের স্ক্রিনের জন্য একটি ব্যক্তিগত লগইন কোড পান। সেবা বিভাগে আপনার সেবাগুলো দাম ও সময়কালসহ যোগ করুন। নিখুঁত সময়ের জন্য আপনি প্রতিটি সেবার সময়কাল প্রতি কর্মী অনুযায়ী ঠিক করতে পারেন। ম্যানেজারও একজন সেবা-প্রদানকারী এবং গ্রাহকদের সেবা করেন।",
        ],
        tip: "লগইন কোড কর্মীকে শপ কোডসহ দিন যাতে তিনি যেকোনো ফোন থেকে নিজের স্ক্রিন খুলতে পারেন।",
      },
      {
        title: "আপনার গ্রাহকদের বুকিংয়ে আমন্ত্রণ জানান",
        paras: ["আপনার দুটি চ্যানেল আছে, এবং দুটোই স্বয়ংক্রিয়ভাবে পরিমাপ হয় যাতে আপনি জানেন প্রতিটি গ্রাহক কোথা থেকে এসেছে:"],
        bullets: [
          "দোকানে: QR পোস্টার ডাউনলোড করুন (এক মিনিটে প্রিন্ট-প্রস্তুত) এবং প্রবেশপথে লাগান — উপস্থিত গ্রাহক স্ক্যান করে পালা নেয়।",
          "দূর থেকে: কোড বা বুকিং লিংক হোয়াটসঅ্যাপ, আপনার পেজ বা যেকোনো জায়গায় শেয়ার করুন — যাতে গ্রাহক পৌঁছানোর আগেই বুক করে।",
        ],
        tip: "দুটো চ্যানেলই একই বুকিং পেজে নিয়ে যায়; পার্থক্য শুধু আপনার পরিসংখ্যান বলে দেয় প্রতিটি গ্রাহক কোথা থেকে এসেছে।",
      },
      {
        title: "আপনার গ্রাহক কীভাবে বুক করে",
        paras: [
          "গ্রাহক লিংক খোলে, নাম লেখে, সেবা বেছে নেয় (এবং কর্মী, যদি আপনি অনুমতি দেন), তারপর: এখনই তাৎক্ষণিক পালা, অথবা — যদি আপনি অ্যাপয়েন্টমেন্ট চালু করেন — উপলব্ধ স্লট থেকে নির্দিষ্ট সময়ের বুকিং (বুক হওয়া স্লট নিষ্ক্রিয় দেখায় যাতে দুবার বুক না হয়)। সবকিছু ব্রাউজার থেকে, কোনো অ্যাপ ছাড়াই।",
        ],
      },
      {
        title: "গ্রাহকের অপেক্ষা স্ক্রিন",
        paras: [
          "বুকিংয়ের পর গ্রাহক একটি লাইভ স্ক্রিন দেখে যা স্বয়ংক্রিয়ভাবে আপডেট হয়: তার নম্বর, কতজন আগে আছে, এবং আনুমানিক সময়। পালা কাছে এলে কার্ডটি রঙ ও গতিতে বাড়ে, শব্দ-সতর্কতা ও কম্পনসহ, এবং সক্রিয় থাকলে ফোনে বিজ্ঞপ্তি — এমনকি পেজ বন্ধ করলেও (অ্যান্ড্রয়েড)।",
        ],
        demo: "stages",
        demoCaption: "স্ক্রিন স্বয়ংক্রিয়ভাবে বাড়ে: দূরে → কাছে → প্রস্তুত হও → আপনি পরের → আপনার পালা",
        tip: "অ্যান্ড্রয়েডে 'পালা কাছে এলে আমাকে জানান' বোতাম দেখায় যাতে পেজ বন্ধ থাকলেও সতর্কতা পাওয়া যায়; আইফোনে গ্রাহক পেজ খোলা রাখে এবং শব্দে সতর্ক হয়।",
      },
      {
        title: "কর্মী স্ক্রিন: গ্রহণ ও সেবা",
        paras: [
          "প্রতিটি কর্মীর নিজস্ব স্ক্রিন আছে, ম্যানেজার ড্যাশবোর্ড থেকে আলাদা। তিনি এটি লগইন পেজ → 'কর্মী' ট্যাব থেকে খোলেন, শপ কোড ও নিজের লগইন কোড দিয়ে — যেকোনো ফোন থেকে, অ্যাপ ছাড়াই। (লগইন কোড ম্যানেজার স্টাফ বিভাগে তৈরি করেন।)",
          "কর্মী নিজের অবস্থা নিজেই ঠিক করেন: গ্রাহক নিতে 'উপলব্ধ', বিরতির সময় 'অনুপলব্ধ' যাতে কোনো গ্রাহক তাঁর কাছে না আসে, এবং সেবার সময় স্বয়ংক্রিয়ভাবে 'ব্যস্ত' দেখায়।",
          "তাঁর স্ক্রিনের বোতাম: পরের গ্রাহক ডাকুন সবচেয়ে পুরনো গ্রাহককে টেনে আনে এবং তাঁকে জানায় যে পালা এসেছে, তারপর সেবা সম্পন্ন করুন সারিকে স্বয়ংক্রিয়ভাবে এগিয়ে নেয়। গ্রাহক না এলে তাঁকে এড়িয়ে যান (তিনি এড়ানো তালিকায় দেখান এবং সারিতে ফেরানো যায়)। ম্যানুয়াল মোডে কর্মী পরের গ্রাহকের প্রস্তুতির সময় একটি সহজ স্লাইডার দিয়ে ঠিক করেন এবং তাঁর কাছে একটি টোন পৌঁছায়।",
        ],
        demo: "queue",
        demoCaption: "প্রতিটি গ্রাহক সম্পন্ন হলে সারি এগিয়ে যায় এবং পরের নম্বর ডাকা হয়",
        tip: "ম্যানেজারও একজন কর্মী, এবং একই বোতাম দিয়ে নিজের ড্যাশবোর্ড থেকে সরাসরি গ্রাহকদের সেবা করেন।",
      },
      {
        title: "দোকানের প্রদর্শন স্ক্রিন",
        paras: [
          "আপনার দোকানে টিভি বা ট্যাবলেটে প্রদর্শন স্ক্রিন খুলুন — এটি বড় সংখ্যায় দেখায় এখন কাকে সেবা দেওয়া হচ্ছে এবং আসন্ন নম্বরগুলো, এবং নতুন নম্বর ডাকলে টোনসহ নিজে নিজে রিফ্রেশ হয়। রেস্তোরাঁ ও ক্লিনিকের জন্য আদর্শ।",
        ],
        tip: "প্রদর্শন লিংক: /display/আপনার-শপ-কোড — এটি স্ক্রিনে খুলে রেখে দিন।",
      },
      {
        title: "আপনার পরিসংখ্যান",
        paras: [
          "পরিসংখ্যান পেজ প্রতিটি কর্মীর জন্য দেখায় তিনি আজ কতজনকে সেবা দিয়েছেন ও তাঁর আয়, মাসের মোট, এবং দিন-ভিত্তিক বিবরণ — যাতে আপনি আপনার দোকান ও কর্মীদের পারফরম্যান্স সংখ্যায় জানেন, এবং মাসগুলোর মধ্যে যান।",
        ],
      },
      {
        title: "আপনার ব্যবসার বিজ্ঞাপন",
        paras: [
          "অনুমতি পেলে আপনার ড্যাশবোর্ডে 'আমার ব্যবসার বিজ্ঞাপন' বিভাগ দেখায় যাতে আপনি আপনার ব্যবসার পেজে বিজ্ঞাপন (টেক্সট + ছবি/ভিডিও + লিংক) সম্প্রচার করতে পারেন — যেমন আজকের অফার বা বিজ্ঞপ্তি। আপনি বেছে নেন এটি কোন পেজে দেখাবে এবং কতক্ষণ সক্রিয় থাকবে।",
        ],
      },
      {
        title: "দাওরাক টিমের সাথে যোগাযোগ",
        paras: [
          "আপনার ড্যাশবোর্ডে 'দাওরাক টিমের সাথে যোগাযোগ' কার্ড আছে যা সরাসরি হোয়াটসঅ্যাপে সহায়তা টিমের সাথে চ্যাট খোলে — সাহায্য, প্রশ্ন, মতামত, বা নবায়নের জন্য। বার্তাটি আপনার ব্যবসার নাম ও কোডসহ স্বয়ংক্রিয়ভাবে পূর্ণ হয়ে আসে, যাতে টিম দ্রুত উত্তর দেয় এবং জানে আপনি কে।",
        ],
        tip: "আপনার ফ্রি ট্রায়াল শেষ হলে, একই হোয়াটসঅ্যাপ চ্যানেল নবায়ন স্ক্রিনে দেখায় যাতে আপনি যোগাযোগ করে তাৎক্ষণিকভাবে আপনার সাবস্ক্রিপশন সক্রিয় করতে পারেন।",
      },
      {
        title: "আপনার পাসওয়ার্ড ও অ্যাকাউন্ট নিরাপত্তা",
        paras: [
          "ড্যাশবোর্ডের নিচে 'পাসওয়ার্ড 🔑' কার্ড থেকে আপনার সাইন-ইন পাসওয়ার্ড যেকোনো সময় পরিবর্তন করুন: আপনার বর্তমান পাসওয়ার্ড লিখুন, তারপর নতুনটি দুবার, এবং 'পাসওয়ার্ড পরিবর্তন' চাপুন।",
          "আর যদি আপনি এটি সম্পূর্ণ ভুলে যান এবং সাইন ইন করতে না পারেন, দাওরাক টিমের সাথে হোয়াটসঅ্যাপে যোগাযোগ করুন যাতে তারা একটি অস্থায়ী পাসওয়ার্ড দিয়ে এটি রিসেট করে দেয় — সেটি দিয়ে সাইন ইন করুন, তারপর একই কার্ড থেকে সঙ্গে সঙ্গে পরিবর্তন করুন।",
        ],
        tip: "একটি শক্তিশালী পাসওয়ার্ড বেছে নিন (৬+ অক্ষর) এবং এটি আপনার কর্মীদের সাথে শেয়ার করবেন না — প্রতিটি কর্মীর নিজস্ব লগইন কোড আছে, ম্যানেজার অ্যাকাউন্ট থেকে আলাদা।",
      },
    ],
    flow: [
      { icon: "📱", label: "কোড স্ক্যান করে বা লিংক খোলে" },
      { icon: "🎫", label: "সারিতে নিজের নম্বর নেয়" },
      { icon: "🔔", label: "পালা কাছে এলে সতর্ক হয়" },
    ],
    stages: [
      { ahead: "4", msg: "নিশ্চিন্তে নিজের কাজ করুন — পালা কাছে এলে আমরা জানাব ✨" },
      { ahead: "2", msg: "আপনার পালা কাছে, অনুগ্রহ করে প্রস্তুত হোন" },
      { ahead: "1", msg: "আপনার আগে মাত্র একজন — কাছে থাকুন 🔔" },
      { ahead: "0", msg: "আপনি পরের! সেবা পয়েন্টের কাছে আসুন 🎉" },
      { ahead: "0", msg: "এখন আপনার পালা, অনুগ্রহ করে আসুন 🎊" },
    ],
    ticketLabel: "আপনার টিকিট নম্বর",
    ticketNum: "42",
    aheadLabel: "আপনার আগে লোক",
    nowServing: "এখন সেবা চলছে",
    coming: "আসন্ন",
    ctaTitle: "শুরু করতে প্রস্তুত?",
    ctaBtn: "আপনার ব্যবসা তৈরি করুন — বিনামূল্যে",
    ctaDash: "অথবা কন্ট্রোল প্যানেলে যান →",
    footer: "দাওরাক দ্বারা পরিচালিত",
  },
};
