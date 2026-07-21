import type { AdClip, AdPlaybackState, AdScreenState } from "@/types/advertising";

const parseJson = async <T>(response: Response) => {
  const data = (await response.json()) as T & { message?: string };

  if (!response.ok) {
    throw new Error(data.message ?? "เกิดข้อผิดพลาด");
  }

  return data;
};

export const fetchAdScreenState = async () =>
  parseJson<AdScreenState>(await fetch("/api/ads/state", { cache: "no-store" }));

export const uploadAdClip = async (formData: FormData) => {
  const data = await parseJson<{ clips: AdClip[] }>(
    await fetch("/api/ads/clips", {
      body: formData,
      method: "POST",
    }),
  );

  return data.clips;
};

export const updateAdPlayback = async (
  patch: Partial<Omit<AdPlaybackState, "id" | "updatedAt">>,
) =>
  parseJson<AdScreenState>(
    await fetch("/api/ads/state", {
      body: JSON.stringify(patch),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    }),
  );
