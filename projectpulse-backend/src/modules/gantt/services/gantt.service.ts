import prisma from '../../../config/database';
import { NotFoundError, ConflictError, ForbiddenError } from '../../../utils/errors';
import { DependencyRequest } from '../gantt.types';

export class GanttService {

    /**
     * Get all tasks for a project formatted for Gantt View
     */
    async getProjectGanttData(userId: string, projectId: string) {
        // Check access
        const membership = await prisma.projectMember.findFirst({
            where: { projectId, userId }
        });
        if (!membership) throw new ForbiddenError('Access denied to project');

        const tasks = await prisma.task.findMany({
            where: {
                projectId,
                isArchived: false
            },
            include: {
                dependencies: {
                    select: { dependsOnTaskId: true }
                },
                assignee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                }
            },
            orderBy: { orderIndex: 'asc' }
        });

        // Format for Gantt
        return tasks.map((t: any) => ({
            id: t.id,
            projectId: t.projectId,
            title: t.title,
            startDate: t.startDate,
            dueDate: t.dueDate,
            duration: t.duration,
            progress: t.progress,
            status: t.status,
            priority: t.priority,
            parentTaskId: t.parentTaskId,
            dependencies: t.dependencies.map((d: any) => d.dependsOnTaskId),
            assignee: t.assignee ? {
                id: t.assignee.id,
                fullName: `${t.assignee.firstName} ${t.assignee.lastName}`,
                avatar: t.assignee.avatar
            } : null
        }));
    }

    /**
     * Create a dependency (Task B depends on Task A)
     */
    async addDependency(userId: string, data: DependencyRequest) {
        // Validate tasks exist and user has access
        const task = await prisma.task.findUnique({
            where: { id: data.taskId },
            include: { project: { include: { members: true } } }
        });
        const dependsOnTask = await prisma.task.findUnique({ where: { id: data.dependsOnTaskId } });

        if (!task || !dependsOnTask) throw new NotFoundError('One or both tasks not found');

        // Ensure same project (optional business rule, but common for Gantt to work cleanly)
        if (task.projectId !== dependsOnTask.projectId) {
            throw new ConflictError('Tasks must belong to the same project');
        }

        const isMember = task.project.members.some((m: { userId: string }) => m.userId === userId);
        if (!isMember) throw new ForbiddenError('Access denied');

        // Check for existing
        const existing = await prisma.taskDependency.findUnique({
            where: {
                taskId_dependsOnTaskId: {
                    taskId: data.taskId,
                    dependsOnTaskId: data.dependsOnTaskId
                }
            }
        });

        if (existing) throw new ConflictError('Dependency already exists');

        // Check for circular dependency (Simple BFS check)
        const isCircular = await this.detectCircularDependency(data.taskId, data.dependsOnTaskId);
        if (isCircular) {
            throw new ConflictError('Circular dependency detected');
        }

        return prisma.taskDependency.create({
            data: {
                taskId: data.taskId,
                dependsOnTaskId: data.dependsOnTaskId
            }
        });
    }

    /**
     * Remove dependency
     */
    async removeDependency(userId: string, data: DependencyRequest) {
        // Validate tasks exist and user has access (via project of taskId)
        const task = await prisma.task.findUnique({
            where: { id: data.taskId },
            include: { project: { include: { members: true } } }
        });

        if (!task) throw new NotFoundError('Task not found');
        const isMember = task.project.members.some((m: { userId: string }) => m.userId === userId);
        if (!isMember) throw new ForbiddenError('Access denied');

        try {
            await prisma.taskDependency.delete({
                where: {
                    taskId_dependsOnTaskId: {
                        taskId: data.taskId,
                        dependsOnTaskId: data.dependsOnTaskId
                    }
                }
            });
        } catch (e) {
            throw new NotFoundError('Dependency not found');
        }
    }

    // --- Helpers ---

    // Check if adding Link(Source -> Target) creates a cycle.
    // In our DB schema: `taskId` (Dependent) -> `dependsOnTaskId` (Blocker).
    // So "Task depends on Blocker". 
    // Creating A depends on B.
    // Cycle exists if there is already a path from B to A (i.e. B depends on ... -> A).
    private async detectCircularDependency(taskId: string, dependsOnTaskId: string): Promise<boolean> {
        // Start BFS from dependsOnTaskId to see if we can reach taskId
        const queue = [dependsOnTaskId];
        const visited = new Set<string>();

        while (queue.length > 0) {
            const current = queue.shift()!;
            if (current === taskId) return true;
            if (visited.has(current)) continue;
            visited.add(current);

            // Find all tasks that 'current' depends on
            const deps = await prisma.taskDependency.findMany({
                where: { taskId: current },
                select: { dependsOnTaskId: true }
            });

            for (const dep of deps) {
                queue.push(dep.dependsOnTaskId);
            }
        }
        return false;
    }
}

export const ganttService = new GanttService();
