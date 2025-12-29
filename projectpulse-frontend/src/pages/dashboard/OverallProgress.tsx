import { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import FilterDropdown from "../../components/common/FilterDropdown";

interface Project {
  id: string | number;
  status: string;
  progress: number;
  createdAt?: string;
  updatedAt?: string;
}

interface OverallProgressProps {
  projects?: Project[];
  total?: number;
  completed?: number;
  delayed?: number;
  ongoing?: number;
  percent?: number;
}

const OverallProgress = ({ projects = [], total = 0, completed = 0, delayed = 0, ongoing = 0, percent = 0 }: OverallProgressProps) => {
  const [timePeriod, setTimePeriod] = useState("All");

  // Filter projects based on time period
  const filterProjectsByPeriod = (projects: Project[]) => {
    if (timePeriod === "All") return projects;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return projects.filter(project => {
      const projectDate = project.updatedAt ? new Date(project.updatedAt) : new Date();
      const projectMonth = projectDate.getMonth();
      const projectYear = projectDate.getFullYear();

      if (timePeriod === "This Month") {
        return projectMonth === currentMonth && projectYear === currentYear;
      } else if (timePeriod === "Last Month") {
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return projectMonth === lastMonth && projectYear === lastMonthYear;
      } else if (timePeriod === "This Quarter") {
        const currentQuarter = Math.floor(currentMonth / 3);
        const projectQuarter = Math.floor(projectMonth / 3);
        return projectQuarter === currentQuarter && projectYear === currentYear;
      }
      return true;
    });
  };

  // Calculate stats from filtered projects
  const filteredProjects = projects.length > 0 ? filterProjectsByPeriod(projects) : [];

  const calculatedTotal = filteredProjects.length || total;
  const calculatedCompleted = filteredProjects.filter(p => p.status === "Completed").length || completed;
  const calculatedDelayed = filteredProjects.filter(p => p.status === "Delayed" || p.status === "On Hold").length || delayed;
  const calculatedOngoing = filteredProjects.filter(p => p.status === "On going" || p.status === "Active").length || ongoing;
  const calculatedPercent = calculatedTotal > 0
    ? Math.round((filteredProjects.reduce((sum, p) => sum + p.progress, 0) / calculatedTotal))
    : percent;

  // Calculate percentages for each segment
  const safeTotal = calculatedTotal || 1;
  const completedPercent = (calculatedCompleted / safeTotal) * 100;
  const delayedPercent = (calculatedDelayed / safeTotal) * 100;
  const ongoingPercent = (calculatedOngoing / safeTotal) * 100;

  return (
    <Box
      sx={{
        flex: 1.5,
        width: "100%",
        backgroundColor: "#F2EAE5",
        borderRadius: "24px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontFamily: "'Aeonik Pro TRIAL'", fontWeight: 600, fontSize: "18px", color: "#1A1A1A" }}>
          Overall Progress
        </Typography>
        <FilterDropdown
          options={["All", "This Month", "Last Month", "This Quarter"]}
          value={timePeriod}
          onChange={setTimePeriod}
        />
      </Box>

      {/* Circular Progress */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 3 }}>
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          {/* Background circle */}
          <CircularProgress
            variant="determinate"
            value={100}
            size={200}
            thickness={4}
            sx={{
              color: "#E5E7EB",
              position: "absolute",
            }}
          />

          {/* Completed (Green) */}
          <CircularProgress
            variant="determinate"
            value={completedPercent}
            size={200}
            thickness={4}
            sx={{
              color: "#1A932E",
              position: "absolute",
              strokeLinecap: "round",
            }}
          />

          {/* Delayed (Yellow) - starts after completed */}
          <CircularProgress
            variant="determinate"
            value={completedPercent + delayedPercent}
            size={200}
            thickness={4}
            sx={{
              color: "#E5AE21",
              position: "absolute",
              strokeLinecap: "round",
              transform: `rotate(${completedPercent * 3.6}deg) !important`,
            }}
          />

          {/* Ongoing (Orange) - starts after delayed */}
          <CircularProgress
            variant="determinate"
            value={ongoingPercent}
            size={200}
            thickness={4}
            sx={{
              color: "#E65F2B",
              strokeLinecap: "round",
              transform: `rotate(${(completedPercent + delayedPercent) * 3.6}deg) !important`,
            }}
          />

          {/* Center Text */}
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ fontFamily: "'Aeonik Pro TRIAL'", fontSize: "48px", fontWeight: 700, color: "#1A1A1A", lineHeight: 1 }}>
              {calculatedPercent}%
            </Typography>
            <Typography sx={{ fontFamily: "'Aeonik Pro TRIAL'", fontSize: "16px", color: "#666666", mt: 1 }}>
              Completed
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer Stats */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 1, mt: 1 }}>
        {[
          { label: "Total projects", value: calculatedTotal, color: "#1A1A1A" },
          { label: "Completed", value: calculatedCompleted, color: "#1A932E" },
          { label: "Delayed", value: calculatedDelayed, color: "#E5AE21" },
          { label: "On going", value: calculatedOngoing, color: "#E65F2B" },
        ].map((item) => (
          <Box key={item.label} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography sx={{ fontFamily: "'Aeonik Pro TRIAL'", fontSize: "20px", fontWeight: 600, color: item.color }}>
              {item.value}
            </Typography>
            <Typography sx={{ fontSize: "11px", color: "#666666", textAlign: "center", lineHeight: 1.2 }}>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OverallProgress;
