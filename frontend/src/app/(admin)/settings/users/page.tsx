"use client";

import {useEffect, useState} from "react";
import Link from "next/link";

import {fetchWithAuth} from "@/app/api";
import ComponentCard from "@/components/common/ComponentCard";
import BaseDataTable from "@/components/tables/base/BaseDataTable";
import Button from "@/components/ui/button/Button";
import {PencilIcon, TrashBinIcon} from "@/icons";

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
}

type UserRow = {
    id: number;
    name: string;
    email: string;
    role: string;
};

export default function UsersPage() {
    const [rows, setRows] = useState<UserRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ===============================
    // LOAD USERS
    // ===============================
    async function loadUsers() {
        try {
            const res = await fetchWithAuth("/users/");
            if (!res.ok) throw new Error(`API error: ${res.status}`);

            const data: User[] = await res.json();
            setRows(
                data.map((u) => ({
                    id: u.id,
                    name: `${u.first_name} ${u.last_name}`,
                    email: u.email,
                    role: u.role,
                }))
            );
        } catch (e) {
            console.error(e);
            setError("Не удалось загрузить пользователей");
        } finally {
            setLoading(false);
        }
    }

    // ===============================
    // DELETE USER
    // ===============================
    async function handleDelete(userId: number) {
        const ok = window.confirm("Удалить пользователя?");
        if (!ok) return;

        try {
            const res = await fetchWithAuth(`/users/${userId}/`, {
                method: "DELETE",
            });

            if (!res.ok) {
                alert("Ошибка удаления пользователя");
                return;
            }

            setRows((prev) => prev.filter((u) => u.id !== userId));
        } catch (e) {
            console.error(e);
            alert("Network error");
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    if (loading) return <p className="text-gray-500">Loading...</p>;
    if (error)
        return (
            <div className="rounded bg-red-100 px-4 py-3 text-red-800">
                {error}
            </div>
        );

    return (
        <div className="space-y-6">
            {/* PAGE HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Users</h1>

                <Link href="/settings/users/new">
                    <Button>+ New user</Button>
                </Link>
            </div>

            {/* ✅ CARD — 1:1 как TailAdmin */}
            <ComponentCard title="Users">
                <BaseDataTable<UserRow>
                    columns={[
                        {key: "id", label: "ID", width: "w-[80px]", searchable: false},
                        {key: "name", label: "Имя"},
                        {key: "email", label: "Email"},
                        {key: "role", label: "Роль", width: "w-[140px]"},
                    ]}
                    data={rows}
                    actionRenderer={(row) => (
                        <div className="flex items-center justify-center gap-2">
                            <Link
                                href={`/settings/users/${row.id}`}
                                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                            >
                                <PencilIcon/>
                            </Link>

                            <button
                                onClick={() => handleDelete(row.id)}
                                className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
                            >
                                <TrashBinIcon/>
                            </button>
                        </div>
                    )}
                />
            </ComponentCard>
        </div>
    );
}
