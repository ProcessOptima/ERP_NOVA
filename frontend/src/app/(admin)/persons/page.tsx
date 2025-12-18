"use client";

import {useEffect, useState} from "react";
import Link from "next/link";

import {fetchWithAuth} from "@/app/api";
import ComponentCard from "@/components/common/ComponentCard";
import BaseDataTable from "@/components/tables/base/BaseDataTable";
import Button from "@/components/ui/button/Button";
import {PencilIcon, TrashBinIcon} from "@/icons";

type Person = {
    id: number;
    full_name: string;
    email: string | null;
    birthday: string | null;
    sex: number | null;
};

type PersonRow = {
    id: number;
    full_name: string;
    email: string;
    birthday: string;
    sex: string;
};

function sexLabel(v: number | null): string {
    if (v === 1) return "Male";
    if (v === 2) return "Female";
    return "";
}

export default function PersonsPage() {
    const [rows, setRows] = useState<PersonRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadPersons() {
        try {
            const res = await fetchWithAuth("/persons/");
            if (!res.ok) throw new Error(`API error: ${res.status}`);

            const data: Person[] = await res.json();

            setRows(
                data.map((p) => ({
                    id: p.id,
                    full_name: p.full_name ?? "",
                    email: p.email ?? "",
                    birthday: p.birthday ?? "",
                    sex: sexLabel(p.sex),
                }))
            );
        } catch (e) {
            console.error(e);
            setError("Не удалось загрузить список персон");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(personId: number) {
        const ok = window.confirm("Удалить персону?");
        if (!ok) return;

        try {
            const res = await fetchWithAuth(`/persons/${personId}/`, {method: "DELETE"});
            if (!res.ok) {
                alert("Ошибка удаления");
                return;
            }
            setRows((prev) => prev.filter((r) => r.id !== personId));
        } catch (e) {
            console.error(e);
            alert("Network error");
        }
    }

    useEffect(() => {
        loadPersons();
    }, []);

    if (loading) return <p className="text-gray-500">Loading...</p>;
    if (error) return <div className="rounded bg-red-100 px-4 py-3 text-red-800">{error}</div>;

    return (
        <div className="space-y-6">
            {/* PAGE HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Persons</h1>

                <Link href="/persons/new">
                    <Button>+ New person</Button>
                </Link>
            </div>

            <ComponentCard title="">
                <BaseDataTable<PersonRow>
                    columns={[
                        {key: "id", label: "ID", width: "w-[80px]", searchable: false},
                        {key: "full_name", label: "Full name"},
                        {key: "email", label: "Email", width: "w-[260px]"},
                        {key: "birthday", label: "Birthday", width: "w-[140px]"},
                        {key: "sex", label: "Sex", width: "w-[120px]"},
                    ]}
                    data={rows}
                    actionRenderer={(row) => (
                        <div className="flex items-center justify-center gap-2">
                            <Link
                                href={`/persons/${row.id}`}
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
