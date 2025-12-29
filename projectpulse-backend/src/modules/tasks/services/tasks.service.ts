import { TaskStatus } from '@prisma/client';
import prisma from '../../../config/database';
import { NotFoundError, ForbiddenError } from '../../../utils/errors';
import type { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from '../validators/tasks.schema';

export class TasksService {
    /**
     * Create a new task
     */
    async createTask(userId: string, data: CreateTaskInput) {
        const { projectId, assigneeId, ...taskData } = data;

        // Verify user is a member of the project
        await this.checkProjectMembership(projectId, userId);

        // If assignee is provided, verify they are a project member
        if (assigneeId) {
            await this.checkProjectMembership(projectId, assigneeId);
        }

        // Create task
        const task = await prisma.task.create({
            data: {
                ...taskData,
                projectId,
                assigneeId: assigneeId || null,
                createdById: userId,
            },
            include: {
                assignee: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        subtasks: true,
                        comments: true,
                        timeEntries: true,
                    },
                },
            },
        });

        return task;
    }

    /**
     * Get tasks with filters
     */
    async getTasks(userId: string, filters?: TaskQueryInput) {
        const { projectId, status, priority, assigneeId, includeArchived = false } = filters || {};

        // If projectId is provided, verify user is a member
        if (projectId) {
            await this.checkProjectMembership(projectId, userId);
        }

        // If no projectId, get tasks from all user's projects
        const whereClause: any = {
            ...(!includeArchived && { isArchived: false }),
            ...(status && { status }),
            ...(priority && { priority }),
            ...(assigneeId && { assigneeId }),
        };

        if (projectId) {
            whereClause.projectId = projectId;
        } else {
            // Get tasks from projects where user is a member AND project is not completed (User Request)
            whereClause.project = {
                members: {
                    some: {
                        userId,
                    },
                },
            };
        }

        const tasks = await prisma.task.findMany({
            where: whereClause,
            include: {
                assignee: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                // Include Dependencies for Gantt
                dependencies: true,
                subtasks: {
                    select: {
                        id: true,
                        title: true,
                        startDate: true,
                        dueDate: true,
                        status: true
                    }
                },
                _count: {
                    select: {
                        subtasks: true,
                        comments: true,
                        timeEntries: true,
                    },
                },
            },
            orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }],
        });

        const tasksWithGantt = tasks.map(task => ({
            ...task,
            start: task.startDate, // Alias for Gantt
            end: task.dueDate,     // Alias for Gantt
            // Ensure no nulls if Gantt library is strict?
            // Some libraries crash on null dates.
            // If startDate is null, use createdAt?
        }));

        return tasksWithGantt;
    }

    /**
     * Get task by ID
     */
    async getTaskById(taskId: string, userId: string) {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: {
                assignee: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                subtasks: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        priority: true,
                    },
                },
                _count: {
                    select: {
                        subtasks: true,
                        comments: true,
                        timeEntries: true,
                    },
                },
            },
        });

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        // Verify user is a member of the project
        await this.checkProjectMembership(task.projectId, userId);

        return task;
    }

    /**
     * Update task
     */
    async updateTask(taskId: string, userId: string, data: UpdateTaskInput) {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { project: true },
        });

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        // Verify user is a member of the project
        await this.checkProjectMembership(task.projectId, userId);

        // If assignee is being changed, verify new assignee is a project member
        if (data.assigneeId) {
            await this.checkProjectMembership(task.projectId, data.assigneeId);
        }

        // Auto-set completedAt when status changes to DONE
        const updateData: any = { ...data };
        if (data.status === TaskStatus.DONE && task.status !== TaskStatus.DONE) {
            updateData.completedAt = new Date();
        } else if (data.status && data.status !== TaskStatus.DONE && task.completedAt) {
            updateData.completedAt = null;
        }

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: updateData,
            include: {
                assignee: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        subtasks: true,
                        comments: true,
                        timeEntries: true,
                    },
                },
            },
        });

        return updatedTask;
    }

    /**
     * Delete task (soft delete)
     */
    async deleteTask(taskId: string, userId: string) {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        // Verify user is a member of the project
        await this.checkProjectMembership(task.projectId, userId);

        const deletedTask = await prisma.task.update({
            where: { id: taskId },
            data: { isArchived: true },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return deletedTask;
    }

    // ========== HELPER METHODS ==========

    /**
     * Check if user is a member of the project
     */
    private async checkProjectMembership(projectId: string, userId: string): Promise<void> {
        const membership = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId,
                },
            },
        });

        if (!membership) {
            throw new ForbiddenError('You are not a member of this project');
        }
    }
}

export const tasksService = new TasksService();
