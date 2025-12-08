"use client";

interface Props {
    mode: "last_month" | "all_time";
    onChange: () => void;
}

export default function PeriodSwitcher({mode, onChange}: Props) {
    return (
        <div className="flex justify-end">
            <button
                onClick={onChange}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white
                   hover:bg-gray-100 transition"
            >
                {mode === "last_month"
                    ? "Показать всё время"
                    : "Показать последний месяц"}
            </button>
        </div>
    );
}
