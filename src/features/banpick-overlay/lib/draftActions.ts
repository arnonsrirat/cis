import type { DraftHero, DraftSide, DraftSlotKind, DraftState, DraftTeam } from "@/types/banpick";

const getSlotsKey = (kind: DraftSlotKind) => (kind === "pick" ? "picks" : "bans");

const updateTeamSlot = (
  team: DraftTeam,
  kind: DraftSlotKind,
  hero: DraftHero,
): DraftTeam => {
  const slotsKey = getSlotsKey(kind);
  const targetIndex = team[slotsKey].findIndex((slot) => !slot.heroName);

  if (targetIndex === -1) {
    return team;
  }

  return {
    ...team,
    [slotsKey]: team[slotsKey].map((slot, index) => ({
      ...slot,
      heroName: index === targetIndex ? hero.name : slot.heroName,
      imageUrl: index === targetIndex ? hero.imageSquareUrl : slot.imageUrl,
      role: index === targetIndex ? hero.role : slot.role,
      isActive: index === targetIndex + 1,
    })),
  };
};

export const applyHeroToDraft = (
  draft: DraftState,
  side: DraftSide,
  kind: DraftSlotKind,
  hero: DraftHero,
): DraftState => {
  const teamKey = side === "blue" ? "blueTeam" : "redTeam";

  return {
    ...draft,
    phase: kind,
    phaseLabel: `${side === "blue" ? "ทีมฟ้า" : "ทีมแดง"} ${
      kind === "pick" ? "เลือกตัวละคร" : "แบนตัวละคร"
    }`,
    [teamKey]: updateTeamSlot(draft[teamKey], kind, hero),
  };
};

export const resetDraftSlots = (draft: DraftState): DraftState => ({
  ...draft,
  phase: "waiting",
  phaseLabel: "รอเริ่ม",
  blueTeam: {
    ...draft.blueTeam,
    picks: draft.blueTeam.picks.map((slot, index) => ({
      ...slot,
      heroName: undefined,
      imageUrl: undefined,
      role: undefined,
      isActive: index === 0,
    })),
    bans: draft.blueTeam.bans.map((slot, index) => ({
      ...slot,
      heroName: undefined,
      imageUrl: undefined,
      role: undefined,
      isActive: index === 0,
    })),
  },
  redTeam: {
    ...draft.redTeam,
    picks: draft.redTeam.picks.map((slot, index) => ({
      ...slot,
      heroName: undefined,
      imageUrl: undefined,
      role: undefined,
      isActive: index === 0,
    })),
    bans: draft.redTeam.bans.map((slot, index) => ({
      ...slot,
      heroName: undefined,
      imageUrl: undefined,
      role: undefined,
      isActive: index === 0,
    })),
  },
});
