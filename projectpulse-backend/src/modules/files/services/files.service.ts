import prisma from '../../../config/database';
import { NotFoundError, ForbiddenError } from '../../../utils/errors';
import { GetUploadUrlRequest, ConfirmUploadRequest } from '../files.types';
import { EntityType } from '@prisma/client';

export class FilesService {

    /**
     * Generates a presigned URL for file upload.
     * NOTE: Since we don't have actual AWS credentials/setup in this environment,
     * this will simulate the behavior by returning a fake URL and expecting the frontend
     * to "upload" (or pretend to). In a real app, this would use AWS SDK S3 `getSignedUrl`.
     */
    async getUploadUrl(userId: string, data: GetUploadUrlRequest) {
        // 1. Verify access to entity
        await this.checkEntityAccess(userId, data.entityType, data.entityId);

        // 2. Generate a unique key
        const timestamp = Date.now();
        const cleanFileName = data.fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = `uploads/${data.entityType.toLowerCase()}/${data.entityId}/${timestamp}-${cleanFileName}`;

        // 3. Mock Presigned URL
        // In production: const url = await s3.getSignedUrlPromise('putObject', { Key: key, ... });
        const uploadUrl = `https://mock-s3-bucket.amazonaws.com/${key}?signature=mock-signature&expires=3600`;

        return {
            uploadUrl,
            key,
            expiresIn: 3600
        };
    }

    /**
     * Confirms upload and creates DB record
     */
    async confirmUpload(userId: string, data: ConfirmUploadRequest) {
        await this.checkEntityAccess(userId, data.entityType, data.entityId);

        // In a real app, we might headObject to S3 to verify it exists and get size.
        // Here we trust the client data for the mock flow.

        const publicUrl = `https://mock-s3-bucket.amazonaws.com/${data.key}`;

        const file = await prisma.file.create({
            data: {
                name: data.name,
                url: publicUrl,
                size: data.size,
                mimeType: data.mimeType,
                entityType: data.entityType,
                entityId: data.entityId,
                uploadedBy: userId
            }
        });

        return file;
    }

    /**
     * List files for an entity
     */
    async getFiles(userId: string, entityType: EntityType, entityId: string) {
        await this.checkEntityAccess(userId, entityType, entityId);

        return prisma.file.findMany({
            where: {
                entityType,
                entityId,
                isArchived: false
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Delete (archive) a file
     */
    async deleteFile(userId: string, fileId: string) {
        const file = await prisma.file.findUnique({ where: { id: fileId } });
        if (!file) throw new NotFoundError('File not found');

        // Check access
        await this.checkEntityAccess(userId, file.entityType, file.entityId);

        // In real S3, we might delete the object or move it. Here, just soft delete logic.
        return prisma.file.update({
            where: { id: fileId },
            data: { isArchived: true }
        });
    }

    // --- Helper ---

    private async checkEntityAccess(userId: string, type: EntityType, id: string) {
        if (type === EntityType.PROJECT) {
            const membership = await prisma.projectMember.findFirst({
                where: { projectId: id, userId }
            });
            if (!membership) throw new ForbiddenError('Access denied to project');
        } else if (type === EntityType.TASK) {
            const task = await prisma.task.findUnique({
                where: { id },
                include: { project: { include: { members: true } } }
            });
            if (!task) throw new NotFoundError('Task not found');
            const isMember = task.project.members.some((m: { userId: string }) => m.userId === userId);
            if (!isMember) throw new ForbiddenError('Access denied to task');
        }
    }
}

export const filesService = new FilesService();
