import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { fileService } from "../../services/fileService";
import type { FileData, EntityType } from "../../types/file";
import FileUploader from "./FileUploader";
import FileList from "./FileList";

interface FileManagerProps {
    entityType: EntityType;
    entityId: string;
}

const FileManager = ({ entityType, entityId }: FileManagerProps) => {
    const [files, setFiles] = useState<FileData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadFiles();
    }, [entityType, entityId]);

    const loadFiles = async () => {
        setLoading(true);
        const data = await fileService.getFiles(entityType, entityId);
        setFiles(data);
        setLoading(false);
    };

    const handleUpload = async (file: File) => {
        // 1. Presign
        await fileService.presignUpload(file.name, file.type);
        // 2. Upload to URL (Skipped in mock, pretended to work)
        // 3. Save Metadata
        await fileService.saveFileMetadata({
            entityType,
            entityId,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size
        });
        // Reload
        await loadFiles();
    };

    const handleDelete = async (id: string) => {
        await fileService.deleteFile(id);
        await loadFiles();
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
                <Typography variant="subtitle2" fontWeight={700} mb={2} color="text.secondary">Upload New File</Typography>
                <FileUploader onUpload={handleUpload} />
            </Box>

            <Box sx={{ flex: 1, overflowY: "auto", minHeight: "200px" }}>
                <Typography variant="subtitle2" fontWeight={700} mb={2} color="text.secondary">Attached Files ({files.length})</Typography>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress size={24} /></Box>
                ) : files.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>No files attached yet.</Typography>
                ) : (
                    <FileList files={files} onDelete={handleDelete} />
                )}
            </Box>
        </Box>
    );
};

export default FileManager;
