"use client";

import {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {API, fetchWithAuth} from "@/app/api";

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // -------------------------------------
    // LOAD CURRENT USER
    // -------------------------------------
    async function loadUser() {
        const access = localStorage.getItem("access");

        // если токена нет — вообще ничего не делаем
        if (!access || access === "null" || access === "undefined") {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await fetchWithAuth("/auth/me/");

            if (!res.ok) {
                // здесь как раз твой случай: токен просрочен / неверный
                console.warn("Token invalid or expired. Clearing storage.");
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                setUser(null);
                setLoading(false);
                return;
            }

            const data = await res.json();
            setUser(data);
        } catch (err) {
            console.error("ME request failed:", err);
            // на всякий случай тоже чистим
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            setUser(null);
        }

        setLoading(false);
    }

    useEffect(() => {
        loadUser();
    }, []);

    // -------------------------------------
    // LOGIN
    // -------------------------------------
    async function login(email: string, password: string): Promise<boolean> {
        try {
            const res = await fetch(`${API}/auth/login/`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password}),
            });

            if (!res.ok) return false;

            const data = await res.json();

            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);

            await loadUser();
            return true;
        } catch (err) {
            console.error("Login error:", err);
            return false;
        }
    }

    // -------------------------------------
    // LOGOUT
    // -------------------------------------
    function logout() {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
        router.push("/signin");
    }

    return (
        <AuthContext.Provider value={{user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
