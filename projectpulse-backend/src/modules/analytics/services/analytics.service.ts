import prisma from '../../../config/database';
import { ProjectStatus, TaskStatus } from '@prisma/client';
import { ForbiddenError, NotFoundError } from '../../../utils/errors';

export class AnalyticsService {

    /**
     * Get High-Level Dashboard Stats
     */
    async getDashboardStats(userId: string, startDate?: Date, endDate?: Date) {
        const now = new Date();
        const start = startDate || new Date(0); // Beginning of time if not set
        const end = endDate || new Date(now.getFullYear() + 100, 0, 1); // Way future

        // 1. Projects (Snapshot, not filtered by date except maybe created?)
        // Usually projects overview is "Current Status". Keeping as is.
        const projects = await prisma.project.findMany({
            where: { members: { some: { userId } } },
            include: {
                tasks: {
                    select: { status: true }
                }
            }
        });

        const projectStats = {
            total: projects.length,
            completed: projects.filter(p => p.status === ProjectStatus.COMPLETED).length,
            active: projects.filter(p => p.status === ProjectStatus.ACTIVE).length,
            delayed: projects.filter(p => p.status === ProjectStatus.ACTIVE && p.endDate && p.endDate < now).length,
            onHold: projects.filter(p => p.status === ProjectStatus.ON_HOLD).length,
            completionRate: 0
        };
        projectStats.completionRate = projectStats.total > 0
            ? Math.round((projectStats.completed / projectStats.total) * 100)
            : 0;

        // 2. Tasks
        // We fetch all tasks to calculate total backlog, but maybe 'Completed' should be 'Completed in period'?
        // The UI shows "Total Tasks", "Tasks Completed", "Overdue".
        // If I filter ALL tasks by date, "Total Tasks" becomes "Tasks created in period".
        // Let's assume standard dashboard behavior:
        // - Total/Overdue/InProgress = Snapshot state.
        // - Completed = Count of tasks completed.
        // But to support date filtering effectively for reports, let's look at "Activity".
        // For simplicity, I'll filter 'Completed' count by date, keeping 'Total' as snapshot.

        const allTasks = await prisma.task.findMany({
            where: {
                project: { members: { some: { userId } } },
                isArchived: false
            },
            select: {
                id: true,
                status: true,
                dueDate: true,
                duration: true,
                completedAt: true,
                createdAt: true
            }
        });

        // Filter completed count by date range
        const doneTasks = allTasks.filter(t =>
            t.status === TaskStatus.DONE && t.completedAt && t.completedAt >= start && t.completedAt <= end
        ).length;

        // For other stats, usually we want current state.
        // But if filtering, maybe we want "Tasks Due in Period"?
        // Let's stick to Snapshot for statuses, but "Completed" strictly in range.

        const taskStats = {
            total: allTasks.length,
            completed: doneTasks,
            inProgress: allTasks.filter(t => t.status === TaskStatus.IN_PROGRESS || t.status === TaskStatus.IN_REVIEW).length,
            toDo: allTasks.filter(t => t.status === TaskStatus.TODO).length,
            overdue: allTasks.filter(t => t.dueDate && t.dueDate < now && t.status !== TaskStatus.DONE).length,
            onTime: 0,
            completionRate: 0
        };

        const activeTasks = taskStats.total - taskStats.completed; // Revisit logic if 'completed' is ranged
        taskStats.onTime = Math.max(0, activeTasks - taskStats.overdue);

        taskStats.completionRate = taskStats.total > 0
            ? Math.round((taskStats.completed / taskStats.total) * 100)
            : 0;

        // 3. Time (Strictly filtered by date)
        const timeEntries = await prisma.timeEntry.findMany({
            where: {
                task: { project: { members: { some: { userId } } } },
                startTime: {
                    gte: start,
                    lte: end
                }
            },
            include: { task: true }
        });

        const loggedMinutes = timeEntries.reduce((sum, t) => sum + (t.duration || 0), 0);
        const loggedHours = Math.round(loggedMinutes / 60);

        // Planned hours: Sum of task durations (Snapshot of all tasks? Or tasks with activity?)
        // Usually planned hours is total backlog effort.
        const plannedHours = allTasks.reduce((sum, t) => sum + (t.duration || 0), 0);

        const billableMinutes = timeEntries
            .filter(t => t.isBillable)
            .reduce((sum, t) => sum + (t.duration || 0), 0);
        const billableHours = Math.round(billableMinutes / 60);

        const timeStats = {
            loggedHours,
            plannedHours,
            billableHours,
            nonBillableHours: loggedHours - billableHours,
            utilizationRate: plannedHours > 0 ? Math.round((loggedHours / plannedHours) * 100) : 0
        };

        // 4. Budget (Filtered by Expense Date)
        const budgets = await prisma.budget.findMany({
            where: { project: { members: { some: { userId } } } },
            include: { expenses: true }
        });

        let totalBudget = 0;
        let spent = 0;

        budgets.forEach(b => {
            totalBudget += b.totalBudget;
            spent += b.expenses
                .filter(e => e.status === 'APPROVED' && e.expenseDate >= start && e.expenseDate <= end)
                .reduce((sum, e) => sum + e.amount, 0);
        });

        const budgetStats = {
            totalBudget, // This is total project budget, not time-scaled
            spent,
            remaining: totalBudget - spent,
            utilizationRate: totalBudget > 0 ? Math.round((spent / totalBudget) * 100) : 0
        };

        // 5. Task Distribution
        const statusMap: Record<string, string> = {
            [TaskStatus.TODO]: 'To Do',
            [TaskStatus.IN_PROGRESS]: 'In Progress',
            [TaskStatus.IN_REVIEW]: 'In Progress',
            [TaskStatus.DONE]: 'Done',
            [TaskStatus.BLOCKED]: 'In Progress'
        };

        const distribution: Record<string, number> = {};
        allTasks.forEach(t => {
            const label = statusMap[t.status] || 'Other';
            distribution[label] = (distribution[label] || 0) + 1;
        });

        const taskDistribution = Object.keys(distribution).map(status => {
            let color = '#E65F2B'; // Default orange
            if (status === 'Done') color = '#1A932E'; // Green
            if (status === 'To Do') color = '#E65F2B';
            if (status === 'In Progress') color = '#F2C94C';

            return {
                status,
                count: distribution[status],
                percentage: Math.round((distribution[status] / allTasks.length) * 100),
                color
            };
        });

        // 6. Project Performance
        const projectPerformance = projects.map(p => {
            const pTasks = p.tasks;
            const total = pTasks.length;
            const completed = pTasks.filter(t => t.status === TaskStatus.DONE).length;
            const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

            let status: "On Track" | "At Risk" | "Delayed" = "On Track";
            if (p.status === ProjectStatus.ON_HOLD) status = "Delayed"; // Map On Hold to Delayed for simplicity or add On Hold to types
            else if (p.endDate && p.endDate < now && rate < 100) status = "Delayed";

            const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            if (status === "On Track" && p.endDate && p.endDate < weekFromNow && rate < 80) {
                status = "At Risk";
            }

            return {
                projectName: p.name,
                completionRate: rate,
                tasksCompleted: completed,
                totalTasks: total,
                status
            };
        });

        // 7. Total Members (unique across all projects)
        const uniqueMemberIds = new Set<string>();
        for (const project of projects) {
            const members = await prisma.projectMember.findMany({
                where: { projectId: project.id },
                select: { userId: true }
            });
            members.forEach(m => uniqueMemberIds.add(m.userId));
        }
        const totalMembers = uniqueMemberIds.size;

        return {
            projects: projectStats,
            tasks: taskStats,
            time: timeStats,
            budget: budgetStats,
            members: { total: totalMembers },
            taskDistribution,
            projectPerformance,
            lastUpdated: new Date().toISOString()
        };
    }

    async getProjectAnalytics(userId: string, projectId: string) {
        // Check access
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { members: true }
        });
        if (!project) throw new NotFoundError('Project not found');
        if (!project.members.some((m: { userId: string }) => m.userId === userId)) {
            throw new ForbiddenError('Access denied');
        }

        // Task Stats
        const tasks = await prisma.task.findMany({
            where: { projectId, isArchived: false },
            include: { assignee: { select: { firstName: true, lastName: true } } } // For filtering by assignee
        });

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
        const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        const tasksByStatus = this.groupBy(tasks, 'status');

        // Tasks by Assignee
        const tasksByAssignee: Record<string, number> = {};
        tasks.forEach((t: any) => {
            const name = t.assignee
                ? `${t.assignee.firstName} ${t.assignee.lastName}`
                : 'Unassigned';
            tasksByAssignee[name] = (tasksByAssignee[name] || 0) + 1;
        });

        // Budget
        const budget = await prisma.budget.findUnique({
            where: { projectId },
            include: { expenses: true }
        });

        const budgetData = {
            total: budget?.totalBudget || 0,
            spent: 0,
            remaining: budget?.totalBudget || 0,
            expensesByCategory: {} as Record<string, number>
        };

        if (budget) {
            const approvedExpenses = budget.expenses.filter((e: any) => e.status === 'APPROVED');
            budgetData.spent = approvedExpenses.reduce((sum: number, e: any) => sum + e.amount, 0);
            budgetData.remaining = budgetData.total - budgetData.spent;

            // Categorization
            budget.expenses.forEach((e: any) => {
                const cat = e.category || 'Uncategorized';
                budgetData.expensesByCategory[cat] = (budgetData.expensesByCategory[cat] || 0) + e.amount;
            });
        }

        // Mock BurnDown (Last 7 days)
        // In a real app, we'd query historical snapshots. 
        // Here we'll generate a basic trend line based on createdAt and completedAt.
        const burnDownData = this.calculateMockBurnDown(tasks);

        return {
            projectId,
            taskProgress,
            tasksByStatus,
            tasksByAssignee,
            burnDownData,
            budget: budgetData
        };
    }

    // Helper: Group Array by Key
    private groupBy(array: any[], key: string) {
        return array.reduce((result, currentValue) => {
            const val = currentValue[key];
            result[val] = (result[val] || 0) + 1;
            return result;
        }, {});
    }

    // Helper: Burn Down Calculation (Approximate)
    private calculateMockBurnDown(tasks: any[]) {
        const days = 7;
        const data = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

            // Count tasks that were created <= date AND (not completed OR completed > date)
            // This represents "Open tasks" on that day
            const openTasks = tasks.filter((t: any) => {
                const created = new Date(t.createdAt);
                const completed = t.completedAt ? new Date(t.completedAt) : null;

                // Created before end of that day
                const isCreated = created <= new Date(date.setHours(23, 59, 59));
                // Not completed yet OR completed after that day
                const isOpen = !completed || completed > new Date(date.setHours(23, 59, 59));

                return isCreated && isOpen;
            }).length;

            data.push({ date: dateStr, remainingTasks: openTasks });
        }
        return data;
    }
}

export const analyticsService = new AnalyticsService();
