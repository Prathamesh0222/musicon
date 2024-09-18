import { NextResponse, NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const url = request.nextUrl;

    if (token && (
        url.pathname.startsWith("/signin") ||
        url.pathname.startsWith("/signup") ||
        url.pathname === "/"
    )) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (!token && url.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }
    return NextResponse.next();
}