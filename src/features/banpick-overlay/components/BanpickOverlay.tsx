import type { DraftState } from "@/types/banpick";
import { CenterVersusPanel } from "./CenterVersusPanel";
import { TeamOverlayPanel } from "./TeamOverlayPanel";

type BanpickOverlayProps = {
  fullScreen?: boolean;
  draft: DraftState;
  layout?: "full" | "bottom";
};

export function BanpickOverlay({
  draft,
  fullScreen = false,
  layout = "full",
}: BanpickOverlayProps) {
  const isFull = layout === "full";

  return (
    <div
      className={[
        "relative overflow-hidden font-rajdhani select-none",
        fullScreen
          ? "h-screen w-screen"
          : "aspect-video min-h-[460px] w-full rounded-lg border border-white/10 shadow-2xl",
        isFull
          ? "bg-[#02050a] bg-cyber-grid bg-honeycomb text-white"
          : "bg-transparent text-white",
      ].join(" ")}
    >
      {/* Background glowing gradients for Full Layout */}
      {isFull ? (
        <>
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-5 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 -z-5 h-[500px] w-[500px] rounded-full bg-red-500/10 blur-[150px] pointer-events-none" />
          
          <div className="h-full w-full p-4 lg:p-6 grid gap-4 grid-cols-[1.5fr_1fr_1.5fr] items-stretch">
            <TeamOverlayPanel team={draft.blueTeam} layout="full" />
            <CenterVersusPanel matchTitle={draft.matchTitle} phaseLabel={draft.phaseLabel} layout="full" />
            <TeamOverlayPanel team={draft.redTeam} layout="full" />
          </div>
        </>
      ) : (
        /* Bottom HUD layout (Stream overlay) */
        <>
          {!fullScreen ? (
            <div className="absolute inset-0 bg-black/10 border border-white/5 pointer-events-none" />
          ) : null}
          <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
            <div className="grid items-end gap-3 lg:grid-cols-[1fr_160px_1fr]">
              <TeamOverlayPanel team={draft.blueTeam} layout="bottom" />
              <CenterVersusPanel matchTitle={draft.matchTitle} phaseLabel={draft.phaseLabel} layout="bottom" />
              <TeamOverlayPanel team={draft.redTeam} layout="bottom" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

