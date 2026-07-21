export type HeroPriority = "ban" | "pick" | "flex";

export type Hero = {
  id: string;
  name: string;
  role: string;
  priority: HeroPriority;
  imageLandscapeUrl: string;
  imageSquareUrl: string;
  createdAt: string;
};

export type HeroFormInput = {
  name: string;
  role: string;
  priority: HeroPriority;
  imageLandscapeUrl: string;
  imageSquareUrl: string;
};
