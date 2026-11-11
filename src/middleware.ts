import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwtPayload(token: string): { role?: string; userId?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(payloadBase64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("bld_token")?.value;

  // Security Headers (Section 23)
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // Protect Admin Dashboard
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login?from=" + pathname, request.url));
    }

    const payload = decodeJwtPayload(token);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN")) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  // Protect Customer Account Dashboard
  if (pathname.startsWith("/account")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login?from=" + pathname, request.url));
    }

    const payload = decodeJwtPayload(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
