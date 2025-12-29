import { Box, Typography, Avatar } from "@mui/material";
import { Visibility, AttachFile, ChatBubbleOutline } from "@mui/icons-material";

export interface TaskData {
    id: number;
    title: string;
    description: string;
    priority: "High" | "Medium" | "Low";
    status: "To Do" | "In Progress" | "In Review" | "Done";
    dueDate: string;
    assignee: string;
    tags: string[];
    comments: number;
    attachments: number;
    progress: number;
}

interface TaskCardProps {
    task: TaskData;
}

const TaskCard = ({ task }: TaskCardProps) => {
    // Status Pill Color Logic
    let statusBg = "#F5F5F5";
    let statusColor = "#666";

    if (task.status === "In Progress") {
        statusBg = "rgba(255, 235, 59, 0.2)"; // Soft yellow
        statusColor = "#FBC02D";
    } else if (task.dueDate === "Upcoming") { // "Upcoming" badge logic from image if we used that
        statusBg = "#FFEBE6"; // Soft Orange
        statusColor = "#E65F2B";
    }

    // Progress Bar Width
    const progressWidth = `${task.progress}%`;

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px",
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                }
            }}
        >
            {/* Left: Title & Subtitle */}
            <Box sx={{ width: "35%" }}>
                <Typography sx={{ fontWeight: 700, fontSize: "15px", color: "#1F2937", mb: 0.5 }}>
                    {task.title}
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "#9CA3AF" }}>
                    {task.description}
                </Typography>
            </Box>

            {/* Status Badge */}
            <Box sx={{ width: "15%", display: "flex", justifyContent: "flex-start" }}>
                <Box
                    sx={{
                        padding: "6px 14px",
                        borderRadius: "8px",
                        backgroundColor: statusBg,
                        color: statusColor,
                        fontSize: "12px",
                        fontWeight: 700
                    }}
                >
                    {task.dueDate === "Upcoming" ? "Upcoming" : task.status}
                </Box>
            </Box>

            {/* Progress Bar */}
            <Box sx={{ width: "20%", display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ flex: 1, height: "8px", borderRadius: "4px", backgroundColor: "#F3F4F6", overflow: "hidden" }}>
                    <Box sx={{ width: progressWidth, height: "100%", backgroundColor: task.progress > 0 ? "#70A1E6" : "transparent" }} />
                </Box>
                <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#9CA3AF", minWidth: "30px" }}>
                    {task.progress}%
                </Typography>
            </Box>

            {/* Right: Meta Icons & Avatars */}
            <Box sx={{ width: "25%", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
                <Box sx={{ display: "flex", gap: 2, color: "#9CA3AF" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Visibility sx={{ fontSize: 18 }} />
                        <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>0</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <ChatBubbleOutline sx={{ fontSize: 16 }} />
                        <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>{task.comments}</Typography>
                    </Box>
                    {task.attachments > 0 && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <AttachFile sx={{ fontSize: 16 }} />
                            <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>{task.attachments}</Typography>
                        </Box>
                    )}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                        sx={{ width: 32, height: 32, border: "2px solid #FFF" }}
                        src={task.assignee}
                    />
                    <Box
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            backgroundColor: "#FFEBE6",
                            border: "2px solid #FFF",
                            marginLeft: "-10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#E65F2B"
                        }}
                    >
                        +3
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default TaskCard;
