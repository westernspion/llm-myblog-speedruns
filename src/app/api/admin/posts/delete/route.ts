import { isAdminAuthenticated, toRequestUrl } from "@/lib/auth";
import { deletePost } from "@/lib/posts";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.redirect(toRequestUrl(request, "/admin/login"));
  }

  const formData = await request.formData();
  const id = Number.parseInt(String(formData.get("id") ?? ""), 10);

  if (Number.isFinite(id)) {
    await deletePost(id);
  }

  return NextResponse.redirect(toRequestUrl(request, "/admin"));
}
