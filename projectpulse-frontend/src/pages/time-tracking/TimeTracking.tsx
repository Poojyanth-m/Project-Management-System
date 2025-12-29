import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, IconButton, MenuItem, Select, FormControl, InputLabel, TextField, Chip, Tabs, Tab, Menu, ListItemIcon, ToggleButton, ToggleButtonGroup, Tooltip, CircularProgress } from "@mui/material";
import { PlayArrow, Pause, Stop, History, AccessTime, DateRange, DeleteOutline, Edit, Download, PictureAsPdf, TableChart, InfoOutlined, MoreHoriz, Close } from "@mui/icons-material";
import TopBar from "../../components/layout/TopBar";
import { useProjectContext, type Project } from "../../context/ProjectContext";
import { Status, Brand } from "../../theme/colors";
import type { TimeEntry, TimeSummary } from "../../types/timeTracking";
import { timeTrackingService, Stopwatch } from "../../services/timeTrackingService";
import { getTasks } from "../../services/taskService";
import { RightDrawer } from "../../components/common/RightDrawer";

// --- Styles ---
const glassStyle = {
  background: "#F2EAE5",
  borderRadius: "16px",
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
};

const metricCardStyle = {
  width: "100%",
  minHeight: "180px",
  background: "#F2EAE5",
  borderRadius: "14px",
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.06)",
  },
};



// --- Helper Functions ---
const formatDuration = (minutes: number) => {
  // Input is minutes, convert to seconds for display
  return formatSeconds(minutes * 60);
};

const formatSeconds = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}


// --- Components ---

const TimerWidget = ({ projects, onSave }: { projects: Project[], onSave: (entry: Omit<TimeEntry, 'id' | 'status'>) => void }) => {
  const [status, setStatus] = useState<"idle" | "running" | "paused">("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [projectTasks, setProjectTasks] = useState<any[]>([]);
  const [description, setDescription] = useState("");

  const stopwatchRef = useRef<Stopwatch>(new Stopwatch());
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Fetch tasks when project changes
  useEffect(() => {
    if (selectedProjectId) {
      setProjectTasks([]); // Clear prev
      getTasks({ projectId: selectedProjectId }).then((data) => {
        setProjectTasks(data);
      }).catch(err => console.error("Failed to load tasks", err));
    } else {
      setProjectTasks([]);
    }
  }, [selectedProjectId]);

  const startTick = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setElapsedMs(stopwatchRef.current.getElapsed());
    }, 1000);
  };

  const handleStart = () => {
    if (!selectedTaskId) return; // Prevent start without task
    stopwatchRef.current.start();
    setStatus("running");
    startTick();
  };

  const handlePause = () => {
    stopwatchRef.current.pause();
    setStatus("paused");
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setElapsedMs(stopwatchRef.current.getElapsed());
  };

  const handleStop = () => {
    const finalDurationMs = stopwatchRef.current.stop();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    const minutes = finalDurationMs / 1000 / 60;

    // Only save if meaningful duration
    if (minutes > 0.01) { // > 0.6 seconds
      const project = projects.find(p => String(p.id) === selectedProjectId);

      onSave({
        userId: "current-user", // Backend will derive from token
        projectId: selectedProjectId,
        taskId: selectedTaskId,
        projectName: project ? project.name : "Unknown",
        description: description || "Time Log",
        date: new Date().toISOString().split('T')[0],
        durationMinutes: minutes,
        billable: true,
        startTime: new Date(Date.now() - finalDurationMs).toISOString(),
        endTime: new Date().toISOString()
      });
    }

    // Reset UI
    setElapsedMs(0);
    setDescription("");
    setStatus("idle");
    // Keep project/task selected for convenience? Or reset? Let's keep for repeated work.
  };

  return (
    <Box sx={{ ...glassStyle, padding: "20px", display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", mb: 4 }}>
      <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
        <InputLabel>Select Project</InputLabel>
        <Select
          value={selectedProjectId}
          label="Select Project"
          onChange={(e) => {
            setSelectedProjectId(e.target.value);
            setSelectedTaskId(""); // Reset task
          }}
          sx={{ borderRadius: "12px", background: "rgba(255,255,255,0.5)" }}
        >
          {projects.map(p => (
            <MenuItem key={p.id} value={String(p.id)}>{p.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 200, flex: 1 }} disabled={!selectedProjectId}>
        <InputLabel>Select Task</InputLabel>
        <Select
          value={selectedTaskId}
          label="Select Task"
          onChange={(e) => setSelectedTaskId(e.target.value)}
          sx={{ borderRadius: "12px", background: "rgba(255,255,255,0.5)" }}
        >
          {projectTasks.length > 0 ? (
            projectTasks.map(t => (
              <MenuItem key={t.id} value={t.id}>{t.title}</MenuItem>
            ))
          ) : (
            <MenuItem disabled value="">No tasks found</MenuItem>
          )}
        </Select>
      </FormControl>

      <TextField
        placeholder="What are you working on?"
        size="small"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ flex: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "rgba(255,255,255,0.5)" } }}
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "fit-content" }}>
        <Typography sx={{ fontSize: "24px", fontWeight: "700", fontFamily: "monospace", color: status === "running" ? "#E65F2B" : "#1A1A1A" }}>
          {formatSeconds(elapsedMs / 1000)}
        </Typography>

        <Tooltip
          title={
            <Box sx={{ p: 1 }}>
              <Typography variant="subtitle2" fontWeight={700} mb={1}>How to use the timer:</Typography>
              <Typography variant="body2" mb={0.5}>1. Select a Project and a Task (Required)</Typography>
              <Typography variant="body2" mb={0.5}>2. Click Start to begin tracking</Typography>
              <Typography variant="body2" mb={0.5}>3. Pause or Stop to save</Typography>
            </Box>
          }
          arrow
          placement="bottom"
        >
          <IconButton size="small" sx={{ color: "#666", "&:hover": { color: "#E65F2B" } }}>
            <InfoOutlined fontSize="small" />
          </IconButton>
        </Tooltip>

        {status === "running" ? (
          <>
            <Tooltip title="Pause timer" arrow>
              <IconButton
                onClick={handlePause}
                sx={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid #E65F2B", color: "#E65F2B", "&:hover": { bgcolor: "rgba(230, 95, 43, 0.1)" } }}
              >
                <Pause />
              </IconButton>
            </Tooltip>
            <Tooltip title="Stop and save" arrow>
              <IconButton
                onClick={handleStop}
                sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: "#D32F2F", color: "#fff", "&:hover": { bgcolor: "#B71C1C" } }}
              >
                <Stop />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Button
            variant="contained"
            onClick={handleStart}
            startIcon={status === "paused" ? <PlayArrow /> : <PlayArrow />}
            disabled={!selectedTaskId}
            sx={{
              borderRadius: "50px", height: "48px", padding: "0 32px", backgroundColor: "#E65F2B", textTransform: "none", fontSize: "16px", fontWeight: 600, boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
              "&:hover": { backgroundColor: "#BF491F" },
              "&.Mui-disabled": { backgroundColor: "#ccc" }
            }}
          >
            {status === "paused" ? "Resume" : "Start Timer"}
          </Button>
        )}
      </Box>
    </Box>
  );
};

const StatSummary = ({ summary }: { summary: TimeSummary | null }) => {
  if (!summary) return <Box>Loading stats...</Box>;

  return (
    <Box>
      <Typography variant="caption" sx={{ display: "block", mb: 2, color: "#666", fontWeight: 500 }}>
        Data Source: Live API
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 3, mb: 4 }}>
        {/* Total Weekly Time */}
        <Box sx={metricCardStyle}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: Brand.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF"
                }}
              >
                <Box sx={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <AccessTime />
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
                Total Time (Weekly)
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
              {formatDuration(summary.weeklyTotalMinutes)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mt: 2 }}>
            <Tooltip title="Total time tracked across all sessions in the selected period" arrow>
              <InfoOutlined sx={{ fontSize: 16, color: "#666666" }} />
            </Tooltip>
            <Typography
              sx={{
                fontFamily: "'Aeonik Pro TRIAL'",
                fontWeight: 500,
                fontSize: "12px",
                color: "#666666",
              }}
            >
              Tracked sessions
            </Typography>
          </Box>
        </Box>

        {/* Billable Hours */}
        <Box sx={metricCardStyle}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: Status.completed.main,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF"
                }}
              >
                <Box sx={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <History />
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
                Billable Hours
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
              {formatDuration(summary.billableMinutes)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mt: 2 }}>
            <Chip
              label="Billable"
              size="small"
              sx={{
                bgcolor: Status.completed.soft,
                color: Status.completed.main,
                fontWeight: 600,
                height: "24px"
              }}
            />
          </Box>
        </Box>

        {/* Total Sessions */}
        <Box sx={metricCardStyle}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: Status.inProgress.main,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF"
                }}
              >
                <Box sx={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <DateRange />
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
                Total Sessions
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
              {summary.totalSessions}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mt: 2 }}>
            <Chip
              label="Sessions"
              size="small"
              sx={{
                bgcolor: Status.inProgress.soft,
                color: Status.inProgress.main,
                fontWeight: 600,
                height: "24px"
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const WeeklyTimesheet = ({ projects, logs }: { projects: Project[], logs: TimeEntry[] }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Get current week's date range
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Adjust to get Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  // Create array of dates for the week (Mon-Sun)
  const weekDates = days.map((_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });

  // Process logs to calculate time per project per day
  const getTimeForProjectAndDay = (projectId: string, dayIndex: number): number => {
    const targetDate = weekDates[dayIndex];

    // Compare using local date parts to avoid timezone issues
    const targetDay = targetDate.getDate();
    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();

    const dayLogs = logs.filter(log => {
      if (log.projectId !== projectId || !log.startTime) return false;
      const logDate = new Date(log.startTime);
      return logDate.getDate() === targetDay &&
        logDate.getMonth() === targetMonth &&
        logDate.getFullYear() === targetYear;
    });

    return dayLogs.reduce((total, log) => total + log.durationMinutes, 0);
  };

  const formatMinutes = (minutes: number): string => {
    if (minutes === 0) return "-";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getProjectTotal = (projectId: string): number => {
    return days.reduce((total, _, index) =>
      total + getTimeForProjectAndDay(projectId, index), 0
    );
  };

  return (
    <Box sx={{ ...glassStyle, padding: "24px", overflowX: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" fontWeight={700} sx={{ color: "#1A1A1A" }}>Weekly Timesheet</Typography>
      </Box>
      <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "12px", color: "#666666" }}>Project</th>
            {days.map((d, index) => (
              <th key={d} style={{ textAlign: "center", padding: "12px", color: "#666666" }}>
                {d}
                <div style={{ fontSize: "10px", color: "#999" }}>
                  {weekDates[index].getDate()}/{weekDates[index].getMonth() + 1}
                </div>
              </th>
            ))}
            <th style={{ textAlign: "center", padding: "12px", color: "#1A1A1A", fontWeight: 800 }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => {
            const projectTotal = getProjectTotal(String(p.id));
            // Only show projects that have time logged
            if (projectTotal === 0) return null;

            return (
              <tr key={p.id} style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                <td style={{ padding: "16px", fontWeight: 600, color: "#1A1A1A" }}>{p.name}</td>
                {days.map((d, index) => {
                  const minutes = getTimeForProjectAndDay(String(p.id), index);
                  return (
                    <td key={d} style={{ textAlign: "center", padding: "16px", color: minutes > 0 ? "#1A1A1A" : "#666666" }}>
                      {formatMinutes(minutes)}
                    </td>
                  );
                })}
                <td style={{ textAlign: "center", padding: "16px", fontWeight: 700, color: "#E65F2B" }}>
                  {formatMinutes(projectTotal)}
                </td>
              </tr>
            );
          })}
          {projects.every(p => getProjectTotal(String(p.id)) === 0) && (
            <tr>
              <td colSpan={9} style={{ textAlign: "center", padding: "32px", color: "#666666" }}>
                No time logged this week
              </td>
            </tr>
          )}
        </tbody>
      </Box>
    </Box>
  );
};

const LogList = ({ logs, onExport, onMenuOpen }: {
  logs: TimeEntry[],
  onExport: (e: React.MouseEvent<HTMLElement>) => void,
  onMenuOpen: (e: React.MouseEvent<HTMLButtonElement>, log: TimeEntry) => void
}) => {
  return (
    <Box sx={{ ...glassStyle, padding: "24px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1A1A1A" }}>Activity Log</Typography>
        <Button
          startIcon={<Download />}
          size="small"
          sx={{ color: "#666666" }}
          onClick={onExport}
        >
          Export Report
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {logs.length === 0 ? (
          <Typography sx={{ color: "#666666", textAlign: "center", py: 4 }}>No time logs found.</Typography>
        ) : logs.map((log) => (
          <Box
            key={log.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderRadius: "12px",
              bgcolor: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(255,255,255,0.2)",
              transition: "transform 0.2s",
              "&:hover": { bgcolor: "rgba(255,255,255,0.6)", transform: "scale(1.005)" }
            }}
          >
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flex: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", color: "#E65F2B", fontWeight: 700 }}>
                {log.projectName.charAt(0)}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, color: "#1A1A1A" }}>{log.description}</Typography>
                <Typography sx={{ fontSize: "12px", color: "#666666" }}>{log.projectName} • {log.date}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 4, flex: 1, justifyContent: "flex-end" }}>
              <Chip label={log.billable ? "Billable" : "Non-billable"} size="small" variant="outlined" sx={{ borderColor: "rgba(0,0,0,0.1)", color: "#666666" }} />
              <Typography sx={{ fontWeight: 700, fontSize: "16px", fontFamily: "monospace", color: "#1A1A1A" }}>
                {formatDuration(log.durationMinutes)}
              </Typography>
              <Box>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); onMenuOpen(e, log); }}>
                  <MoreHoriz fontSize="small" sx={{ color: "#666" }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// --- Main Page ---
const TimeTracking = () => {
  const { projects } = useProjectContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewTab, setViewTab] = useState(0);
  const [filterType, setFilterType] = useState<"Daily" | "Weekly" | "Monthly">("Weekly");
  const [exportAnchor, setExportAnchor] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(true);

  // Backend Data State
  const [logs, setLogs] = useState<TimeEntry[]>([]);
  const [summary, setSummary] = useState<TimeSummary | null>(null);

  // Edit/Delete State
  const [editLogOpen, setEditLogOpen] = useState(false);
  const [logToEdit, setLogToEdit] = useState<TimeEntry | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuLog, setMenuLog] = useState<TimeEntry | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedLogs, fetchedSummary] = await Promise.all([
        timeTrackingService.getTimeEntries(),
        timeTrackingService.getSummary(filterType.toLowerCase() as any)
      ]);
      setLogs(fetchedLogs);
      setSummary(fetchedSummary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterType]);

  const handleAddLog = async (newLog: Omit<TimeEntry, 'id' | 'status'>) => {
    // Optimistic or wait? Let's wait for demo simplicity
    await timeTrackingService.addTimeEntry(newLog);
    fetchData(); // Refresh list and stats
  };

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchor(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchor(null);
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Project', 'Description', 'Date', 'Duration (hrs)', 'Billable'].join(','),
      ...visibleLogs.map(log => [
        log.projectName,
        `"${log.description}"`,
        log.date,
        (log.durationMinutes / 60).toFixed(2),
        log.billable ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-tracking-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    handleExportClose();
  };

  const handleExportPDF = () => {
    // Dynamic import to avoid bundling jsPDF if not used
    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.setTextColor(230, 95, 43); // Brand color
      doc.text('Time Tracking Report', 14, 20);

      // Date range
      doc.setFontSize(10);
      doc.setTextColor(102, 102, 102);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
      doc.text(`Period: ${filterType}`, 14, 33);

      // Summary section
      doc.setFontSize(14);
      doc.setTextColor(26, 26, 26);
      doc.text('Summary', 14, 45);

      doc.setFontSize(10);
      if (summary) {
        doc.text(`Total Time: ${formatDuration(summary.weeklyTotalMinutes)}`, 14, 53);
        doc.text(`Billable Hours: ${formatDuration(summary.billableMinutes)}`, 14, 59);
        doc.text(`Total Sessions: ${summary.totalSessions}`, 14, 65);
      }

      // Time entries table
      doc.setFontSize(14);
      doc.text('Time Entries', 14, 80);

      let yPos = 90;
      doc.setFontSize(9);
      doc.setTextColor(102, 102, 102);
      doc.text('Project', 14, yPos);
      doc.text('Description', 60, yPos);
      doc.text('Date', 120, yPos);
      doc.text('Duration', 155, yPos);
      doc.text('Billable', 185, yPos);

      yPos += 5;
      doc.setLineWidth(0.5);
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos, 200, yPos);

      yPos += 5;
      doc.setTextColor(26, 26, 26);

      visibleLogs.forEach((log) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        doc.text(log.projectName.substring(0, 20), 14, yPos);
        doc.text(log.description.substring(0, 25), 60, yPos);
        doc.text(log.date, 120, yPos);
        doc.text(formatDuration(log.durationMinutes), 155, yPos);
        doc.text(log.billable ? 'Yes' : 'No', 185, yPos);

        yPos += 7;
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 14, 285);
        doc.text('Project Pulse - Time Tracking', 200, 285, { align: 'right' });
      }

      doc.save(`time-tracking-${filterType.toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`);
    }).catch(err => {
      console.error('Failed to load jsPDF:', err);
      alert('Failed to generate PDF. Please try again.');
    });

    handleExportClose();
  };



  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>, log: TimeEntry) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setMenuLog(log);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    if (!showDeleteConfirm) {
      setMenuLog(null);
    }
  };

  const handleEditClick = () => {
    if (menuLog) {
      setLogToEdit(menuLog);
      setEditLogOpen(true);
      handleMenuClose();
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (menuLog) {
      console.log("Deleting time entry:", menuLog.id);
      // TODO: Implement deleteTimeEntry in timeTrackingService
      setShowDeleteConfirm(false);
      handleMenuClose();
      fetchData();
    }
  };

  const visibleLogs = logs.filter(l =>
    l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ pb: 4 }}>
      <TopBar
        title="Time Tracking"
        searchPlaceholder="Search time logs..."
        onSearch={setSearchQuery}
      />

      {/* Active Timer Widget (Always Visible) */}
      <TimerWidget projects={projects} onSave={handleAddLog} />

      {/* Stats Overview */}
      <StatSummary summary={summary} />

      {/* View Switcher Controls */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 2 }}>
        <Tabs
          value={viewTab}
          onChange={(_e, v) => setViewTab(v)}
          sx={{
            "& .MuiTabs-indicator": { backgroundColor: "#E65F2B" },
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600, color: "#666", "&.Mui-selected": { color: "#E65F2B" } }
          }}
        >
          <Tab label="Activity Log" />
          <Tab label="Timesheet" />
        </Tabs>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <ToggleButtonGroup
            value={filterType}
            exclusive
            onChange={(_e, newFilter) => { if (newFilter) setFilterType(newFilter) }}
            size="small"
            sx={{
              background: "rgba(255,255,255,0.4)",
              borderRadius: "8px",
              "& .MuiToggleButton-root": { textTransform: "none", fontWeight: 600, border: "none", borderRadius: "8px !important", m: 0.5, px: 2 },
              "& .Mui-selected": { bgcolor: "#fff !important", color: "#E65F2B !important", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }
            }}
          >
            <ToggleButton value="Daily">Daily</ToggleButton>
            <ToggleButton value="Weekly">Weekly</ToggleButton>
            <ToggleButton value="Monthly">Monthly</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Tab Content */}
      <Box sx={{ mt: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress sx={{ color: Brand.primary }} /></Box>
        ) : (
          <>
            {viewTab === 0 ? (
              <LogList
                logs={visibleLogs}
                onExport={handleExportClick}
                onMenuOpen={handleMenuOpen}
              />
            ) : (
              <WeeklyTimesheet projects={projects} logs={logs} />
            )}
          </>
        )}
      </Box>

      {/* Export Menu */}
      <Menu
        anchorEl={exportAnchor}
        open={Boolean(exportAnchor)}
        onClose={handleExportClose}
        PaperProps={{
          sx: { mt: 1, minWidth: 180, ...glassStyle, backdropFilter: "blur(20px)", borderRadius: "12px" }
        }}
      >
        <MenuItem onClick={handleExportCSV}>
          <ListItemIcon><TableChart fontSize="small" /></ListItemIcon>
          Export as CSV
        </MenuItem>
        <MenuItem onClick={handleExportPDF}>
          <ListItemIcon><PictureAsPdf fontSize="small" /></ListItemIcon>
          Export as PDF
        </MenuItem>
      </Menu>

      {/* Time Entry Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          elevation: 0,
          sx: {
            minWidth: 160,
            borderRadius: "12px",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
            border: "1px solid rgba(0,0,0,0.05)",
            mt: 1
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {!showDeleteConfirm ? (
          <>
            <MenuItem onClick={handleEditClick} sx={{ gap: 1.5, fontSize: "14px", fontWeight: 500, color: "#1A1A1A", py: 1 }}>
              <Edit fontSize="small" />
              Edit Entry
            </MenuItem>
            <MenuItem onClick={handleDeleteClick} sx={{ gap: 1.5, fontSize: "14px", fontWeight: 500, color: "#D32F2F", py: 1 }}>
              <DeleteOutline fontSize="small" />
              Delete
            </MenuItem>
          </>
        ) : (
          <>
            <Typography variant="caption" sx={{ px: 2, py: 1, color: "#666", display: "block", fontWeight: 600 }}>
              Delete this entry?
            </Typography>
            <MenuItem onClick={handleConfirmDelete} sx={{ gap: 1.5, fontSize: "14px", fontWeight: 700, color: "#D32F2F", py: 1, bgcolor: "#FEF2F2" }}>
              <DeleteOutline fontSize="small" />
              Yes, Delete
            </MenuItem>
            <MenuItem onClick={() => setShowDeleteConfirm(false)} sx={{ gap: 1.5, fontSize: "14px", fontWeight: 500, color: "#666", py: 1 }}>
              <Close fontSize="small" />
              Cancel
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Edit Log Drawer */}
      <RightDrawer
        open={editLogOpen}
        onClose={() => setEditLogOpen(false)}
        title="Edit Time Entry"
        actions={
          <>
            <Button variant="outlined" onClick={() => setEditLogOpen(false)} sx={{ borderRadius: "8px", textTransform: "none", color: Brand.primary, borderColor: Brand.primary, fontWeight: 600, "&:hover": { borderColor: Brand.primary, bgcolor: "rgba(230, 95, 43, 0.04)" } }}>Cancel</Button>
            <Button variant="contained" sx={{ bgcolor: Brand.primary, borderRadius: "8px", textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "#BF491F" } }}>Save Changes</Button>
          </>
        }
      >
        {logToEdit && (
          <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Description"
              fullWidth
              defaultValue={logToEdit.description}
              InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
            />
            <TextField
              label="Duration (minutes)"
              type="number"
              fullWidth
              defaultValue={logToEdit.durationMinutes}
              InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Chip
                label="Billable"
                clickable
                sx={{
                  bgcolor: logToEdit.billable ? Brand.primary : "#F3F4F6",
                  color: logToEdit.billable ? "#fff" : "#666",
                  fontWeight: 600
                }}
              />
              <Chip
                label="Non-billable"
                clickable
                sx={{
                  bgcolor: !logToEdit.billable ? "#666" : "#F3F4F6",
                  color: !logToEdit.billable ? "#fff" : "#666",
                  fontWeight: 600
                }}
              />
            </Box>
          </Box>
        )}
      </RightDrawer>
    </Box>
  );
};

export default TimeTracking;