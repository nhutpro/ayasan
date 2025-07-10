import { NextRequest, NextResponse } from "next/server";
import { refreshAccessToken } from "./app/utils/functions";



export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // If no refreshToken, logout
    if (!refreshToken) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
    }

    // If no accessToken, try to refresh
    if (!accessToken) {
        const backendUrl = process.env.BACKEND_URL || "http://localhost:5000/api";
        const newAccessToken = await refreshAccessToken(backendUrl, refreshToken);

        // If refreshToken expired or invalid, logout
        if (!newAccessToken) {
            const response = NextResponse.redirect(new URL("/login", request.url));
            response.cookies.delete("accessToken");
            response.cookies.delete("refreshToken");
            return response;
        }

        // Set new accessToken and continue
        const response = NextResponse.next();
        response.cookies.set("accessToken", newAccessToken, { httpOnly: true });
        return response;
    }

    return NextResponse.next();
}

// Protect /admin and all subroutes
export const config = {
    matcher: ["/admin/:path*"],
};