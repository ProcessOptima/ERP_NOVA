"use client";

import React, {useMemo} from "react";
import dynamic from "next/dynamic";
import {ApexOptions} from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

type ChartPoint = {
    year: number;
    month: number;
    revenue: number;
    costs: number;
    profit: number;
    dividends: number;
};

interface RevenueBarChartProps {
    data: ChartPoint[];
}

export default function RevenueBarChart({data}: RevenueBarChartProps) {
    // ---------------------------
    //  PREPARE CATEGORIES (labels)
    // ---------------------------
    const categories = data.map((p) => `${p.month}/${String(p.year).slice(2)}`);

    // ---------------------------
    //  DEFINE MAX Y FOR GRID
    // ---------------------------
    const {maxY} = useMemo(() => {
        const maxValue = Math.max(
            ...data.map((d) => Math.max(d.revenue, d.costs, d.profit))
        );

        const step = 10_000_000;
        const maxRounded = Math.ceil(maxValue / step) * step;

        return {maxY: maxRounded};
    }, [data]);

    const minY = -10_000_000;

    // ---------------------------
    //  APEXCHART OPTIONS
    // ---------------------------
    const options: ApexOptions = {
        chart: {
            type: "bar",
            fontFamily: "Outfit, sans-serif",
            stacked: false,
            toolbar: {show: false},
        },

        colors: ["#4f46e5", "#ef4444", "#10b981", "#f97316"], // доход, расходы, прибыль, дивиденды

        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "39%",
                borderRadius: 10,
                borderRadiusApplication: "end",
                borderRadiusWhenStacked: "last",
            },
        },

        stroke: {
            width: [0, 0, 2, 2], // Доход, Расходы, ПРИБЫЛЬ (линия), Дивиденды (линия)
            curve: "smooth",
        },

        labels: categories,

        xaxis: {
            categories,
            tickPlacement: "on",
            axisBorder: {show: false},
            axisTicks: {show: false},
            labels: {
                style: {fontSize: "12px", colors: "#6b7280"}
            }
        },

        yaxis: {
            min: minY,
            max: maxY,
            tickAmount: (maxY - minY) / 10_000_000,

            labels: {
                formatter: (v: number) => `${(v / 1_000_000).toFixed(0)} млн`,
                style: {fontSize: "12px", colors: "#6b7280"},
            },
        },

        grid: {
            borderColor: "#e5e7eb",
            yaxis: {lines: {show: true}},
        },

        legend: {
            show: true,
            position: "top",
            horizontalAlign: "left",
            fontFamily: "Outfit",
        },

        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: (val: number) => `${val.toLocaleString()} ₽`,
            },
        },
    };

    // ---------------------------
    //  SERIES
    // ---------------------------
    const series = [
        {
            name: "Доход",
            type: "column",
            data: data.map((p) => p.revenue),
        },
        {
            name: "Расходы",
            type: "column",
            data: data.map((p) => p.costs),
        },
        {
            name: "Прибыль",
            type: "line",
            data: data.map((p) => p.profit),
        },
        {
            name: "Дивиденды",
            type: "line",
            data: data.map((p) => p.dividends),
        },
    ];

    // ---------------------------
    // RENDER
    // ---------------------------
    return (
        <div className="w-full h-full">
            <ReactApexChart
                options={options}
                series={series}
                type="line"
                height="100%"
            />
        </div>
    );

}
