import type { FileData, UploadMetadata, EntityType } from "../types/file";

// Mock Store
let MOCK_FILES: FileData[] = [
    {
        id: "f1",
        entityType: "TASK",
        entityId: "1",
        fileName: "requirements_v2.pdf",
        fileType: "application/pdf",
        fileSize: 1024 * 1024 * 2.5, // 2.5MB
        uploadedBy: "Alice Johnson",
        uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        downloadUrl: "#"
    },
    {
        id: "f2",
        entityType: "PROJECT",
        entityId: "1",
        fileName: "brand_assets.zip",
        fileType: "application/zip",
        fileSize: 1024 * 1024 * 15, // 15MB
        uploadedBy: "David Kim",
        uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        downloadUrl: "#"
    }
];

export const fileService = {
    getFiles: async (entityType: EntityType, entityId: string): Promise<FileData[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_FILES.filter(f => f.entityType === entityType && f.entityId === entityId)
                    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()));
            }, 500);
        });
    },

    // Mock Presign step - returns a mock URL to upload to
    presignUpload: async (fileName: string, _fileType: string): Promise<string> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`https://mock-storage.com/${Date.now()}_${fileName}`);
            }, 300);
        });
    },

    // Mock Metadata save step
    saveFileMetadata: async (metadata: UploadMetadata): Promise<FileData> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newFile: FileData = {
                    id: `new_${Date.now()}`,
                    ...metadata,
                    uploadedBy: "You", // Mock user
                    uploadedAt: new Date().toISOString(),
                    downloadUrl: "#"
                };
                MOCK_FILES = [newFile, ...MOCK_FILES];
                resolve(newFile);
            }, 300);
        });
    },

    // Simulate current user check for delete permissions etc.
    deleteFile: async (fileId: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                MOCK_FILES = MOCK_FILES.filter(f => f.id !== fileId);
                resolve();
            }, 300);
        });
    }
};
