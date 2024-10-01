import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = [
  "/dashboard",
  "/events",
  "/newspaper",
  "/push-notification",
  "/users",
  "/settings",
  "/refund-requests",
];
const publicRoutes = ["/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const token = cookies().get("token")?.value;

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
