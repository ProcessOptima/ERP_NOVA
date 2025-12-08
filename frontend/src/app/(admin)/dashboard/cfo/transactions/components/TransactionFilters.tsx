"use client";

import DatePicker from "@/components/form/date-picker";
import Select from "@/components/form/Select";

import {TransactionFilters} from "../types/filters";

interface Props {
    categories: string[];
    filters: TransactionFilters;
    onChange: (f: TransactionFilters) => void;
}

function formatMoscowDate(d: Date) {
    // Москва = UTC+3
    const moscow = new Date(d.getTime() + 3 * 60 * 60 * 1000);

    const y = moscow.getUTCFullYear();
    const m = String(moscow.getUTCMonth() + 1).padStart(2, "0");
    const day = String(moscow.getUTCDate()).padStart(2, "0");

    return `${y}-${m}-${day}`;
}

export default function TransactionFiltersComponent({
                                                        categories,
                                                        filters,
                                                        onChange,
                                                    }: Props) {

    const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : undefined;
    const toDate = filters.dateTo ? new Date(filters.dateTo) : undefined;

    return (
        <div className="grid grid-cols-5 gap-4 bg-white p-4 rounded-xl shadow">

            {/* Дата с */}
            <div>
                <label className="mb-2 block text-sm font-medium">Дата с</label>

                <DatePicker
                    id="dateFrom"
                    mode="single"
                    defaultDate={fromDate}
                    onChange={(dates: Date[]) => {
                        const d = dates[0]
                            ? formatMoscowDate(dates[0])
                            : null;

                        onChange({...filters, dateFrom: d});
                    }}
                    placeholder="Выберите дату"
                />
            </div>

            {/* Дата по */}
            <div>
                <label className="mb-2 block text-sm font-medium">Дата по</label>

                <DatePicker
                    id="dateTo"
                    mode="single"
                    defaultDate={toDate}
                    onChange={(dates: Date[]) => {
                        const d = dates[0]
                            ? formatMoscowDate(dates[0])
                            : null;

                        onChange({...filters, dateTo: d});
                    }}
                    placeholder="Выберите дату"
                />
            </div>

            {/* Тип */}
            <div>
                <label className="mb-2 block text-sm font-medium">Тип</label>

                <Select
                    placeholder="Выберите"
                    options={[
                        {value: "CREDIT", label: "Доход"},
                        {value: "DEBIT", label: "Расход"},
                    ]}
                    defaultValue={filters.indicator ?? ""}
                    onChange={(v: string) =>
                        onChange({
                            ...filters,
                            indicator: v || null,
                        })
                    }
                />

            </div>

            {/* Категория */}
            <div>
                <label className="mb-2 block text-sm font-medium">Категория</label>

                <Select
                    placeholder="Выберите"
                    options={categories.map((c: string) => ({
                        value: c,
                        label: c,
                    }))}
                    defaultValue={filters.category ?? ""}
                    onChange={(v: string) =>
                        onChange({
                            ...filters,
                            category: v || null,
                        })
                    }
                />

            </div>

            {/* Поиск */}
            <div>
                <label className="mb-2 block text-sm font-medium">Поиск</label>

                <input
                    className="h-11 w-full rounded-lg border px-4"
                    placeholder="Описание, категория, сумма"
                    value={filters.search}
                    onChange={(e) =>
                        onChange({...filters, search: e.target.value})
                    }
                />
            </div>
        </div>
    );
}
