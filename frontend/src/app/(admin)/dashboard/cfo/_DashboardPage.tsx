"use client";

import {useState, useMemo, useCallback} from "react";

import {Card, CardTitle, CardDescription} from "@/components/ui/card";

import RevenueBarChart from "./components/RevenueBarChart";
import CategoryFilter from "./components/CategoryFilter";
import CategoryDataTable from "./components/CategoryDataTable";
import PieChartIncome from "./components/PieChartIncome";
import PieChartExpenses from "./components/PieChartExpenses";

import {formatNumber} from "@/lib/format";


//
// ---------- TYPES ----------
//

interface FilterDate {
    year: number;
    month: number;
}

type CreditDebit = "CREDIT" | "DEBIT";

interface CategoryByMonth {
    category: string;
    year: number;
    month: number;
    corrected_amount: number;
    creditdebitindicator: CreditDebit;
}

interface RevenueByMonth {
    year: number;
    month: number;
    revenue: number;
}

interface CostsByMonth {
    year: number;
    month: number;
    costs: number;
}

interface ProfitByMonth {
    year: number;
    month: number;
    profit: number;
}

interface DividendsByMonth {
    year: number;
    month: number;
    dividends: number;
}

interface FinanceData {
    filter_date: FilterDate[];

    total_revenue: number;
    total_costs: number;
    total_profit: number;
    total_dividends: number;
    profitability: number;

    revenue_by_month: RevenueByMonth[];
    costs_by_month: CostsByMonth[];
    profit_by_month: ProfitByMonth[];
    dividends_by_month: DividendsByMonth[];

    category_by_month: CategoryByMonth[];
}

interface DashboardPageProps {
    initialData: FinanceData;
    user: {
        id: number;
        email: string;
        role: string;
    };
}

//
// ---------- COMPONENT ----------
//

export default function DashboardPage({initialData}: DashboardPageProps) {
    const [data] = useState<FinanceData>(initialData);

    //
    // ---------- FILTER OPTIONS ----------
    //
    const years = Array.from(new Set(data.filter_date.map(f => f.year)));

    const monthsList = Array.from(new Set(data.filter_date.map(f => f.month)));
    const months = [0, ...monthsList.filter(m => m !== 0)];

    const [year, setYear] = useState<number>(years[0] ?? 2025);
    const [month, setMonth] = useState<number>(0);

    //
    // ---------- PERIOD CHECK ----------
    //
    const isMatchPeriod = useCallback(
        (row: { year: number; month: number }) => {
            if (row.year !== year) return false;
            if (month === 0) return row.month === 0;
            return row.month === month;
        },
        [year, month]
    );

    //
    // ---------- REVENUE TOTAL ----------
    //
    const revenueTotal = useMemo(() => {
        if (month === 0) {
            return data.revenue_by_month
                .filter(r => r.year === year)
                .reduce((s, r) => s + r.revenue, 0);
        }

        return (
            data.revenue_by_month.find(
                r => r.year === year && r.month === month
            )?.revenue ?? 0
        );
    }, [data.revenue_by_month, year, month]);

    //
    // ---------- CATEGORY TABLE ----------
    //
    const tableRows = useMemo(() => {
        const filtered = data.category_by_month.filter(isMatchPeriod);

        const agg: Record<string, number> = {};

        filtered.forEach(r => {
            agg[r.category] = (agg[r.category] || 0) + r.corrected_amount;
        });

        return Object.entries(agg).map(([category, amount]) => {
            const type =
                filtered.find(r => r.category === category)?.creditdebitindicator ??
                "CREDIT";

            return {
                category,
                amount,
                percent: revenueTotal > 0 ? (amount / revenueTotal) * 100 : 0,
                creditdebitindicator: type,
            };
        });
    }, [data.category_by_month, isMatchPeriod, revenueTotal]);

    //
    // ---------- PIE INCOME ----------
    //
    const incomePie = useMemo(() => {
        const filtered = data.category_by_month.filter(
            r => r.creditdebitindicator === "CREDIT" && isMatchPeriod(r)
        );

        const agg: Record<string, number> = {};
        filtered.forEach(r => {
            agg[r.category] = (agg[r.category] || 0) + r.corrected_amount;
        });

        return Object.entries(agg).map(([category, amount]) => ({
            category,
            amount,
        }));
    }, [data.category_by_month, isMatchPeriod]);

    //
    // ---------- PIE EXPENSE ----------
    //
    const expensePie = useMemo(() => {
        const filtered = data.category_by_month.filter(
            r => r.creditdebitindicator === "DEBIT" && isMatchPeriod(r)
        );

        const agg: Record<string, number> = {};
        filtered.forEach(r => {
            agg[r.category] = (agg[r.category] || 0) + r.corrected_amount;
        });

        return Object.entries(agg).map(([category, amount]) => ({
            category,
            amount,
        }));
    }, [data.category_by_month, isMatchPeriod]);

    //
    // ---------- BAR ----------
    //
    const chartData = useMemo(() => {
        return data.revenue_by_month
            .filter(x => x.year === year)
            .map(x => {
                const cost =
                    data.costs_by_month.find(
                        c => c.year === year && c.month === x.month
                    )?.costs ?? 0;

                const profit =
                    data.profit_by_month.find(
                        p => p.year === year && p.month === x.month
                    )?.profit ?? x.revenue - cost;

                const dividends =
                    data.dividends_by_month.find(
                        d => d.year === year && d.month === x.month
                    )?.dividends ?? 0;

                return {
                    year: x.year,
                    month: x.month,
                    revenue: x.revenue,
                    costs: cost,
                    profit,
                    dividends,
                };
            });
    }, [
        data.revenue_by_month,
        data.costs_by_month,
        data.profit_by_month,
        data.dividends_by_month,
        year,
    ]);

    //
    // ---------- RENDER ----------
    //
    return (
        <div className="p-0 space-y-6">

            <CategoryFilter
                years={years}
                months={months}
                year={year}
                month={month}
                onYearChange={setYear}
                onMonthChange={setMonth}
            />

            {/* KPI + BAR */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-4 xl:col-span-3 flex flex-col gap-6">

                    <Card>
                        <CardTitle>Доходы</CardTitle>
                        <CardDescription>
        <span className="text-2xl font-semibold">
            {formatNumber(data.total_revenue)} ₽
        </span>
                        </CardDescription>
                    </Card>

                    <Card>
                        <CardTitle>Расходы</CardTitle>
                        <CardDescription>
        <span className="text-2xl font-semibold">
            {formatNumber(data.total_costs)} ₽
        </span>
                        </CardDescription>
                    </Card>

                    <Card>
                        <CardTitle>Прибыль</CardTitle>
                        <CardDescription>
        <span className="text-2xl font-semibold">
            {formatNumber(data.total_profit)} ₽
        </span>
                        </CardDescription>
                    </Card>

                    <Card>
                        <CardTitle>Рентабельность, %</CardTitle>
                        <CardDescription>
              <span className="text-2xl font-semibold">
                {data.profitability}
              </span>
                        </CardDescription>
                    </Card>

                    <Card>
                        <CardTitle>Дивиденды</CardTitle>
                        <CardDescription>
        <span className="text-2xl font-semibold">
            {formatNumber(data.total_dividends)} ₽
        </span>
                        </CardDescription>
                    </Card>
                </div>

                <div className="col-span-12 md:col-span-8 xl:col-span-9">
                    <Card>
                        <CardTitle>График доходов</CardTitle>
                        <div className="mt-4 h-[580px]">
                            <RevenueBarChart data={chartData}/>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 mt-6">
                <div className="col-span-12 xl:col-span-4 space-y-6">

                    <Card>
                        <CardTitle>Доходы по категориям</CardTitle>
                        <div className="mt-4 h-[360px]">
                            <PieChartIncome data={incomePie}/>
                        </div>
                    </Card>

                    <Card>
                        <CardTitle>Расходы по категориям</CardTitle>
                        <div className="mt-4 h-[360px]">
                            <PieChartExpenses data={expensePie}/>
                        </div>
                    </Card>
                </div>

                <div className="col-span-12 xl:col-span-8">
                    <Card>
                        <CardTitle>Категории</CardTitle>
                        <div className="mt-4 h-[840px]">
                            <CategoryDataTable rows={tableRows}/>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
