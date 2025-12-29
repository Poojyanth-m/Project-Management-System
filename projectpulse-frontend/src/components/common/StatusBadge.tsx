import { Box, Typography } from "@mui/material";

export type BadgeVariant = "red" | "yellow" | "green" | "grey" | "blue";

interface StatusBadgeProps {
    label: string;
    variant: BadgeVariant;
}

const badgeStyles: Record<BadgeVariant, { bg: string; color: string }> = {
    red: { bg: "#FEE2E2", color: "#EF4444" },
    yellow: { bg: "#FEF3C7", color: "#F59E0B" },
    green: { bg: "#D1FAE5", color: "#059669" },
    grey: { bg: "#F3F4F6", color: "#6B7280" },
    blue: { bg: "#DBEAFE", color: "#2563EB" },
};

const StatusBadge = ({ label, variant }: StatusBadgeProps) => {
    const style = badgeStyles[variant];

    return (
        <Box
            sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "24px",
                px: 1.25,
                borderRadius: "12px",
                backgroundColor: style.bg,
                color: style.color,
                fontSize: "11px",
                fontWeight: 600,
                fontFamily: "'Aeonik Pro TRIAL'",
                whiteSpace: "nowrap",
                lineHeight: 1,
            }}
        >
            <Typography
                component="span"
                sx={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "inherit",
                    lineHeight: 1,
                }}
            >
                {label}
            </Typography>
        </Box>
    );
};

export default StatusBadge;
