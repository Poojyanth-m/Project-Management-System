import { z } from 'zod';
import { ProjectStatus, UserRole } from '@prisma/client';

// Create project schema
export const createProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required').max(100, 'Project name too long'),
    description: z.string().max(1000, 'Description too long').optional(),
    status: z.nativeEnum(ProjectStatus).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    memberIds: z.array(z.string().uuid()).optional(),
});

// Update project schema
export const updateProjectSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(1000).optional().nullable(),
    status: z.nativeEnum(ProjectStatus).optional(),
    startDate: z.coerce.date().optional().nullable(),
    endDate: z.coerce.date().optional().nullable(),
});

// Add member schema
export const addMemberSchema = z.object({
    userId: z.string().uuid('Invalid user ID'),
    role: z.nativeEnum(UserRole).optional(),
});

// Remove member schema
export const removeMemberSchema = z.object({
    userId: z.string().uuid('Invalid user ID'),
});

// UUID param schema
export const projectIdSchema = z.object({
    id: z.string().uuid('Invalid project ID'),
});

// Query filters schema
export const projectQuerySchema = z.object({
    status: z.nativeEnum(ProjectStatus).optional(),
    includeArchived: z.coerce.boolean().optional(),
});

// Export inferred types
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type ProjectQueryInput = z.infer<typeof projectQuerySchema>;
