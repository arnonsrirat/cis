import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  createAdClipInDb,
  listAdClipsFromDb,
} from "@/features/advertising/lib/adRepository";

const uploadDir = path.join(process.cwd(), "public", "uploads", "ads");

const sanitizeFileName = (fileName: string) =>
  fileName.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();

export async function GET() {
  return NextResponse.json({ clips: await listAdClipsFromDb() });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const title = String(formData.get("title") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "กรุณาเลือกไฟล์วิดีโอ" }, { status: 400 });
  }

  if (!file.type.startsWith("video/")) {
    return NextResponse.json({ message: "รองรับเฉพาะไฟล์วิดีโอ" }, { status: 400 });
  }

  await mkdir(uploadDir, { recursive: true });

  const storedFileName = `${randomUUID()}-${sanitizeFileName(file.name)}`;
  const filePath = path.join(uploadDir, storedFileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, bytes);
  await createAdClipInDb({
    fileName: file.name,
    fileUrl: `/uploads/ads/${storedFileName}`,
    mimeType: file.type,
    sizeBytes: file.size,
    title,
  });

  return NextResponse.json({ clips: await listAdClipsFromDb() }, { status: 201 });
}
