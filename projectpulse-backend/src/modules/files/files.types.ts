import { EntityType } from '@prisma/client';

export interface FileResponse {
    id: string;
    name: string;
    url: string;
    size: number;
    mimeType: string;
    entityType: EntityType;
    entityId: string;
    uploadedBy: string;
    createdAt: Date;
}

export interface GetUploadUrlRequest {
    fileName: string;
    fileType: string; // MIME type
    fileSize: number;
    entityType: EntityType;
    entityId: string;
}

export interface ConfirmUploadRequest {
    name: string;
    size: number;
    mimeType: string;
    entityType: EntityType;
    entityId: string;
    key: string; // The storage key/path returned from getUploadUrl
}
