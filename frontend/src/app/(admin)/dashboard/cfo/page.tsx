import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import DashboardPage from "./_DashboardPage";
import {API} from "@/app/api";

export default async function CFOPage() {
    // cookies() в Next.js 15 — async
    const cookieStore = await cookies();

    // читаем токены
    const token =
        cookieStore.get("access")?.value ??
        cookieStore.get("accessToken")?.value ??
        null;

    if (!token) {
        redirect("/signin");
    }

    // получаем пользователя
    const resUser = await fetch(`${API}/auth/me/`, {
        headers: {Authorization: `Bearer ${token}`},
        cache: "no-store",
    });

    if (!resUser.ok) {
        redirect("/signin");
    }

    const user = await resUser.json();

    if (user.role !== "admin") {
        redirect("/403");
    }

    // CFO данные
    const resData = await fetch("http://localhost:3000/api/cfo", {
        cache: "no-store",
    });

    if (!resData.ok) {
        throw new Error("Не удалось загрузить данные CFO");
    }

    const cfoData = await resData.json();

    return <DashboardPage user={user} initialData={cfoData}/>;
}
