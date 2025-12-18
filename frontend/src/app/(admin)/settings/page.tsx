"use client";

import Link from "next/link";

import ComponentCard from "@/components/common/ComponentCard";
import BaseDataTable from "@/components/tables/base/BaseDataTable";
import {PencilIcon} from "@/icons";

type SettingRow = {
    id: number;
    name: string;
    path: string;
};

const SETTINGS: SettingRow[] = [
    {id: 1, name: "Users", path: "/settings/users"},
    {id: 2, name: "Roles", path: "/settings/roles"},
    {id: 3, name: "Categories", path: "/settings/categories"},
    {id: 4, name: "Integrations", path: "/settings/integrations"},
];

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            {/* PAGE HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Settings</h1>
            </div>

            {/* CARD — TailAdmin style */}
            <ComponentCard title="">
                <BaseDataTable<SettingRow>
                    columns={[
                        {key: "id", label: "ID", width: "w-[80px]", searchable: false},
                        {key: "name", label: "Раздел"},
                    ]}
                    data={SETTINGS}
                    actionRenderer={(row) => (
                        <div className="flex items-center justify-center">
                            <Link
                                href={row.path}
                                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                                title="Open"
                            >
                                <PencilIcon/>
                            </Link>
                        </div>
                    )}
                />
            </ComponentCard>
        </div>
    );
}
