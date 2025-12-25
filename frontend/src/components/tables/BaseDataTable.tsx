"use client";

import {useMemo, useState} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import PaginationWithButton from "@/components/tables/DataTables/TableTwo/PaginationWithButton";

import {BaseDataTableProps} from "./BaseDataTable.types";

export default function BaseDataTable<T extends { id: number }>({
                                                                    title,
                                                                    columns,
                                                                    data,
                                                                    actions,
                                                                }: BaseDataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [search, setSearch] = useState("");

    const filteredData = useMemo(() => {
        return data.filter((row) =>
            Object.values(row).some(
                (v) =>
                    typeof v === "string" &&
                    v.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [data, search]);

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, totalItems);
    const pageData = filteredData.slice(start, end);

    return (
        <div className="overflow-hidden rounded-xl bg-white dark:bg-white/[0.03]">
            {/* HEADER */}
            <div
                className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.05] flex items-center justify-between">
                <h1 className="text-lg font-semibold">{title}</h1>
                <input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-10 rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
            </div>

            {/* TABLE */}
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell key={String(col.key)} isHeader>
                                    {col.label}
                                </TableCell>
                            ))}
                            {actions && <TableCell isHeader>Action</TableCell>}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {pageData.map((row) => (
                            <TableRow key={row.id}>
                                {columns.map((col) => (
                                    <TableCell key={String(col.key)}>
                                        {String(row[col.key] ?? "")}
                                    </TableCell>
                                ))}
                                {actions && (
                                    <TableCell className="text-right">
                                        {actions(row)}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* FOOTER */}
            <div
                className="px-4 py-4 border-t border-gray-100 dark:border-white/[0.05] flex items-center justify-between">
                <PaginationWithButton
                    totalPages={totalPages}
                    initialPage={currentPage}
                    onPageChange={setCurrentPage}
                />
                <p className="text-sm text-gray-500">
                    Showing {start + 1} to {end} of {totalItems}
                </p>
            </div>
        </div>
    );
}
