import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload; // valid
  } catch {
    return null; // invalid / expired
  }
}

/**
 * Routes that should redirect to /chat if logged in
 */
const AUTH_ROUTES = ["/login", "/signup"];

/**
 * Routes that require authentication
 */
const PROTECTED_PREFIXES = ["/chat", "/profile", "/settings"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isProtectedRoute = PROTECTED_PREFIXES.some((route) =>
    pathname.startsWith(route)
  );

  let isAuthenticated = false;

  if (token) {
    const payload = await verifyJwt(token);
    isAuthenticated = Boolean(payload);
  }

  /**
   * 🔒 Protected route without valid token → redirect to login
   */
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  /**
   * 🔁 Logged-in user visiting login/signup → redirect to chat
   */
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
  ],
};
