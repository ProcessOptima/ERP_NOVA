// src/app/(admin)/settings/users/[id]/page.tsx
"use client";

import {useEffect, useState} from "react";
import {useRouter, useParams} from "next/navigation";
import {fetchWithAuth} from "@/app/api";

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

    async function loadUser() {
        try {
            const res = await fetchWithAuth(`/users/${userId}/`);
            if (!res.ok) {
                console.error("Failed to load user:", res.status);
                setUser(null);
            } else {
                const data = await res.json();
                setUser(data);
            }
        } catch (e) {
            console.error("Ошибка загрузки пользователя:", e);
        }
        setLoading(false);
    }

    async function saveUser() {
        if (!user) return;
        setSaving(true);
        try {
            const res = await fetchWithAuth(`/users/${userId}/`, {
                method: "PUT",
                body: JSON.stringify(user),
            });
            if (res.ok) {
                router.push("/settings/users");
            } else {
                console.error("Ошибка сохранения:", res.status);
            }
        } catch (e) {
            console.error("Ошибка сохранения:", e);
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

            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
                className="w-full border px-4 py-2 rounded-lg"
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value})}
            />

            <label className="block text-sm font-medium text-gray-700">
                First name
            </label>
            <input
                className="w-full border px-4 py-2 rounded-lg"
                value={user.first_name}
                onChange={(e) => setUser({...user, first_name: e.target.value})}
            />

            <label className="block text-sm font-medium text-gray-700">
                Last name
            </label>
            <input
                className="w-full border px-4 py-2 rounded-lg"
                value={user.last_name}
                onChange={(e) => setUser({...user, last_name: e.target.value})}
            />

            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
                className="w-full border px-4 py-2 rounded-lg"
                value={user.role}
                onChange={(e) => setUser({...user, role: e.target.value})}
            >
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>

            <button
                onClick={saveUser}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-400"
            >
                {saving ? "Saving..." : "Save"}
            </button>
        </div>
    );
}
