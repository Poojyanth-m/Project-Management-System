import { UserRole } from '@prisma/client';
import prisma from '../../../config/database';
import { NotFoundError, ForbiddenError, ConflictError } from '../../../utils/errors';
import type { CreateProjectInput, UpdateProjectInput, ProjectQueryInput } from '../validators/projects.schema';

export class ProjectsService {
    /**
     * Create a new project
     */
    async createProject(userId: string, data: CreateProjectInput) {
        const { memberIds, ...projectData } = data;

        // Create project with creator as owner
        const project = await prisma.project.create({
            data: {
                ...projectData,
                createdById: userId,
                members: {
                    create: {
                        userId,
                        role: UserRole.ADMIN, // Creator is admin of their project
                    },
                },
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        tasks: true,
                        members: true,
                    },
                },
            },
        });

        // Add additional members if provided
        if (memberIds && memberIds.length > 0) {
            await this.addMultipleMembers(project.id, memberIds);
        }

        return project;
    }

    /**
     * Get all projects for a user
     */
    async getUserProjects(userId: string, filters?: ProjectQueryInput) {
        const { status, includeArchived = false } = filters || {};

        const projects = await prisma.project.findMany({
            where: {
                members: {
                    some: {
                        userId,
                    },
                },
                ...(status && { status }),
                ...(!includeArchived && { isArchived: false }),
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        tasks: true,
                        members: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Fetch Task Status Counts for these projects to calculate progress
        const projectIds = projects.map(p => p.id);
        const taskStats = await prisma.task.groupBy({
            by: ['projectId', 'status'],
            where: {
                projectId: { in: projectIds }
            },
            _count: {
                _all: true
            }
        });

        // Map stats to projects
        const projectsWithProgress = projects.map(project => {
            const stats = taskStats.filter(t => t.projectId === project.id);
            const totalTasks = stats.reduce((acc, curr) => acc + curr._count._all, 0);
            const completedTasks = stats
                .filter(t => t.status === 'DONE') // Assuming TaskStatus.DONE enum string
                .reduce((acc, curr) => acc + curr._count._all, 0);

            // Calculate progress (default 0 if no tasks)
            // If status is COMPLETED, force 100% just in case tasks are missing/archived
            // But usually we respect task status.
            let progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            // Override for COMPLETED projects if they have 0 progress calculated? 
            // Better to let data speak, but for demo 'Project Status: COMPLETED' usually implies 100%.
            if (project.status === 'COMPLETED' && progress === 0 && totalTasks === 0) {
                progress = 100;
            }

            return {
                ...project,
                progress
            };
        });

        return projectsWithProgress;
    }

    /**
     * Get project by ID
     */
    async getProjectById(projectId: string, userId: string) {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            },
                        },
                    },
                },
                files: {
                    select: {
                        id: true,
                        name: true,
                        url: true,
                        mimeType: true,
                        size: true,
                        createdAt: true, // uploadedAt is likely createdAt
                        uploadedBy: true
                    }
                },
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        priority: true,
                        startDate: true,
                        dueDate: true,
                        assignee: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true
                            }
                        },
                        dependencies: true
                    }
                },
                _count: {
                    select: {
                        tasks: true,
                        members: true,
                        files: true
                    },
                },
            },
        });

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        // Check if user is a member
        await this.checkProjectMembership(projectId, userId);

        // Alias dates for Gantt
        const projectWithGantt = {
            ...project,
            tasks: project.tasks ? project.tasks.map(t => ({
                ...t,
                start: t.startDate,
                end: t.dueDate
            })) : []
        };

        return projectWithGantt;
    }

    /**
     * Update project
     */
    async updateProject(projectId: string, userId: string, data: UpdateProjectInput) {
        // Check permissions (owner or manager)
        await this.checkProjectPermission(projectId, userId);

        const project = await prisma.project.update({
            where: { id: projectId },
            data,
            include: {
                createdBy: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        tasks: true,
                        members: true,
                    },
                },
            },
        });

        return project;
    }

    /**
     * Archive project (soft delete)
     */
    async archiveProject(projectId: string, userId: string) {
        // Only owner or admin can archive
        await this.checkProjectPermission(projectId, userId);

        const project = await prisma.project.update({
            where: { id: projectId },
            data: { isArchived: true },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        return project;
    }

    /**
     * Add member to project
     */
    async addMember(projectId: string, userId: string, memberUserId: string, role: UserRole = UserRole.MEMBER) {
        // Check permissions
        await this.checkProjectPermission(projectId, userId);

        // Check if project exists
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        // Check if user exists
        const memberUser = await prisma.user.findUnique({
            where: { id: memberUserId },
        });

        if (!memberUser) {
            throw new NotFoundError('User not found');
        }

        // Check if already a member
        const existingMember = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId: memberUserId,
                },
            },
        });

        if (existingMember) {
            throw new ConflictError('User is already a member of this project');
        }

        // Add member
        const member = await prisma.projectMember.create({
            data: {
                projectId,
                userId: memberUserId,
                role,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
        });

        return member;
    }

    /**
     * Remove member from project
     */
    async removeMember(projectId: string, userId: string, memberUserId: string) {
        // Check permissions
        await this.checkProjectPermission(projectId, userId);

        // Cannot remove project creator
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (project?.createdById === memberUserId) {
            throw new ForbiddenError('Cannot remove project creator');
        }

        // Remove member
        const member = await prisma.projectMember.delete({
            where: {
                projectId_userId: {
                    projectId,
                    userId: memberUserId,
                },
            },
        });

        return member;
    }

    /**
     * Get project members
     */
    async getProjectMembers(projectId: string, userId: string) {
        // Check if user has access to project
        await this.checkProjectMembership(projectId, userId);

        const members = await prisma.projectMember.findMany({
            where: { projectId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                joinedAt: 'asc',
            },
        });

        return members;
    }

    // ========== HELPER METHODS ==========

    /**
     * Check if user is a member of the project
     */
    private async checkProjectMembership(projectId: string, userId: string): Promise<void> {
        const membership = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId,
                },
            },
        });

        if (!membership) {
            throw new ForbiddenError('You are not a member of this project');
        }
    }

    /**
     * Check if user has permission to modify project (owner or manager)
     */
    private async checkProjectPermission(projectId: string, userId: string): Promise<void> {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                members: {
                    where: { userId },
                },
            },
        });

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        // Check if user is creator or has admin/manager role
        const member = project.members[0];
        const isCreator = project.createdById === userId;
        const isAdminOrManager = member && (member.role === UserRole.ADMIN || member.role === UserRole.MANAGER);

        if (!isCreator && !isAdminOrManager) {
            throw new ForbiddenError('Insufficient permissions to modify this project');
        }
    }

    /**
     * Add multiple members at once
     */
    private async addMultipleMembers(projectId: string, userIds: string[]): Promise<void> {
        const validUsers = await prisma.user.findMany({
            where: {
                id: { in: userIds },
            },
            select: { id: true },
        });

        const validUserIds = validUsers.map((u: { id: string }) => u.id);

        if (validUserIds.length > 0) {
            await prisma.projectMember.createMany({
                data: validUserIds.map((userId: string) => ({
                    projectId,
                    userId,
                    role: UserRole.MEMBER,
                })),
                skipDuplicates: true,
            });
        }
    }
}

export const projectsService = new ProjectsService();
