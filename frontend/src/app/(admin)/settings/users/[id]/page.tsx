"use client";

import {useEffect, useState} from "react";
import {useRouter, useParams} from "next/navigation";
import {API} from "@/app/api";

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
}

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const userId = params?.id;

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // ===============================
    // LOAD USER
    // ===============================
    async function loadUser() {
        try {
            const res = await fetch(`${API}/users/${userId}/`, {
                method: "GET",
                credentials: "include",
            });

            if (res.status === 401) {
                router.push("/signin");
                return;
            }

            if (!res.ok) {
                console.error("Failed to load user:", res.status);
                return;
            }

            const data = await res.json();
            setUser(data);
        } catch (err) {
            console.error("Load user error:", err);
        }

        setLoading(false);
    }

    // ===============================
    // SAVE USER
    // ===============================
    async function saveUser() {
        if (!user) return;

        setSaving(true);

        try {
            const res = await fetch(`${API}/users/${userId}/`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            if (res.status === 401) {
                router.push("/signin");
                return;
            }

            if (!res.ok) {
                console.error("Ошибка сохранения:", res.status);
            } else {
                router.push("/settings/users");
            }
        } catch (err) {
            console.error("Ошибка сохранения:", err);
        }

        setSaving(false);
    }

    useEffect(() => {
        loadUser();
    }, []);

    if (loading || !user) return <p>Loading...</p>;

    return (
        <div className="max-w-xl space-y-4">
            <h1 className="text-2xl font-semibold">Edit user</h1>

            <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                    className="w-full rounded border px-3 py-2"
                    value={user.email}
                    onChange={(e) => setUser({...user, email: e.target.value})}
                />
            </div>

            <div>
                <label className="block text-sm font-medium">First name</label>
                <input
                    className="w-full rounded border px-3 py-2"
                    value={user.first_name}
                    onChange={(e) =>
                        setUser({...user, first_name: e.target.value})
                    }
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Last name</label>
                <input
                    className="w-full rounded border px-3 py-2"
                    value={user.last_name}
                    onChange={(e) =>
                        setUser({...user, last_name: e.target.value})
                    }
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Role</label>
                <select
                    className="w-full rounded border px-3 py-2"
                    value={user.role}
                    onChange={(e) => setUser({...user, role: e.target.value})}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <button
                onClick={saveUser}
                disabled={saving}
                className="rounded bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 disabled:bg-gray-400"
            >
                {saving ? "Saving..." : "Save"}
            </button>
        </div>
    );
}
