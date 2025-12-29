import prisma from '../../../config/database';
import { NotFoundError, ForbiddenError } from '../../../utils/errors';
import { SetBudgetRequest, AddExpenseRequest, UpdateExpenseStatusRequest } from '../budget.types';
import { UserRole } from '@prisma/client';

export class BudgetService {

    async getProjectBudget(userId: string, projectId: string) {
        // Check access
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { members: true }
        });
        if (!project) throw new NotFoundError('Project not found');
        const isMember = project.members.some((m: { userId: string }) => m.userId === userId);
        if (!isMember) throw new ForbiddenError('Access denied');

        const budget = await prisma.budget.findUnique({
            where: { projectId },
            include: {
                expenses: {
                    orderBy: { expenseDate: 'desc' }
                }
            }
        });

        if (!budget) return null;

        const expenses = budget.expenses || [];
        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const remainingBudget = budget.totalBudget - totalSpent;
        const percentage = budget.totalBudget > 0 ? (totalSpent / budget.totalBudget) * 100 : 0;

        return {
            ...budget,
            totalSpent,
            remainingBudget,
            percentage
        };
    }

    async getAllBudgets(userId: string) {
        // Find all budgets for projects where user is a member
        const budgets = await prisma.budget.findMany({
            where: {
                project: {
                    members: {
                        some: { userId }
                    }
                }
            },
            include: {
                project: { select: { id: true, name: true } },
                expenses: true
            }
        });

        // Calculate stats for each
        const enrichedBudgets = budgets.map(b => {
            const expenses = b.expenses || [];
            const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
            return {
                ...b,
                totalSpent,
                remainingBudget: b.totalBudget - totalSpent,
                percentage: b.totalBudget > 0 ? (totalSpent / b.totalBudget) * 100 : 0
            };
        });

        return enrichedBudgets;
    }

    async setProjectBudget(userId: string, data: SetBudgetRequest) {
        // Check Admin/Manager logic
        const projectMember = await prisma.projectMember.findFirst({
            where: { projectId: data.projectId, userId }
        });

        if (!projectMember || (projectMember.role !== UserRole.ADMIN && projectMember.role !== UserRole.MANAGER)) {
            throw new ForbiddenError('Insufficient permissions to set budget');
        }

        // Upsert Budget
        return prisma.budget.upsert({
            where: { projectId: data.projectId },
            update: {
                totalBudget: data.totalBudget,
                currency: data.currency ?? "USD"
            },
            create: {
                projectId: data.projectId,
                totalBudget: data.totalBudget,
                currency: data.currency ?? "USD",
                createdById: userId
            }
        });
    }

    async addExpense(userId: string, data: AddExpenseRequest) {
        // Verify Budget exists
        const budget = await prisma.budget.findUnique({
            where: { id: data.budgetId },
            include: { project: { include: { members: true } } }
        });
        if (!budget) throw new NotFoundError('Budget not found');

        // Check is member
        const isMember = budget.project.members.some(m => m.userId === userId);
        if (!isMember) throw new ForbiddenError('Access denied');

        return prisma.expense.create({
            data: {
                budgetId: data.budgetId,
                description: data.description,
                amount: data.amount,
                category: data.category,
                receiptUrl: data.receiptUrl,
                expenseDate: data.expenseDate,
                status: data.status || 'PENDING'
            }
        });
    }

    async updateExpenseStatus(userId: string, expenseId: string, data: UpdateExpenseStatusRequest) {
        const expense = await prisma.expense.findUnique({
            where: { id: expenseId },
            include: { budget: { include: { project: { include: { members: true } } } } }
        });

        if (!expense) throw new NotFoundError('Expense not found');

        // Check Admin/Manager
        const member = expense.budget.project.members.find(m => m.userId === userId);
        if (!member || (member.role !== UserRole.ADMIN && member.role !== UserRole.MANAGER)) {
            throw new ForbiddenError('Insufficient permissions to approve/reject expenses');
        }

        return prisma.expense.update({
            where: { id: expenseId },
            data: { status: data.status }
        });
    }

    async deleteExpense(userId: string, expenseId: string) {
        const expense = await prisma.expense.findUnique({
            where: { id: expenseId },
            include: { budget: { include: { project: { include: { members: true } } } } }
        });

        if (!expense) throw new NotFoundError('Expense not found');

        // Owner/Admin check? Or maybe creator? simplifying to Admin/Manager for now
        const member = expense.budget.project.members.find(m => m.userId === userId);
        if (!member || (member.role !== UserRole.ADMIN && member.role !== UserRole.MANAGER)) {
            throw new ForbiddenError('Insufficient permissions');
        }

        return prisma.expense.delete({ where: { id: expenseId } });
    }
}

export const budgetService = new BudgetService();
