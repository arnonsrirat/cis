import type { PermissionKey, UserAccount, UserRole, UserStatus } from "@/types/auth";

const parseJson = async <T>(response: Response) => {
  const data = (await response.json()) as T & { message?: string };

  if (!response.ok) {
    throw new Error(data.message ?? "เกิดข้อผิดพลาด");
  }

  return data;
};

export const fetchUsers = async () => {
  const data = await parseJson<{ users: UserAccount[] }>(await fetch("/api/users"));
  return data.users;
};

export const loginWithApi = async (username: string, password: string) => {
  return parseJson<{ ok: true; user: UserAccount }>(
    await fetch("/api/auth/login", {
      body: JSON.stringify({ password, username }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }),
  );
};

export const registerWithApi = async (
  username: string,
  password: string,
  displayName: string,
) => {
  return parseJson<{ message: string; ok: true }>(
    await fetch("/api/auth/register", {
      body: JSON.stringify({ displayName, password, username }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }),
  );
};

export const updateApprovalWithApi = async (
  userId: string,
  status: UserStatus,
) => {
  const data = await parseJson<{ users: UserAccount[] }>(
    await fetch(`/api/users/${userId}/approval`, {
      body: JSON.stringify({ status }),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    }),
  );

  return data.users;
};

export const updateRoleWithApi = async (userId: string, role: UserRole) => {
  const data = await parseJson<{ users: UserAccount[] }>(
    await fetch(`/api/users/${userId}/role`, {
      body: JSON.stringify({ role }),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    }),
  );

  return data.users;
};

export const updatePermissionsWithApi = async (
  userId: string,
  permissions: PermissionKey[],
) => {
  const data = await parseJson<{ users: UserAccount[] }>(
    await fetch(`/api/users/${userId}/permissions`, {
      body: JSON.stringify({ permissions }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    }),
  );

  return data.users;
};
