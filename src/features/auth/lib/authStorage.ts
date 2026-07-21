import type { LoginResult, PermissionKey, UserAccount, UserRole } from "@/types/auth";
import { allPermissions, defaultMasterAccount } from "../data/defaultAccounts";

const STORAGE_KEY = "banpick-rov-users";

const isBrowser = () => typeof window !== "undefined";

const normalizeUsers = (users: UserAccount[]) => {
  const hasMaster = users.some((user) => user.id === defaultMasterAccount.id);

  return hasMaster ? users : [defaultMasterAccount, ...users];
};

export const loadUsers = (): UserAccount[] => {
  if (!isBrowser()) {
    return [defaultMasterAccount];
  }

  const rawUsers = window.localStorage.getItem(STORAGE_KEY);

  if (!rawUsers) {
    saveUsers([defaultMasterAccount]);
    return [defaultMasterAccount];
  }

  try {
    return normalizeUsers(JSON.parse(rawUsers) as UserAccount[]);
  } catch {
    saveUsers([defaultMasterAccount]);
    return [defaultMasterAccount];
  }
};

export const saveUsers = (users: UserAccount[]) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeUsers(users)));
};

export const loginUser = (
  users: UserAccount[],
  username: string,
  password: string,
): LoginResult => {
  const account = users.find(
    (user) => user.username.toLowerCase() === username.trim().toLowerCase(),
  );

  if (!account || account.password !== password) {
    return { ok: false, message: "Username หรือ password ไม่ถูกต้อง" };
  }

  if (account.status === "pending") {
    return { ok: false, message: "บัญชียังรอ Master อนุมัติ" };
  }

  if (account.status === "rejected") {
    return { ok: false, message: "บัญชีนี้ถูกปฏิเสธการใช้งาน" };
  }

  return { ok: true, user: account };
};

export const registerUser = (
  users: UserAccount[],
  username: string,
  password: string,
  displayName: string,
): { ok: boolean; message: string; users: UserAccount[] } => {
  const trimmedUsername = username.trim();

  if (!trimmedUsername || !password || !displayName.trim()) {
    return { ok: false, message: "กรุณากรอกข้อมูลให้ครบ", users };
  }

  const isDuplicate = users.some(
    (user) => user.username.toLowerCase() === trimmedUsername.toLowerCase(),
  );

  if (isDuplicate) {
    return { ok: false, message: "Username นี้ถูกใช้งานแล้ว", users };
  }

  const nextUsers: UserAccount[] = [
    ...users,
    {
      id: crypto.randomUUID(),
      username: trimmedUsername,
      password,
      displayName: displayName.trim(),
      role: "admin",
      status: "pending",
      permissions: [],
      createdAt: new Date().toISOString(),
    },
  ];

  saveUsers(nextUsers);

  return {
    ok: true,
    message: "สมัครสำเร็จ กรุณารอ Master อนุมัติและกำหนดสิทธิ์",
    users: nextUsers,
  };
};

export const updateUserApproval = (
  users: UserAccount[],
  userId: string,
  status: UserAccount["status"],
): UserAccount[] => {
  const nextUsers = users.map((user) =>
    user.id === userId && user.role !== "master"
      ? {
          ...user,
          status,
          permissions: status === "approved" ? user.permissions : [],
        }
      : user,
  );

  saveUsers(nextUsers);
  return nextUsers;
};

export const updateUserRole = (
  users: UserAccount[],
  userId: string,
  role: UserRole,
): UserAccount[] => {
  const nextUsers = users.map((user) =>
    user.id === userId && user.id !== defaultMasterAccount.id
      ? {
          ...user,
          role,
          permissions: role === "master" ? allPermissions : user.permissions,
        }
      : user,
  );

  saveUsers(nextUsers);
  return nextUsers;
};

export const togglePermission = (
  users: UserAccount[],
  userId: string,
  permission: PermissionKey,
): UserAccount[] => {
  const nextUsers = users.map((user) => {
    if (user.id !== userId || user.role === "master") {
      return user;
    }

    const hasPermission = user.permissions.includes(permission);

    return {
      ...user,
      permissions: hasPermission
        ? user.permissions.filter((item) => item !== permission)
        : [...user.permissions, permission],
    };
  });

  saveUsers(nextUsers);
  return nextUsers;
};
