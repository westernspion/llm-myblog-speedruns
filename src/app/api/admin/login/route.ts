import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminCredentials,
  getAdminSessionCookieOptions,
  toRequestUrl
} from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const expected = getAdminCredentials();

  if (username !== expected.username || password !== expected.password) {
    return NextResponse.redirect(toRequestUrl(request, "/admin/login?error=1"));
  }

  const response = NextResponse.redirect(toRequestUrl(request, "/admin"));
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    createAdminSessionToken(username),
    getAdminSessionCookieOptions()
  );
  return response;
}
