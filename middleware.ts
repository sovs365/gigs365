import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Redirect authenticated users away from login/signup
  if ((pathname === "/login" || pathname === "/signup") && token) {
    const redirectUrl = token.role === "ADMIN" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/signup", "/dashboard"],
};
