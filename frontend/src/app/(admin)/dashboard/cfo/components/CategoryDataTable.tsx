"use client";

import {useState, useMemo} from "react";
import {useRouter} from "next/navigation";
import {formatNumber} from "@/lib/format";

export interface CategoryRow {
    category: string;
    amount: number;
    percent: number;
    creditdebitindicator: "CREDIT" | "DEBIT";
}

interface Props {
    rows: CategoryRow[];
}

export default function CategoryDataTable({rows}: Props) {
    const router = useRouter();

    const [sortField, setSortField] =
        useState<"amount" | "percent" | "category">("amount");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const creditRows = useMemo(
        () => rows.filter((r) => r.creditdebitindicator === "CREDIT"),
        [rows]
    );

    const debitRows = useMemo(
        () => rows.filter((r) => r.creditdebitindicator === "DEBIT"),
        [rows]
    );

    const sortFn = (a: CategoryRow, b: CategoryRow) => {
        let res = 0;

        if (sortField === "category") {
            res = a.category.localeCompare(b.category);
        } else if (sortField === "amount") {
            res = a.amount - b.amount;
        } else {
            res = a.percent - b.percent;
        }

        return sortOrder === "asc" ? res : -res;
    };

    const sortedCredit = useMemo(
        () => [...creditRows].sort(sortFn),
        [creditRows, sortField, sortOrder]
    );

    const sortedDebit = useMemo(
        () => [...debitRows].sort(sortFn),
        [debitRows, sortField, sortOrder]
    );

    const handleSort = (field: typeof sortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("desc");
        }
    };

    const arrow = (type: "CREDIT" | "DEBIT") =>
        type === "CREDIT" ? (
            <span className="text-green-600 font-bold mr-2">↑</span>
        ) : (
            <span className="text-red-600 font-bold mr-2">↓</span>
        );

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default
                        dark:border-strokedark dark:bg-boxdark sm:px-7.5">
            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th
                            className="cursor-pointer py-4 px-4 font-medium text-black dark:text-white"
                            onClick={() => handleSort("category")}
                        >
                            Категория {sortField === "category" && (sortOrder === "asc" ? "↑" : "↓")}
                        </th>

                        <th
                            className="cursor-pointer py-4 px-4 font-medium text-black dark:text-white"
                            onClick={() => handleSort("amount")}
                        >
                            Сумма ₽ {sortField === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                        </th>

                        <th
                            className="cursor-pointer py-4 px-4 font-medium text-black dark:text-white"
                            onClick={() => handleSort("percent")}
                        >
                            % от дохода {sortField === "percent" && (sortOrder === "asc" ? "↑" : "↓")}
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {/* === ДОХОДЫ === */}
                    {sortedCredit.map((row, i) => (
                        <tr
                            key={"CREDIT-" + i}
                            className="border-b border-stroke dark:border-strokedark cursor-pointer hover:bg-gray-100"
                            onClick={() =>
                                router.push(
                                    `/dashboard/cfo/transactions?category=${encodeURIComponent(row.category)}`
                                )
                            }
                        >
                            <td className="py-4 px-4 flex items-center">
                                {arrow(row.creditdebitindicator)}
                                {row.category}
                            </td>

                            {/* ★ FIXED: ЕДИНЫЙ ФОРМАТАТОР */}
                            <td className="py-4 px-4">
                                {formatNumber(row.amount)} ₽
                            </td>

                            <td className="py-4 px-4">
                                {row.percent.toFixed(2)}%
                            </td>
                        </tr>
                    ))}

                    <tr>
                        <td colSpan={3} className="py-2"></td>
                    </tr>

                    {/* === РАСХОДЫ === */}
                    {sortedDebit.map((row, i) => (
                        <tr
                            key={"DEBIT-" + i}
                            className="border-b border-stroke dark:border-strokedark cursor-pointer hover:bg-gray-100"
                            onClick={() =>
                                router.push(
                                    `/dashboard/cfo/transactions?category=${encodeURIComponent(row.category)}`
                                )
                            }
                        >
                            <td className="py-4 px-4 flex items-center">
                                {arrow(row.creditdebitindicator)}
                                {row.category}
                            </td>

                            {/* ★ FIXED */}
                            <td className="py-4 px-4">
                                {formatNumber(row.amount)} ₽
                            </td>

                            <td className="py-4 px-4">
                                {row.percent.toFixed(2)}%
                            </td>
                        </tr>
                    ))}

                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={3} className="py-4 text-center text-gray-500">
                                Нет данных
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
