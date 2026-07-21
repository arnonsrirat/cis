import { randomUUID } from "crypto";
import type { RowDataPacket } from "mysql2";
import type { Hero, HeroFormInput } from "@/types/hero";
import { getMysqlPool } from "@/lib/database/mysql";

type HeroRow = RowDataPacket & {
  id: string;
  name: string;
  role: string;
  priority: Hero["priority"];
  image_landscape_url: string;
  image_square_url: string;
  created_at: Date;
};

const mapHero = (row: HeroRow): Hero => ({
  id: row.id,
  name: row.name,
  role: row.role,
  priority: row.priority,
  imageLandscapeUrl: row.image_landscape_url,
  imageSquareUrl: row.image_square_url,
  createdAt: row.created_at.toISOString(),
});

export const listHeroesFromDb = async () => {
  const [rows] = await getMysqlPool().query<HeroRow[]>(
    `SELECT
      id,
      name,
      role,
      priority,
      image_landscape_url,
      image_square_url,
      created_at
    FROM heroes
    ORDER BY name ASC`,
  );

  return rows.map(mapHero);
};

export const createHeroInDb = async (input: HeroFormInput) => {
  const id = randomUUID();

  await getMysqlPool().execute(
    `INSERT INTO heroes (
      id,
      name,
      role,
      priority,
      image_landscape_url,
      image_square_url
    ) VALUES (
      :id,
      :name,
      :role,
      :priority,
      :imageLandscapeUrl,
      :imageSquareUrl
    )`,
    {
      id,
      name: input.name.trim(),
      role: input.role.trim(),
      priority: input.priority,
      imageLandscapeUrl: input.imageLandscapeUrl.trim(),
      imageSquareUrl: input.imageSquareUrl.trim(),
    },
  );

  return id;
};
