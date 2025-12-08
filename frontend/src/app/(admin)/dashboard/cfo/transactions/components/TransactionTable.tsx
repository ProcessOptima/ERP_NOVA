"use client";

import React, {useState, useMemo} from "react";

import { Transaction } from "../types/transaction";

type Props = {
    data: Transaction[];
};

export default function TransactionTable({data}: Props) {
    const [sortField, setSortField] = useState<keyof Transaction>("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const handleSort = (field: keyof Transaction) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => {
            const valA = a[sortField] ?? "";
            const valB = b[sortField] ?? "";

            let res = 0;

            if (typeof valA === "number" && typeof valB === "number") {
                res = valA - valB;
            } else {
                res = String(valA).localeCompare(String(valB));
            }

            return sortOrder === "asc" ? res : -res;
        });
    }, [data, sortField, sortOrder]);

    const th = (field: keyof Transaction, label: string) => (
        <th
            className="px-4 py-4 font-medium text-black dark:text-white cursor-pointer select-none"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center gap-1">
                <span>{label}</span>
                {sortField === field && (
                    <span className="text-sm">
          {sortOrder === "asc" ? "↑" : "↓"}
        </span>
                )}
            </div>
        </th>
    );


    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5
                    shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        {th("date", "Дата")}
                        {th("description", "Описание")}
                        {th("contragent_name", "Контрагент")}
                        {th("debtorparty_name", "Дебитор")}
                        {th("creditorparty_name", "Кредитор")}
                        {th("category", "Категория")}
                        {th("corrected_amount", "Сумма ₽")}
                        {th("creditdebitindicator", "Тип")}
                        {th("flow", "Банк")}
                    </tr>
                    </thead>

                    <tbody>
                    {sortedData.map((t, i) => (
                        <tr key={i} className="border-b border-[#eee] dark:border-strokedark">
                            <td className="px-4 py-5">{t.date}</td>
                            <td className="px-4 py-5 text-sm">{t.description}</td>
                            <td className="px-4 py-5 text-sm">{t.contragent_name ?? "-"}</td>
                            <td className="px-4 py-5 text-sm">{t.debtorparty_name ?? "-"}</td>
                            <td className="px-4 py-5 text-sm">{t.creditorparty_name ?? "-"}</td>
                            <td className="px-4 py-5">{t.category}</td>
                            <td className="px-4 py-5 font-medium">
                                {t.corrected_amount.toLocaleString()} ₽
                            </td>
                            <td className="px-4 py-5">{t.creditdebitindicator}</td>
                            <td className="px-4 py-5">{t.flow}</td>
                        </tr>
                    ))}

                    {sortedData.length === 0 && (
                        <tr>
                            <td colSpan={10} className="py-4 text-center text-gray-500">
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
