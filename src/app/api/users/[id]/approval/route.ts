import { NextResponse } from "next/server";
import type { UserStatus } from "@/types/auth";
import { listUsersFromDb, updateApprovalInDb } from "@/features/auth/lib/userRepository";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as { status?: UserStatus };

  if (!body.status) {
    return NextResponse.json({ message: "กรุณาระบุสถานะ" }, { status: 400 });
  }

  await updateApprovalInDb(id, body.status);
  return NextResponse.json({ users: await listUsersFromDb() });
}
