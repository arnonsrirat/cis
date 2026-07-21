import { NextResponse } from "next/server";
import { listUsersFromDb } from "@/features/auth/lib/userRepository";

export async function GET() {
  const users = await listUsersFromDb();

  return NextResponse.json({ users });
}
