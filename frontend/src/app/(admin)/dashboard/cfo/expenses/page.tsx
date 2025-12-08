"use client";

import {useEffect, useMemo, useState} from "react";

import ExpenseFilters from "./components/ExpenseFilters";
import ExpenseCreditorsTable from "./components/ExpenseCreditorsTable";
import PeriodSwitcher from "./components/PeriodSwitcher";

import {ExpenseFiltersType} from "./types/filters";
import {Transaction} from "../transactions/types/transaction";

function getLastMonthRange() {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const to = new Date(now.getFullYear(), now.getMonth(), 0); // конец прошлого месяца
    return {from, to};
}

export default function Page() {
    const [{from, to}] = useState(getLastMonthRange);

    const [allDebit, setAllDebit] = useState<Transaction[]>([]);
    const [filters, setFilters] = useState<ExpenseFiltersType>({
        dateFrom: from.toISOString().slice(0, 10),
        dateTo: to.toISOString().slice(0, 10),
        category: null,
        periodMode: "last_month",
    });

    // --- загрузка данных ---
    useEffect(() => {
        fetch("/api/cfo/expenses")
            .then((r) => r.json())
            .then((j) => setAllDebit(j.expenses ?? []));
    }, []);

    // --- список категорий ---
    const categories = useMemo(
        () => [...new Set(allDebit.map((r) => r.category))],
        [allDebit]
    );

    // --- фильтрация по периоду + категории ---
    const filtered = useMemo(() => {
        return allDebit.filter((r) => {
            const rDate = new Date(r.date);

            // режим «последний месяц»
            if (filters.periodMode === "last_month") {
                if (filters.dateFrom && rDate < new Date(filters.dateFrom))
                    return false;
                if (filters.dateTo && rDate > new Date(filters.dateTo))
                    return false;
            }

            // режим "все время" — без дат
            if (filters.periodMode === "all_time") {
                // но категория всё равно работает
            }

            if (filters.category && r.category !== filters.category)
                return false;

            return true;
        });
    }, [allDebit, filters]);

    // --- агрегация по кредиторам ---
    const aggregated = useMemo(() => {
        if (filtered.length === 0) return [];

        const groups: Record<string, number> = {};
        let total = 0;

        for (const tx of filtered) {
            const creditor = tx.creditorparty_name || "Не указан";
            const amount = tx.corrected_amount || 0;

            groups[creditor] = (groups[creditor] || 0) + amount;
            total += amount;
        }

        return Object.entries(groups)
            .map(([creditor, amount]) => ({
                creditor,
                amount,
                percent: (amount / total) * 100,
            }))
            .sort((a, b) => b.amount - a.amount)
    }, [filtered]);

    // --- переключатель периода ---
    const togglePeriod = () => {
        if (filters.periodMode === "last_month") {
            setFilters({
                ...filters,
                periodMode: "all_time",
                dateFrom: null,
                dateTo: null,
            });
        } else {
            const {from, to} = getLastMonthRange();
            setFilters({
                ...filters,
                periodMode: "last_month",
                dateFrom: from.toISOString().slice(0, 10),
                dateTo: to.toISOString().slice(0, 10),
            });
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Детализация расходов</h1>

            <PeriodSwitcher mode={filters.periodMode} onChange={togglePeriod}/>

            <ExpenseFilters
                categories={categories}
                filters={filters}
                onChange={setFilters}
            />

            <ExpenseCreditorsTable rows={aggregated}/>
        </div>
    );
}
