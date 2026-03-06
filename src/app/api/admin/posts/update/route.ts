import { isAdminAuthenticated, toRequestUrl } from "@/lib/auth";
import { updatePost } from "@/lib/posts";
import { NextResponse } from "next/server";

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.redirect(toRequestUrl(request, "/admin/login"));
  }

  const formData = await request.formData();
  const id = Number.parseInt(String(formData.get("id") ?? ""), 10);
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "");
  const content = String(formData.get("content") ?? "");
  const tags = parseTags(String(formData.get("tags") ?? ""));

  if (!Number.isFinite(id) || !title || !content.trim()) {
    return NextResponse.redirect(toRequestUrl(request, "/admin"));
  }

  await updatePost(id, { title, excerpt, content, tags });
  return NextResponse.redirect(toRequestUrl(request, "/admin"));
}
