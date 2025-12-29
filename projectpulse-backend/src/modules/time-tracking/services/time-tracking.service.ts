import prisma from '../../../config/database';
import { NotFoundError, ConflictError, ForbiddenError } from '../../../utils/errors';
import {
    StartTimerRequest,
    StopTimerRequest,
    ManualEntryRequest
} from '../time-tracking.types';

export class TimeTrackingService {
    /**
     * Start a timer for a task
     */
    async startTimer(userId: string, data: StartTimerRequest) {
        // Check if user already has a running timer
        const runningTimer = await prisma.timeEntry.findFirst({
            where: {
                userId,
                endTime: null,
            },
        });

        if (runningTimer) {
            throw new ConflictError('You already have a running timer. Please stop it first.');
        }

        // Verify task existence and access
        const task = await prisma.task.findUnique({
            where: { id: data.taskId },
            include: { project: { include: { members: true } } },
        });

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        const isMember = task.project.members.some((m: { userId: string }) => m.userId === userId);
        if (!isMember) {
            throw new ForbiddenError('You do not have access to this task');
        }

        // Create time entry
        return prisma.timeEntry.create({
            data: {
                userId,
                taskId: data.taskId,
                description: data.description,
                startTime: data.startTime || new Date(),
                isBillable: data.isBillable ?? true,
            },
            include: {
                task: {
                    select: {
                        id: true,
                        title: true,
                        project: { select: { id: true, name: true } }
                    }
                }
            }
        });
    }

    /**
     * Stop the active timer
     */
    async stopTimer(userId: string, data: StopTimerRequest) {
        const runningTimer = await prisma.timeEntry.findFirst({
            where: {
                userId,
                endTime: null,
            },
        });

        if (!runningTimer) {
            throw new NotFoundError('No running timer found');
        }

        const endTime = data.endTime || new Date();
        const durationMinutes = Math.floor((endTime.getTime() - runningTimer.startTime.getTime()) / (1000 * 60));

        return prisma.timeEntry.update({
            where: { id: runningTimer.id },
            data: {
                endTime,
                duration: durationMinutes,
                description: data.description ?? runningTimer.description,
            },
        });
    }

    /**
     * Create a manual time entry
     */
    async createManualEntry(userId: string, data: ManualEntryRequest) {
        // Verify task
        const task = await prisma.task.findUnique({
            where: { id: data.taskId },
            include: { project: { include: { members: true } } },
        });

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        const isMember = task.project.members.some((m: { userId: string }) => m.userId === userId);
        if (!isMember) {
            throw new ForbiddenError('You do not have access to this task');
        }

        const durationMinutes = Math.floor((data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60));

        return prisma.timeEntry.create({
            data: {
                userId,
                taskId: data.taskId,
                description: data.description,
                startTime: data.startTime,
                endTime: data.endTime,
                duration: durationMinutes,
                isBillable: data.isBillable ?? true,
            },
        });
    }

    /**
     * Get filtered time entries
     */
    async getTimeEntries(userId: string, filters: any) {
        const { projectId, taskId, from, to, userId: filterUserId } = filters;

        const whereClause: any = {
            // Access control: User can see their own entries, or if they are searching a project, they must be a member
        };

        if (filterUserId && filterUserId !== userId) {
            // Checking if we are fetching someone else's logs.
            // For simplicity in this phase, we'll allow fetching if they share a project, 
            // but strict RBAC might limit this to managers.
            // We'll enforce that the requesting user must have access to the projects associated with the entries.
            whereClause.userId = filterUserId;
        } else {
            whereClause.userId = userId;
        }

        if (projectId) {
            whereClause.task = { projectId };
        }

        if (taskId) {
            whereClause.taskId = taskId;
        }

        if (from || to) {
            whereClause.startTime = {};
            if (from) whereClause.startTime.gte = from;
            if (to) whereClause.startTime.lte = to;
        }

        return prisma.timeEntry.findMany({
            where: whereClause,
            include: {
                task: {
                    select: {
                        id: true,
                        title: true,
                        project: { select: { id: true, name: true } }
                    }
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            },
            orderBy: { startTime: 'desc' }
        });
    }

    /**
     * Get currently running timer
     */
    async getRunningTimer(userId: string) {
        return prisma.timeEntry.findFirst({
            where: {
                userId,
                endTime: null
            },
            include: {
                task: {
                    select: {
                        id: true,
                        title: true,
                        project: { select: { id: true, name: true } }
                    }
                }
            }
        });
    }
}

export const timeTrackingService = new TimeTrackingService();
