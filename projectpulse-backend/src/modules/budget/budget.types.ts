import { ExpenseStatus } from '@prisma/client';

export interface BudgetResponse {
    id: string;
    projectId: string;
    totalBudget: number;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
    expenses: ExpenseResponse[];
}

export interface ExpenseResponse {
    id: string;
    description: string;
    amount: number;
    category: string | null;
    status: ExpenseStatus;
    receiptUrl: string | null;
    expenseDate: Date;
}

export interface SetBudgetRequest {
    projectId: string;
    totalBudget: number;
    currency?: string;
}

export interface AddExpenseRequest {
    budgetId: string;
    description: string;
    amount: number;
    category?: string;
    receiptUrl?: string;
    expenseDate: Date;
    status?: ExpenseStatus;
}

export interface UpdateExpenseStatusRequest {
    status: ExpenseStatus;
}
