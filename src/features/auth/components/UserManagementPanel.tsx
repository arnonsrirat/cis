"use client";

import type { PermissionKey, UserAccount, UserRole } from "@/types/auth";
import { allPermissions, permissionLabels } from "../data/defaultAccounts";
import {
  updateApprovalWithApi,
  updatePermissionsWithApi,
  updateRoleWithApi,
} from "../lib/authApi";

type UserManagementPanelProps = {
  currentUser: UserAccount;
  onUsersChange: (users: UserAccount[]) => void;
  users: UserAccount[];
};

export function UserManagementPanel({
  currentUser,
  onUsersChange,
  users,
}: UserManagementPanelProps) {
  if (currentUser.role !== "master") {
    return null;
  }

  const managedUsers = users.filter((user) => user.id !== currentUser.id);

  const handlePermissionChange = async (
    user: UserAccount,
    permission: PermissionKey,
  ) => {
    const permissions = user.permissions.includes(permission)
      ? user.permissions.filter((item) => item !== permission)
      : [...user.permissions, permission];

    onUsersChange(await updatePermissionsWithApi(user.id, permissions));
  };

  return (
    <section className="rounded-lg border border-[#d8dbc9] bg-white p-4 shadow-sm">
      <div>
        <h2 className="text-xl font-bold">จัดการผู้ใช้งาน</h2>
        <p className="mt-1 text-sm text-[#69705a]">
          Master สามารถอนุมัติผู้ใช้ เปลี่ยนบทบาท และกำหนดสิทธิ์ได้
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {managedUsers.length === 0 ? (
          <div className="rounded-md border border-dashed border-[#cdd2bd] p-4 text-sm text-[#69705a]">
            ยังไม่มีผู้สมัครใช้งาน
          </div>
        ) : (
          managedUsers.map((user) => (
            <article
              className="rounded-lg border border-[#d8dbc9] bg-[#fbfcf5] p-4"
              key={user.id}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-lg font-bold">{user.displayName}</h3>
                  <p className="text-sm text-[#69705a]">@{user.username}</p>
                  <span className="mt-2 inline-flex rounded-md bg-[#edf3df] px-2 py-1 text-xs font-bold uppercase text-[#34520f]">
                    {user.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    className="h-9 rounded-md bg-[#1f3324] px-3 text-sm font-semibold text-white hover:bg-[#2f4b36]"
                    onClick={async () =>
                      onUsersChange(await updateApprovalWithApi(user.id, "approved"))
                    }
                    type="button"
                  >
                    อนุมัติ
                  </button>
                  <button
                    className="h-9 rounded-md border border-[#c95648] px-3 text-sm font-semibold text-[#9b2f21] hover:bg-[#f6e6dc]"
                    onClick={async () =>
                      onUsersChange(await updateApprovalWithApi(user.id, "rejected"))
                    }
                    type="button"
                  >
                    ปฏิเสธ
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[180px_1fr]">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#747a68]">
                    บทบาท
                  </span>
                  <select
                    className="mt-2 h-10 w-full rounded-md border border-[#cdd2bd] bg-white px-3 text-sm font-semibold"
                    onChange={async (event) =>
                      onUsersChange(
                        await updateRoleWithApi(
                          user.id,
                          event.target.value as UserRole,
                        ),
                      )
                    }
                    value={user.role}
                  >
                    <option value="admin">Admin</option>
                    <option value="master">Master</option>
                  </select>
                </label>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#747a68]">
                    สิทธิ์การใช้งาน
                  </p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    {allPermissions.map((permission) => (
                      <PermissionToggle
                        checked={
                          user.role === "master" ||
                          user.permissions.includes(permission)
                        }
                        disabled={user.role === "master"}
                        key={permission}
                        label={permissionLabels[permission]}
                        onChange={() => handlePermissionChange(user, permission)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function PermissionToggle({
  checked,
  disabled,
  label,
  onChange,
}: {
  checked: boolean;
  disabled: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="flex min-h-10 items-center gap-2 rounded-md border border-[#d8dbc9] bg-white px-3 text-sm font-semibold">
      <input
        checked={checked}
        className="size-4 accent-[#1f3324]"
        disabled={disabled}
        onChange={onChange}
        type="checkbox"
      />
      <span className={disabled ? "text-[#69705a]" : ""}>{label}</span>
    </label>
  );
}
