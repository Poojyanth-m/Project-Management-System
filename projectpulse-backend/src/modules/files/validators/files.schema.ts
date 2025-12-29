import { z } from 'zod';
import { EntityType } from '@prisma/client';

export const getUploadUrlSchema = z.object({
    fileName: z.string().min(1),
    fileType: z.string().min(1),
    fileSize: z.number().positive(),
    entityType: z.nativeEnum(EntityType),
    entityId: z.string().uuid(),
});

export const confirmUploadSchema = z.object({
    name: z.string().min(1),
    size: z.number().positive(),
    mimeType: z.string().min(1),
    entityType: z.nativeEnum(EntityType),
    entityId: z.string().uuid(),
    key: z.string().min(1)
});

export const getFilesQuerySchema = z.object({
    entityType: z.nativeEnum(EntityType),
    entityId: z.string().uuid()
});

export const fileIdSchema = z.object({
    id: z.string().uuid()
});
