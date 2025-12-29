import { Request, Response, NextFunction } from 'express';
import { resourcesService } from '../services/resources.service';

export const getResources = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const resources = await resourcesService.getAllResources();
        res.status(200).json({ success: true, data: resources });
    } catch (error) {
        next(error);
    }
};

export const getStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await resourcesService.getStats();
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};

export const createResource = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const resource = await resourcesService.createResource(req.body);
        res.status(201).json({ success: true, data: resource });
    } catch (error) {
        next(error);
    }
};

export const allocateResource = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allocation = await resourcesService.createAllocation(req.body);
        res.status(201).json({ success: true, data: allocation });
    } catch (error) {
        next(error);
    }
};

export const deleteResource = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await resourcesService.deleteResource(req.params.id);
        res.status(200).json({ success: true, message: 'Resource deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const updateResource = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await resourcesService.updateResource(req.params.id, req.body);
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        next(error);
    }
};
