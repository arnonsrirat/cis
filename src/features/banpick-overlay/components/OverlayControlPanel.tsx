"use client";

/* eslint-disable @next/next/no-img-element */
import type { DraftHero, DraftSide, DraftSlotKind } from "@/types/banpick";

type OverlayControlPanelProps = {
  activeKind: DraftSlotKind;
  activeSide: DraftSide;
  heroes: DraftHero[];
  onApplyHero: (hero: DraftHero) => void;
  onKindChange: (kind: DraftSlotKind) => void;
  onReset: () => void;
  onSideChange: (side: DraftSide) => void;
};

export function OverlayControlPanel({
  activeKind,
  activeSide,
  heroes,
  onApplyHero,
  onKindChange,
  onReset,
  onSideChange,
}: OverlayControlPanelProps) {
  return (
    <aside className="rounded-lg border border-[#d8dbc9] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">ควบคุม Overlay</h2>
          <p className="mt-1 text-sm text-[#69705a]">
            เลือกฝั่ง เลือก Pick/Ban แล้วกดตัวละครเพื่อใส่ลงช่องแรกที่ว่าง
          </p>
        </div>
        <button
          className="h-9 rounded-md border border-[#c95648] px-3 text-sm font-semibold text-[#9b2f21] hover:bg-[#f6e6dc]"
          onClick={onReset}
          type="button"
        >
          รีเซ็ต
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <SegmentedControl<DraftSide>
          label="ทีมที่กำลังเลือก"
          onChange={onSideChange}
          options={[
            { label: "ทีมฟ้า", value: "blue" },
            { label: "ทีมแดง", value: "red" },
          ]}
          value={activeSide}
        />
        <SegmentedControl<DraftSlotKind>
          label="การกระทำ"
          onChange={onKindChange}
          options={[
            { label: "เลือก", value: "pick" },
            { label: "แบน", value: "ban" },
          ]}
          value={activeKind}
        />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {heroes.map((hero) => (
          <button
            className="grid grid-cols-[52px_1fr_auto] items-center gap-3 rounded-md border border-[#d8dbc9] bg-[#fbfcf5] p-2 text-left transition hover:border-[#1f3324] hover:bg-[#f2f4e9]"
            key={hero.id}
            onClick={() => onApplyHero(hero)}
            type="button"
          >
            {hero.imageSquareUrl ? (
              <img
                alt={hero.name}
                className="size-12 rounded-md object-cover"
                src={hero.imageSquareUrl}
              />
            ) : (
              <span className="flex size-12 items-center justify-center rounded-md bg-[#edf3df] text-sm font-bold">
                {hero.name.slice(0, 1)}
              </span>
            )}
            <span>
              <span className="block text-sm font-bold">{hero.name}</span>
              <span className="mt-1 block text-xs text-[#69705a]">{hero.role}</span>
            </span>
            <span className="rounded-md bg-[#e7f0ce] px-2 py-1 text-xs font-bold text-[#34520f]">
              {hero.priority}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function SegmentedControl<TValue extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: TValue) => void;
  options: { label: string; value: TValue }[];
  value: TValue;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#747a68]">
        {label}
      </p>
      <div className="grid grid-cols-2 rounded-md border border-[#d8dbc9] bg-[#f6f7f2] p-1">
        {options.map((option) => (
          <button
            className={`h-9 rounded text-sm font-bold transition ${
              option.value === value ? "bg-[#1f3324] text-white" : "text-[#42483a]"
            }`}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
