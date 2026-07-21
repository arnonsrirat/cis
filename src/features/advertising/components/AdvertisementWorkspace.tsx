"use client";

import { FormEvent, useEffect, useState } from "react";
import type { AdScreenState } from "@/types/advertising";
import type { UserAccount } from "@/types/auth";
import {
  fetchAdScreenState,
  updateAdPlayback,
  uploadAdClip,
} from "../lib/adApi";

type AdvertisementWorkspaceProps = {
  currentUser: UserAccount;
  onBackToMenu: () => void;
  onLogout: () => void;
};

export function AdvertisementWorkspace({
  currentUser,
  onBackToMenu,
  onLogout,
}: AdvertisementWorkspaceProps) {
  const [state, setState] = useState<AdScreenState | null>(null);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = () => {
      fetchAdScreenState()
        .then((nextState) => {
          if (isMounted) {
            setState(nextState);
          }
        })
        .catch(() => {
          if (isMounted) {
            setMessage("ยังโหลดข้อมูลโฆษณาไม่ได้ กรุณาตรวจสอบฐานข้อมูล");
          }
        });
    };

    load();
    const interval = window.setInterval(load, 1500);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setMessage("กรุณาเลือกไฟล์วิดีโอ");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      const clips = await uploadAdClip(formData);
      setState((current) =>
        current
          ? {
              ...current,
              clips,
            }
          : current,
      );
      setFile(null);
      setTitle("");
      setMessage("อัปโหลดคลิปเรียบร้อยแล้ว");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "อัปโหลดไม่สำเร็จ");
    }
  };

  const updatePlayback = async (
    patch: Parameters<typeof updateAdPlayback>[0],
  ) => {
    try {
      setState(await updateAdPlayback(patch));
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "ควบคุมการเล่นไม่สำเร็จ");
    }
  };

  const playback = state?.playback;

  return (
    <main className="min-h-screen bg-[#f6f7f2] text-[#171812]">
      <section className="border-b border-[#d8dbc9] bg-[#fdfdf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-6 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#69705a]">
                ระบบแสดงโฆษณาขึ้นจอ
              </p>
              <h1 className="mt-2 text-4xl font-bold">ควบคุมวิดีโอโฆษณา</h1>
              <p className="mt-2 text-sm text-[#69705a]">
                ผู้ควบคุม: {currentUser.displayName}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="h-10 rounded-md border border-[#cdd2bd] bg-white px-4 text-sm font-semibold hover:bg-[#f6f7f2]"
                onClick={onBackToMenu}
                type="button"
              >
                กลับหน้าเมนู
              </button>
              <button
                className="h-10 rounded-md border border-[#cdd2bd] bg-white px-4 text-sm font-semibold hover:bg-[#f6f7f2]"
                onClick={onLogout}
                type="button"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-6 sm:px-8 xl:grid-cols-[360px_1fr] xl:px-10">
        <aside className="space-y-5">
          <section className="rounded-lg border border-[#d8dbc9] bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold">อัปโหลดคลิป</h2>
            <p className="mt-1 text-sm text-[#69705a]">
              แนะนำไฟล์ MP4 ขนาด 1920x1080 เพื่อแสดงเต็มจอใน OBS
            </p>
            <form className="mt-4 space-y-3" onSubmit={handleUpload}>
              <label className="block">
                <span className="text-sm font-semibold text-[#42483a]">ชื่อคลิป</span>
                <input
                  className="mt-2 h-11 w-full rounded-md border border-[#cdd2bd] px-3 text-sm outline-none focus:border-[#1f3324]"
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="เช่น โฆษณารอบพักเบรก"
                  type="text"
                  value={title}
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-[#42483a]">ไฟล์วิดีโอ</span>
                <input
                  accept="video/*"
                  className="mt-2 w-full rounded-md border border-[#cdd2bd] bg-white px-3 py-2 text-sm"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                  type="file"
                />
              </label>
              <button
                className="h-11 w-full rounded-md bg-[#1f3324] px-4 font-semibold text-white hover:bg-[#2f4b36]"
                type="submit"
              >
                อัปโหลดเข้าคลัง
              </button>
            </form>
          </section>

          <section className="rounded-lg border border-[#d8dbc9] bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold">ควบคุมการเล่น</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                className="h-10 rounded-md bg-[#1f3324] px-3 text-sm font-semibold text-white hover:bg-[#2f4b36]"
                onClick={() => updatePlayback({ isPlaying: true })}
                type="button"
              >
                เล่น
              </button>
              <button
                className="h-10 rounded-md border border-[#c95648] px-3 text-sm font-semibold text-[#9b2f21] hover:bg-[#f6e6dc]"
                onClick={() => updatePlayback({ isPlaying: false })}
                type="button"
              >
                หยุด
              </button>
              <button
                className="h-10 rounded-md border border-[#cdd2bd] px-3 text-sm font-semibold hover:bg-[#f6f7f2]"
                onClick={() => updatePlayback({ isMuted: !playback?.isMuted })}
                type="button"
              >
                {playback?.isMuted ? "เปิดเสียง" : "ปิดเสียง"}
              </button>
              <button
                className="h-10 rounded-md border border-[#cdd2bd] px-3 text-sm font-semibold hover:bg-[#f6f7f2]"
                onClick={() => updatePlayback({ isLooping: !playback?.isLooping })}
                type="button"
              >
                {playback?.isLooping ? "ปิดวนซ้ำ" : "เปิดวนซ้ำ"}
              </button>
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-semibold text-[#42483a]">
                ระดับเสียง {playback?.volume ?? 100}%
              </span>
              <input
                className="mt-2 w-full accent-[#1f3324]"
                max="100"
                min="0"
                onChange={(event) =>
                  updatePlayback({ volume: Number(event.target.value) })
                }
                type="range"
                value={playback?.volume ?? 100}
              />
            </label>
            <a
              className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-md bg-[#1f3324] px-4 text-sm font-semibold text-white hover:bg-[#2f4b36]"
              href="/ads-screen"
              target="_blank"
            >
              เปิดหน้าวิดีโอสำหรับ OBS
            </a>
          </section>
        </aside>

        <section className="rounded-lg border border-[#d8dbc9] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">คลังคลิปโฆษณา</h2>
              <p className="mt-1 text-sm text-[#69705a]">
                เลือกคลิปที่ต้องการส่งขึ้นหน้าจอ OBS แบบเรียลไทม์
              </p>
            </div>
            <div className="rounded-md bg-[#edf3df] px-3 py-2 text-sm font-semibold text-[#34520f]">
              กำลังเลือก: {state?.activeClip?.title ?? "ยังไม่ได้เลือกคลิป"}
            </div>
          </div>

          {message ? (
            <div className="mt-3 rounded-md border border-[#d8dbc9] bg-[#fbfcf5] px-3 py-2 text-sm text-[#42483a]">
              {message}
            </div>
          ) : null}

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {state?.clips.map((clip) => (
              <article
                className="rounded-lg border border-[#d8dbc9] bg-[#fbfcf5] p-3"
                key={clip.id}
              >
                <video
                  className="aspect-video w-full rounded-md bg-black object-cover"
                  muted
                  src={clip.fileUrl}
                />
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{clip.title}</h3>
                    <p className="mt-1 text-sm text-[#69705a]">
                      {(clip.sizeBytes / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    className="h-9 rounded-md bg-[#1f3324] px-3 text-sm font-semibold text-white hover:bg-[#2f4b36]"
                    onClick={() =>
                      updatePlayback({
                        activeClipId: clip.id,
                        isPlaying: true,
                      })
                    }
                    type="button"
                  >
                    ส่งขึ้นจอ
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
