"use client";

import {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {API} from "@/app/api";

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
    // READ TOKENS FROM COOKIES
    // -------------------------------------
    function getAccessToken() {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith("access="))
            ?.split("=")[1];
    }

    function getRefreshToken() {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith("refresh="))
            ?.split("=")[1];
    }

    // -------------------------------------
    // LOAD CURRENT USER
    // -------------------------------------
    async function loadUser() {
        const token = getAccessToken();

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API}/auth/me/`, {
                headers: {Authorization: `Bearer ${token}`},
                cache: "no-store",
            });

            if (!res.ok) {
                console.warn("Access token invalid, trying refresh...");
                const okRefresh = await refreshAccessToken();

                if (!okRefresh) {
                    clearTokens();
                    setUser(null);
                    setLoading(false);
                    return;
                }

                return loadUser();
            }

            const data = await res.json();
            setUser(data);
        } catch (err) {
            console.error("ME request failed:", err);
            clearTokens();
            setUser(null);
        }

        setLoading(false);
    }

    // -------------------------------------
    // REFRESH ACCESS TOKEN
    // -------------------------------------
    async function refreshAccessToken(): Promise<boolean> {
        const refresh = getRefreshToken();
        if (!refresh) return false;

        try {
            const res = await fetch(`${API}/auth/refresh/`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({refresh}),
            });

            if (!res.ok) return false;

            const data = await res.json();
            setCookies(data.access, data.refresh);

            return true;
        } catch {
            return false;
        }
    }

    // -------------------------------------
    // SET COOKIES
    // -------------------------------------
    function setCookies(access: string, refresh: string) {
        document.cookie = `access=${access}; path=/;`;
        document.cookie = `refresh=${refresh}; path=/;`;
    }

    function clearTokens() {
        document.cookie = `access=; Max-Age=0; path=/;`;
        document.cookie = `refresh=; Max-Age=0; path=/;`;
    }

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

            // ставим куки
            setCookies(data.access, data.refresh);

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
        clearTokens();
        setUser(null);
        router.push("/signin");
    }

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{user, loading, login, logout}}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
