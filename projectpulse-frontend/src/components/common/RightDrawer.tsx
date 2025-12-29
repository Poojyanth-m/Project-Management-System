import React from "react";
import { Drawer, Box, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Text } from "../../theme/colors";

interface RightDrawerProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    header?: React.ReactNode;
    children: React.ReactNode;
    actions?: React.ReactNode;
    width?: string | number;
    contentSx?: any;
}

export const RightDrawer = ({ open, onClose, title, header, children, actions, width = "520px", contentSx }: RightDrawerProps) => {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { width: width, p: 0, bgcolor: "#FAFAFA", borderRadius: "20px 0 0 20px" } }}
        >
            {/* Header Section */}
            {(header || title) && (
                <Box sx={{ p: 4, bgcolor: "#fff", borderBottom: "1px solid #eee" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        {header ? (
                            <Box sx={{ flex: 1 }}>{header}</Box>
                        ) : (
                            <Typography variant="h5" fontWeight="800" color={Text.primary}>{title}</Typography>
                        )}
                        <IconButton onClick={onClose} size="small" sx={{ bgcolor: "rgba(0,0,0,0.05)", ml: 2, color: "#666", "&:hover": { bgcolor: "rgba(0,0,0,0.1)" } }}><Close /></IconButton>
                    </Box>
                </Box>
            )}

            {/* Content Section */}
            <Box sx={{ p: 4, overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 3, ...contentSx }}>
                {children}
            </Box>

            {/* Actions/Footer Section */}
            {actions && (
                <Box sx={{ mt: "auto", p: 3, borderTop: "1px solid #eee", bgcolor: "#fff", display: "flex", gap: 2, justifyContent: "flex-end" }}>
                    {actions}
                </Box>
            )}
        </Drawer>
    );
};
