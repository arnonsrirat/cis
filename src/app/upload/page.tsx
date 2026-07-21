"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function UploadPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Load existing banner preview on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("invitation_banner");
      if (stored) {
        setPreviewUrl(stored);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "cis69") {
      setIsAuthenticated(true);
      setErrorMessage("");
    } else {
      setErrorMessage("รหัสผ่านไม่ถูกต้อง! กรุณาลองใหม่อีกครั้ง");
      setIsAuthenticated(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("กรุณาเลือกเฉพาะไฟล์รูปภาพ .png, .jpeg, .jpg เท่านั้น!");
      return;
    }

    setSelectedFile(file);

    // Create a local object URL for instant preview before compressing
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setIsSuccess(false);
  };

  const handleSave = () => {
    if (!selectedFile) {
      alert("กรุณาเลือกไฟล์รูปภาพก่อนทำการบันทึก!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Resize image to max 1920px dimensions if larger
        const maxDim = 1920;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress image to JPEG at 0.7 quality to stay under 5MB localStorage limit
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

        try {
          localStorage.setItem("invitation_banner", compressedBase64);
          setIsSuccess(true);
          alert("บันทึกการปรับปรุงรูปภาพการ์ดเรียบร้อยแล้ว!");
        } catch (e) {
          console.error(e);
          alert("ไม่สามารถบันทึกรูปภาพได้ เนื่องจากขนาดไฟล์ใหญ่เกินขีดจำกัดหน่วยความจำ");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleReset = () => {
    if (confirm("ต้องการคืนค่าภาพแบนเนอร์การ์ดกลับสู่ภาพเริ่มต้นใช่หรือไม่?")) {
      localStorage.removeItem("invitation_banner");
      setPreviewUrl(null);
      setSelectedFile(null);
      setIsSuccess(false);
      alert("คืนค่าภาพแบนเนอร์เริ่มต้นเรียบร้อยแล้ว!");
    }
  };

  return (
    <main className="invite-film flex flex-col justify-center items-center p-6 bg-slate-950 min-h-screen">
      <div className="film-grain" />
      <div className="matrix-grid" />
      <div className="scanlines-overlay" />

      {/* Cyber/Cinematic framing bars */}
      <div className="cinematic-letterbox top" style={{ transform: "translateY(0)" }} />
      <div className="cinematic-letterbox bottom" style={{ transform: "translateY(0)" }} />

      <div className="z-10 w-full max-w-md bg-slate-900/80 border border-cyan-500/20 rounded-xl p-8 backdrop-blur-xl shadow-2xl">
        <div className="text-center mb-6">
          <div className="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-1">
            System Administration
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
            CIS INVITATION CONSOLE
          </h1>
          <div className="h-0.5 w-16 bg-cyan-500 mx-auto mt-3" />
        </div>

        {!isAuthenticated ? (
          // Verification Passcode Form
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">
                Enter Console Passcode
              </label>
              <input
                type="password"
                required
                placeholder="••••••"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-slate-950 border border-cyan-500/30 rounded-lg py-3 px-4 text-center text-white tracking-widest focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
              />
            </div>

            {errorMessage && (
              <p className="text-rose-400 text-xs text-center font-mono">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-400/50 rounded-lg py-3 font-semibold font-mono text-sm tracking-wide transition active:scale-[0.98]"
            >
              ACCESS CONSOLE
            </button>
          </form>
        ) : (
          // File Upload Form
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">
                Upload Invitation Banner
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/60 bg-slate-950 rounded-lg cursor-pointer transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-3 text-cyan-400"
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 20 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-300">
                      <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG or JPEG (Max 1920x1080)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {previewUrl && (
              <div className="space-y-2">
                <span className="block text-xs font-mono text-gray-400 uppercase tracking-wider">
                  Banner Image Preview
                </span>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-cyan-500/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Banner Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                onClick={handleSave}
                disabled={!selectedFile}
                className={`w-full py-3 rounded-lg text-sm font-semibold tracking-wide transition active:scale-[0.98] ${
                  selectedFile
                    ? "bg-gradient-to-r from-cyan-500 to-lime-500 text-slate-950 font-bold hover:shadow-lg hover:shadow-cyan-500/20"
                    : "bg-slate-800 text-gray-500 border border-slate-700 cursor-not-allowed"
                }`}
              >
                บันทึกภาพแบนเนอร์ใหม่
              </button>

              <button
                onClick={handleReset}
                className="w-full bg-slate-950/80 hover:bg-slate-950 text-rose-400 border border-rose-500/30 rounded-lg py-2.5 font-semibold text-xs tracking-wide transition active:scale-[0.98]"
              >
                คืนค่าเริ่มต้น (RESET DEFAULT)
              </button>

              <div className="h-px bg-slate-800 my-4" />

              <Link href="/" className="block">
                <button className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded-lg py-2.5 font-semibold font-mono text-xs tracking-wide transition active:scale-[0.98]">
                  &lt; BACK TO INVITATION
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
