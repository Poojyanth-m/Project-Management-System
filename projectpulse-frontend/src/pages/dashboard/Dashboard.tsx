import { Box, Typography } from "@mui/material";
import {
  WorkOutline,
  TaskAlt,
  People,
  TrendingUp,
} from "@mui/icons-material";
import TopBar from "../../components/layout/TopBar";
import StatCard from "./StatCard";
import ProjectSummary from "./ProjectSummary";
import OverallProgress from "./OverallProgress";
import SecondaryWidgets from "./SecondaryWidgets";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/analyticsService";
import { useProjectContext } from "../../context/ProjectContext";

const Dashboard = () => {
  const { projects } = useProjectContext(); // tasks removed as we use stats for counts
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeTasks: 0,
    totalMembers: 0,
    avgCompletion: 0,
    completedProjects: 0,
    delayedProjects: 0,
    ongoingProjects: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        console.log("Dashboard stats from backend:", data);

        // Map the nested backend response structure to flat state
        const mappedStats = {
          totalProjects: data.projects?.total || 0,
          activeTasks: data.tasks?.total - data.tasks?.completed || 0,
          totalMembers: data.members?.total || 0,
          avgCompletion: data.projects?.completionRate || 0,
          completedProjects: data.projects?.completed || 0,
          delayedProjects: data.projects?.delayed || 0,
          ongoingProjects: data.projects?.active || 0
        };

        console.log("Mapped stats for dashboard:", mappedStats);
        setStats(mappedStats);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };
    fetchStats();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  // use stats from state
  const {
    totalProjects,
    activeTasks,
    totalMembers,
    avgCompletion,
    completedProjects,
    delayedProjects,
    ongoingProjects
  } = stats;

  // Filter and Map context projects to summary rows
  const summaryProjects = projects
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .map(p => ({
      id: p.id,
      name: p.name,
      manager: "Alex Meian", // Placeholder until manager is in context
      dueDate: "Dec 31, 2024", // Placeholder
      status: (
        p.status.toLowerCase() === "active" ? "On going" :
          p.status.toLowerCase() === "on hold" ? "Delayed" :
            p.status.charAt(0).toUpperCase() + p.status.slice(1).toLowerCase()
      ) as any,
      progress: p.progress
    }));

  // Map projects for OverallProgress with necessary fields
  const progressProjects = projects.map(p => ({
    id: p.id,
    status: (
      p.status.toLowerCase() === "active" ? "On going" :
        p.status.toLowerCase() === "on hold" ? "Delayed" :
          p.status.charAt(0).toUpperCase() + p.status.slice(1).toLowerCase()
    ),
    progress: p.progress,
    createdAt: p.startDate,
    updatedAt: p.dueDate // Use dueDate as a proxy for filtering
  }));

  return (
    <>
      <TopBar
        title="Dashboard"
        searchPlaceholder="Search projects..."
        onSearch={setSearchQuery}
      />



      {/* Overview Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "34px",
          mb: 4,
          mt: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Aeonik Pro TRIAL'",
            fontWeight: 400,
            fontSize: "22px",
            lineHeight: "25px",
            letterSpacing: "0.01em",
            color: "#1A1A1A",
            px: 1,
            py: 0.5,
          }}
        >
          Overview
        </Typography>
      </Box>

      {/* ================= STAT CARDS ================= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)"
          },
          gap: "24px",
          width: "100%",
          mb: 4,
        }}
      >
        <StatCard
          title="Total Projects"
          value={totalProjects}
          icon={<WorkOutline />}
          pillColor="#E89271"
          trendText="12% increase from last month"
          trendDirection="up"
        />
        <StatCard
          title="Active Tasks"
          value={activeTasks}
          icon={<TaskAlt />}
          pillColor="#70A1E6"
          trendText="10% decrease from last month"
          trendDirection="down"
        />
        <StatCard
          title="Team Members"
          value={totalMembers}
          icon={<People />}
          pillColor="#F0C274"
          trendText="8% increase from last month"
          trendDirection="up"
        />
        <StatCard
          title="Completion Rate"
          value={`${avgCompletion}%`}
          icon={<TrendingUp />}
          pillColor="#D398E7"
          trendText="2% increase from last month"
          trendDirection="up"
        />
      </Box>

      {/* ================= PROJECT SUMMARY + OVERALL PROGRESS ================= */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: "16px",
          width: "100%",
          mb: 4,
        }}
      >
        <ProjectSummary projects={summaryProjects.length > 0 ? summaryProjects : undefined} />
        <OverallProgress
          projects={progressProjects}
          total={totalProjects}
          completed={completedProjects}
          delayed={delayedProjects}
          ongoing={ongoingProjects}
          percent={avgCompletion}
        />
      </Box>
      {/* ================= TASK / DEADLINES / WORKLOAD ================= */}
      <SecondaryWidgets />
    </>
  );
};

export default Dashboard;
