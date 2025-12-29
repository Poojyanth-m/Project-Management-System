import { useState, useEffect } from "react";
import { Box, Typography, Button, Switch, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { RightDrawer } from "../common/RightDrawer";
import { Brand } from "../../theme/colors";
import { CheckCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

interface Role {
    id: string;
    title: string;
    count: number;
    desc: string;
}

interface RoleDetailsDrawerProps {
    open: boolean;
    onClose: () => void;
    role: Role | null;
}

// Mock permissions data derived from typical role based access control (RBAC)
const ALL_PERMISSIONS = [
    { id: "p1", name: "Manage Users", desc: "Invite, edit, and deactivate users" },
    { id: "p2", name: "Configure Settings", desc: "Access to global system settings" },
    { id: "p3", name: "Manage Projects", desc: "Create, edit, and delete projects" },
    { id: "p4", name: "Manage Resources", desc: "Assign and reassign resources" },
    { id: "p5", name: "View Reports", desc: "Access analytics and budget reports" },
    { id: "p6", name: "Edit Tasks", desc: "Create and modify tasks" },
    { id: "p7", name: "Log Time", desc: "Record working hours" },
];

// Mapping roles to their active permissions
const ROLE_PERMISSIONS: Record<string, string[]> = {
    "Admin": ["p1", "p2", "p3", "p4", "p5", "p6", "p7"],
    "Project Manager": ["p3", "p4", "p5", "p6", "p7"],
    "Team Member": ["p6", "p7"],
    "Viewer": ["p5"], // Read-only mostly, maybe view reports
};


export const RoleDetailsDrawer = ({ open, onClose, role }: RoleDetailsDrawerProps) => {
    const [currentPermissions, setCurrentPermissions] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (role && open) {
            setCurrentPermissions(ROLE_PERMISSIONS[role.title] || []);
        }
    }, [role, open]);

    if (!role) return null;

    const handleToggle = (permId: string) => {
        setCurrentPermissions(prev =>
            prev.includes(permId)
                ? prev.filter(id => id !== permId)
                : [...prev, permId]
        );
    };

    const handleSave = () => {
        setSaving(true);
        // Simulate API call
        setTimeout(() => {
            ROLE_PERMISSIONS[role.title] = [...currentPermissions];
            setSaving(false);
            onClose();
        }, 500);
    };

    return (
        <RightDrawer
            open={open}
            onClose={onClose}
            title={`${role.title} Permissions`}
            actions={
                <>
                    <Button onClick={onClose} variant="outlined" sx={{ borderRadius: "8px", textTransform: "none", color: Brand.primary, borderColor: Brand.primary, fontWeight: 600 }}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={saving}
                        sx={{ bgcolor: Brand.primary, borderRadius: "8px", textTransform: "none", fontWeight: 700 }}
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </>
            }
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Role Description</Typography>
                    <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>{role.desc}</Typography>
                </Box>

                <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Permissions Config</Typography>
                    <Box sx={{ border: "1px solid #E5E7EB", borderRadius: "12px", bgcolor: "#fff", overflow: "hidden" }}>
                        <List disablePadding>
                            {ALL_PERMISSIONS.map((perm, index) => {
                                const isEnabled = currentPermissions.includes(perm.id);
                                return (
                                    <ListItem
                                        key={perm.id}
                                        divider={index !== ALL_PERMISSIONS.length - 1}
                                        secondaryAction={
                                            <Switch
                                                edge="end"
                                                checked={isEnabled}
                                                onChange={() => handleToggle(perm.id)}
                                                color="primary"
                                            />
                                        }
                                        sx={{
                                            py: 2,
                                            transition: "background-color 0.2s",
                                            "&:hover": { bgcolor: "rgba(230, 95, 43, 0.02)" }
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            {isEnabled ? <CheckCircleOutline sx={{ color: "#10B981" }} /> : <RemoveCircleOutline sx={{ color: "#9CA3AF" }} />}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={<Typography variant="body2" fontWeight={600} color={isEnabled ? "#1A1A1A" : "#6B7280"}>{perm.name}</Typography>}
                                            secondary={<Typography variant="caption" color="text.secondary">{perm.desc}</Typography>}
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                </Box>
            </Box>
        </RightDrawer>
    );
};
