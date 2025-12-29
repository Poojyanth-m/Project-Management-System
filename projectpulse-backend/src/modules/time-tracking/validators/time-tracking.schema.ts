import { z } from 'zod';

export const startTimerSchema = z.object({
    taskId: z.string().uuid('Invalid task ID'),
    description: z.string().optional(),
    isBillable: z.boolean().optional(),
    startTime: z.coerce.date().optional(),
});

export const stopTimerSchema = z.object({
    endTime: z.coerce.date().optional(),
    description: z.string().optional(),
});

export const manualEntrySchema = z.object({
    taskId: z.string().uuid('Invalid task ID'),
    description: z.string().optional(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    isBillable: z.boolean().optional(),
}).refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
});

export const updateTimeEntrySchema = z.object({
    description: z.string().optional(),
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),
    isBillable: z.boolean().optional(),
});

export const timeEntryIdSchema = z.object({
    id: z.string().uuid('Invalid time entry ID'),
});

export const timeEntryQuerySchema = z.object({
    projectId: z.string().uuid().optional(),
    taskId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
});
