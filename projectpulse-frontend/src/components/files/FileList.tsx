import { Box, Typography, IconButton, Menu, MenuItem, Link } from "@mui/material";
import { InsertDriveFile, MoreVert, Download, DeleteOutline, Description, Image, PictureAsPdf } from "@mui/icons-material";
import React, { useState } from "react";
import type { FileData } from "../../types/file";

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const FileIcon = ({ type }: { type: string }) => {
    if (type.includes("pdf")) return <PictureAsPdf style={{ color: "#F44336" }} />;
    if (type.includes("image")) return <Image style={{ color: "#4CAF50" }} />;
    return <Description style={{ color: "#2196F3" }} />;
};

interface FileListProps {
    files: FileData[];
    onDelete: (id: string) => void;
}

const FileList = ({ files, onDelete }: FileListProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedFile(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedFile(null);
    };

    const handleDelete = () => {
        if (selectedFile) onDelete(selectedFile);
        handleMenuClose();
    };

    if (files.length === 0) return null;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {files.map((file) => (
                <Box
                    key={file.id}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1.5,
                        borderRadius: "12px",
                        bgcolor: "white",
                        border: "1px solid rgba(0,0,0,0.05)",
                        transition: "all 0.2s",
                        "&:hover": { bgcolor: "#F9FAFB", borderColor: "rgba(0,0,0,0.1)" }
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, overflow: "hidden" }}>
                        <Box sx={{ p: 1, bgcolor: "#F3F4F6", borderRadius: "8px", display: "flex" }}>
                            <FileIcon type={file.fileType} />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="subtitle2" fontWeight={600} noWrap title={file.fileName}>{file.fileName}</Typography>
                            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                <Typography variant="caption" color="text.secondary">{formatBytes(file.fileSize)}</Typography>
                                <Typography variant="caption" color="text.secondary">•</Typography>
                                <Typography variant="caption" color="text.secondary">{file.uploadedBy}</Typography>
                                <Typography variant="caption" color="text.secondary">•</Typography>
                                <Typography variant="caption" color="text.secondary">{formatDate(file.uploadedAt)}</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, file.id)}>
                        <MoreVert fontSize="small" />
                    </IconButton>
                </Box>
            ))}

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleMenuClose}>
                    <Download fontSize="small" sx={{ mr: 1, color: "#666" }} /> Download
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: "#D32F2F" }}>
                    <DeleteOutline fontSize="small" sx={{ mr: 1 }} /> Delete
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default FileList;
