import { z } from 'zod';
import { TaskStatus, TaskPriority } from '@prisma/client';

// Create task schema
export const createTaskSchema = z.object({
    title: z.string().min(1, 'Task title is required').max(200, 'Title too long'),
    description: z.string().max(2000, 'Description too long').optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    projectId: z.string().uuid('Invalid project ID'),
    assigneeId: z.string().uuid('Invalid assignee ID').optional(),
    startDate: z.coerce.date().optional(),
    dueDate: z.coerce.date().optional(),
    duration: z.number().int().min(0).optional(), // in hours
    parentTaskId: z.string().uuid('Invalid parent task ID').optional(),
});

// Update task schema
export const updateTaskSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional().nullable(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    assigneeId: z.string().uuid('Invalid assignee ID').optional().nullable(),
    startDate: z.coerce.date().optional().nullable(),
    dueDate: z.coerce.date().optional().nullable(),
    duration: z.number().int().min(0).optional().nullable(),
    progress: z.number().int().min(0).max(100).optional(),
    parentTaskId: z.string().uuid('Invalid parent task ID').optional().nullable(),
});

// UUID param schema
export const taskIdSchema = z.object({
    id: z.string().uuid('Invalid task ID'),
});

// Query filters schema
export const taskQuerySchema = z.object({
    projectId: z.string().uuid('Invalid project ID').optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    assigneeId: z.string().uuid('Invalid assignee ID').optional(),
    includeArchived: z.coerce.boolean().optional(),
});

// Export inferred types
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
