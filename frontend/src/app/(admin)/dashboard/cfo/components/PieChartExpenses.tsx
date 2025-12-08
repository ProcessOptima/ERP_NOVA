"use client";

import {useMemo} from "react";
import {ApexOptions} from "apexcharts";
import ChartWrapper from "./ChartWrapper";
import {PieData} from "./PieChartIncome";

export default function PieChartExpenses({data}: { data: PieData[] }) {
    const series = useMemo(() => data.map((d: PieData) => d.amount), [data]);
    const labels = useMemo(() => data.map((d: PieData) => d.category), [data]);

    const options: ApexOptions = {
        chart: {type: "donut"},
        labels,
        legend: {position: "bottom"},
        dataLabels: {enabled: false},
        colors: ["#ff8a65", "#ff7043", "#ff5722", "#f4511e", "#e64a19", "#bf360c"],
    };

    return (
        <ChartWrapper
            forceKey={labels.join("_") + series.join("_")}
            options={options}
            series={series}
            type="donut"
        />
    );
}
