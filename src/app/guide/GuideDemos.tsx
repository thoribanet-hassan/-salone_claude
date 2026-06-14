"use client";

import { useEffect, useState } from "react";

// التنسيق البصري لكل مرحلة حسب ترتيبها (النص يأتي مترجَماً من القاموس)
const STAGE_STYLE = [
  { card: "", num: "", accent: false },
  { card: "stage-approaching", num: "", accent: false },
  { card: "stage-ready", num: "stage-num-ready", accent: false },
  { card: "stage-next", num: "stage-num-next", accent: false },
  { card: "", num: "stage-num-next", accent: true },
];

// ===== مقطع ١: مراحل قرب الدور =====
export function StagesDemo({
  stages,
  ticketLabel,
  ticketNum,
  aheadLabel,
}: {
  stages: { ahead: string; msg: string }[];
  ticketLabel: string;
  ticketNum: string;
  aheadLabel: string;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % stages.length), 2300);
    return () => clearInterval(id);
  }, [stages.length]);
  const s = stages[i];
  const st = STAGE_STYLE[i] ?? STAGE_STYLE[0];
  return (
    <div className="w-full max-w-[15rem] mx-auto flex flex-col gap-2">
      <div
        className={`surface stage-card p-5 text-center flex flex-col items-center gap-1 ${st.accent ? "" : st.card}`}
        style={st.accent ? { background: "var(--accent)", color: "var(--accent-contrast)", borderColor: "var(--accent)" } : undefined}
      >
        <p className="text-xs" style={{ opacity: 0.8 }}>{ticketLabel}</p>
        <p
          className={`text-5xl font-extrabold stage-num ${st.num}`}
          style={{ color: st.accent ? "var(--accent-contrast)" : "var(--accent)" }}
        >
          {ticketNum}
        </p>
      </div>
      <div className={`surface stage-card p-3 text-center text-sm font-bold ${st.card}`}>{s.msg}</div>
      {!st.accent && (
        <div className="surface p-2 flex items-center justify-between text-xs">
          <span className="muted">{aheadLabel}</span>
          <span className="font-extrabold">{s.ahead}</span>
        </div>
      )}
    </div>
  );
}

// ===== مقطع ٢: تقدّم الطابور =====
export function QueueDemo({ nowServing, coming }: { nowServing: string; coming: string }) {
  const [st, setSt] = useState({ serving: 42, queue: [43, 44, 45, 46], next: 47 });
  useEffect(() => {
    const id = setInterval(() => {
      setSt((s) =>
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
      <div className="surface p-5 text-center" style={{ background: "var(--accent)", color: "var(--accent-contrast)", borderColor: "var(--accent)" }}>
        <p className="text-xs" style={{ opacity: 0.85 }}>{nowServing}</p>
        <p key={serving} className="text-5xl font-extrabold demo-pop">{serving}</p>
      </div>
      <p className="muted text-xs text-center">{coming}</p>
      <div className="flex justify-center gap-2 flex-wrap">
        {queue.map((n, idx) => (
          <div key={n} className="surface px-4 py-2 font-extrabold text-lg" style={{ opacity: idx === 0 ? 1 : 0.6 - idx * 0.1 }}>
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== مقطع ٣: تدفّق الحجز =====
export function FlowDemo({ items }: { items: { icon: string; label: string }[] }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((x) => (x + 1) % items.length), 1600);
    return () => clearInterval(id);
  }, [items.length]);
  return (
    <div className="flex items-stretch justify-center gap-2">
      {items.map((f, i) => (
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
