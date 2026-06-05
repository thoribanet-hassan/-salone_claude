// توليد نغمات تنبيه برمجياً عبر Web Audio (بدون ملفات صوت)

export interface BeepPattern {
  freq: number; // التردد (كلما زاد = نغمة أحدّ/أقرب)
  count: number; // عدد النبضات
  duration?: number; // مدة النبضة بالثواني
  gap?: number; // الفاصل بين النبضات
  volume?: number;
}

// تشغيل نمط نبضات متتالية
export function playPattern(ctx: AudioContext, p: BeepPattern): void {
  const duration = p.duration ?? 0.18;
  const gap = p.gap ?? 0.12;
  const volume = p.volume ?? 0.25;
  let t = ctx.currentTime;
  for (let i = 0; i < p.count; i++) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = p.freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(volume, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.02);
    t += duration + gap;
  }
}

// مستوى التنبيه حسب قرب الدور — تتصاعد النغمة كلما اقترب
// remainingMinutes = الوقت المتبقي، peopleAhead = عدد من قبله
export function reminderPatternFor(remainingMinutes: number, peopleAhead: number): BeepPattern {
  if (peopleAhead <= 1 || remainingMinutes <= 5) {
    // قريب جداً — نغمة عالية وثلاث نبضات
    return { freq: 1100, count: 3, volume: 0.32 };
  }
  if (remainingMinutes <= 15) {
    // متوسط — نغمة متوسطة ونبضتان
    return { freq: 820, count: 2, volume: 0.28 };
  }
  // بعيد — نغمة هادئة ونبضة واحدة
  return { freq: 600, count: 1, volume: 0.22 };
}

// نغمة تنبيه واضحة وقوية عند انطلاق العدّاد (الوضع اليدوي) — لتنبيه الزبون فوراً
export function playCountdownStartAlert(ctx: AudioContext): void {
  // ثلاث نبضات قوية صاعدة، مكرّرة مرتين — واضحة ولافتة
  const seq = [880, 1100, 1320, 880, 1100, 1320];
  let t = ctx.currentTime;
  for (const freq of seq) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "square"; // أوضح وأقوى من الجيبية
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.24);
    t += 0.2;
  }
}

// نغمة "حان دورك" — لحن صاعد مميّز يُشغَّل مرة واحدة عند بدء الخدمة
export function playTurnChime(ctx: AudioContext): void {
  const notes = [660, 880, 1175]; // لحن صاعد
  let t = ctx.currentTime;
  for (const freq of notes) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.35, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.34);
    t += 0.26;
  }
}
