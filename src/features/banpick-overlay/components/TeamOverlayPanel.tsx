import type { DraftTeam } from "@/types/banpick";
import { SlotFrame } from "./SlotFrame";

type TeamOverlayPanelProps = {
  team: DraftTeam;
  layout?: "full" | "bottom";
};

const panelStyles = {
  blue: {
    border: "border-sky-500/40 shadow-blue-500/5",
    glow: "shadow-glow-blue",
    line: "from-sky-400 via-sky-500 to-transparent",
    text: "text-sky-400",
    textLight: "text-sky-300",
    titleBg: "bg-gradient-to-r from-sky-950/80 to-blue-900/30 border-sky-400/50",
    headerClip: "clip-cyber-header-l",
  },
  red: {
    border: "border-red-500/40 shadow-red-500/5",
    glow: "shadow-glow-red",
    line: "from-transparent via-red-500 to-red-400",
    text: "text-red-400",
    textLight: "text-red-300",
    titleBg: "bg-gradient-to-l from-red-950/80 to-red-900/30 border-red-400/50",
    headerClip: "clip-cyber-header-r",
  },
};

export function TeamOverlayPanel({ team, layout = "full" }: TeamOverlayPanelProps) {
  const styles = panelStyles[team.side];
  const isBlue = team.side === "blue";
  const isFull = layout === "full";

  const picks = (
    <SlotGroup
      label="เลือก"
      side={team.side}
      slots={team.picks}
      variant="pick"
      layout={layout}
    />
  );

  const bans = (
    <SlotGroup
      label="แบน"
      side={team.side}
      slots={team.bans}
      variant="ban"
      layout={layout}
    />
  );

  if (isFull) {
    /* Full screen dashboard vertical layout */
    return (
      <section
        className={[
          "relative flex flex-col rounded-xl border bg-[#050b14]/75 p-5 backdrop-blur-md select-none",
          styles.border,
          styles.glow,
        ].join(" ")}
      >
        {/* Slanted border brackets for cyber design */}
        <div className={`absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r ${styles.line}`} />
        
        {/* Team Name Header slanted */}
        <div className="flex items-center mb-6 justify-between border-b border-white/5 pb-3">
          <div
            className={[
              "relative px-8 py-2 border text-xl font-orbitron font-black uppercase tracking-wider text-white",
              styles.titleBg,
              isBlue ? "clip-cyber-header-l" : "clip-cyber-header-r",
            ].join(" ")}
          >
            {team.name}
          </div>
          <div className="flex items-center gap-2 pr-2">
            <span className="text-[10px] font-orbitron font-bold text-white/40">ทีม</span>
            <span className={`h-2 w-2 rounded-full ${isBlue ? "bg-sky-400 shadow-[0_0_8px_#38bdf8]" : "bg-red-500 shadow-[0_0_8px_#ef4444]"}`} />
          </div>
        </div>

        {/* Layout: Picks on outer, Bans on inner */}
        <div className="grid gap-6 grid-cols-[1fr_auto] h-full items-start">
          {isBlue ? (
            <>
              {picks}
              {bans}
            </>
          ) : (
            <>
              {bans}
              {picks}
            </>
          )}
        </div>
      </section>
    );
  }

  /* Compact Horizontal overlay layout (bottom HUD) */
  return (
    <section
      className={`relative rounded-xl border bg-[#050b14]/85 p-3 backdrop-blur-sm ${styles.border} ${styles.glow}`}
    >
      <div className={`absolute inset-x-5 top-0 h-[1.5px] bg-gradient-to-r ${styles.line}`} />
      
      <div className="flex items-center justify-between mb-2">
        <div className={`inline-flex px-4 py-1.5 text-sm font-orbitron font-black uppercase tracking-wider border rounded bg-slate-900/60 border-white/10 text-white`}>
          {team.name}
        </div>
        <span className={`text-[10px] font-orbitron font-bold uppercase tracking-wider ${styles.text}`}>
          {team.side === "blue" ? "ฝั่งฟ้า" : "ฝั่งแดง"}
        </span>
      </div>

      <div className="grid gap-3 items-end lg:grid-cols-[1fr_auto]">
        {isBlue ? (
          <>
            {picks}
            {bans}
          </>
        ) : (
          <>
            {bans}
            {picks}
          </>
        )}
      </div>
    </section>
  );
}

function SlotGroup({
  label,
  side,
  slots,
  variant,
  layout,
}: {
  label: string;
  side: DraftTeam["side"];
  slots: DraftTeam["picks"];
  variant: "pick" | "ban";
  layout: "full" | "bottom";
}) {
  const isFull = layout === "full";
  const isBlue = side === "blue";

  return (
    <div className={isFull ? "w-full" : ""}>
      <p
        className={`mb-2 text-[10px] font-orbitron font-extrabold uppercase tracking-widest text-center ${
          isBlue ? "text-sky-400 text-glow-blue" : "text-red-400 text-glow-red"
        }`}
      >
        {label}
      </p>
      <div
        className={[
          "flex gap-2.5",
          isFull 
            ? variant === "pick" 
              ? "flex-col w-full" 
              : "flex-col items-center justify-start h-full pt-1"
            : "justify-center",
        ].join(" ")}
      >
        {slots.map((slot) => (
          <SlotFrame kind={variant} side={side} slot={slot} layout={layout} key={slot.id} />
        ))}
      </div>
    </div>
  );
}
