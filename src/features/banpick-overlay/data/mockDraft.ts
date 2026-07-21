import type { DraftHero, DraftState, DraftTeam } from "@/types/banpick";

const createTeam = (
  side: DraftTeam["side"],
  name: string,
  activePickOrder: number,
  activeBanOrder: number,
): DraftTeam => ({
  side,
  name,
  score: 0,
  picks: Array.from({ length: 5 }, (_, index) => ({
    id: `${side}-pick-${index + 1}`,
    order: index + 1,
    isActive: index + 1 === activePickOrder,
  })),
  bans: Array.from({ length: 5 }, (_, index) => ({
    id: `${side}-ban-${index + 1}`,
    order: index + 1,
    isActive: index + 1 === activeBanOrder,
  })),
});

export const initialHeroPool: DraftHero[] = [
  { id: "florentino", name: "Florentino", role: "Dark Slayer", priority: "pick" },
  { id: "nakroth", name: "Nakroth", role: "Jungle", priority: "pick" },
  { id: "liliana", name: "Liliana", role: "Mid Lane", priority: "flex" },
  { id: "valhein", name: "Valhein", role: "Abyssal Dragon", priority: "flex" },
  { id: "zip", name: "Zip", role: "Support", priority: "ban" },
  { id: "aya", name: "Aya", role: "Support", priority: "ban" },
  { id: "elsu", name: "Elsu", role: "Abyssal Dragon", priority: "ban" },
  { id: "bijan", name: "Bijan", role: "Jungle", priority: "pick" },
];

export const initialDraftState: DraftState = {
  phase: "ban",
  phaseLabel: "ช่วงแบน 1",
  matchTitle: "ข้อมูลแมตช์",
  blueTeam: createTeam("blue", "ทีมฟ้า", 1, 1),
  redTeam: createTeam("red", "ทีมแดง", 1, 1),
  heroPool: initialHeroPool,
};
