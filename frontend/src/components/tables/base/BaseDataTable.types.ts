import React from "react";

export type Column<T> = {
    key: keyof T;
    label: string;
    width?: string;            // Tailwind: w-[80px]
    align?: "left" | "center" | "right";
    searchable?: boolean;
    render?: (row: T) => React.ReactNode;
};

export interface BaseDataTableProps<T> {
    title?: string;
    columns: Column<T>[];
    data: T[];
    actionRenderer?: (row: T) => React.ReactNode;
}

