"use client";

import { useEffect, useMemo, useState } from "react";
import type { PermissionKey, UserAccount } from "@/types/auth";
import { AdvertisementWorkspace } from "@/features/advertising/components/AdvertisementWorkspace";
import { DraftWorkspace } from "@/features/banpick-overlay/components/DraftWorkspace";
import { MainMenu } from "@/features/home/components/MainMenu";
import { hasPermission } from "../lib/accessControl";
import { fetchUsers } from "../lib/authApi";
import { LoginScreen } from "./LoginScreen";

type ActiveMenu = "menu" | "banpick" | "ads";

export function AuthGate() {
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>("menu");
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetchUsers()
      .then((nextUsers) => {
        if (isMounted) {
          setUsers(nextUsers);
          setLoadError("");
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoadError("ยังเชื่อมต่อฐานข้อมูลไม่ได้ กรุณาตรวจสอบ MySQL และไฟล์ .env");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const permissionMap = useMemo(
    () =>
      ({
        controlDraft: hasPermission(currentUser, "controlDraft"),
        manageAds: hasPermission(currentUser, "manageAds"),
        manageHeroes: hasPermission(currentUser, "manageHeroes"),
        manageUsers: hasPermission(currentUser, "manageUsers"),
        viewOverlay: hasPermission(currentUser, "viewOverlay"),
      }) satisfies Record<PermissionKey, boolean>,
    [currentUser],
  );

  const handleLogout = () => {
    setActiveMenu("menu");
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginScreen onLogin={setCurrentUser} onUsersChange={setUsers} />;
  }

  if (activeMenu === "menu") {
    return (
      <MainMenu
        currentUser={currentUser}
        onLogout={handleLogout}
        onSelect={setActiveMenu}
        permissions={permissionMap}
      />
    );
  }

  if (activeMenu === "ads") {
    return (
      <AdvertisementWorkspace
        currentUser={currentUser}
        onBackToMenu={() => setActiveMenu("menu")}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <DraftWorkspace
      currentUser={currentUser}
      onBackToMenu={() => setActiveMenu("menu")}
      onLogout={handleLogout}
      onUsersChange={setUsers}
      permissions={permissionMap}
      systemMessage={loadError}
      users={users}
    />
  );
}
