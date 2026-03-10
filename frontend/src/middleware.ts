import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isPublic = publicRoutes.includes(request.nextUrl.pathname);

  // Belum login = akses halaman protected → redirect ke login
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Udah login  akses login page → redirect ke dashboard
  if (token && isPublic) {
    return NextResponse.redirect(new URL("/authors", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
