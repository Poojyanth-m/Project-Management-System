import { Request, Response } from 'express';
import { budgetService } from '../services/budget.service';
import {
    setBudgetSchema,
    addExpenseSchema,
    updateExpenseStatusSchema,
    projectIdQuerySchema,
    expenseIdSchema
} from '../validators/budget.schema';

export class BudgetController {

    async getBudget(req: Request, res: Response) {
        const userId = req.user!.userId;
        const { projectId } = projectIdQuerySchema.parse(req.query);

        let data;
        if (projectId) {
            data = await budgetService.getProjectBudget(userId, projectId);
        } else {
            data = await budgetService.getAllBudgets(userId);
        }

        res.status(200).json({
            success: true,
            data
        });
    }

    async setBudget(req: Request, res: Response) {
        const userId = req.user!.userId;
        const validated = setBudgetSchema.parse(req.body);
        const budget = await budgetService.setProjectBudget(userId, validated);

        res.status(200).json({
            success: true,
            data: budget
        });
    }

    async addExpense(req: Request, res: Response) {
        const userId = req.user!.userId;
        const validated = addExpenseSchema.parse(req.body);
        const expense = await budgetService.addExpense(userId, validated);

        res.status(201).json({
            success: true,
            data: expense
        });
    }

    async updateExpenseStatus(req: Request, res: Response) {
        const userId = req.user!.userId;
        const { id } = expenseIdSchema.parse(req.params);
        const validated = updateExpenseStatusSchema.parse(req.body);

        const expense = await budgetService.updateExpenseStatus(userId, id, validated);

        res.status(200).json({
            success: true,
            data: expense
        });
    }

    async deleteExpense(req: Request, res: Response) {
        const userId = req.user!.userId;
        const { id } = expenseIdSchema.parse(req.params);

        await budgetService.deleteExpense(userId, id);
        res.status(200).json({
            success: true,
            message: 'Expense deleted'
        });
    }
}

export const budgetController = new BudgetController();
