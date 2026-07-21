import type { PermissionKey, UserAccount } from "@/types/auth";

export const allPermissions: PermissionKey[] = [
  "controlDraft",
  "viewOverlay",
  "manageUsers",
  "manageHeroes",
  "manageAds",
];

export const permissionLabels: Record<PermissionKey, string> = {
  controlDraft: "ควบคุม Ban/Pick",
  viewOverlay: "เปิดหน้า Overlay",
  manageUsers: "จัดการผู้ใช้งาน",
  manageHeroes: "จัดการคลังตัวละคร",
  manageAds: "จัดการโฆษณาขึ้นจอ",
};

export const defaultMasterAccount: UserAccount = {
  id: "master-default",
  username: "anonsrirat",
  displayName: "Master Admin",
  role: "master",
  status: "approved",
  permissions: allPermissions,
  createdAt: "2026-07-21T00:00:00.000Z",
};
