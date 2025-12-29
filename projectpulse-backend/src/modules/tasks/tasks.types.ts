import { TaskStatus, TaskPriority } from '@prisma/client';

// Task response
export interface TaskResponse {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    projectId: string;
    assigneeId: string | null;
    createdById: string;
    startDate: Date | null;
    dueDate: Date | null;
    duration: number | null;
    progress: number;
    parentTaskId: string | null;
    orderIndex: number;
    isArchived: boolean;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    assignee?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string | null;
    } | null;
    createdBy: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    project: {
        id: string;
        name: string;
    };
    _count?: {
        subtasks: number;
        comments: number;
        timeEntries: number;
    };
}

// Request types
export interface CreateTaskRequest {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    projectId: string;
    assigneeId?: string;
    startDate?: Date;
    dueDate?: Date;
    duration?: number;
    parentTaskId?: string;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assigneeId?: string;
    startDate?: Date;
    dueDate?: Date;
    duration?: number;
    progress?: number;
    parentTaskId?: string;
}
