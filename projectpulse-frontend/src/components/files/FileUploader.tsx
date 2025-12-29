import React, { useState, useRef } from "react";
import { Box, Typography, Button, LinearProgress, IconButton } from "@mui/material";
import { CloudUpload, Close, InsertDriveFile } from "@mui/icons-material";
import { Brand } from "../../theme/colors";


// Inline helper if creating new file is too much context switch for tiny logic
const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

interface FileUploaderProps {
    onUpload: (file: File) => Promise<void>;
}

const FileUploader = ({ onUpload }: FileUploaderProps) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const triggerUpload = async () => {
        if (!file) return;
        setUploading(true);
        setProgress(0);

        // Simulate progress for UX
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;
                return prev + 10;
            });
        }, 200);

        try {
            await onUpload(file);
            setProgress(100);
            setTimeout(() => {
                setFile(null);
                setUploading(false);
                setProgress(0);
            }, 500);
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            clearInterval(interval);
        }
    };

    return (
        <Box
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            sx={{
                border: "2px dashed",
                borderColor: dragActive ? Brand.primary : "#ccc",
                borderRadius: "16px",
                p: 3,
                textAlign: "center",
                bgcolor: dragActive ? "rgba(230, 95, 43, 0.05)" : "#F9FAFB",
                transition: "all 0.2s",
                position: "relative"
            }}
        >
            <input
                ref={inputRef}
                type="file"
                style={{ display: "none" }}
                onChange={handleChange}
            />

            {!file ? (
                <>
                    <CloudUpload sx={{ fontSize: 40, color: "#ccc", mb: 1 }} />
                    <Typography variant="body2" fontWeight={600} color="text.primary">
                        Drag & Drop or <span style={{ color: Brand.primary, cursor: "pointer" }} onClick={() => inputRef.current?.click()}>Choose File</span>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">All formats supported</Typography>
                </>
            ) : (
                <Box sx={{ width: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Box sx={{ p: 1, bgcolor: "#eee", borderRadius: "8px" }}><InsertDriveFile sx={{ color: "#666" }} /></Box>
                        <Box sx={{ flex: 1, textAlign: "left" }}>
                            <Typography variant="subtitle2" fontWeight={700} noWrap>{file.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{formatBytes(file.size)}</Typography>
                        </Box>
                        {!uploading && (
                            <IconButton size="small" onClick={() => setFile(null)}>
                                <Close fontSize="small" />
                            </IconButton>
                        )}
                    </Box>

                    {uploading ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <LinearProgress variant="determinate" value={progress} sx={{ flex: 1, borderRadius: "4px", height: 6 }} />
                            <Typography variant="caption" fontWeight={600}>{progress}%</Typography>
                        </Box>
                    ) : (
                        <Button fullWidth variant="contained" onClick={triggerUpload} sx={{ bgcolor: Brand.primary, color: "white", textTransform: "none", boxShadow: "none", "&:hover": { bgcolor: "#BF491F" } }}>
                            Upload File
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default FileUploader;
