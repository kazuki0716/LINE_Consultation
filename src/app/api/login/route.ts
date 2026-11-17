import { NextResponse } from "next/server";

const COOKIE_NAME = "ueda_site_access";

async function accessToken(password: string) {
  const bytes = new TextEncoder().encode(`ueda-site:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  const data = await request.formData();
  const submitted = String(data.get("password") || "");
  const configured = process.env.SITE_PASSWORD || "sampleueda";
  const rawReturnTo = String(data.get("returnTo") || "/");
  const returnTo = rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//") ? rawReturnTo : "/";

  if (submitted !== configured) {
    const login = new URL("/login", request.url);
    login.searchParams.set("error", "1");
    login.searchParams.set("returnTo", returnTo);
    return NextResponse.redirect(login, 303);
  }

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  response.cookies.set(COOKIE_NAME, await accessToken(configured), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
