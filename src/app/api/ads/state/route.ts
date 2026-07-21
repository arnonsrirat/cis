import { NextResponse } from "next/server";
import {
  getAdScreenStateFromDb,
  updatePlaybackStateInDb,
} from "@/features/advertising/lib/adRepository";
import type { AdPlaybackState } from "@/types/advertising";

export async function GET() {
  return NextResponse.json(await getAdScreenStateFromDb());
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as Partial<
    Omit<AdPlaybackState, "id" | "updatedAt">
  >;

  await updatePlaybackStateInDb({
    activeClipId: body.activeClipId,
    isLooping: body.isLooping,
    isMuted: body.isMuted,
    isPlaying: body.isPlaying,
    volume: body.volume,
  });

  return NextResponse.json(await getAdScreenStateFromDb());
}
