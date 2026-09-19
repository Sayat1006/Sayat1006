import { NextResponse } from "next/server";

import { auth, isAuthEnvConfigured } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isAuthPage = nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

  if (!isAuthEnvConfigured) {
    if (isDashboard || isAuthPage) {
      return NextResponse.redirect(new URL("/setup-required", nextUrl));
    }
    return NextResponse.next();
  }

  const isLoggedIn = Boolean(req.auth);

  if (isDashboard && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
