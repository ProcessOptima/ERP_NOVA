"use client";

import {useMemo} from "react";
import {ApexOptions} from "apexcharts";
import ChartWrapper from "./ChartWrapper";

export interface PieData {
    category: string;
    amount: number;
}

export default function PieChartIncome({data}: { data: PieData[] }) {
    const series = useMemo(() => data.map((d: PieData) => d.amount), [data]);
    const labels = useMemo(() => data.map((d: PieData) => d.category), [data]);

    const options: ApexOptions = {
        chart: {type: "donut"},
        labels,
        legend: {position: "bottom"},
        dataLabels: {enabled: false},
        colors: ["#66cc99", "#55aa88", "#449977", "#338866", "#227755", "#116644"],
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
