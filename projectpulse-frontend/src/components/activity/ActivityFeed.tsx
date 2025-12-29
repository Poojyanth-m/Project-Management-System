import { useState, useEffect } from "react";
import { Box, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { AddCircleOutline, EditOutlined, AssignmentInd, CommentOutlined } from "@mui/icons-material";
import { collaborationService } from "../../services/collaborationService";
import type { Activity, EntityType } from "../../types/collaboration";
import { Brand } from "../../theme/colors";

const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    if (diff < 60000) return "Just now";
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
};

const ActivityIcon = ({ action }: { action: Activity['action'] }) => {
    switch (action) {
        case "CREATED": return <AddCircleOutline fontSize="small" sx={{ color: "#4CAF50" }} />;
        case "UPDATED_STATUS": return <EditOutlined fontSize="small" sx={{ color: "#FF9800" }} />;
        case "ASSIGNED": return <AssignmentInd fontSize="small" sx={{ color: "#2196F3" }} />;
        case "COMMENTED": return <CommentOutlined fontSize="small" sx={{ color: Brand.primary }} />;
        default: return <EditOutlined fontSize="small" />;
    }
}

const ActivityText = ({ activity }: { activity: Activity }) => {
    const name = <Box component="span" fontWeight={600}>{activity.user.name}</Box>;

    let text;
    switch (activity.action) {
        case "CREATED": text = "created this task"; break;
        case "UPDATED_STATUS": text = activity.details || "updated the status"; break;
        case "ASSIGNED": text = "updated the assignee"; break;
        case "COMMENTED": text = "left a comment"; break;
        default: text = "performed an action";
    }

    return (
        <Typography variant="body2" fontSize="13px" color="#333">
            {name} {text}
        </Typography>
    );
};

interface ActivityFeedProps {
    entityType: EntityType;
    entityId: string;
}

const ActivityFeed = ({ entityType, entityId }: ActivityFeedProps) => {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        const load = async () => {
            const data = await collaborationService.getActivities(entityType, entityId);
            setActivities(data);
        };
        load();

        // In a real app, we'd poll or use sockets. 
        // For demo, we just load once or we could set an interval.
    }, [entityId]);

    return (
        <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
            {activities.length === 0 ? <Typography variant="caption" color="text.secondary" textAlign="center" display="block" py={2}>No activity yet.</Typography> :
                <List dense sx={{ p: 0 }}>
                    {activities.map(act => (
                        <ListItem key={act.id} alignItems="flex-start" sx={{ px: 1, py: 1.5, borderBottom: "1px solid rgba(0,0,0,0.03)" }}>
                            <ListItemAvatar sx={{ minWidth: 40, mt: 0.5 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: "#f5f5f5" }}>
                                    <ActivityIcon action={act.action} />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={<ActivityText activity={act} />}
                                secondary={
                                    <Typography variant="caption" color="text.secondary">
                                        {timeAgo(act.createdAt)}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            }
        </Box>
    );
};

export default ActivityFeed;
