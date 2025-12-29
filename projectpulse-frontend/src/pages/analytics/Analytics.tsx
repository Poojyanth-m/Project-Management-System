import { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress, TextField } from "@mui/material";
import {
  TableChart,
  PictureAsPdf,
  Assessment,
  CheckCircleOutline,
  Assignment,
  AccessTime,
  AccountBalanceWallet,
  TrendingUp,
  TrendingDown,
  ArrowDropUp,
  ArrowDropDown,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import TopBar from "../../components/layout/TopBar";
import { Brand, Status } from "../../theme/colors";
import { getDashboard, exportReport, downloadSummary } from "../../services/analyticsService";
import type { AnalyticsDashboard } from "../../types/analytics";
import ProjectPerformanceChart from "../../components/analytics/ProjectPerformanceChart";
import TaskDistributionChart from "../../components/analytics/TaskDistributionChart";

// Standardized metric card style
const metricCardStyle = {
  width: "100%",
  minHeight: "180px",
  background: "rgba(255, 255, 255, 0.2)", // Glass effect
  backdropFilter: "blur(12px)",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    background: "rgba(255, 255, 255, 0.3)",
    boxShadow: "0 12px 28px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
  },
};

const MetricCard = ({
  label,
  value,
  icon,
  trend,
  trendLabel,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down";
  trendLabel?: string;
  color: string;
}) => {
  const trendColor = trend === "up" ? "#1A932E" : "#EE201C";

  return (
    <Box sx={metricCardStyle}>
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
              color: "#FFFFFF",
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
            mt: 2,
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

const Analytics = () => {
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  // Date range state
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [dateError, setDateError] = useState<string>("");

  useEffect(() => {
    // Only fetch if dates are valid
    if (!dateError) {
      fetchAnalytics();
    }
  }, [startDate, endDate, dateError]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const analyticsData = await getDashboard(startDate, endDate);
      setData(analyticsData);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      enqueueSnackbar("Failed to load analytics data", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (newStartDate: string) => {
    setStartDate(newStartDate);

    // Validate: end date should be >= start date
    if (endDate && newStartDate > endDate) {
      setDateError("Start date cannot be after end date");
      enqueueSnackbar("Start date cannot be after end date", { variant: "error" });
    } else {
      setDateError("");
    }
  };

  const handleEndDateChange = (newEndDate: string) => {
    setEndDate(newEndDate);

    // Validate: end date should be >= start date
    if (startDate && newEndDate < startDate) {
      setDateError("End date cannot be before start date");
      enqueueSnackbar("End date cannot be before start date", { variant: "error" });
    } else {
      setDateError("");
    }
  };

  const handleExportCSV = async () => {
    if (dateError) {
      enqueueSnackbar("Please fix date range errors before exporting", { variant: "error" });
      return;
    }
    await exportReport(startDate, endDate);
    enqueueSnackbar("Report exported successfully", { variant: "success" });
  };

  const handleDownloadSummary = async () => {
    if (dateError) {
      enqueueSnackbar("Please fix date range errors before downloading", { variant: "error" });
      return;
    }
    await downloadSummary(startDate, endDate);
    enqueueSnackbar("Summary downloaded successfully", { variant: "success" });
  };

  if (loading) {
    return (
      <Box>
        <TopBar title="Analytics & Reporting" />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress sx={{ color: Brand.primary }} />
        </Box>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box>
        <TopBar title="Analytics & Reporting" />
        <Box sx={{ p: 4 }}>
          <Typography>Failed to load analytics data. Please try again.</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <TopBar title="Analytics & Reporting" />

      {/* Header with Date Range and Export Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        {/* Title and Last Updated on Left */}
        <Box>
          <Typography
            sx={{
              fontFamily: "'Aeonik Pro TRIAL'",
              fontSize: "22px",
              fontWeight: 400,
              color: "#1A1A1A",
              mb: 0.5,
            }}
          >
            Overview
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Aeonik Pro TRIAL'",
              fontSize: "14px",
              color: "#666666",
            }}
          >
            Last updated: {new Date(data.lastUpdated).toLocaleString()}
          </Typography>
        </Box>

        {/* Date Range Pickers and Export Buttons on Right */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          {/* Date Range Pickers */}
          <TextField
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            error={!!dateError && dateError.includes("Start date")}
            helperText={dateError.includes("Start date") ? dateError : ""}
            inputProps={{
              max: endDate, // Start date cannot be after end date
            }}
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
            sx={{
              width: "150px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "#F2EAE5",
                "& fieldset": {
                  borderColor: dateError && dateError.includes("Start date") ? "#d32f2f" : "rgba(0,0,0,0.1)",
                },
                "&:hover fieldset": {
                  borderColor: dateError && dateError.includes("Start date") ? "#d32f2f" : Brand.primary,
                },
                "&.Mui-focused fieldset": {
                  borderColor: dateError && dateError.includes("Start date") ? "#d32f2f" : Brand.primary,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: dateError && dateError.includes("Start date") ? "#d32f2f" : Brand.primary,
              },
              "& .MuiFormHelperText-root": {
                position: "absolute",
                bottom: "-20px",
                fontSize: "11px",
              },
            }}
          />
          <Typography sx={{ color: "#666666", fontWeight: 500, fontSize: "14px" }}>to</Typography>
          <TextField
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            error={!!dateError && dateError.includes("End date")}
            helperText={dateError.includes("End date") ? dateError : ""}
            inputProps={{
              min: startDate, // End date cannot be before start date
              max: new Date().toISOString().split('T')[0], // Cannot select future dates
            }}
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
            sx={{
              width: "150px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "#F2EAE5",
                "& fieldset": {
                  borderColor: dateError && dateError.includes("End date") ? "#d32f2f" : "rgba(0,0,0,0.1)",
                },
                "&:hover fieldset": {
                  borderColor: dateError && dateError.includes("End date") ? "#d32f2f" : Brand.primary,
                },
                "&.Mui-focused fieldset": {
                  borderColor: dateError && dateError.includes("End date") ? "#d32f2f" : Brand.primary,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: dateError && dateError.includes("End date") ? "#d32f2f" : Brand.primary,
              },
              "& .MuiFormHelperText-root": {
                position: "absolute",
                bottom: "-20px",
                fontSize: "11px",
              },
            }}
          />

          {/* Export Buttons */}
          <Button
            variant="outlined"
            startIcon={<PictureAsPdf />}
            onClick={handleDownloadSummary}
            size="small"
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              fontWeight: 600,
              borderColor: Brand.primary,
              color: Brand.primary,
              px: 2,
              "&:hover": {
                borderColor: Brand.primary,
                bgcolor: `${Brand.primary}10`,
              },
            }}
          >
            Download Summary
          </Button>
          <Button
            variant="contained"
            startIcon={<TableChart />}
            onClick={handleExportCSV}
            size="small"
            sx={{
              bgcolor: Brand.primary,
              borderRadius: "24px",
              textTransform: "none",
              fontWeight: 600,
              px: 2,
              "&:hover": { bgcolor: Brand.primary },
            }}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* KPI Metrics */}
      {/* Unified Glass Metrics Container */}
      <Box
        sx={{
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(24px)",
          borderRadius: "32px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          padding: { xs: 2, md: 4 },
          mb: 4,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {/* Row 1: KPI Metrics */}
          <MetricCard
            label="Total Projects"
            value={data.projects.total}
            icon={<Assessment />}
            color={Brand.primary}
            trend="up"
            trendLabel={`${data.projects.completed} completed`}
          />
          <MetricCard
            label="Completion Rate"
            value={`${data.projects.completionRate}%`}
            icon={<CheckCircleOutline />}
            color={Status.completed.main}
            trend="up"
            trendLabel="On track"
          />
          <MetricCard
            label="Total Hours"
            value={data.time.loggedHours.toLocaleString()}
            icon={<AccessTime />}
            color={Status.inProgress.main}
            trend="up"
            trendLabel={`${data.time.utilizationRate}% utilized`}
          />
          <MetricCard
            label="Budget Utilization"
            value={`${data.budget.utilizationRate}%`}
            icon={<AccountBalanceWallet />}
            color={
              data.budget.utilizationRate > 90
                ? Status.atRisk.main
                : data.budget.utilizationRate > 75
                  ? Status.inProgress.main
                  : Status.completed.main
            }
            trend={data.budget.utilizationRate > 80 ? "up" : "down"}
            trendLabel={`₹${(data.budget.spent / 1000).toFixed(0)}k spent`}
          />

          {/* Row 2: Detailed/Secondary Metrics */}
          <MetricCard
            label="On-Track Projects"
            value={data.projects.active}
            icon={<TrendingUp />}
            color={Status.completed.main}
          />
          <MetricCard
            label="Delayed Projects"
            value={data.projects.delayed}
            icon={<TrendingDown />}
            color={Status.atRisk.main}
          />
          <MetricCard
            label="Tasks Completed"
            value={data.tasks.completed}
            icon={<Assignment />}
            color={Status.completed.main}
            trend="up"
            trendLabel={`${data.tasks.completionRate}% done`}
          />
          <MetricCard
            label="Overdue Tasks"
            value={data.tasks.overdue}
            icon={<Assignment />}
            color={Status.atRisk.main}
          />
        </Box>
      </Box>

      {/* Charts Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr",
          },
          gap: 3,
          mb: 4,
        }}
      >
        <TaskDistributionChart data={data.taskDistribution} />
        <ProjectPerformanceChart data={data.projectPerformance} />
      </Box>

      {/* Time & Budget Insights */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
          },
          gap: 3,
        }}
      >
        {/* Time Insights */}
        <Box
          sx={{
            background: "#F2EAE5",
            borderRadius: "14px",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
            padding: "24px",
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Aeonik Pro TRIAL'",
              fontWeight: 600,
              fontSize: "18px",
              color: "#1A1A1A",
              mb: 3,
            }}
          >
            Time Summary
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "14px", color: "#666666" }}>
                Logged Hours
              </Typography>
              <Typography sx={{ fontSize: "16px", fontWeight: 700 }}>
                {data.time.loggedHours.toLocaleString()} hrs
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "14px", color: "#666666" }}>
                Planned Hours
              </Typography>
              <Typography sx={{ fontSize: "16px", fontWeight: 700 }}>
                {data.time.plannedHours.toLocaleString()} hrs
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "14px", color: "#666666" }}>
                Billable Hours
              </Typography>
              <Typography
                sx={{ fontSize: "16px", fontWeight: 700, color: Status.completed.main }}
              >
                {data.time.billableHours.toLocaleString()} hrs
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "14px", color: "#666666" }}>
                Utilization Rate
              </Typography>
              <Typography
                sx={{ fontSize: "16px", fontWeight: 700, color: Brand.primary }}
              >
                {data.time.utilizationRate}%
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Budget Insights */}
        <Box
          sx={{
            background: "#F2EAE5",
            borderRadius: "14px",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
            padding: "24px",
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Aeonik Pro TRIAL'",
              fontWeight: 600,
              fontSize: "18px",
              color: "#1A1A1A",
              mb: 3,
            }}
          >
            Budget Summary
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "14px", color: "#666666" }}>
                Total Budget
              </Typography>
              <Typography sx={{ fontSize: "16px", fontWeight: 700 }}>
                ₹{(data.budget.totalBudget / 1000).toFixed(0)}k
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "14px", color: "#666666" }}>
                Total Spent
              </Typography>
              <Typography
                sx={{ fontSize: "16px", fontWeight: 700, color: Status.inProgress.main }}
              >
                ₹{(data.budget.spent / 1000).toFixed(0)}k
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "14px", color: "#666666" }}>
                Remaining
              </Typography>
              <Typography
                sx={{ fontSize: "16px", fontWeight: 700, color: Status.completed.main }}
              >
                ₹{(data.budget.remaining / 1000).toFixed(0)}k
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "14px", color: "#666666" }}>
                Utilization Rate
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color:
                    data.budget.utilizationRate > 90
                      ? Status.atRisk.main
                      : Brand.primary,
                }}
              >
                {data.budget.utilizationRate}%
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Analytics;