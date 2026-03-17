import { type NextRequest, NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const { auth } = await import("./services/auth");

  const session = await auth();
  if (!session) {
    const authUrl = new URL("/login", req.url);
    authUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(authUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|error|_next/static|_next/image|favicon.ico|.*\\.[a-zA-Z]+$).*)"],
};
