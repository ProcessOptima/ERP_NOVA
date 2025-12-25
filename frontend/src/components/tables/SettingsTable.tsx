"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Button from "@/components/ui/button/Button";
import PaginationWithButton from "@/components/tables/DataTables/TableTwo/PaginationWithButton";

type SettingsRow = {
  id: number;
  name: string;
  href: string;
};

const settingsData: SettingsRow[] = [
  { id: 1, name: "Users", href: "/settings/users" },
  { id: 2, name: "Roles", href: "/settings/roles" },
  { id: 3, name: "Categories", href: "/settings/categories" },
  { id: 4, name: "Integrations", href: "/settings/integrations" },
];

export default function SettingsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    return settingsData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="overflow-hidden rounded-xl bg-white dark:bg-white/[0.03]">
      {/* TOP BAR */}
      <div className="flex flex-col gap-2 px-4 py-4 border border-b-0 border-gray-100 dark:border-white/[0.05] rounded-t-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 dark:text-gray-400">Show</span>

          <select
            className="h-9 rounded-lg border border-gray-300 bg-transparent px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            {[5, 10, 20].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          <span className="text-gray-500 dark:text-gray-400">entries</span>
        </div>

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:bg-gray-900 xl:w-[300px]"
        />
      </div>

      {/* TABLE */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-t border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-4 py-3">
                Table name
              </TableCell>
              <TableCell isHeader className="px-4 py-3 text-right">
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="px-4 py-4 font-medium">
                  {row.name}
                </TableCell>
                <TableCell className="px-4 py-4 text-right">
                  <Link href={row.href}>
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* FOOTER */}
      <div className="border border-t-0 rounded-b-xl border-gray-100 py-4 px-4 dark:border-white/[0.05]">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
          <PaginationWithButton
            totalPages={totalPages}
            initialPage={currentPage}
            onPageChange={setCurrentPage}
          />

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {startIndex + 1} to {endIndex} of {totalItems} entries
          </p>
        </div>
      </div>
    </div>
  );
}
