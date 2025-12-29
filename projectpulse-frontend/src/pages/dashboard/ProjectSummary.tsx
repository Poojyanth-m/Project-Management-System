import { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { Backgrounds, getProgressColor } from "../../theme/colors";
import StatusBadge from "../../components/common/StatusBadge";
import { getStatusBadgeVariant } from "../../utils/badgeHelpers";
import FilterDropdown from "../../components/common/FilterDropdown";

export interface ProjectRow {
  id: string | number;
  name: string;
  manager: string;
  dueDate: string;
  status: "Completed" | "Delayed" | "At risk" | "On going";
  progress: number;
}

interface ProjectSummaryProps {
  projects?: ProjectRow[];
}



const defaultRows: ProjectRow[] = [
  { id: 1, name: "Nelsa web developement", manager: "Om prakash sao", dueDate: "May 25, 2023", status: "Completed", progress: 100 },
  { id: 2, name: "Datascale AI app", manager: "Neilsan mando", dueDate: "Jun 20, 2023", status: "Delayed", progress: 35 },
  { id: 3, name: "Media channel branding", manager: "Tiruvelly priya", dueDate: "July 13, 2023", status: "At risk", progress: 68 },
  { id: 4, name: "Corlax iOS app develpoement", manager: "Matte hannery", dueDate: "Dec 20, 2023", status: "Completed", progress: 100 },
  { id: 5, name: "Website builder developement", manager: "Sukumar rao", dueDate: "Mar 15, 2024", status: "On going", progress: 50 },
];

const ProjectSummary = ({ projects = defaultRows }: ProjectSummaryProps) => {
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("Recent");

  // Filter and sort projects
  const filteredProjects = projects
    .filter((project) => statusFilter === "All Status" || project.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === "Name A-Z") return a.name.localeCompare(b.name);
      if (sortBy === "Name Z-A") return b.name.localeCompare(a.name);
      if (sortBy === "Progress") return b.progress - a.progress;
      return 0; // Recent (default order)
    });

  return (
    <Box
      sx={{
        flex: 2,
        backgroundColor: Backgrounds.card,
        borderRadius: "24px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
        height: "520px", // Fixed height to match OverallProgress
        overflow: "hidden", // Prevent outer scroll
      }}
    >
      {/* Header Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography
          sx={{
            fontFamily: "'Aeonik Pro TRIAL'",
            fontWeight: 600,
            fontSize: "18px",
            color: "#1A1A1A",
          }}
        >
          Project Summary
        </Typography>

        <Box sx={{ display: "flex", gap: "12px" }}>
          <FilterDropdown
            options={["Recent", "Name A-Z", "Name Z-A", "Progress"]}
            value={sortBy}
            onChange={setSortBy}
          />
          <FilterDropdown
            options={["All Status", "Completed", "Delayed", "At risk", "On going"]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </Box>
      </Box>

      {/* Table Header */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr",
          alignItems: "center",
          px: 2,
          pb: 1,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {["Name", "Project manager", "Due date", "Status", "Progress"].map((h) => (
          <Typography
            key={h}
            sx={{
              fontFamily: "'Aeonik Pro TRIAL'",
              fontWeight: 600,
              fontSize: "12px",
              color: "#666666",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {h}
          </Typography>
        ))}
      </Box>

      {/* Rows - Scrollable container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          overflowY: "auto", // Enable vertical scrolling
          flex: 1, // Take remaining space
          pr: 1, // Padding for scrollbar
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "transparent",
            borderRadius: "10px",
          },
          "&:hover::-webkit-scrollbar-thumb": {
            background: "rgba(0,0,0,0.2)",
          },
          "&:hover::-webkit-scrollbar-thumb:hover": {
            background: "rgba(0,0,0,0.3)",
          },
        }}
      >
        {filteredProjects.map((row) => {
          const progressColor = getProgressColor(row.progress);

          return (
            <Box
              key={row.id}
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr",
                alignItems: "center",
                px: 2,
                py: 1.5,
                borderRadius: "12px",
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.02)",
                }
              }}
            >
              <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>{row.name}</Typography>
              <Typography sx={{ fontSize: "14px", color: "#666666" }}>{row.manager}</Typography>
              <Typography sx={{ fontSize: "14px", color: "#666666" }}>{row.dueDate}</Typography>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StatusBadge
                  label={row.status}
                  variant={getStatusBadgeVariant(row.status)}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={36}
                    thickness={3}
                    sx={{ color: "#E5E7EB", position: "absolute" }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={row.progress}
                    size={36}
                    thickness={3}
                    sx={{ color: progressColor }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: "absolute",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#1A1A1A" }}>
                      {row.progress}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ProjectSummary;
