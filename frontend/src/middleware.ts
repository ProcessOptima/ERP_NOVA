import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

export function middleware(req: NextRequest) {
    const access = req.cookies.get("access")?.value;

    // Если токена нет → перенаправляем на SignIn
    if (!access) {
        if (!req.nextUrl.pathname.startsWith("/signin")) {
            const loginUrl = new URL("/signin", req.url);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    // Админ-защита: /dashboard/cfo — только admin
    if (req.nextUrl.pathname.startsWith("/dashboard/cfo")) {
        const userRole = req.cookies.get("role")?.value;

        if (userRole !== "admin") {
            const forbidden = new URL("/403", req.url);
            return NextResponse.redirect(forbidden);
        }
    }

    return NextResponse.next();
}

// Ограничиваем рабочие маршруты
export const config = {
    matcher: [
        "/dashboard/:path*", // защищаем ВСЮ админку
        "/api/protected/:path*",
    ],
};
