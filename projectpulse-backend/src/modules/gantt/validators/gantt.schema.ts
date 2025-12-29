import { z } from 'zod';

export const dependencySchema = z.object({
    taskId: z.string().uuid(),
    dependsOnTaskId: z.string().uuid()
}).refine(data => data.taskId !== data.dependsOnTaskId, {
    message: "Task cannot depend on itself"
});

export const ganttQuerySchema = z.object({
    projectId: z.string().uuid()
});

export const deleteDependencySchema = z.object({
    taskId: z.string().uuid(),
    dependsOnTaskId: z.string().uuid()
});
