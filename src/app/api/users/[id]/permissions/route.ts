import { NextResponse } from "next/server";
import type { PermissionKey } from "@/types/auth";
import {
  listUsersFromDb,
  replacePermissionsInDb,
} from "@/features/auth/lib/userRepository";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as { permissions?: PermissionKey[] };

  await replacePermissionsInDb(id, body.permissions ?? []);
  return NextResponse.json({ users: await listUsersFromDb() });
}
