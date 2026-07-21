import type { Hero, HeroFormInput } from "@/types/hero";

const parseJson = async <T>(response: Response) => {
  const data = (await response.json()) as T & { message?: string };

  if (!response.ok) {
    throw new Error(data.message ?? "เกิดข้อผิดพลาด");
  }

  return data;
};

export const fetchHeroes = async () => {
  const data = await parseJson<{ heroes: Hero[] }>(await fetch("/api/heroes"));
  return data.heroes;
};

export const createHeroWithApi = async (input: HeroFormInput) => {
  const data = await parseJson<{ heroes: Hero[] }>(
    await fetch("/api/heroes", {
      body: JSON.stringify(input),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }),
  );

  return data.heroes;
};
