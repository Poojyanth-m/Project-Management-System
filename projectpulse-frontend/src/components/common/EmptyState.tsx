import { Box, Typography } from "@mui/material";

interface EmptyStateProps {
    message: string;
    height?: string;
}

export const EmptyState = ({ message, height = "60vh" }: EmptyStateProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: height,
                flexDirection: "column",
                gap: 2
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                    color: "#6b7280",
                    fontWeight: 500
                }}
            >
                {message}
            </Typography>
        </Box>
    );
};
