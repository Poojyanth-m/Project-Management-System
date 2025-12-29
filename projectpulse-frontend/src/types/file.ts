export type EntityType = "PROJECT" | "TASK";

export interface FileData {
    id: string;
    entityType: EntityType;
    entityId: string;
    fileName: string;
    fileType: string;
    fileSize: number; // in bytes
    uploadedBy: string;
    uploadedAt: string; // ISO
    downloadUrl?: string; // Pre-signed or public URL
}

export interface UploadMetadata {
    entityType: EntityType;
    entityId: string;
    fileName: string;
    fileType: string;
    fileSize: number;
}
