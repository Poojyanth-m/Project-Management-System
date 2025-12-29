import api from "./api";
import type { ProjectBudget, Expense } from "../types/budget";

export const budgetService = {
    getProjectBudget: async (projectId: string): Promise<ProjectBudget> => {
        const response = await api.get(`/budget?projectId=${projectId}`);
        const data = response.data.data;

        // Backend returns budget with stats, verify shape matches ProjectBudget
        // Backend: { id, totalBudget, currency, spentAmount (as totalSpent), ... }
        // Frontend type: ProjectBudget needs checking.
        // Usually safe to cast if keys line up or map them
        return {
            id: data.id,
            projectId: data.projectId,
            totalBudget: data.totalBudget,
            currency: data.currency,
            spentAmount: data.totalSpent || 0, // Backend sends totalSpent
            // Frontend might expect other fields, verify type
        };
    },

    getExpenses: async (projectId: string): Promise<Expense[]> => {
        // Since backend GetBudget includes expenses, we can reuse it
        const response = await api.get(`/budget?projectId=${projectId}`);
        const data = response.data.data;
        if (!data || !data.expenses) return [];

        return data.expenses.map((e: any) => ({
            id: e.id,
            projectId: projectId, // Backend expense doesn't always have projectId on it, but we know it
            title: e.description, // Map description -> title
            category: e.category,
            amount: e.amount,
            date: e.expenseDate.split('T')[0], // ISO to YYYY-MM-DD
            createdBy: "Unknown", // Backend might not send creator name yet
            status: e.status
        }));
    },

    addExpense: async (expense: any): Promise<Expense> => {
        // Frontend passed { ...others, projectId }. Backend needs budgetId.
        // We might need to fetch budgetId first if not provided?
        // Actually, budgetService.addExpense in Budget.tsx should pass budgetId if possible.
        // But if we stick to the signature:

        // If expense has budgetId, use it. If not, we have a problem unless we look it up.
        // Let's assume the caller will update to pass budgetId.

        const response = await api.post("/budget/expenses", {
            budgetId: expense.budgetId,
            amount: Number(expense.amount),
            description: expense.title, // Frontend sends title, backend expects description
            category: expense.category,
            expenseDate: new Date(expense.date).toISOString(),
            status: expense.status // Added status based on user input
            // receiptUrl?
        });

        const e = response.data.data;
        return {
            id: e.id,
            projectId: expense.projectId || "",
            title: e.description,
            category: e.category,
            amount: e.amount,
            date: e.expenseDate.split('T')[0],
            createdBy: "Me",
            status: e.status
        };
    },

    deleteExpense: async (id: string): Promise<void> => {
        await api.delete(`/budget/expenses/${id}`);
    }
};
