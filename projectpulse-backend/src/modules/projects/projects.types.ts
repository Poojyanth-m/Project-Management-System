import { ProjectStatus, UserRole } from '@prisma/client';

// Project response with member details
export interface ProjectResponse {
    id: string;
    name: string;
    description: string | null;
    status: ProjectStatus;
    startDate: Date | null;
    endDate: Date | null;
    isArchived: boolean;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    members?: ProjectMemberResponse[];
    _count?: {
        tasks: number;
        members: number;
    };
}

export interface ProjectMemberResponse {
    id: string;
    role: UserRole;
    joinedAt: Date;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string | null;
    };
}

// Request types
export interface CreateProjectRequest {
    name: string;
    description?: string;
    status?: ProjectStatus;
    startDate?: Date;
    endDate?: Date;
    memberIds?: string[]; // User IDs to add as members
}

export interface UpdateProjectRequest {
    name?: string;
    description?: string;
    status?: ProjectStatus;
    startDate?: Date;
    endDate?: Date;
}

export interface AddProjectMemberRequest {
    userId: string;
    role?: UserRole;
}
