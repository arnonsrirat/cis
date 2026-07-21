"use client";

import type { PermissionKey, UserAccount } from "@/types/auth";

type MainMenuProps = {
  currentUser: UserAccount;
  onLogout: () => void;
  onSelect: (menu: "banpick" | "ads") => void;
  permissions: Record<PermissionKey, boolean>;
};

export function MainMenu({
  currentUser,
  onLogout,
  onSelect,
  permissions,
}: MainMenuProps) {
  return (
    <main className="min-h-screen bg-[#f6f7f2] px-5 py-8 text-[#171812]">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-lg border border-[#d8dbc9] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#69705a]">
              ศูนย์ควบคุมระบบ
            </p>
            <h1 className="mt-2 text-4xl font-bold">เลือกเมนูที่ต้องการใช้งาน</h1>
            <p className="mt-2 text-sm text-[#69705a]">
              เข้าสู่ระบบในชื่อ {currentUser.displayName} / {currentUser.role}
            </p>
          </div>
          <button
            className="h-11 rounded-md border border-[#cdd2bd] bg-white px-4 text-sm font-semibold hover:bg-[#f6f7f2]"
            onClick={onLogout}
            type="button"
          >
            ออกจากระบบ
          </button>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          <MenuCard
            description="ควบคุมการเลือกและแบนตัวละคร จัดการคลังตัวละคร และเปิดหน้า Overlay สำหรับ OBS"
            disabled={!permissions.controlDraft && !permissions.viewOverlay}
            label="เข้าเมนู Ban/Pick"
            onClick={() => onSelect("banpick")}
            title="เว็บ Ban/Pick"
          />
          <MenuCard
            description="อัปโหลดคลิปโฆษณา เลือกคลิปขึ้นจอ สั่งเล่น/หยุด/ปิดเสียง และเปิด widget วิดีโอเต็มจอสำหรับ OBS"
            disabled={!permissions.manageAds}
            label="เข้าเมนูโฆษณา"
            onClick={() => onSelect("ads")}
            title="เว็บแสดงโฆษณาขึ้นจอ"
          />
        </div>
      </section>
    </main>
  );
}

function MenuCard({
  description,
  disabled,
  label,
  onClick,
  title,
}: {
  description: string;
  disabled: boolean;
  label: string;
  onClick: () => void;
  title: string;
}) {
  return (
    <article className="rounded-lg border border-[#d8dbc9] bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-3 min-h-16 text-sm leading-6 text-[#69705a]">{description}</p>
      <button
        className={`mt-5 h-11 w-full rounded-md px-4 font-semibold ${
          disabled
            ? "cursor-not-allowed border border-[#d8dbc9] bg-[#f6f7f2] text-[#8d927f]"
            : "bg-[#1f3324] text-white hover:bg-[#2f4b36]"
        }`}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        {disabled ? "ยังไม่มีสิทธิ์ใช้งาน" : label}
      </button>
    </article>
  );
}
