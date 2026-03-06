import { isAdminAuthenticated, toRequestUrl } from "@/lib/auth";
import { createPost } from "@/lib/posts";
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
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "");
  const content = String(formData.get("content") ?? "");
  const tags = parseTags(String(formData.get("tags") ?? ""));

  if (!title || !content.trim()) {
    return NextResponse.redirect(toRequestUrl(request, "/admin/posts/new"));
  }

  await createPost({ title, excerpt, content, tags });
  return NextResponse.redirect(toRequestUrl(request, "/admin"));
}
