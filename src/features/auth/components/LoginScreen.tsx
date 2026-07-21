"use client";

import { FormEvent, useState } from "react";
import type { UserAccount } from "@/types/auth";
import { fetchUsers, loginWithApi, registerWithApi } from "../lib/authApi";

type LoginScreenProps = {
  onLogin: (user: UserAccount) => void;
  onUsersChange: (users: UserAccount[]) => void;
};

export function LoginScreen({ onLogin, onUsersChange }: LoginScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const isLogin = mode === "login";

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const result = await loginWithApi(username, password);
      setMessage("");
      onLogin(result.user);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "เข้าสู่ระบบไม่สำเร็จ");
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const result = await registerWithApi(username, password, displayName);
      setMessage(result.message);
      onUsersChange(await fetchUsers());
      setDisplayName("");
      setPassword("");
      setUsername("");
      setMode("login");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "สมัครใช้งานไม่สำเร็จ");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07101a] px-5 py-8 text-white">
      <section className="w-full max-w-md rounded-xl border border-white/15 bg-black/65 p-6 shadow-[0_0_60px_rgba(14,165,233,0.22)]">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
            Welcome
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-normal">
            Welcome Banpick Rov
          </h1>
          <p className="mt-3 text-sm text-white/65">
            {isLogin
              ? "เข้าสู่ระบบเพื่อใช้งานระบบควบคุม Ban/Pick"
              : "สมัครใช้งานแล้วรอ Master อนุมัติและกำหนดสิทธิ์"}
          </p>
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={isLogin ? handleLogin : handleRegister}
        >
          {!isLogin ? (
            <label className="block">
              <span className="text-sm font-semibold text-white/75">
                ชื่อที่แสดง
              </span>
              <input
                className="mt-2 h-11 w-full rounded-md border border-white/15 bg-white/10 px-3 text-white outline-none transition placeholder:text-white/35 focus:border-sky-300"
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="กรอกชื่อที่แสดงในระบบ"
                type="text"
                value={displayName}
              />
            </label>
          ) : null}

          <label className="block">
            <span className="text-sm font-semibold text-white/75">ชื่อผู้ใช้</span>
            <input
              className="mt-2 h-11 w-full rounded-md border border-white/15 bg-white/10 px-3 text-white outline-none transition placeholder:text-white/35 focus:border-sky-300"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="กรอกชื่อผู้ใช้"
              type="text"
              value={username}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-white/75">รหัสผ่าน</span>
            <input
              className="mt-2 h-11 w-full rounded-md border border-white/15 bg-white/10 px-3 text-white outline-none transition placeholder:text-white/35 focus:border-sky-300"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="กรอกรหัสผ่าน"
              type="password"
              value={password}
            />
          </label>

          {message ? (
            <div className="rounded-md border border-sky-300/25 bg-sky-300/10 px-3 py-2 text-sm text-sky-100">
              {message}
            </div>
          ) : null}

          <button
            className="h-11 w-full rounded-md bg-sky-500 font-black text-white transition hover:bg-sky-400"
            type="submit"
          >
            {isLogin ? "เข้าสู่ระบบ" : "สมัครใช้งาน"}
          </button>
        </form>

        <button
          className="mt-4 w-full text-sm font-semibold text-sky-200 hover:text-white"
          onClick={() => {
            setMessage("");
            setMode(isLogin ? "register" : "login");
          }}
          type="button"
        >
          {isLogin
            ? "ยังไม่มีบัญชี? สมัครเพื่อรอ Master อนุมัติ"
            : "กลับไปหน้าเข้าสู่ระบบ"}
        </button>
      </section>
    </main>
  );
}
