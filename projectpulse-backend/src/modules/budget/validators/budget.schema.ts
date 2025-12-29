import { z } from 'zod';
import { ExpenseStatus } from '@prisma/client';

export const setBudgetSchema = z.object({
    projectId: z.string().uuid(),
    totalBudget: z.number().positive(),
    currency: z.string().length(3).optional()
});

export const addExpenseSchema = z.object({
    budgetId: z.string().uuid(),
    description: z.string().min(1),
    amount: z.number().positive(),
    category: z.string().optional(),
    receiptUrl: z.string().url().optional(),
    expenseDate: z.coerce.date(),
    status: z.nativeEnum(ExpenseStatus).optional()
});

export const updateExpenseStatusSchema = z.object({
    status: z.nativeEnum(ExpenseStatus)
});

export const expenseIdSchema = z.object({
    id: z.string().uuid()
});

export const projectIdQuerySchema = z.object({
    projectId: z.string().uuid().optional()
});
