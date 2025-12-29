import { Request, Response } from 'express';
import { ganttService } from '../services/gantt.service';
import {
    ganttQuerySchema,
    dependencySchema,
    deleteDependencySchema
} from '../validators/gantt.schema';

export class GanttController {

    async getProjectGantt(req: Request, res: Response) {
        const userId = req.user!.userId;
        const { projectId } = ganttQuerySchema.parse(req.query);
        const data = await ganttService.getProjectGanttData(userId, projectId);

        res.status(200).json({
            success: true,
            data
        });
    }

    async addDependency(req: Request, res: Response) {
        const userId = req.user!.userId;
        const validated = dependencySchema.parse(req.body);
        const dependency = await ganttService.addDependency(userId, validated);

        res.status(201).json({
            success: true,
            data: dependency
        });
    }

    async removeDependency(req: Request, res: Response) {
        const userId = req.user!.userId;
        const validated = deleteDependencySchema.parse(req.body);
        await ganttService.removeDependency(userId, validated);

        res.status(200).json({
            success: true,
            message: 'Dependency removed'
        });
    }
}

export const ganttController = new GanttController();
