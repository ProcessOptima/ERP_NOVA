import {cookies} from "next/headers";
import {API} from "@/app/api";
import DashboardPage from "./_DashboardPage";

export default async function CFOPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access")?.value;

    if (!token) {
        // safety fallback, но middleware уже защитит этот маршрут
        return null;
    }

    const resUser = await fetch(`${API}/auth/me/`, {
        headers: {Authorization: `Bearer ${token}`},
        cache: "no-store",
    });

    const user = await resUser.json();

    const resData = await fetch("http://localhost:3000/api/cfo", {
        cache: "no-store",
    });

    const cfoData = await resData.json();

    return <DashboardPage user={user} initialData={cfoData}/>;
}
