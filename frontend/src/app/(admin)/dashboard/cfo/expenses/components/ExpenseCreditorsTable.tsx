"use client";

interface Row {
    creditor: string;
    amount: number;
    percent: number;
}

interface Props {
    rows: Row[];
}

export default function ExpenseCreditorsTable({rows}: Props) {
    return (
        <div
            className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5
                 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5"
        >
            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="py-4 px-4 font-medium">Кредитор</th>
                        <th className="py-4 px-4 font-medium">Сумма ₽</th>
                        <th className="py-4 px-4 font-medium">% от расходов</th>
                    </tr>
                    </thead>

                    <tbody>
                    {rows.map((r, i) => (
                        <tr
                            key={i}
                            className="border-b border-stroke dark:border-strokedark"
                        >
                            <td className="py-4 px-4">{r.creditor}</td>
                            <td className="py-4 px-4">{r.amount.toLocaleString()} ₽</td>
                            <td className="py-4 px-4">{r.percent.toFixed(2)}%</td>
                        </tr>
                    ))}

                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={3} className="py-4 text-center text-gray-500">
                                Нет данных за выбранный период
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
