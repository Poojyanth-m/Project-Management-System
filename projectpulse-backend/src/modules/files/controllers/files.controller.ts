import { Request, Response } from 'express';
import { filesService } from '../services/files.service';
import {
    getUploadUrlSchema,
    confirmUploadSchema,
    getFilesQuerySchema,
    fileIdSchema
} from '../validators/files.schema';

export class FilesController {

    async getUploadUrl(req: Request, res: Response) {
        const userId = req.user!.userId;
        const validatedData = getUploadUrlSchema.parse(req.body);
        const result = await filesService.getUploadUrl(userId, validatedData);

        res.status(200).json({
            success: true,
            data: result
        });
    }

    async confirmUpload(req: Request, res: Response) {
        const userId = req.user!.userId;
        const validatedData = confirmUploadSchema.parse(req.body);
        const file = await filesService.confirmUpload(userId, validatedData);

        res.status(201).json({
            success: true,
            data: file
        });
    }

    async getFiles(req: Request, res: Response) {
        const userId = req.user!.userId;
        const { entityType, entityId } = getFilesQuerySchema.parse(req.query);
        const files = await filesService.getFiles(userId, entityType, entityId);

        res.status(200).json({
            success: true,
            data: files
        });
    }

    async deleteFile(req: Request, res: Response) {
        const userId = req.user!.userId;
        const { id } = fileIdSchema.parse(req.params);
        await filesService.deleteFile(userId, id);

        res.status(200).json({
            success: true,
            message: 'File deleted successfully'
        });
    }
}

export const filesController = new FilesController();
