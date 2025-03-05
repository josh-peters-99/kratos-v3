import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    // Extract token from requrest using NextAuth's getToken function
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });

    // Define protected routes
    const protectedRoutes = ["/", "/workout"];

    // If the user is trying to access a protected route and doesn't have a valid token, redirect to sign-in
    if (protectedRoutes.some((route) => req.nextUrl.pathname) && !token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Allow the request to proceed
    return NextResponse.next();
}

// Apply middleware only to specific routes
export const config = {
    matcher: ["/", "/workout"],
}