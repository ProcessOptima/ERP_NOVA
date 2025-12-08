"use client";

import Select from "@/components/form/Select";

interface Props {
    years: number[];
    months: number[];
    year: number;
    month: number;
    onYearChange: (y: number) => void;
    onMonthChange: (m: number) => void;
}

export default function CategoryFilter({
                                           years,
                                           months,
                                           year,
                                           month,
                                           onYearChange,
                                           onMonthChange,
                                       }: Props) {

    const yearOptions = years.map((y) => ({
        label: y.toString(),
        value: String(y),
    }));

    const monthOptions = [
        {label: "Все месяцы", value: "0"},
        ...months
            .filter((m) => m !== 0)
            .map((m) => ({
                label: m.toString(),
                value: String(m),
            })),
    ];

    return (
        <div className="flex flex-col md:flex-row gap-4">

            {/* YEAR FILTER */}
            <div className="w-full md:w-1/4">
                <Select
                    options={yearOptions}
                    placeholder="Год"
                    defaultValue={String(year)}        // ✔ возвращаем defaultValue
                    onChange={(v) => onYearChange(Number(v))}
                />
            </div>

            {/* MONTH FILTER */}
            <div className="w-full md:w-1/4">
                <Select
                    options={monthOptions}
                    placeholder="Месяц"
                    defaultValue={String(month)}        // ✔ возвращаем defaultValue
                    onChange={(v) => onMonthChange(Number(v))}
                />
            </div>

        </div>
    );
}
