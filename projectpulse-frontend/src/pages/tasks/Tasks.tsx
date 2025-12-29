import { useState, useEffect } from "react";
import { Box, Typography, Button, IconButton, Chip, Avatar, Tooltip, Tabs, Tab, Divider, TextField, MenuItem, Menu } from "@mui/material";
import {
    Add,
    CheckCircleOutline,
    Assignment,
    WarningAmber,
    Schedule,
    Edit,
    DeleteOutline,
    ArrowDropUp,
    ArrowDropDown,
    ChatBubbleOutline,
    History,
    AttachFile,
    MoreHoriz,
    Close
} from "@mui/icons-material";
import TopBar from "../../components/layout/TopBar";
import { Status, Brand, Text } from "../../theme/colors";
import CommentsSection from "../../components/comments/CommentsSection";
import ActivityFeed from "../../components/activity/ActivityFeed";
import { RightDrawer } from "../../components/common/RightDrawer";
import FileManager from "../../components/files/FileManager";
import StatusBadge from "../../components/common/StatusBadge";
import { getStatusBadgeVariant, getPriorityBadgeVariant } from "../../utils/badgeHelpers";
import { getTasks, createTask, updateTask, deleteTask } from "../../services/taskService";
import { useProjectContext } from "../../context/ProjectContext";
import { useSnackbar } from "notistack";

// --- Types ---
export interface TaskData {
    id: number | string;
    title: string;
    project: string;
    projectId?: string;
    priority: "High" | "Medium" | "Low" | "HIGH" | "MEDIUM" | "LOW";
    status: "To Do" | "In Progress" | "In Review" | "Completed" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
    dueDate: string;
    assignee: { name: string; avatar: string };
    progress: number; // 0-100
}

// --- Mock Data (fallback if API fails or no data) ---
const mockTasks: TaskData[] = [
    {
        id: 1,
        title: "Design System Components",
        project: "Website Redesign",
        priority: "High",
        status: "In Progress",
        dueDate: "2024-12-30",
        assignee: { name: "Poojyanth", avatar: "P" },
        progress: 65
    },
    {
        id: 2,
        title: "API Integration Testing",
        project: "Mobile App Development",
        priority: "High",
        status: "To Do",
        dueDate: "2025-01-05",
        assignee: { name: "Rakshitha", avatar: "R" },
        progress: 0
    },
    {
        id: 3,
        title: "Database Schema Updates",
        project: "Backend Optimization",
        priority: "Medium",
        status: "In Review",
        dueDate: "2024-12-28",
        assignee: { name: "Prakriti", avatar: "P" },
        progress: 90
    },
    {
        id: 4,
        title: "User Authentication Flow",
        project: "Website Redesign",
        priority: "High",
        status: "Completed",
        dueDate: "2024-12-20",
        assignee: { name: "Sanjana", avatar: "S" },
        progress: 100
    },
    {
        id: 5,
        title: "Social Media Campaign Assets",
        project: "Marketing Campaign Q1",
        priority: "Medium",
        status: "To Do",
        dueDate: "2025-01-10",
        assignee: { name: "Venkata", avatar: "V" },
        progress: 0
    },
    {
        id: 6,
        title: "Performance Optimization",
        project: "Backend Optimization",
        priority: "Low",
        status: "In Progress",
        dueDate: "2025-01-15",
        assignee: { name: "Poojyanth", avatar: "P" },
        progress: 30
    },
];

// --- Styles ---
const glassStyle = {
    background: "#F2EAE5",
    borderRadius: "16px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
};

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

// --- Sub-components ---

const StatCard = ({ label, value, icon, trend, trendLabel, color }: { label: string, value: string | number, icon: React.ReactNode, trend?: "up" | "down", trendLabel?: string, color: string }) => {
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
                        {trendLabel} from last month
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

const TaskRow = ({ task, onClick, onMenuOpen }: {
    task: TaskData,
    onClick: () => void,
    onMenuOpen: (e: React.MouseEvent<HTMLButtonElement>, task: TaskData) => void
}) => {
    return (
        <Box
            onClick={onClick}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                mb: 2,
                borderRadius: "16px",
                bgcolor: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.4)",
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }
            }}
        >
            {/* Title & Project */}
            <Box sx={{ width: "30%" }}>
                <Typography variant="subtitle2" fontWeight="700" color="#1A1A1A">{task.title}</Typography>
                <Typography variant="caption" color="#666666">{task.project}</Typography>
            </Box>

            {/* Assignee */}
            <Box sx={{ width: "10%" }}>
                <Tooltip title={task.assignee.name}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#E65F2B", fontSize: "14px" }}>{task.assignee.name.charAt(0)}</Avatar>
                </Tooltip>
            </Box>

            {/* Priority */}
            <Box sx={{ width: "15%", display: "flex", alignItems: "center" }}>
                <StatusBadge label={task.priority} variant={getPriorityBadgeVariant(task.priority)} />
            </Box>

            {/* Status */}
            <Box sx={{ width: "15%", display: "flex", alignItems: "center" }}>
                <StatusBadge label={task.status} variant={getStatusBadgeVariant(task.status)} />
            </Box>

            {/* Due Date */}
            <Box sx={{ width: "15%" }}>
                <Typography variant="body2" fontSize="13px" color="#666666">{task.dueDate}</Typography>
            </Box>

            {/* Actions */}
            <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); onMenuOpen(e, task); }}
                >
                    <MoreHoriz fontSize="small" sx={{ color: "#666" }} />
                </IconButton>
            </Box>
        </Box>
    );
};

const TaskDetailsDrawer = ({ task, open, onClose }: { task: TaskData | null, open: boolean, onClose: () => void }) => {
    const [tabIndex, setTabIndex] = useState(0);

    if (!task) return null;

    const headerContent = (
        <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.5, mb: 1, display: "block" }}>
                {task.project}
            </Typography>
            <Typography variant="h5" fontWeight={700} sx={{ color: Text.primary, mb: 1 }}>
                {task.title}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
                <Chip label={task.status} size="small" sx={{ fontSize: "11px", fontWeight: 600 }} />
                <Chip label={task.priority} size="small" sx={{ fontSize: "11px", fontWeight: 600 }} />
            </Box>
        </Box>
    );

    return (
        <RightDrawer
            open={open}
            onClose={onClose}
            header={headerContent}
            contentSx={{ p: 0, gap: 0 }}
        >
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "white", px: 3 }}>
                <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} sx={{ "& .MuiTabs-indicator": { bgcolor: Brand.primary } }}>
                    <Tab label="Details" sx={{ textTransform: "none", fontWeight: 600, "&.Mui-selected": { color: Brand.primary } }} />
                    <Tab label="Files" icon={<AttachFile fontSize="small" />} iconPosition="start" sx={{ textTransform: "none", fontWeight: 600, "&.Mui-selected": { color: Brand.primary } }} />
                    <Tab label="Comments" icon={<ChatBubbleOutline fontSize="small" />} iconPosition="start" sx={{ textTransform: "none", fontWeight: 600, "&.Mui-selected": { color: Brand.primary } }} />
                    <Tab label="Activity" icon={<History fontSize="small" />} iconPosition="start" sx={{ textTransform: "none", fontWeight: 600, "&.Mui-selected": { color: Brand.primary } }} />
                </Tabs>
            </Box>

            {/* Content */}
            <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {tabIndex === 0 && (
                    <Box sx={{ flex: 1, overflowY: "auto" }}>
                        <Typography variant="subtitle2" fontWeight={700} mb={1}>Description</Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            This is a mock description for the task. In a real application, this would contain detailed requirements, acceptance criteria, and other necessary information for the assignee.
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="subtitle2" fontWeight={700} mb={2}>Assignee</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar sx={{ bgcolor: Brand.primary }}>{task.assignee.name.charAt(0)}</Avatar>
                            <Box>
                                <Typography variant="body2" fontWeight={600}>{task.assignee.name}</Typography>
                                <Typography variant="caption" color="text.secondary">Software Engineer</Typography>
                            </Box>
                        </Box>
                    </Box>
                )}
                {tabIndex === 1 && (
                    <FileManager entityType="TASK" entityId={task.id.toString()} />
                )}
                {tabIndex === 2 && (
                    <CommentsSection entityType="TASK" entityId={task.id.toString()} />
                )}
                {tabIndex === 3 && (
                    <ActivityFeed entityType="TASK" entityId={task.id.toString()} />
                )}
            </Box>
        </RightDrawer>
    );
};

const CreateTaskDrawer = ({ open, onClose, onTaskCreated }: { open: boolean, onClose: () => void, onTaskCreated: () => void }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [projectId, setProjectId] = useState("");
    const [priority, setPriority] = useState("MEDIUM");
    const [status, setStatus] = useState("TODO");
    const [dueDate, setDueDate] = useState("");
    const [creating, setCreating] = useState(false);
    const { projects } = useProjectContext();
    const { enqueueSnackbar } = useSnackbar();

    // Reset form when drawer opens
    useEffect(() => {
        if (open) {
            setTitle("");
            setDescription("");
            setProjectId(projects.length > 0 ? String(projects[0].id) : "");
            setPriority("MEDIUM");
            setStatus("TODO");
            setDueDate("");
        }
    }, [open, projects]);

    const handleSubmit = async () => {
        if (!title.trim()) {
            enqueueSnackbar('Task title is required', { variant: 'error' });
            return;
        }
        if (!projectId) {
            enqueueSnackbar('Please select a project', { variant: 'error' });
            return;
        }

        try {
            setCreating(true);
            await createTask({
                title: title.trim(),
                description: description.trim(),
                projectId,
                priority,
                status,
                dueDate: dueDate || undefined,
            });
            enqueueSnackbar('Task created successfully!', { variant: 'success' });
            onTaskCreated();
            onClose();
        } catch (error) {
            console.error("Failed to create task:", error);
            enqueueSnackbar('Failed to create task', { variant: 'error' });
        } finally {
            setCreating(false);
        }
    };

    const actions = (
        <>
            <Button
                variant="outlined"
                onClick={onClose}
                disabled={creating}
                sx={{ borderRadius: "8px", textTransform: "none", color: Brand.primary, borderColor: Brand.primary, fontWeight: 600 }}
            >
                Cancel
            </Button>
            <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={creating}
                sx={{ bgcolor: Brand.primary, textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 4, "&:hover": { bgcolor: "#BF491F" } }}
            >
                {creating ? "Creating..." : "Create Task"}
            </Button>
        </>
    );

    return (
        <RightDrawer
            open={open}
            onClose={onClose}
            title="Create New Task"
            actions={actions}
        >
            <TextField
                label="Task Title"
                fullWidth
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Update Landing Page"
                variant="outlined"
                InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
            />

            <TextField
                select
                label="Project"
                fullWidth
                required
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
            >
                {projects.map((project) => (
                    <MenuItem key={project.id} value={String(project.id)}>
                        {project.name}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                select
                label="Status"
                fullWidth
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
            >
                <MenuItem value="TODO">To Do</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="IN_REVIEW">In Review</MenuItem>
                <MenuItem value="DONE">Completed</MenuItem>
            </TextField>

            <TextField
                select
                label="Priority"
                fullWidth
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
            >
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="LOW">Low</MenuItem>
            </TextField>

            <TextField
                label="Due Date"
                type="date"
                fullWidth
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
            />

            <TextField
                label="Description"
                multiline
                rows={4}
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add detailed description..."
                InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
            />
        </RightDrawer>
    );
};

const Tasks = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
    const [createTaskOpen, setCreateTaskOpen] = useState(false);
    const [editTaskOpen, setEditTaskOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<TaskData | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [menuTask, setMenuTask] = useState<TaskData | null>(null);
    const [tasks, setTasks] = useState<TaskData[]>(mockTasks);
    const [loading, setLoading] = useState(true);
    const { projects } = useProjectContext();

    // Fetch tasks from API
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const apiTasks = await getTasks();

                // Map API tasks to TaskData format
                const mappedTasks: TaskData[] = apiTasks.map((task: any) => {
                    // Find project name from projects context
                    const project = projects.find(p => p.id === task.projectId);

                    // Normalize status
                    let status: TaskData['status'] = "To Do";
                    if (task.status === "IN_PROGRESS") status = "In Progress";
                    else if (task.status === "IN_REVIEW") status = "In Review";
                    else if (task.status === "DONE") status = "Completed";
                    else if (task.status === "TODO") status = "To Do";

                    // Normalize priority
                    let priority: TaskData['priority'] = "Medium";
                    if (task.priority === "HIGH") priority = "High";
                    else if (task.priority === "LOW") priority = "Low";
                    else if (task.priority === "MEDIUM") priority = "Medium";

                    return {
                        id: task.id,
                        title: task.title,
                        project: project?.name || "Unknown Project",
                        projectId: task.projectId,
                        priority,
                        status,
                        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
                        assignee: {
                            name: task.assignee?.firstName
                                ? `${task.assignee.firstName} ${task.assignee.lastName || ''}`.trim()
                                : "Unassigned",
                            avatar: task.assignee?.firstName?.charAt(0) || "U"
                        },
                        progress: task.status === "DONE" ? 100 : task.status === "IN_PROGRESS" ? 50 : 0
                    };
                });

                setTasks(mappedTasks.length > 0 ? mappedTasks : mockTasks);
            } catch (error) {
                console.error("Failed to fetch tasks, using mock data:", error);
                setTasks(mockTasks);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [projects]);

    // Calculate stats from current tasks
    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === "Completed" || t.status === "DONE").length,
        pending: tasks.filter(t => t.status === "To Do" || t.status === "TODO" || t.status === "In Progress" || t.status === "IN_PROGRESS").length,
        overdue: tasks.filter(t => {
            const dueDate = new Date(t.dueDate);
            const today = new Date();
            return dueDate < today && (t.status !== "Completed" && t.status !== "DONE");
        }).length
    };

    const alerts = stats.overdue > 0 ? [
        { id: 1, message: `${stats.overdue} task${stats.overdue > 1 ? 's are' : ' is'} overdue and require${stats.overdue > 1 ? '' : 's'} attention`, type: "warning" }
    ] : [];

    const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>, task: TaskData) => {
        e.stopPropagation();
        setMenuAnchor(e.currentTarget);
        setMenuTask(task);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        if (!showDeleteConfirm) {
            setMenuTask(null);
        }
    };

    const handleEditTask = () => {
        if (menuTask) {
            setTaskToEdit(menuTask);
            setEditTaskOpen(true);
            handleMenuClose();
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const { enqueueSnackbar } = useSnackbar();

    const handleConfirmDelete = async () => {
        if (menuTask) {
            try {
                await deleteTask(String(menuTask.id));
                enqueueSnackbar('Task deleted successfully', { variant: 'success' });

                // Refresh tasks
                const apiTasks = await getTasks();
                const mappedTasks: TaskData[] = apiTasks.map((task: any) => {
                    const project = projects.find(p => p.id === task.projectId);
                    let status: TaskData['status'] = "To Do";
                    if (task.status === "IN_PROGRESS") status = "In Progress";
                    else if (task.status === "IN_REVIEW") status = "In Review";
                    else if (task.status === "DONE") status = "Completed";
                    else if (task.status === "TODO") status = "To Do";

                    let priority: TaskData['priority'] = "Medium";
                    if (task.priority === "HIGH") priority = "High";
                    else if (task.priority === "LOW") priority = "Low";
                    else if (task.priority === "MEDIUM") priority = "Medium";

                    return {
                        id: task.id,
                        title: task.title,
                        project: project?.name || "Unknown Project",
                        projectId: task.projectId,
                        priority,
                        status,
                        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
                        assignee: {
                            name: task.assignee?.firstName
                                ? `${task.assignee.firstName} ${task.assignee.lastName || ''}`.trim()
                                : "Unassigned",
                            avatar: task.assignee?.firstName?.charAt(0) || "U"
                        },
                        progress: task.status === "DONE" ? 100 : task.status === "IN_PROGRESS" ? 50 : 0
                    };
                });
                setTasks(mappedTasks.length > 0 ? mappedTasks : mockTasks);

                setShowDeleteConfirm(false);
                handleMenuClose();
            } catch (error) {
                console.error("Failed to delete task:", error);
                enqueueSnackbar('Failed to delete task', { variant: 'error' });
            }
        }
    };

    const filteredTasks = tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.project.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === "All" || t.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <Box sx={{ pb: 10, display: "flex", flexDirection: "column", minHeight: "100%" }}>
            <TopBar
                title="Tasks"
                searchPlaceholder="Search tasks by name, project, or assignee..."
                onSearch={setSearchQuery}
            />

            {/* Stats Overview */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
                <StatCard label="Total Tasks" value={stats.total} icon={<Assignment />} color={Brand.primary} />
                <StatCard label="Completed" value={stats.completed} icon={<CheckCircleOutline />} color={Status.completed.main} />
                <StatCard label="Pending" value={stats.pending} icon={<Schedule />} color={Status.inProgress.main} />
                <StatCard label="Overdue" value={stats.overdue} icon={<WarningAmber />} color={Status.atRisk.main} />
            </Box>

            {/* Alerts Section */}
            <Box sx={{ mb: 4 }}>
                {alerts.map(alert => (
                    <Box key={alert.id} sx={{
                        ...glassStyle,
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        borderLeft: `4px solid ${alert.type === "warning" ? "#EF5350" : "#6B7280"}`,
                        borderRadius: "0px 16px 16px 0px"
                    }}>
                        <WarningAmber color={alert.type === "warning" ? "error" : "info"} />
                        <Typography variant="body2" fontWeight="500" sx={{ color: alert.type === "warning" ? "#EE201C" : "#1A1A1A" }}>{alert.message}</Typography>
                    </Box>
                ))}
            </Box>

            {/* Filters & Actions */}
            <Box sx={{
                ...glassStyle,
                padding: "16px 24px",
                mb: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2
            }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    {["All", "To Do", "In Progress", "Completed"].map(status => (
                        <Chip
                            key={status}
                            label={status}
                            clickable
                            onClick={() => setFilterStatus(status)}
                            sx={{
                                bgcolor: filterStatus === status ? "#E65F2B" : "rgba(255,255,255,0.5)",
                                color: filterStatus === status ? "#fff" : "#666666",
                                fontWeight: 600,
                                "&:hover": {
                                    bgcolor: filterStatus === status ? "#E65F2B" : "rgba(255,255,255,0.8)",
                                }
                            }}
                        />
                    ))}
                </Box>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>

                    <Button onClick={() => setCreateTaskOpen(true)} variant="contained" startIcon={<Add />} sx={{ borderRadius: "20px", textTransform: "none", bgcolor: "#E65F2B", "&:hover": { bgcolor: "#BF491F" } }}>Create Task</Button>
                </Box>
            </Box>

            {/* Main Content Area */}
            <Box sx={{ ...glassStyle, padding: "24px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" fontWeight="700" color="#1A1A1A">
                        All Tasks <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#6B7280', marginLeft: '8px' }}>(For detailed view click on a task)</span>
                    </Typography>
                </Box>
                <Box>
                    {filteredTasks.length > 0 ? filteredTasks.map(task => (
                        <TaskRow
                            key={task.id}
                            task={task}
                            onClick={() => setSelectedTask(task)}
                            onMenuOpen={handleMenuOpen}
                        />
                    )) : (
                        <Typography sx={{ textAlign: "center", color: "#666666", py: 4 }}>No tasks found.</Typography>
                    )}
                </Box>
            </Box>

            {/* Task Details & Collaboration Drawer */}
            <TaskDetailsDrawer
                task={selectedTask}
                open={Boolean(selectedTask)}
                onClose={() => setSelectedTask(null)}
            />

            <CreateTaskDrawer
                open={createTaskOpen}
                onClose={() => setCreateTaskOpen(false)}
                onTaskCreated={() => {
                    // Refresh tasks by re-fetching
                    const refreshTasks = async () => {
                        try {
                            const apiTasks = await getTasks();
                            const mappedTasks: TaskData[] = apiTasks.map((task: any) => {
                                const project = projects.find(p => p.id === task.projectId);
                                let status: TaskData['status'] = "To Do";
                                if (task.status === "IN_PROGRESS") status = "In Progress";
                                else if (task.status === "IN_REVIEW") status = "In Review";
                                else if (task.status === "DONE") status = "Completed";
                                else if (task.status === "TODO") status = "To Do";

                                let priority: TaskData['priority'] = "Medium";
                                if (task.priority === "HIGH") priority = "High";
                                else if (task.priority === "LOW") priority = "Low";
                                else if (task.priority === "MEDIUM") priority = "Medium";

                                return {
                                    id: task.id,
                                    title: task.title,
                                    project: project?.name || "Unknown Project",
                                    projectId: task.projectId,
                                    priority,
                                    status,
                                    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
                                    assignee: {
                                        name: task.assignee?.firstName
                                            ? `${task.assignee.firstName} ${task.assignee.lastName || ''}`.trim()
                                            : "Unassigned",
                                        avatar: task.assignee?.firstName?.charAt(0) || "U"
                                    },
                                    progress: task.status === "DONE" ? 100 : task.status === "IN_PROGRESS" ? 50 : 0
                                };
                            });
                            setTasks(mappedTasks.length > 0 ? mappedTasks : mockTasks);
                        } catch (error) {
                            console.error("Failed to refresh tasks:", error);
                        }
                    };
                    refreshTasks();
                }}
            />

            {/* Task Actions Menu */}
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
                        <MenuItem onClick={handleEditTask} sx={{ gap: 1.5, fontSize: "14px", fontWeight: 500, color: "#1A1A1A", py: 1 }}>
                            <Edit fontSize="small" />
                            Edit Task
                        </MenuItem>
                        <MenuItem onClick={handleDeleteClick} sx={{ gap: 1.5, fontSize: "14px", fontWeight: 500, color: "#D32F2F", py: 1 }}>
                            <DeleteOutline fontSize="small" />
                            Delete
                        </MenuItem>
                    </>
                ) : (
                    <>
                        <Typography variant="caption" sx={{ px: 2, py: 1, color: "#666", display: "block", fontWeight: 600 }}>
                            Delete "{menuTask?.title}"?
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

            {/* Edit Task Drawer */}
            {/* Edit Task Drawer */}
            <RightDrawer
                open={editTaskOpen}
                onClose={() => {
                    setEditTaskOpen(false);
                    setTaskToEdit(null);
                }}
                title="Edit Task"
                actions={
                    <>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setEditTaskOpen(false);
                                setTaskToEdit(null);
                            }}
                            sx={{ borderRadius: "8px", textTransform: "none", color: Brand.primary, borderColor: Brand.primary, fontWeight: 600, "&:hover": { borderColor: Brand.primary, bgcolor: "rgba(230, 95, 43, 0.04)" } }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={async () => {
                                if (!taskToEdit) return;

                                try {
                                    const editForm = document.getElementById('edit-task-form') as HTMLFormElement;
                                    const formData = new FormData(editForm);

                                    const title = formData.get('title') as string;
                                    const projectId = formData.get('projectId') as string;
                                    const priority = formData.get('priority') as string;
                                    const status = formData.get('status') as string;
                                    const dueDate = formData.get('dueDate') as string;
                                    // Assignee update is distinct; for now we keep the existing one or allow selection if backend supports it
                                    // The backend `updateTaskSchema` likely supports `assigneeId`. 
                                    // For this fix, we'll focus on the fields present in the UI form.

                                    if (!title?.trim()) {
                                        enqueueSnackbar('Task title is required', { variant: 'error' });
                                        return;
                                    }

                                    // Call Update API
                                    await updateTask(String(taskToEdit.id), {
                                        title: title.trim(),
                                        projectId,
                                        priority,
                                        status,
                                        dueDate: dueDate || undefined,
                                    });

                                    enqueueSnackbar('Task updated successfully', { variant: 'success' });

                                    // Refresh tasks (Fetch and Map)
                                    const apiTasks = await getTasks();
                                    const mappedTasks: TaskData[] = apiTasks.map((task: any) => {
                                        const project = projects.find(p => p.id === task.projectId);

                                        // Normalize status
                                        let status: TaskData['status'] = "To Do";
                                        if (task.status === "IN_PROGRESS") status = "In Progress";
                                        else if (task.status === "IN_REVIEW") status = "In Review";
                                        else if (task.status === "DONE") status = "Completed";
                                        else if (task.status === "TODO") status = "To Do";

                                        // Normalize priority
                                        let priority: TaskData['priority'] = "Medium";
                                        if (task.priority === "HIGH") priority = "High";
                                        else if (task.priority === "LOW") priority = "Low";
                                        else if (task.priority === "MEDIUM") priority = "Medium";

                                        return {
                                            id: task.id,
                                            title: task.title,
                                            project: project?.name || "Unknown Project",
                                            projectId: task.projectId,
                                            priority,
                                            status,
                                            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
                                            assignee: {
                                                name: task.assignee?.firstName
                                                    ? `${task.assignee.firstName} ${task.assignee.lastName || ''}`.trim()
                                                    : "Unassigned",
                                                avatar: task.assignee?.firstName?.charAt(0) || "U"
                                            },
                                            progress: task.status === "DONE" ? 100 : task.status === "IN_PROGRESS" ? 50 : 0
                                        };
                                    });

                                    setTasks(mappedTasks.length > 0 ? mappedTasks : mockTasks);

                                    // Close Drawer
                                    setEditTaskOpen(false);
                                    setTaskToEdit(null);

                                } catch (error) {
                                    console.error("Failed to update task:", error);
                                    enqueueSnackbar('Failed to update task', { variant: 'error' });
                                }
                            }}
                            sx={{ bgcolor: Brand.primary, textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 4, "&:hover": { bgcolor: "#BF491F" } }}
                        >
                            Save Changes
                        </Button>
                    </>
                }
            >
                {taskToEdit && (
                    <Box id="edit-task-form" component="form" sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
                        <TextField
                            name="title"
                            label="Task Title"
                            fullWidth
                            required
                            defaultValue={taskToEdit.title}
                            InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
                        />

                        <TextField
                            select
                            name="projectId"
                            label="Project"
                            fullWidth
                            required
                            defaultValue={taskToEdit.projectId || (projects.find(p => p.name === taskToEdit.project)?.id) || ""}
                            InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
                        >
                            {projects.map((project) => (
                                <MenuItem key={project.id} value={String(project.id)}>
                                    {project.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            name="priority"
                            label="Priority"
                            fullWidth
                            defaultValue={
                                taskToEdit.priority === "High" ? "HIGH" :
                                    taskToEdit.priority === "Medium" ? "MEDIUM" :
                                        taskToEdit.priority === "Low" ? "LOW" : "MEDIUM"
                            }
                            InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
                        >
                            <MenuItem value="HIGH">High</MenuItem>
                            <MenuItem value="MEDIUM">Medium</MenuItem>
                            <MenuItem value="LOW">Low</MenuItem>
                        </TextField>

                        <TextField
                            select
                            name="status"
                            label="Status"
                            fullWidth
                            defaultValue={
                                taskToEdit.status === "To Do" ? "TODO" :
                                    taskToEdit.status === "In Progress" ? "IN_PROGRESS" :
                                        taskToEdit.status === "In Review" ? "IN_REVIEW" :
                                            taskToEdit.status === "Completed" ? "DONE" : "TODO"
                            }
                            InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
                        >
                            <MenuItem value="TODO">To Do</MenuItem>
                            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                            <MenuItem value="IN_REVIEW">In Review</MenuItem>
                            <MenuItem value="DONE">Completed</MenuItem>
                        </TextField>

                        <TextField
                            name="dueDate"
                            label="Due Date"
                            type="date"
                            fullWidth
                            defaultValue={taskToEdit.dueDate}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
                        />
                    </Box>
                )}
            </RightDrawer>
        </Box>
    );
};

export default Tasks;
