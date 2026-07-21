import type { PermissionKey, UserAccount } from "@/types/auth";

export const hasPermission = (
  user: UserAccount | null,
  permission: PermissionKey,
) => {
  if (!user || user.status !== "approved") {
    return false;
  }

  return user.role === "master" || user.permissions.includes(permission);
};
