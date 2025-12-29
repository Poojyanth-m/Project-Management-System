import { z } from 'zod';
import { EntityType } from '@prisma/client';

export const analyticsQuerySchema = z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    projectId: z.string().uuid().optional(),
});

export const projectAnalyticsQuerySchema = z.object({
    projectId: z.string().uuid()
});

export const activityLogSchema = z.object({
    limit: z.coerce.number().min(1).max(100).optional().default(10),
    entityType: z.nativeEnum(EntityType).optional(),
    entityId: z.string().uuid().optional()
});
