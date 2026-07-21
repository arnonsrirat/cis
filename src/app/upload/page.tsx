"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";

export default function UploadPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem("invitation_banner");
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (passcode === "cis69") {
      setErrorMessage("");
      setIsAuthenticated(true);
      return;
    }

    setErrorMessage("รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
    setIsAuthenticated(false);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      alert("กรุณาเลือกเฉพาะไฟล์รูปภาพ .png, .jpeg, .jpg เท่านั้น");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (!selectedFile) {
      alert("กรุณาเลือกไฟล์รูปภาพก่อนบันทึก");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 1920;
        let width = image.width;
        let height = image.height;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);

        try {
          localStorage.setItem("invitation_banner", canvas.toDataURL("image/jpeg", 0.7));
          alert("บันทึกรูปภาพเรียบร้อยแล้ว");
        } catch {
          alert("ไม่สามารถบันทึกรูปภาพได้ เนื่องจากไฟล์ใหญ่เกินไป");
        }
      };

      image.src = String(event.target?.result ?? "");
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleReset = () => {
    if (!confirm("ต้องการคืนค่ารูปภาพกลับเป็นค่าเริ่มต้นใช่หรือไม่?")) {
      return;
    }

    localStorage.removeItem("invitation_banner");
    setPreviewUrl(null);
    setSelectedFile(null);
    alert("คืนค่าเรียบร้อยแล้ว");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <section className="w-full max-w-md rounded-xl border border-cyan-500/20 bg-slate-900/80 p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-cyan-400">
            จัดการรูปภาพ
          </p>
          <h1 className="text-2xl font-bold">อัปโหลดรูปภาพ Invitation</h1>
        </div>

        {!isAuthenticated ? (
          <form className="space-y-4" onSubmit={handleLogin}>
            <label className="block">
              <span className="text-sm text-slate-300">รหัสผ่าน</span>
              <input
                className="mt-2 w-full rounded-lg border border-cyan-500/30 bg-slate-950 px-4 py-3 text-center text-white outline-none focus:border-cyan-400"
                onChange={(event) => setPasscode(event.target.value)}
                placeholder="กรอกรหัสผ่าน"
                required
                type="password"
                value={passcode}
              />
            </label>

            {errorMessage ? (
              <p className="text-center text-sm text-rose-400">{errorMessage}</p>
            ) : null}

            <button
              className="w-full rounded-lg border border-cyan-400/50 bg-cyan-500/10 py-3 font-semibold text-cyan-300 hover:bg-cyan-500/20"
              type="submit"
            >
              เข้าสู่หน้าจัดการ
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            <label className="block">
              <span className="text-sm text-slate-300">เลือกรูปภาพ</span>
              <input
                accept=".png,.jpg,.jpeg"
                className="mt-2 w-full rounded-lg border border-cyan-500/30 bg-slate-950 px-3 py-2 text-sm"
                onChange={handleFileChange}
                type="file"
              />
            </label>

            {previewUrl ? (
              <div>
                <p className="mb-2 text-sm text-slate-300">ตัวอย่างรูปภาพ</p>
                <img
                  alt="ตัวอย่างรูปภาพ"
                  className="aspect-video w-full rounded-lg border border-cyan-500/30 object-cover"
                  src={previewUrl}
                />
              </div>
            ) : null}

            <div className="space-y-3">
              <button
                className="w-full rounded-lg bg-cyan-400 py-3 font-bold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                disabled={!selectedFile}
                onClick={handleSave}
                type="button"
              >
                บันทึกรูปภาพใหม่
              </button>
              <button
                className="w-full rounded-lg border border-rose-500/30 py-3 font-semibold text-rose-300 hover:bg-rose-500/10"
                onClick={handleReset}
                type="button"
              >
                คืนค่าเริ่มต้น
              </button>
              <Link
                className="block rounded-lg border border-cyan-500/40 py-3 text-center font-semibold text-cyan-300 hover:bg-cyan-500/10"
                href="/"
              >
                กลับหน้าแรก
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
