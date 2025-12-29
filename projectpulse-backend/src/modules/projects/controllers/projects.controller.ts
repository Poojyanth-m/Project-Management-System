import { Request, Response } from 'express';
import { projectsService } from '../services/projects.service';
import {
    createProjectSchema,
    updateProjectSchema,
    addMemberSchema,
    removeMemberSchema,
    projectIdSchema,
    projectQuerySchema,
} from '../validators/projects.schema';

export class ProjectsController {
    /**
     * Create new project
     * POST /api/projects
     */
    async createProject(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const validatedData = createProjectSchema.parse(req.body);

        const project = await projectsService.createProject(userId, validatedData);

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: project,
        });
    }

    /**
     * Get all projects for user
     * GET /api/projects
     */
    async getProjects(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const filters = projectQuerySchema.parse(req.query);

        const projects = await projectsService.getUserProjects(userId, filters);

        res.status(200).json({
            success: true,
            data: projects,
        });
    }

    /**
     * Get project by ID
     * GET /api/projects/:id
     */
    async getProjectById(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const { id } = projectIdSchema.parse(req.params);

        const project = await projectsService.getProjectById(id, userId);

        res.status(200).json({
            success: true,
            data: project,
        });
    }

    /**
     * Update project
     * PATCH /api/projects/:id
     */
    async updateProject(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const { id } = projectIdSchema.parse(req.params);
        const validatedData = updateProjectSchema.parse(req.body);

        const project = await projectsService.updateProject(id, userId, validatedData);

        res.status(200).json({
            success: true,
            message: 'Project updated successfully',
            data: project,
        });
    }

    /**
     * Archive project
     * DELETE /api/projects/:id
     */
    async archiveProject(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const { id } = projectIdSchema.parse(req.params);

        const project = await projectsService.archiveProject(id, userId);

        res.status(200).json({
            success: true,
            message: 'Project archived successfully',
            data: project,
        });
    }

    /**
     * Add member to project
     * POST /api/projects/:id/members
     */
    async addMember(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const { id } = projectIdSchema.parse(req.params);
        const { userId: memberUserId, role } = addMemberSchema.parse(req.body);

        const member = await projectsService.addMember(id, userId, memberUserId, role);

        res.status(201).json({
            success: true,
            message: 'Member added successfully',
            data: member,
        });
    }

    /**
     * Remove member from project
     * DELETE /api/projects/:id/members
     */
    async removeMember(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const { id } = projectIdSchema.parse(req.params);
        const { userId: memberUserId } = removeMemberSchema.parse(req.body);

        await projectsService.removeMember(id, userId, memberUserId);

        res.status(200).json({
            success: true,
            message: 'Member removed successfully',
        });
    }

    /**
     * Get project members
     * GET /api/projects/:id/members
     */
    async getMembers(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const { id } = projectIdSchema.parse(req.params);

        const members = await projectsService.getProjectMembers(id, userId);

        res.status(200).json({
            success: true,
            data: members,
        });
    }
}

export const projectsController = new ProjectsController();
