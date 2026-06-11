"use client";

import { useMemo, useState } from "react";

export interface ShopOption {
  id: string;
  name: string;
  facilityType: string; // male_barber | female_salon | restaurant | clinic | general
  facilityLabel: string; // النص الذي كتبه صاحب المنشأة
}

const TYPE_FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "male_barber", label: "حلاق رجالي" },
  { key: "female_salon", label: "صالون نسائي" },
  { key: "restaurant", label: "مطاعم وكافيهات" },
  { key: "clinic", label: "عيادات" },
  { key: "general", label: "أخرى" },
];

// قائمة منزلقة لاختيار المنشآت المستهدفة بإعلانٍ ما، مع فرز حسب نوع المنشأة
// بدون أي تحديد = يُبث الإعلان لكل المنشآت
export default function ShopPicker({
  shops,
  initialSelected,
}: {
  shops: ShopOption[];
  initialSelected: string[];
}) {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));

  const visible = useMemo(
    () => (filter === "all" ? shops : shops.filter((s) => s.facilityType === filter)),
    [shops, filter]
  );

  // الأنواع الموجودة فعلاً بين المنشآت المسجلة فقط
  const filters = useMemo(() => {
    const present = new Set(shops.map((s) => s.facilityType));
    return TYPE_FILTERS.filter((f) => f.key === "all" || present.has(f.key));
  }, [shops]);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const selectVisible = () =>
    setSelected((prev) => new Set([...prev, ...visible.map((s) => s.id)]));
  const clearVisible = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      for (const s of visible) next.delete(s.id);
      return next;
    });

  // منشآت محددة لكن مخفية بالفلتر الحالي — تُرسل كحقول خفية حتى لا يُفقد تحديدها
  const hiddenSelected = [...selected].filter((id) => !visible.some((s) => s.id === id));

  return (
    <div className="flex flex-col gap-2">
      {hiddenSelected.map((id) => (
        <input key={id} type="hidden" name="shopIds" value={id} />
      ))}
      <p className="text-xs font-bold">
        المنشآت المستهدفة{" "}
        <span className="muted font-normal">
          ({selected.size === 0 ? "بدون تحديد = كل المنشآت" : `${selected.size} محددة`})
        </span>
      </p>

      <div className="flex flex-wrap gap-1">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={filter === f.key ? "btn-accent px-3 py-1 text-xs" : "surface px-3 py-1 text-xs"}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="input-field p-2 max-h-44 overflow-y-auto flex flex-col gap-1">
        {visible.length === 0 && <p className="muted text-xs p-1">لا منشآت من هذا النوع</p>}
        {visible.map((s) => (
          <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              name="shopIds"
              value={s.id}
              checked={selected.has(s.id)}
              onChange={() => toggle(s.id)}
              className="w-4 h-4 shrink-0"
            />
            <span className="truncate">
              {s.name} <span className="muted text-xs">— {s.facilityLabel}</span>
            </span>
          </label>
        ))}
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={selectVisible} className="surface px-3 py-1 text-xs font-bold">
          تحديد المعروض
        </button>
        <button type="button" onClick={clearVisible} className="surface px-3 py-1 text-xs font-bold">
          إلغاء تحديد المعروض
        </button>
      </div>
    </div>
  );
}
