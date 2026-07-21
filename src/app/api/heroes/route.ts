import { NextResponse } from "next/server";
import { createHeroInDb, listHeroesFromDb } from "@/features/heroes/lib/heroRepository";
import type { HeroFormInput } from "@/types/hero";

export async function GET() {
  return NextResponse.json({ heroes: await listHeroesFromDb() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<HeroFormInput>;

  if (
    !body.name?.trim() ||
    !body.role?.trim() ||
    !body.priority ||
    !body.imageLandscapeUrl?.trim() ||
    !body.imageSquareUrl?.trim()
  ) {
    return NextResponse.json({ message: "กรุณากรอกข้อมูลตัวละครให้ครบ" }, { status: 400 });
  }

  await createHeroInDb(body as HeroFormInput);

  return NextResponse.json({ heroes: await listHeroesFromDb() }, { status: 201 });
}
