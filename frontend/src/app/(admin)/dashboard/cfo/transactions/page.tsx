"use client";

import {useEffect, useMemo, useState} from "react";
import {useSearchParams} from "next/navigation";

import TransactionFilters from "./components/TransactionFilters";
import TransactionTable from "./components/TransactionTable";

import {Transaction} from "./types/transaction";
import {TransactionFilters as Filters} from "./types/filters";

export default function Page() {
    const [allRows, setAllRows] = useState<Transaction[]>([]);

    const [filters, setFilters] = useState<Filters>({
        dateFrom: null,
        dateTo: null,
        indicator: null,
        category: null,
        search: "",
    });

    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");

    // Загружаем все транзакции
    useEffect(() => {
        fetch("/api/cfo/transactions")
            .then((r) => r.json())
            .then((j) => setAllRows(j.all_transactions));
    }, []);

    // Автоустановка категории при переходе из таблицы категорий
    useEffect(() => {
        if (categoryParam) {
            setFilters((prev) => ({
                ...prev,
                category: categoryParam,
            }));
        }
    }, [categoryParam]);

    const categories = useMemo(
        () => [...new Set(allRows.map((r) => r.category))],
        [allRows]
    );

    const filtered = useMemo(() => {
        return allRows.filter((r) => {
            if (filters.dateFrom && r.date < filters.dateFrom) return false;
            if (filters.dateTo && r.date > filters.dateTo) return false;

            if (filters.indicator && r.creditdebitindicator !== filters.indicator)
                return false;
            if (filters.category && r.category !== filters.category) return false;

            const s = filters.search.toLowerCase();
            if (
                s &&
                !r.category.toLowerCase().includes(s) &&
                !(r.description ?? "").toLowerCase().includes(s) &&
                !String(r.corrected_amount).includes(s)
            )
                return false;


            return true;
        });
    }, [allRows, filters]);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Все транзакции</h1>

            <TransactionFilters
                categories={categories}
                filters={filters}
                onChange={setFilters}
            />

            <TransactionTable data={filtered}/>
        </div>
    );
}
