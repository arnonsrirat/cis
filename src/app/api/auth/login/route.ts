import { NextResponse } from "next/server";
import { loginUserFromDb } from "@/features/auth/lib/userRepository";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };
  const result = await loginUserFromDb(body.username ?? "", body.password ?? "");

  return NextResponse.json(result, { status: result.ok ? 200 : 401 });
}
