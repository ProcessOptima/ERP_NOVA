// src/app/(admin)/settings/users/new/page.tsx
"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {fetchWithAuth} from "@/app/api";

export default function NewUserPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        email: "",
        first_name: "",
        last_name: "",
        role: "user",
        password: "",
    });

    function updateField(key: string, value: string) {
        setForm((prev) => ({...prev, [key]: value}));
    }

    async function submit() {
        try {
            const res = await fetchWithAuth("/users/", {
                method: "POST",
                body: JSON.stringify(form),
            });

            if (res.ok) {
                router.push("/settings/users");
            } else {
                console.error("Create user error:", res.status, await res.text());
            }
        } catch (e) {
            console.error("Network error:", e);
        }
    }

    return (
        <div className="max-w-xl space-y-4">
            <h1 className="text-2xl font-semibold mb-6">Create user</h1>

            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
                className="w-full border px-4 py-2 rounded-lg"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
            />

            <label className="block text-sm font-medium text-gray-700">
                First name
            </label>
            <input
                className="w-full border px-4 py-2 rounded-lg"
                value={form.first_name}
                onChange={(e) => updateField("first_name", e.target.value)}
            />

            <label className="block text-sm font-medium text-gray-700">
                Last name
            </label>
            <input
                className="w-full border px-4 py-2 rounded-lg"
                value={form.last_name}
                onChange={(e) => updateField("last_name", e.target.value)}
            />

            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
                className="w-full border px-4 py-2 rounded-lg"
                value={form.role}
                onChange={(e) => updateField("role", e.target.value)}
            >
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>

            <label className="block text-sm font-medium text-gray-700">
                Password
            </label>
            <input
                className="w-full border px-4 py-2 rounded-lg"
                type="password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
            />

            <button
                onClick={submit}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
                Save
            </button>
        </div>
    );
}
