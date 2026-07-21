import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import type { PermissionKey, UserAccount, UserRole, UserStatus } from "@/types/auth";
import { allPermissions } from "../data/defaultAccounts";
import { getMysqlPool } from "@/lib/database/mysql";

type UserRow = RowDataPacket & {
  id: string;
  username: string;
  display_name: string;
  role: UserRole;
  status: UserStatus;
  created_at: Date;
  permissions: string | null;
};

type AuthUserRow = UserRow & {
  password_hash: string;
};

const mapUser = (row: UserRow): UserAccount => ({
  id: row.id,
  username: row.username,
  displayName: row.display_name,
  role: row.role,
  status: row.status,
  permissions:
    row.role === "master"
      ? allPermissions
      : ((row.permissions?.split(",").filter(Boolean) ?? []) as PermissionKey[]),
  createdAt: row.created_at.toISOString(),
});

export const listUsersFromDb = async () => {
  const [rows] = await getMysqlPool().query<UserRow[]>(
    `SELECT
      users.id,
      users.username,
      users.display_name,
      users.role,
      users.status,
      users.created_at,
      GROUP_CONCAT(user_permissions.permission_key) AS permissions
    FROM users
    LEFT JOIN user_permissions ON users.id = user_permissions.user_id
    GROUP BY users.id
    ORDER BY users.created_at ASC`,
  );

  return rows.map(mapUser);
};

export const loginUserFromDb = async (username: string, password: string) => {
  const [rows] = await getMysqlPool().execute<AuthUserRow[]>(
    `SELECT
      users.id,
      users.username,
      users.password_hash,
      users.display_name,
      users.role,
      users.status,
      users.created_at,
      GROUP_CONCAT(user_permissions.permission_key) AS permissions
    FROM users
    LEFT JOIN user_permissions ON users.id = user_permissions.user_id
    WHERE LOWER(users.username) = LOWER(:username)
    GROUP BY users.id
    LIMIT 1`,
    { username },
  );

  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return { ok: false as const, message: "Username หรือ Password ไม่ถูกต้อง" };
  }

  if (user.status === "pending") {
    return { ok: false as const, message: "บัญชียังรอ Master อนุมัติ" };
  }

  if (user.status === "rejected") {
    return { ok: false as const, message: "บัญชีนี้ถูกปฏิเสธการใช้งาน" };
  }

  return { ok: true as const, user: mapUser(user) };
};

export const createPendingUser = async (
  username: string,
  password: string,
  displayName: string,
) => {
  const trimmedUsername = username.trim();
  const trimmedDisplayName = displayName.trim();

  if (!trimmedUsername || !password || !trimmedDisplayName) {
    return { ok: false as const, message: "กรุณากรอกข้อมูลให้ครบ" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await getMysqlPool().execute(
      `INSERT INTO users (
        id,
        username,
        password_hash,
        display_name,
        role,
        status
      ) VALUES (
        :id,
        :username,
        :passwordHash,
        :displayName,
        'admin',
        'pending'
      )`,
      {
        id: randomUUID(),
        username: trimmedUsername,
        passwordHash,
        displayName: trimmedDisplayName,
      },
    );
  } catch {
    return { ok: false as const, message: "Username นี้ถูกใช้งานแล้ว" };
  }

  return {
    ok: true as const,
    message: "สมัครสำเร็จ กรุณารอ Master อนุมัติและกำหนดสิทธิ์",
  };
};

export const updateApprovalInDb = async (id: string, status: UserStatus) => {
  await getMysqlPool().execute(
    "UPDATE users SET status = :status WHERE id = :id AND role <> 'master'",
    { id, status },
  );

  if (status !== "approved") {
    await getMysqlPool().execute("DELETE FROM user_permissions WHERE user_id = :id", {
      id,
    });
  }
};

export const updateRoleInDb = async (id: string, role: UserRole) => {
  await getMysqlPool().execute(
    "UPDATE users SET role = :role WHERE id = :id AND id <> 'master-default'",
    { id, role },
  );

  if (role === "master") {
    await replacePermissionsInDb(id, allPermissions);
  }
};

export const replacePermissionsInDb = async (
  id: string,
  permissions: PermissionKey[],
) => {
  const pool = getMysqlPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.execute("DELETE FROM user_permissions WHERE user_id = :id", {
      id,
    });

    for (const permission of permissions) {
      await connection.execute(
        "INSERT IGNORE INTO user_permissions (user_id, permission_key) VALUES (:id, :permission)",
        { id, permission },
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
