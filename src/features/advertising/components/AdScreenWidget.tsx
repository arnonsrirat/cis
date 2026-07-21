"use client";

import { useEffect, useRef, useState } from "react";
import type { AdScreenState } from "@/types/advertising";
import { fetchAdScreenState } from "../lib/adApi";

export function AdScreenWidget() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [state, setState] = useState<AdScreenState | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = () => {
      fetchAdScreenState()
        .then((nextState) => {
          if (isMounted) {
            setState(nextState);
          }
        })
        .catch(() => undefined);
    };

    load();
    const interval = window.setInterval(load, 1000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !state) {
      return;
    }

    video.muted = state.playback.isMuted;
    video.loop = state.playback.isLooping;
    video.volume = Math.min(Math.max(state.playback.volume / 100, 0), 1);

    if (state.playback.isPlaying) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [state]);

  if (!state?.activeClip) {
    return <main className="min-h-screen bg-transparent" />;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-transparent">
      <video
        className="h-screen w-screen bg-black object-cover"
        key={state.activeClip.id}
        loop={state.playback.isLooping}
        muted={state.playback.isMuted}
        playsInline
        ref={videoRef}
        src={state.activeClip.fileUrl}
      />
    </main>
  );
}
