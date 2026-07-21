import { NextResponse } from "next/server";
import type { UserRole } from "@/types/auth";
import { listUsersFromDb, updateRoleInDb } from "@/features/auth/lib/userRepository";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as { role?: UserRole };

  if (!body.role) {
    return NextResponse.json({ message: "กรุณาระบุ role" }, { status: 400 });
  }

  await updateRoleInDb(id, body.role);
  return NextResponse.json({ users: await listUsersFromDb() });
}
