"use client";

import { useEffect, useState } from "react";

// ===== مقطع متحرك ١: مراحل قرب الدور في شاشة العميل =====
const STAGES = [
  { ahead: "٤", msg: "تابع أعمالك بحرّية — سننبّهك عند اقتراب دورك ✨", card: "", num: "", accent: false },
  { ahead: "٢", msg: "اقترب دورك، يرجى الاستعداد", card: "stage-approaching", num: "", accent: false },
  { ahead: "١", msg: "بقي شخص واحد أمامك — كن قريباً 🔔", card: "stage-ready", num: "stage-num-ready", accent: false },
  { ahead: "٠", msg: "أنت التالي! اقترب من نقطة الخدمة 🎉", card: "stage-next", num: "stage-num-next", accent: false },
  { ahead: "٠", msg: "حان دورك الآن، تفضّل 🎊", card: "", num: "stage-num-next", accent: true },
];

export function StagesDemo() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % STAGES.length), 2300);
    return () => clearInterval(id);
  }, []);
  const s = STAGES[i];
  return (
    <div className="w-full max-w-[15rem] mx-auto flex flex-col gap-2">
      <div
        className={`surface stage-card p-5 text-center flex flex-col items-center gap-1 ${s.accent ? "" : s.card}`}
        style={s.accent ? { background: "var(--accent)", color: "var(--accent-contrast)", borderColor: "var(--accent)" } : undefined}
      >
        <p className="text-xs" style={{ opacity: 0.8 }}>رقم تذكرتك</p>
        <p
          className={`text-5xl font-extrabold stage-num ${s.num}`}
          style={{ color: s.accent ? "var(--accent-contrast)" : "var(--accent)" }}
        >
          ٤٢
        </p>
      </div>
      <div className={`surface stage-card p-3 text-center text-sm font-bold ${s.accent ? s.card : s.card}`}>
        {s.msg}
      </div>
      {!s.accent && (
        <div className="surface p-2 flex items-center justify-between text-xs">
          <span className="muted">عدد الأشخاص قبلك</span>
          <span className="font-extrabold">{s.ahead}</span>
        </div>
      )}
    </div>
  );
}

// ===== مقطع متحرك ٢: تقدّم الطابور عند خدمة الموظف =====
export function QueueDemo() {
  const [st, setSt] = useState({ serving: 42, queue: [43, 44, 45, 46], next: 47 });
  useEffect(() => {
    const id = setInterval(() => {
      setSt((s) =>
        // يدور ضمن نطاق واقعي بدل أن تكبر الأرقام بلا حدّ
        s.next > 55
          ? { serving: 42, queue: [43, 44, 45, 46], next: 47 }
          : { serving: s.queue[0], queue: [...s.queue.slice(1), s.next], next: s.next + 1 }
      );
    }, 2200);
    return () => clearInterval(id);
  }, []);
  const { serving, queue } = st;

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-3">
      <div
        className="surface p-5 text-center"
        style={{ background: "var(--accent)", color: "var(--accent-contrast)", borderColor: "var(--accent)" }}
      >
        <p className="text-xs" style={{ opacity: 0.85 }}>الآن يُخدَم</p>
        <p key={serving} className="text-5xl font-extrabold demo-pop">{serving}</p>
      </div>
      <p className="muted text-xs text-center">القادمون</p>
      <div className="flex justify-center gap-2 flex-wrap">
        {queue.map((n, idx) => (
          <div
            key={n}
            className="surface px-4 py-2 font-extrabold text-lg"
            style={{ opacity: idx === 0 ? 1 : 0.6 - idx * 0.1 }}
          >
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== مقطع متحرك ٣: تدفّق الحجز (مسح → رقم → تنبيه) =====
const FLOW = [
  { icon: "📱", label: "يمسح الرمز أو يفتح الرابط" },
  { icon: "🎫", label: "يأخذ رقمه في الطابور" },
  { icon: "🔔", label: "يُنبَّه عند اقتراب دوره" },
];

export function FlowDemo() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((x) => (x + 1) % FLOW.length), 1600);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-stretch justify-center gap-2">
      {FLOW.map((f, i) => (
        <div
          key={i}
          className="surface flex-1 max-w-[8rem] p-3 text-center flex flex-col items-center gap-2 transition-all"
          style={
            active === i
              ? { borderColor: "var(--accent)", transform: "translateY(-4px)", boxShadow: "0 12px 24px -14px var(--accent)" }
              : { opacity: 0.55 }
          }
        >
          <span className="text-3xl">{f.icon}</span>
          <span className="text-xs font-bold leading-tight">{f.label}</span>
        </div>
      ))}
    </div>
  );
}
