import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose/jwt/verify";

const JWT_SECRET = process.env.JWT_SECRET || "build_clothing_fallback_secret_key_123456";
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

async function verifyTokenEdge(token: string): Promise<{ role?: string; userId?: string } | null> {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload as { role?: string; userId?: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
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

    const payload = await verifyTokenEdge(token);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN")) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  // Protect Customer Account Dashboard
  if (pathname.startsWith("/account")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login?from=" + pathname, request.url));
    }

    const payload = await verifyTokenEdge(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
