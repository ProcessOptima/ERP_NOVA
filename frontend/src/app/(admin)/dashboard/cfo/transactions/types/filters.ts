export interface TransactionFilters {
    dateFrom: string | null; // YYYY-MM-DD
    dateTo: string | null;
    indicator: string | null;
    category: string | null;
    search: string;
}
