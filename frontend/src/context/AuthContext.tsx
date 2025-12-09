"use client";

import {createContext, useContext, useEffect, useState} from "react";
import {API} from "@/app/api";
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

    // --------------------------
    // LOAD CURRENT USER
    // --------------------------
    async function loadUser() {
        try {
            const res = await fetch(`${API}/auth/me/`, {
                credentials: "include",
            });

            if (!res.ok) {
                setUser(null);
                setLoading(false);
                return;
            }

            const data = await res.json();
            setUser(data);
        } catch {
            setUser(null);
        }

        setLoading(false);
    }

    // --------------------------
    // LOGIN
    // --------------------------
    async function login(email: string, password: string): Promise<boolean> {
        try {
            const res = await fetch(`${API}/auth/login/`, {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password}),
            });

            if (!res.ok) return false;

            await loadUser();
            return true;
        } catch {
            return false;
        }
    }

    // --------------------------
    // LOGOUT
    // --------------------------
    function logout() {
        setUser(null);
        router.push("/signin");
    }

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be inside provider");
    return ctx;
}
