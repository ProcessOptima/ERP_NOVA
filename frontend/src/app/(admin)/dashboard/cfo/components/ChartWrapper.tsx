"use client";

import dynamic from "next/dynamic";
import {ApexOptions} from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {ssr: false});

interface Props {
    options: ApexOptions;
    series: number[];
    type: "donut" | "line" | "bar";
    height?: number;
    forceKey: string;  // ← уникальный ключ для ремонта
}

export default function ChartWrapper({
                                         options,
                                         series,
                                         type,
                                         height = 330,
                                         forceKey,
                                     }: Props) {
    return (
        <ReactApexChart
            key={forceKey} // ← МАГИЯ! Перемонтирует компонент корректно
            options={options}
            series={series}
            type={type}
            height={height}
        />
    );
}
