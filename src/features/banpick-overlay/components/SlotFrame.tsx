/* eslint-disable @next/next/no-img-element */
import type { DraftSide, DraftSlot, DraftSlotKind } from "@/types/banpick";

type SlotFrameProps = {
  kind: DraftSlotKind;
  side: DraftSide;
  slot: DraftSlot;
  layout?: "full" | "bottom";
};

const sideStyles = {
  blue: {
    border: "border-sky-400/40",
    borderActive: "border-sky-400 shadow-glow-blue-active",
    text: "text-sky-300 text-glow-blue",
    textMuted: "text-sky-400/60",
    badge: "bg-blue-600 border-sky-400/50",
    scanClass: "bg-cyber-scan",
    emptyBg: "bg-sky-950/10",
  },
  red: {
    border: "border-red-500/30",
    borderActive: "border-red-500 shadow-glow-red-active",
    text: "text-red-400 text-glow-red",
    textMuted: "text-red-400/60",
    badge: "bg-red-600 border-red-500/50",
    scanClass: "bg-cyber-scan-red",
    emptyBg: "bg-red-950/10",
  },
};

export function SlotFrame({ kind, side, slot, layout = "full" }: SlotFrameProps) {
  const styles = sideStyles[side];
  const isBlue = side === "blue";
  const isFull = layout === "full";
  const isPick = kind === "pick";
  const isActive = slot.isActive;

  // Render Full Board Layout (First Image style)
  if (isFull) {
    if (isPick) {
      /* Pick slots: Large horizontal bars stacked vertically */
      return (
        <div className={`w-full flex items-stretch gap-2.5 h-16 lg:h-20 select-none`}>
          {/* Badge Number (Left slanted for blue, right slanted for red) */}
          {isBlue ? (
            <div
              className={`w-12 flex items-center justify-center text-white font-orbitron font-black text-xl border-y border-l ${styles.badge}`}
              style={{ clipPath: "polygon(0 0, 100% 0, 70% 100%, 0 100%)" }}
            >
              {slot.order}
            </div>
          ) : null}

          {/* Hero Information Card Box */}
          <div
            className={[
              "flex-1 relative overflow-hidden bg-[#070e17] border transition duration-300 flex flex-col justify-center px-4",
              isActive ? styles.borderActive : styles.border,
              isActive ? styles.scanClass : "",
              isBlue ? "rounded-r clip-cyber-panel-sm" : "rounded-l clip-cyber-panel-sm",
            ].join(" ")}
          >
            {/* Tech grid texture in card */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-40" />

            {slot.heroName ? (
              <div className="absolute inset-0">
                {slot.imageUrl ? (
                  <img
                    alt={slot.heroName}
                    className="h-full w-full object-cover opacity-80"
                    src={slot.imageUrl}
                  />
                ) : null}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent p-3">
                  <p className={`font-orbitron font-extrabold uppercase text-sm lg:text-base tracking-wider ${styles.text}`}>
                    {slot.heroName}
                  </p>
                  {slot.role ? (
                    <p className="text-[10px] lg:text-[11px] font-semibold text-white/50 tracking-wide font-rajdhani">
                      {slot.role.toUpperCase()}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-xs font-orbitron font-extrabold tracking-widest text-white/20">
                  {isActive ? "กำลังเลือก..." : "รอ..."}
                </span>
                <span className={`font-orbitron font-black text-xl ${isActive ? "text-white/40 animate-pulse" : "text-white/10"}`}>
                  ?
                </span>
              </div>
            )}

            {/* Glowing corner overlay indicator */}
            {isActive ? (
              <div className={`absolute top-0 right-0 w-1.5 h-1.5 ${isBlue ? "bg-sky-400" : "bg-red-500"}`} />
            ) : null}
          </div>

          {/* Badge Number (Right slanted for red) */}
          {!isBlue ? (
            <div
              className={`w-12 flex items-center justify-center text-white font-orbitron font-black text-xl border-y border-r ${styles.badge}`}
              style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)" }}
            >
              {slot.order}
            </div>
          ) : null}
        </div>
      );
    } else {
      /* Ban slots: Smaller vertical boxes next to Picks */
      return (
        <div
          className={[
            "relative size-12 lg:size-14 overflow-hidden border bg-[#050a10] transition duration-300 flex items-center justify-center clip-cyber-panel-sm",
            isActive ? styles.borderActive : styles.border,
            isActive ? styles.scanClass : "",
          ].join(" ")}
        >
          {slot.heroName ? (
            <div className="relative h-full w-full bg-red-950/20">
              {slot.imageUrl ? (
                <img
                  alt={slot.heroName}
                  className="absolute inset-0 h-full w-full object-cover opacity-80"
                  src={slot.imageUrl}
                />
              ) : null}
              <p className={`absolute inset-x-1 bottom-1 font-orbitron font-bold text-[8px] lg:text-[9px] uppercase tracking-tighter text-center leading-none ${styles.text}`}>
                {slot.heroName}
              </p>
              {/* Ban Diagonal Red Line */}
              <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-red-600/80 -translate-y-1/2 rotate-[35deg] pointer-events-none" />
              <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-red-600/80 -translate-y-1/2 -rotate-[35deg] pointer-events-none" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <span className={`text-[10px] font-orbitron font-extrabold ${isActive ? "text-white/40 animate-pulse" : "text-white/10"}`}>
                แบน
              </span>
              <span className="text-[9px] font-orbitron font-semibold text-white/15">
                {slot.order}
              </span>
            </div>
          )}
        </div>
      );
    }
  }

  // Render Stream Overlay Bottom Bar Layout (Second Image style)
  const sizeClass = isPick ? "h-20 w-16 lg:h-24 lg:w-20" : "h-14 w-11 lg:h-16 lg:w-13";

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <div
        className={[
          "relative overflow-hidden rounded border bg-[#070e17] transition duration-300",
          sizeClass,
          isActive ? styles.borderActive : styles.border,
          isActive ? styles.scanClass : "",
        ].join(" ")}
      >
        {/* Slot Content */}
        {slot.heroName ? (
          <div className="relative z-10 h-full">
            {slot.imageUrl ? (
              <img
                alt={slot.heroName}
                className="absolute inset-0 h-full w-full object-cover"
                src={slot.imageUrl}
              />
            ) : null}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent p-1.5">
              <p className={`text-[10px] lg:text-xs font-orbitron font-black uppercase leading-tight tracking-wider ${styles.text}`}>
                {slot.heroName}
              </p>
              {slot.role ? (
                <p className="text-[8px] font-rajdhani text-white/50 leading-none mt-0.5 uppercase">
                  {slot.role}
                </p>
              ) : null}
            </div>
            {!isPick ? (
              <div className="absolute inset-0 border border-red-500/20 bg-red-950/10 pointer-events-none" />
            ) : null}
          </div>
        ) : (
          <div className={`relative z-10 flex h-full flex-col items-center justify-center ${styles.emptyBg}`}>
            <span className={`text-base font-orbitron font-black ${isActive ? "text-white/40 animate-pulse" : "text-white/10"}`}>
              {isActive ? "..." : "?"}
            </span>
          </div>
        )}
      </div>

      {/* Number Badge at the bottom */}
      <span
        className={[
          "flex h-4.5 min-w-4.5 items-center justify-center rounded-[2px] border px-1 text-[8px] font-orbitron font-black text-white",
          styles.badge,
        ].join(" ")}
      >
        {slot.order}
      </span>
    </div>
  );
}
