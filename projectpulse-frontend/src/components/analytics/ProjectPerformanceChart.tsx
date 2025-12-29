import { Box, Typography, LinearProgress } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import type { ProjectPerformance } from "../../types/analytics";

interface ProjectPerformanceChartProps {
    data: ProjectPerformance[];
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "On Track": return "#10B981";
        case "At Risk": return "#F59E0B";
        case "Delayed": return "#EF4444";
        default: return "#6B7280";
    }
};

const ProjectPerformanceChart = ({ data }: ProjectPerformanceChartProps) => {
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
                <TrendingUp sx={{ color: "#E65F2B" }} />
                <Typography
                    sx={{
                        fontFamily: "'Aeonik Pro TRIAL'",
                        fontWeight: 600,
                        fontSize: "18px",
                        color: "#1A1A1A",
                    }}
                >
                    Project Performance
                </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {data.map((project, index) => (
                    <Box key={index}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                            <Box>
                                <Typography
                                    sx={{
                                        fontFamily: "'Aeonik Pro TRIAL'",
                                        fontWeight: 600,
                                        fontSize: "14px",
                                        color: "#1A1A1A",
                                        mb: 0.5
                                    }}
                                >
                                    {project.projectName}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "'Aeonik Pro TRIAL'",
                                        fontSize: "12px",
                                        color: "#666666",
                                    }}
                                >
                                    {project.tasksCompleted} / {project.totalTasks} tasks
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box
                                    sx={{
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: "12px",
                                        bgcolor: `${getStatusColor(project.status)}20`,
                                        color: getStatusColor(project.status),
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: "'Aeonik Pro TRIAL'",
                                            fontSize: "11px",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {project.status}
                                    </Typography>
                                </Box>
                                <Typography
                                    sx={{
                                        fontFamily: "'Aeonik Pro TRIAL'",
                                        fontWeight: 700,
                                        fontSize: "16px",
                                        color: "#1A1A1A",
                                    }}
                                >
                                    {project.completionRate}%
                                </Typography>
                            </Box>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={project.completionRate}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: "rgba(0,0,0,0.08)",
                                "& .MuiLinearProgress-bar": {
                                    bgcolor: getStatusColor(project.status),
                                    borderRadius: 4,
                                },
                            }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default ProjectPerformanceChart;
