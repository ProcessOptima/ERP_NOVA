"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { fetchWithAuth } from "@/app/api";
import ComponentCard from "@/components/common/ComponentCard";
import BaseDataTable from "@/components/tables/base/BaseDataTable";
import Button from "@/components/ui/button/Button";
import { PencilIcon, TrashBinIcon } from "@/icons";

import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";

/* =======================
   TYPES
======================= */

type Person = {
    id: number;
    full_name: string;
    email: string | null;
    birthday: string | null; // YYYY-MM-DD
    sex: number | null;      // 1 | 2
};

type PersonRow = {
    id: number;
    full_name: string;
    email: string;
    birthday: string;
    sex: string;
};

/* =======================
   CONSTANTS
======================= */

const sexOptions = [
    { value: "1", label: "Male" },
    { value: "2", label: "Female" },
];

function sexLabel(v: number | null): string {
    if (v === 1) return "Male";
    if (v === 2) return "Female";
    return "";
}

/* =======================
   PAGE
======================= */

export default function PersonsPage() {
    const [data, setData] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /* FILTER STATE (CONTROLLED) */
    const [sexFilter, setSexFilter] = useState<string>("");
    const [birthdayFilter, setBirthdayFilter] = useState<string>("");

    /* =======================
       LOAD
    ======================= */

    useEffect(() => {
        async function load() {
            try {
                const res = await fetchWithAuth("/persons/");
                if (!res.ok) throw new Error(`API ${res.status}`);
                setData(await res.json());
            } catch (e) {
                console.error(e);
                setError("Не удалось загрузить список персон");
            } finally {
                setLoading(false);
            }
        }

        void load();
    }, []);

    /* =======================
       FILTER + MAP
    ======================= */

    const rows: PersonRow[] = useMemo(() => {
        return data
            .filter((p) => {
                if (sexFilter && String(p.sex) !== sexFilter) return false;
                if (birthdayFilter && p.birthday !== birthdayFilter) return false;
                return true;
            })
            .map((p) => ({
                id: p.id,
                full_name: p.full_name ?? "",
                email: p.email ?? "",
                birthday: p.birthday ?? "",
                sex: sexLabel(p.sex),
            }));
    }, [data, sexFilter, birthdayFilter]);

    /* =======================
       DELETE
    ======================= */

    async function handleDelete(id: number) {
        if (!window.confirm("Удалить персону?")) return;

        const res = await fetchWithAuth(`/persons/${id}/`, { method: "DELETE" });
        if (!res.ok) {
            alert("Ошибка удаления");
            return;
        }

        setData((prev) => prev.filter((p) => p.id !== id));
    }

    /* =======================
       RENDER
    ======================= */

    if (loading) return <p className="text-gray-500">Loading...</p>;
    if (error) {
        return (
            <div className="rounded bg-red-100 px-4 py-3 text-red-800">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Persons</h1>

                <Link href="/persons/new">
                    <Button>+ New person</Button>
                </Link>
            </div>

            {/* FILTERS */}
            <ComponentCard title="">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* SEX — TAILADMIN SELECT */}
                    <Select
                        options={sexOptions}
                        placeholder="Sex"
                        defaultValue={sexFilter}
                        onChange={(value) => setSexFilter(value)}
                        className="dark:bg-dark-900"
                    />

                    {/* BIRTHDAY — TAILADMIN DATEPICKER */}
                    <DatePicker
                        id="persons-birthday-filter"
                        placeholder="Birthday"
                        onChange={(_, dateStr) => {
                            setBirthdayFilter(dateStr || "");
                        }}
                    />

                    {/* RESET */}
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSexFilter("");
                            setBirthdayFilter("");
                        }}
                    >
                        Reset filters
                    </Button>
                </div>
            </ComponentCard>

            {/* TABLE */}
            <ComponentCard title="">
                <BaseDataTable<PersonRow>
                    columns={[
                        { key: "id", label: "ID", width: "w-[80px]", searchable: false },
                        { key: "full_name", label: "Full name" },
                        { key: "email", label: "Email", width: "w-[260px]" },
                        { key: "birthday", label: "Birthday", width: "w-[140px]" },
                        { key: "sex", label: "Sex", width: "w-[120px]" },
                    ]}
                    data={rows}
                    actionRenderer={(row) => (
                        <div className="flex items-center justify-center gap-2">
                            <Link
                                href={`/persons/${row.id}`}
                                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                            >
                                <PencilIcon />
                            </Link>

                            <button
                                onClick={() => handleDelete(row.id)}
                                className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
                            >
                                <TrashBinIcon />
                            </button>
                        </div>
                    )}
                />
            </ComponentCard>
        </div>
    );
}
