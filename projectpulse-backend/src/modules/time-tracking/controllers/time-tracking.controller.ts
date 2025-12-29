import { Request, Response } from 'express';
import { timeTrackingService } from '../services/time-tracking.service';
import {
    startTimerSchema,
    stopTimerSchema,
    manualEntrySchema,
    timeEntryQuerySchema
} from '../validators/time-tracking.schema';

export class TimeTrackingController {

    async startTimer(req: Request, res: Response) {
        const userId = req.user!.userId;
        const validatedData = startTimerSchema.parse(req.body);
        const entry = await timeTrackingService.startTimer(userId, validatedData);

        res.status(201).json({
            success: true,
            data: entry
        });
    }

    async stopTimer(req: Request, res: Response) {
        const userId = req.user!.userId;
        const validatedData = stopTimerSchema.parse(req.body);
        const entry = await timeTrackingService.stopTimer(userId, validatedData);

        res.status(200).json({
            success: true,
            data: entry
        });
    }

    async createManualEntry(req: Request, res: Response) {
        const userId = req.user!.userId;
        const validatedData = manualEntrySchema.parse(req.body);
        const entry = await timeTrackingService.createManualEntry(userId, validatedData);

        res.status(201).json({
            success: true,
            data: entry
        });
    }

    async getTimeEntries(req: Request, res: Response) {
        const userId = req.user!.userId;
        const filters = timeEntryQuerySchema.parse(req.query);
        const entries = await timeTrackingService.getTimeEntries(userId, filters);

        res.status(200).json({
            success: true,
            data: entries
        });
    }

    async getRunningTimer(req: Request, res: Response) {
        const userId = req.user!.userId;
        const entry = await timeTrackingService.getRunningTimer(userId);

        res.status(200).json({
            success: true,
            data: entry
        });
    }
}

export const timeTrackingController = new TimeTrackingController();
