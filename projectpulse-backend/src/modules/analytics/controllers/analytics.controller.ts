import { Request, Response } from 'express';
import { analyticsService } from '../services/analytics.service';
import { projectAnalyticsQuerySchema, analyticsQuerySchema } from '../validators/analytics.schema';

export class AnalyticsController {

    async getDashboardStats(req: Request, res: Response) {
        const userId = req.user!.userId;
        const { startDate, endDate } = analyticsQuerySchema.parse(req.query);
        const stats = await analyticsService.getDashboardStats(userId, startDate, endDate);

        res.status(200).json({
            success: true,
            data: stats
        });
    }

    async getProjectAnalytics(req: Request, res: Response) {
        const userId = req.user!.userId;
        const { projectId } = projectAnalyticsQuerySchema.parse(req.query);
        const stats = await analyticsService.getProjectAnalytics(userId, projectId);

        res.status(200).json({
            success: true,
            data: stats
        });
    }
}

export const analyticsController = new AnalyticsController();
