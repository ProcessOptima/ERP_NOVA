export interface ExpenseFiltersType {
    dateFrom: string | null;
    dateTo: string | null;
    category: string | null;
    periodMode: "last_month" | "all_time";
}
