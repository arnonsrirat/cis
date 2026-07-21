export type AdClip = {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  sizeBytes: number;
  durationSeconds?: number;
  createdAt: string;
};

export type AdPlaybackState = {
  id: "main";
  activeClipId?: string;
  isPlaying: boolean;
  isMuted: boolean;
  isLooping: boolean;
  volume: number;
  updatedAt: string;
};

export type AdScreenState = {
  activeClip?: AdClip;
  clips: AdClip[];
  playback: AdPlaybackState;
};
