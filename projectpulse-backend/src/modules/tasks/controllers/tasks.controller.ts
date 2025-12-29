import { Request, Response } from 'express';
import { tasksService } from '../services/tasks.service';
import {
    createTaskSchema,
    updateTaskSchema,
    taskIdSchema,
    taskQuerySchema,
} from '../validators/tasks.schema';

export class TasksController {
    /**
     * Create new task
     * POST /api/tasks
     */
    async createTask(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const validatedData = createTaskSchema.parse(req.body);

        const task = await tasksService.createTask(userId, validatedData);

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task,
        });
    }

    /**
     * Get tasks with filters
     * GET /api/tasks
     */
    async getTasks(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const filters = taskQuerySchema.parse(req.query);

        const tasks = await tasksService.getTasks(userId, filters);

        res.status(200).json({
            success: true,
            data: tasks,
        });
    }

    /**
     * Get task by ID
     * GET /api/tasks/:id
     */
    async getTaskById(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const { id } = taskIdSchema.parse(req.params);

        const task = await tasksService.getTaskById(id, userId);

        res.status(200).json({
            success: true,
            data: task,
        });
    }

    /**
     * Update task
     * PATCH /api/tasks/:id
     */
    async updateTask(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const { id } = taskIdSchema.parse(req.params);
        const validatedData = updateTaskSchema.parse(req.body);

        const task = await tasksService.updateTask(id, userId, validatedData);

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: task,
        });
    }

    /**
     * Delete task (soft delete)
     * DELETE /api/tasks/:id
     */
    async deleteTask(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const { id } = taskIdSchema.parse(req.params);

        const task = await tasksService.deleteTask(id, userId);

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
            data: task,
        });
    }
}

export const tasksController = new TasksController();
