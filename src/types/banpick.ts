export type DraftSide = "blue" | "red";

export type DraftSlotKind = "pick" | "ban";

export type DraftPhase = "waiting" | "ban" | "pick" | "complete";

export type DraftSlot = {
  id: string;
  order: number;
  heroName?: string;
  role?: string;
  imageUrl?: string;
  isActive?: boolean;
};

export type DraftTeam = {
  side: DraftSide;
  name: string;
  score: number;
  picks: DraftSlot[];
  bans: DraftSlot[];
};

export type DraftHero = {
  id: string;
  imageLandscapeUrl?: string;
  imageSquareUrl?: string;
  name: string;
  role: string;
  priority: "ban" | "pick" | "flex";
};

export type DraftState = {
  phase: DraftPhase;
  phaseLabel: string;
  matchTitle: string;
  blueTeam: DraftTeam;
  redTeam: DraftTeam;
  heroPool: DraftHero[];
};
