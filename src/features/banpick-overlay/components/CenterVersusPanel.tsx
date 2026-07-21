type CenterVersusPanelProps = {
  matchTitle: string;
  phaseLabel: string;
  layout?: "full" | "bottom";
};

export function CenterVersusPanel({
  matchTitle,
  phaseLabel,
  layout = "full",
}: CenterVersusPanelProps) {
  const isFull = layout === "full";

  return (
    <section
      className={[
        "relative flex flex-col items-center justify-center select-none font-orbitron",
        isFull
          ? "h-full py-8 px-4 gap-6 min-w-[200px]"
          : "min-w-36 gap-2 px-2 pb-1 justify-end",
      ].join(" ")}
    >
      <div
        className={[
          "relative flex items-center justify-center border border-white/10 bg-[#050b14]/85 transition duration-500",
          isFull
            ? "size-32 shadow-[0_0_40px_rgba(255,255,255,0.12)] clip-cyber-vs"
            : "size-20 shadow-[0_0_20px_rgba(255,255,255,0.08)] [clip-path:polygon(18%_0,82%_0,100%_18%,100%_82%,82%_100%,18%_100%,0_82%,0_18%)]",
        ].join(" ")}
      >
        <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(0,188,255,0.22)_0%,transparent_50%,rgba(255,0,60,0.22)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(60deg,transparent_46%,rgba(255,255,255,0.25)_49%,rgba(255,255,255,0.25)_51%,transparent_54%)]" />

        <p
          className={[
            "relative font-black italic tracking-wide text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] leading-none select-none",
            isFull ? "text-6xl" : "text-3xl",
          ].join(" ")}
        >
          VS
        </p>
      </div>

      <div className="w-full relative p-[1px] bg-gradient-to-r from-blue-500/20 via-white/5 to-red-500/20 clip-cyber-panel-sm">
        <div className="bg-[#050b14]/90 px-3 py-2 text-center clip-cyber-panel-sm">
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">
            เฟส
          </p>
          <p className="mt-0.5 text-xs font-black uppercase text-blue-400 tracking-wider text-glow-blue">
            {phaseLabel}
          </p>
        </div>
      </div>

      <div className="w-full relative p-[1px] bg-gradient-to-r from-white/10 to-white/5 clip-cyber-panel-sm">
        <div className="bg-[#050b14]/90 px-3 py-2.5 text-center clip-cyber-panel-sm">
          <p className="text-[10px] font-black uppercase tracking-wider text-white/80">
            {matchTitle}
          </p>
        </div>
      </div>
    </section>
  );
}
