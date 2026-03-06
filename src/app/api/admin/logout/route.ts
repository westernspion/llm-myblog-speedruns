import { ADMIN_SESSION_COOKIE, toRequestUrl } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = NextResponse.redirect(toRequestUrl(request, "/admin/login"));
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  return response;
}
