export type UserRole = "master" | "admin";

export type PermissionKey =
  | "controlDraft"
  | "viewOverlay"
  | "manageUsers"
  | "manageHeroes"
  | "manageAds";

export type UserStatus = "pending" | "approved" | "rejected";

export type UserAccount = {
  id: string;
  username: string;
  password?: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  permissions: PermissionKey[];
  createdAt: string;
};

export type LoginResult =
  | { ok: true; user: UserAccount }
  | { ok: false; message: string };
