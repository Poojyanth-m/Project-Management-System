import { Box, Typography, LinearProgress } from "@mui/material";
import { AttachMoney, MoneyOff, AccountBalanceWallet, ArrowDropUp, ArrowDropDown } from "@mui/icons-material";
import { Status, Brand } from "../../theme/colors";
import type { ProjectBudget } from "../../types/budget";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

interface BudgetSummaryProps {
    budget: ProjectBudget;
}

const cardStyle = {
    width: "100%",
    minHeight: "180px",
    background: "#F2EAE5",
    borderRadius: "14px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
    minWidth: "200px",
    transition: "transform 0.2s",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.06)",
    },
};

const StatCard = ({ label, value, icon, trend, trendLabel, color }: { label: string, value: string, icon: React.ReactNode, trend?: "up" | "down", trendLabel?: string, color: string }) => {
    const trendColor = trend === "up" ? "#1A932E" : "#EE201C";

    return (
        <Box sx={cardStyle}>
            <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: 2 }}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            background: color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#FFFFFF"
                        }}
                    >
                        <Box sx={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {icon}
                        </Box>
                    </Box>
                    <Typography
                        sx={{
                            fontFamily: "'Aeonik Pro TRIAL'",
                            fontWeight: 500,
                            fontSize: "16px",
                            color: "#666666",
                        }}
                    >
                        {label}
                    </Typography>
                </Box>

                <Typography
                    sx={{
                        fontFamily: "'Aeonik Pro TRIAL'",
                        fontWeight: 700,
                        fontSize: "32px",
                        color: "#1A1A1A",
                        lineHeight: 1.2,
                    }}
                >
                    {value}
                </Typography>
            </Box>

            {trend && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        mt: 2
                    }}
                >
                    {trend === "up" ? (
                        <ArrowDropUp sx={{ color: trendColor, fontSize: 24 }} />
                    ) : (
                        <ArrowDropDown sx={{ color: trendColor, fontSize: 24 }} />
                    )}
                    <Typography
                        sx={{
                            fontFamily: "'Aeonik Pro TRIAL'",
                            fontWeight: 500,
                            fontSize: "12px",
                            color: "#666666",
                        }}
                    >
                        {trendLabel}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

const BudgetSummary = ({ budget }: BudgetSummaryProps) => {
    const remaining = budget.totalBudget - budget.spentAmount;
    const utilization = (budget.spentAmount / budget.totalBudget) * 100;

    // Determine health color
    let healthColor = Status.completed.main; // Green
    if (utilization > 90) healthColor = Status.atRisk.main; // Red
    else if (utilization > 75) healthColor = Status.inProgress.main; // Yellow

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Stats Cards */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                <StatCard
                    label="Total Budget"
                    value={formatCurrency(budget.totalBudget)}
                    icon={<AccountBalanceWallet />}
                    color={Brand.primary}
                />
                <StatCard
                    label="Total Spent"
                    value={formatCurrency(budget.spentAmount)}
                    icon={<MoneyOff />}
                    color={healthColor}
                    trend={utilization > 75 ? "up" : undefined}
                    trendLabel={`${utilization.toFixed(1)}%`}
                />
                <StatCard
                    label="Remaining"
                    value={formatCurrency(remaining)}
                    icon={<AttachMoney />}
                    color={remaining < 0 ? Status.atRisk.main : Status.completed.main}
                    trend={remaining < 0 ? "down" : "up"}
                    trendLabel={remaining < 0 ? "Over budget" : "Available"}
                />
            </Box>

            {/* Progress Bar Container */}
            <Box sx={{
                background: "#F2EAE5",
                borderRadius: "16px",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
                p: 3,
            }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: "#1A1A1A" }}>Budget Utilization</Typography>
                    <Typography variant="body2" fontWeight={700} color={healthColor}>{utilization.toFixed(1)}%</Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={Math.min(utilization, 100)}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "rgba(0,0,0,0.08)",
                        "& .MuiLinearProgress-bar": {
                            bgcolor: healthColor,
                            borderRadius: 4
                        }
                    }}
                />
            </Box>
        </Box>
    );
};

export default BudgetSummary;
