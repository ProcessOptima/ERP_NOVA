"use client";

import {useState, useMemo} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import PaginationWithButton from "@/components/tables/DataTables/TableTwo/PaginationWithButton"
import type {BaseDataTableProps} from "./BaseDataTable.types";


export default function BaseDataTable<T extends { id: number }>({
                                                                    columns,
                                                                    data,
                                                                    actionRenderer,
                                                                }: BaseDataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [search, setSearch] = useState("");

    /* =========================
       FILTER (1:1 как в шаблоне)
       ========================= */
    const filteredData = useMemo(() => {
        return data.filter((row) =>
            columns.some((col) => {
                if (col.searchable === false) return false;
                const value = row[col.key];
                return (
                    typeof value === "string" &&
                    value.toLowerCase().includes(search.toLowerCase())
                );
            })
        );
    }, [data, columns, search]);

    /* =========================
       PAGINATION (1:1)
       ========================= */
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const pageData = filteredData.slice(startIndex, endIndex);

    return (
        <div className="overflow-hidden rounded-xl bg-white dark:bg-white/[0.03]">
            <div
                className="flex flex-col gap-2 px-4 py-4 border border-b-0 border-gray-100 dark:border-white/[0.05] rounded-t-xl sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-gray-500 dark:text-gray-400"> Show </span>
                    <div className="relative z-20 bg-transparent">
                        <select
                            className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            {[5, 10, 20].map((v) => (
                                <option
                                    key={v}
                                    value={v}
                                    className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                                >
                                    {v}
                                </option>
                            ))}
                        </select>
                        <span
                            className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
              <svg
                  className="stroke-current"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                    stroke=""
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
              </svg>
            </span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400"> entries </span>
                </div>

                <div className="relative">
                    <button className="absolute text-gray-500 -translate-y-1/2 left-4 top-1/2 dark:text-gray-400">
                        <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                                fill=""
                            />
                        </svg>
                    </button>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Search..."
                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 xl:w-[300px]"
                    />
                </div>
            </div>

            <div className="max-w-full overflow-x-auto custom-scrollbar">
                <div>
                    <Table>
                        <TableHeader className="border-t border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                {columns.map((col) => (
                                    <TableCell
                                        key={String(col.key)}
                                        isHeader
                                        className={`
    px-4 py-3 border border-gray-100 dark:border-white/[0.05]
    text-theme-xs font-medium text-gray-700 dark:text-gray-400
    whitespace-nowrap
    ${col.align === "center" ? "text-center" : ""}
    ${col.align === "right" ? "text-right" : "text-left"}
  `}
                                    >
                                        <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                                            {col.label}
                                        </p>
                                    </TableCell>
                                ))}

                                {actionRenderer && (
                                    <TableCell
                                        isHeader
                                        className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                                    >
                                        <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                                            Action
                                        </p>
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pageData.map((row) => (
                                <TableRow key={row.id}>
                                    {columns.map((col) => (
                                        <TableCell
                                            key={String(col.key)}
                                            className={`
    px-4 py-4 font-normal text-gray-800
    border border-gray-100 dark:border-white/[0.05]
    text-theme-sm dark:text-gray-400 whitespace-nowrap
    ${col.align === "center" ? "text-center" : ""}
    ${col.align === "right" ? "text-right" : "text-left"}
  `}
                                        >
                                            {col.render
                                                ? col.render(row)
                                                : String(row[col.key] ?? "")}
                                        </TableCell>
                                    ))}

                                    {actionRenderer && (
                                        <TableCell
                                            className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] whitespace-nowrap">
                                            {actionRenderer(row)}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div
                className="border border-t-0 rounded-b-xl border-gray-100 py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
                    {/* Left side: Showing entries */}

                    <PaginationWithButton
                        totalPages={totalPages}
                        initialPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                    <div className="pt-3 xl:pt-0">
                        <p className="pt-3 text-sm font-medium text-center text-gray-500 border-t border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-t-0 xl:pt-0 xl:text-left">
                            Showing {startIndex + 1} to {endIndex} of {totalItems} entries
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
