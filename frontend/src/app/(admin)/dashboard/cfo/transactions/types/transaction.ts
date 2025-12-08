export interface Transaction {
    t_id: number;                     // ID транзакции
    flow: string | null;              // банк или источник
    creditdebitindicator: "CREDIT" | "DEBIT";
    date: string;                     // YYYY-MM-DD
    description: string | null;

    contragent_name: string | null;
    debtorparty_name: string | null;
    creditorparty_name: string | null;

    category: string;
    corrected_amount: number;

    bank: string | null;              // если есть в API
}
