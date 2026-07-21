import { NextResponse } from "next/server";
import { createPendingUser } from "@/features/auth/lib/userRepository";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    displayName?: string;
    password?: string;
    username?: string;
  };
  const result = await createPendingUser(
    body.username ?? "",
    body.password ?? "",
    body.displayName ?? "",
  );

  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
