import { randomUUID } from "crypto";
import type { RowDataPacket } from "mysql2";
import type { AdClip, AdPlaybackState, AdScreenState } from "@/types/advertising";
import { getMysqlPool } from "@/lib/database/mysql";

type AdClipRow = RowDataPacket & {
  id: string;
  title: string;
  file_name: string;
  file_url: string;
  mime_type: string;
  size_bytes: number;
  duration_seconds: number | null;
  created_at: Date;
};

type AdPlaybackRow = RowDataPacket & {
  id: "main";
  active_clip_id: string | null;
  is_playing: 0 | 1;
  is_muted: 0 | 1;
  is_looping: 0 | 1;
  volume: number;
  updated_at: Date;
};

const mapClip = (row: AdClipRow): AdClip => ({
  id: row.id,
  title: row.title,
  fileName: row.file_name,
  fileUrl: row.file_url,
  mimeType: row.mime_type,
  sizeBytes: Number(row.size_bytes),
  durationSeconds: row.duration_seconds ?? undefined,
  createdAt: row.created_at.toISOString(),
});

const mapPlayback = (row: AdPlaybackRow): AdPlaybackState => ({
  id: "main",
  activeClipId: row.active_clip_id ?? undefined,
  isPlaying: Boolean(row.is_playing),
  isMuted: Boolean(row.is_muted),
  isLooping: Boolean(row.is_looping),
  volume: Number(row.volume),
  updatedAt: row.updated_at.toISOString(),
});

export const listAdClipsFromDb = async () => {
  const [rows] = await getMysqlPool().query<AdClipRow[]>(
    `SELECT
      id,
      title,
      file_name,
      file_url,
      mime_type,
      size_bytes,
      duration_seconds,
      created_at
    FROM ad_clips
    ORDER BY created_at DESC`,
  );

  return rows.map(mapClip);
};

export const createAdClipInDb = async ({
  fileName,
  fileUrl,
  mimeType,
  sizeBytes,
  title,
}: {
  fileName: string;
  fileUrl: string;
  mimeType: string;
  sizeBytes: number;
  title: string;
}) => {
  const id = randomUUID();

  await getMysqlPool().execute(
    `INSERT INTO ad_clips (
      id,
      title,
      file_name,
      file_url,
      mime_type,
      size_bytes
    ) VALUES (
      :id,
      :title,
      :fileName,
      :fileUrl,
      :mimeType,
      :sizeBytes
    )`,
    {
      fileName,
      fileUrl,
      id,
      mimeType,
      sizeBytes,
      title: title.trim() || fileName,
    },
  );

  return id;
};

export const ensurePlaybackState = async () => {
  await getMysqlPool().execute(
    `INSERT IGNORE INTO ad_playback_state (
      id,
      active_clip_id,
      is_playing,
      is_muted,
      is_looping,
      volume
    ) VALUES (
      'main',
      NULL,
      FALSE,
      TRUE,
      TRUE,
      100
    )`,
  );
};

export const getPlaybackStateFromDb = async () => {
  await ensurePlaybackState();

  const [rows] = await getMysqlPool().query<AdPlaybackRow[]>(
    `SELECT
      id,
      active_clip_id,
      is_playing,
      is_muted,
      is_looping,
      volume,
      updated_at
    FROM ad_playback_state
    WHERE id = 'main'
    LIMIT 1`,
  );

  return mapPlayback(rows[0]);
};

export const updatePlaybackStateInDb = async (
  patch: Partial<Omit<AdPlaybackState, "id" | "updatedAt">>,
) => {
  await ensurePlaybackState();

  const current = await getPlaybackStateFromDb();

  await getMysqlPool().execute(
    `UPDATE ad_playback_state SET
      active_clip_id = :activeClipId,
      is_playing = :isPlaying,
      is_muted = :isMuted,
      is_looping = :isLooping,
      volume = :volume
    WHERE id = 'main'`,
    {
      activeClipId: patch.activeClipId ?? current.activeClipId ?? null,
      isLooping: patch.isLooping ?? current.isLooping,
      isMuted: patch.isMuted ?? current.isMuted,
      isPlaying: patch.isPlaying ?? current.isPlaying,
      volume: patch.volume ?? current.volume,
    },
  );

  return getPlaybackStateFromDb();
};

export const getAdScreenStateFromDb = async (): Promise<AdScreenState> => {
  const [clips, playback] = await Promise.all([
    listAdClipsFromDb(),
    getPlaybackStateFromDb(),
  ]);

  return {
    activeClip: clips.find((clip) => clip.id === playback.activeClipId),
    clips,
    playback,
  };
};
