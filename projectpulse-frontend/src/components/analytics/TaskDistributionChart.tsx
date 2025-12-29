import { Box, Typography } from "@mui/material";
import { PieChart } from "@mui/icons-material";
import type { TaskStatusDistribution } from "../../types/analytics";

interface TaskDistributionChartProps {
    data: TaskStatusDistribution[];
}

const TaskDistributionChart = ({ data }: TaskDistributionChartProps) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);

    return (
        <Box
            sx={{
                background: "#F2EAE5",
                borderRadius: "14px",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
                padding: "24px",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <PieChart sx={{ color: "#E65F2B" }} />
                <Typography
                    sx={{
                        fontFamily: "'Aeonik Pro TRIAL'",
                        fontWeight: 600,
                        fontSize: "18px",
                        color: "#1A1A1A",
                    }}
                >
                    Task Status Distribution
                </Typography>
            </Box>

            {/* Simple Bar Chart */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {data.map((item, index) => (
                    <Box key={index}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: "50%",
                                        bgcolor: item.color,
                                    }}
                                />
                                <Typography
                                    sx={{
                                        fontFamily: "'Aeonik Pro TRIAL'",
                                        fontWeight: 500,
                                        fontSize: "14px",
                                        color: "#1A1A1A",
                                    }}
                                >
                                    {item.status}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Typography
                                    sx={{
                                        fontFamily: "'Aeonik Pro TRIAL'",
                                        fontSize: "12px",
                                        color: "#666666",
                                    }}
                                >
                                    {item.count} tasks
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "'Aeonik Pro TRIAL'",
                                        fontWeight: 700,
                                        fontSize: "16px",
                                        color: "#1A1A1A",
                                        minWidth: "50px",
                                        textAlign: "right",
                                    }}
                                >
                                    {item.percentage.toFixed(1)}%
                                </Typography>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                width: "100%",
                                height: 8,
                                borderRadius: 4,
                                bgcolor: "rgba(0,0,0,0.08)",
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                sx={{
                                    width: `${item.percentage}%`,
                                    height: "100%",
                                    bgcolor: item.color,
                                    borderRadius: 4,
                                }}
                            />
                        </Box>
                    </Box>
                ))}
            </Box>

            {/* Total Summary */}
            <Box
                sx={{
                    mt: 3,
                    pt: 2,
                    borderTop: "1px solid rgba(0,0,0,0.08)",
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography
                        sx={{
                            fontFamily: "'Aeonik Pro TRIAL'",
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "#1A1A1A",
                        }}
                    >
                        Total Tasks
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: "'Aeonik Pro TRIAL'",
                            fontWeight: 700,
                            fontSize: "18px",
                            color: "#1A1A1A",
                        }}
                    >
                        {total}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default TaskDistributionChart;
