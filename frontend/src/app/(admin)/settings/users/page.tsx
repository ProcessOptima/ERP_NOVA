// src/app/(admin)/settings/users/page.tsx
"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {fetchWithAuth} from "@/app/api";

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadUsers() {
        try {
            const res = await fetchWithAuth("/users/");
            if (!res.ok) {
                setError(`API error: ${res.status}`);
                setUsers([]);
            } else {
                const data = await res.json();
                setUsers(Array.isArray(data) ? data : []);
            }
        } catch (e) {
            console.error("Ошибка загрузки пользователей:", e);
            setError("Network error");
        }
        setLoading(false);
    }

    useEffect(() => {
        loadUsers();
    }, []);

    if (loading) return <p>Loading...</p>;

    if (error)
        return (
            <div className="p-4 rounded bg-red-100 text-red-800">API error: {error}</div>
        );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Users</h1>

                <Link
                    href="/settings/users/new"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                    + New user
                </Link>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 border rounded-xl">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900 text-left text-sm">
                    <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Имя</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Роль</th>
                        <th/>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((u) => (
                        <tr key={u.id} className="border-t dark:border-gray-700">
                            <td className="px-4 py-3">{u.id}</td>
                            <td className="px-4 py-3">
                                {u.first_name} {u.last_name}
                            </td>
                            <td className="px-4 py-3">{u.email}</td>
                            <td className="px-4 py-3">{u.role}</td>
                            <td className="px-4 py-3 text-right">
                                <Link
                                    href={`/settings/users/${u.id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    Edit →
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
