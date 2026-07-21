"use client";

import { useEffect, useMemo, useState } from "react";
import type { PermissionKey, UserAccount } from "@/types/auth";
import type { DraftHero, DraftSide, DraftSlotKind, DraftState } from "@/types/banpick";
import type { Hero } from "@/types/hero";
import { UserManagementPanel } from "@/features/auth/components/UserManagementPanel";
import { HeroManagementPanel } from "@/features/heroes/components/HeroManagementPanel";
import { fetchHeroes } from "@/features/heroes/lib/heroApi";
import { initialDraftState } from "../data/mockDraft";
import { applyHeroToDraft, resetDraftSlots } from "../lib/draftActions";
import { BanpickOverlay } from "./BanpickOverlay";
import { OverlayControlPanel } from "./OverlayControlPanel";

type DraftWorkspaceProps = {
  currentUser: UserAccount;
  onBackToMenu: () => void;
  onLogout: () => void;
  onUsersChange: (users: UserAccount[]) => void;
  permissions: Record<PermissionKey, boolean>;
  systemMessage?: string;
  users: UserAccount[];
};

const mapHeroToDraftHero = (hero: Hero): DraftHero => ({
  id: hero.id,
  imageLandscapeUrl: hero.imageLandscapeUrl,
  imageSquareUrl: hero.imageSquareUrl,
  name: hero.name,
  priority: hero.priority,
  role: hero.role,
});

export function DraftWorkspace({
  currentUser,
  onBackToMenu,
  onLogout,
  onUsersChange,
  permissions,
  systemMessage,
  users,
}: DraftWorkspaceProps) {
  const [draft, setDraft] = useState<DraftState>(initialDraftState);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [activeSide, setActiveSide] = useState<DraftSide>("blue");
  const [activeKind, setActiveKind] = useState<DraftSlotKind>("pick");
  const [previewLayout, setPreviewLayout] = useState<"full" | "bottom">("bottom");
  const draftHeroes = useMemo(
    () => (heroes.length > 0 ? heroes.map(mapHeroToDraftHero) : draft.heroPool),
    [draft.heroPool, heroes],
  );

  useEffect(() => {
    fetchHeroes()
      .then(setHeroes)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "banpick-draft-state",
      JSON.stringify({ ...draft, heroPool: draftHeroes }),
    );
  }, [draft, draftHeroes]);

  return (
    <main className="min-h-screen bg-[#f6f7f2] text-[#171812]">
      <section className="border-b border-[#d8dbc9] bg-[#fdfdf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-6 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#69705a]">
                ระบบควบคุมการถ่ายทอดสด
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-normal sm:text-5xl">
                Banpick Rov
              </h1>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <InfoBadge label="เฟสปัจจุบัน" value={draft.phaseLabel} />
              <InfoBadge
                label="ผู้ใช้งาน"
                value={`${currentUser.displayName} / ${currentUser.role}`}
              />
              <button
                className="h-11 rounded-md border border-[#cdd2bd] bg-white px-4 text-sm font-semibold hover:bg-[#f6f7f2]"
                onClick={onBackToMenu}
                type="button"
              >
                กลับหน้าเมนู
              </button>
              <button
                className="h-11 rounded-md border border-[#cdd2bd] bg-white px-4 text-sm font-semibold hover:bg-[#f6f7f2]"
                onClick={onLogout}
                type="button"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>

          {systemMessage ? (
            <div className="rounded-md border border-[#d8dbc9] bg-white px-4 py-3 text-sm text-[#8d2f1b]">
              {systemMessage}
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-6 sm:px-8 xl:grid-cols-[1fr_340px] xl:px-10">
        <div>
          <BanpickOverlay
            draft={{ ...draft, heroPool: draftHeroes }}
            fullScreen={false}
            layout={previewLayout}
          />
          <div className="mt-3 flex flex-col gap-3 rounded-lg border border-[#d8dbc9] bg-white px-4 py-3 text-sm text-[#535b4b] sm:flex-row sm:items-center sm:justify-between">
            <p>
              ใช้หน้าโอเวอร์เลย์เป็นแหล่งภาพในโปรแกรมถ่ายทอดสด ขนาด 1920x1080 และเปิดพื้นหลังแบบโปร่งใส
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                className={`h-9 rounded-md px-3 text-sm font-semibold ${
                  previewLayout === "bottom"
                    ? "bg-[#1f3324] text-white"
                    : "border border-[#cdd2bd] bg-white text-[#42483a]"
                }`}
                onClick={() => setPreviewLayout("bottom")}
                type="button"
              >
                แถบล่าง
              </button>
              <button
                className={`h-9 rounded-md px-3 text-sm font-semibold ${
                  previewLayout === "full"
                    ? "bg-[#1f3324] text-white"
                    : "border border-[#cdd2bd] bg-white text-[#42483a]"
                }`}
                onClick={() => setPreviewLayout("full")}
                type="button"
              >
                กระดานเต็ม
              </button>
              {permissions.viewOverlay ? (
                <a
                  className="inline-flex h-9 items-center justify-center rounded-md bg-[#1f3324] px-4 font-semibold text-white hover:bg-[#2f4b36]"
                  href={`/overlay?layout=${previewLayout}`}
                  target="_blank"
                >
                  เปิด Overlay
                </a>
              ) : (
                <span className="rounded-md border border-[#cdd2bd] px-3 py-2 text-sm font-semibold text-[#69705a]">
                  ไม่มีสิทธิ์เปิด Overlay
                </span>
              )}
            </div>
          </div>
        </div>

        {permissions.controlDraft ? (
          <OverlayControlPanel
            activeKind={activeKind}
            activeSide={activeSide}
            heroes={draftHeroes}
            onApplyHero={(hero) =>
              setDraft((currentDraft) =>
                applyHeroToDraft(currentDraft, activeSide, activeKind, hero),
              )
            }
            onKindChange={setActiveKind}
            onReset={() => setDraft((currentDraft) => resetDraftSlots(currentDraft))}
            onSideChange={setActiveSide}
          />
        ) : (
          <aside className="rounded-lg border border-[#d8dbc9] bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold">ควบคุม Overlay</h2>
            <p className="mt-2 text-sm text-[#69705a]">
              บัญชีนี้ยังไม่มีสิทธิ์ควบคุมการเลือกและแบน กรุณาให้ Master กำหนดสิทธิ์
            </p>
          </aside>
        )}
      </section>

      {permissions.manageHeroes ? (
        <section className="mx-auto w-full max-w-7xl px-5 pb-6 sm:px-8 xl:px-10">
          <HeroManagementPanel heroes={heroes} onHeroesChange={setHeroes} />
        </section>
      ) : null}

      {permissions.manageUsers ? (
        <section className="mx-auto w-full max-w-7xl px-5 pb-8 sm:px-8 xl:px-10">
          <UserManagementPanel
            currentUser={currentUser}
            onUsersChange={onUsersChange}
            users={users}
          />
        </section>
      ) : null}
    </main>
  );
}

function InfoBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#d8dbc9] bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#747a68]">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}
