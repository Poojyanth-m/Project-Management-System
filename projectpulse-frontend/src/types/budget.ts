export type Currency = "INR" | "USD";
export type ExpenseStatus = "APPROVED" | "PENDING";
export type ExpenseCategory = "Software" | "Hardware" | "Personnel" | "Marketing" | "Travel" | "Other";

export interface ProjectBudget {
    id?: string;
    projectId: string;
    totalBudget: number;
    currency: Currency;
    spentAmount: number;
}

export interface Expense {
    id: string;
    projectId: string;
    title: string;
    category: ExpenseCategory;
    amount: number;
    date: string; // ISO Date YYYY-MM-DD
    createdBy: string;
    status: ExpenseStatus;
}
