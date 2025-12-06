"use client";

import {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";

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

    // -----------------------------
    //  LOAD USER ON FIRST LOAD
    // -----------------------------
    async function loadUser() {
        const access = localStorage.getItem("access");
        if (!access) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:8000/api/auth/me/", {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
            });

            if (!res.ok) {
                console.warn("Access token invalid or expired");
                setUser(null);
                setLoading(false);
                return;
            }

            const data = await res.json();
            setUser(data);
        } catch (e) {
            console.error("ME request failed:", e);
        }

        setLoading(false);
    }

    useEffect(() => {
        loadUser();
    }, []);

    // -----------------------------
    // LOGIN
    // -----------------------------
    async function login(email: string, password: string): Promise<boolean> {
        try {
            const res = await fetch("http://localhost:8000/api/auth/login/", {
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
        } catch (e) {
            console.error("Login error:", e);
            return false;
        }
    }

    // -----------------------------
    // LOGOUT
    // -----------------------------
    function logout() {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
        router.push("/signin");
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
            }}
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
