import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar, Chip, IconButton, Button, Menu, MenuItem, CircularProgress, TextField } from "@mui/material";
import {
    PersonAdd,
    MoreHoriz,
    Edit,
    TaskAlt,
    Close,
    DeleteOutline
} from "@mui/icons-material";
import TopBar from "../../components/layout/TopBar";
import { userService } from "../../services/userService";
import { Brand, Text } from "../../theme/colors";
import { InviteUserDrawer } from "../../components/users/InviteUserDrawer";
import { RoleDetailsDrawer } from "../../components/users/RoleDetailsDrawer";
import { RightDrawer } from "../../components/common/RightDrawer";
import StatusBadge from "../../components/common/StatusBadge";
import { getStatusBadgeVariant } from "../../utils/badgeHelpers";

interface SystemUser {
    id: string;
    userId?: string; // fallback
    firstName: string;
    lastName: string;
    name?: string; // fallback
    email: string;
    role: string;
    isActive: boolean;
    avatar?: string;
    lastLoginAt?: string;
    createdAt?: string;
    activeProjects?: number;
    activeTasks?: number;
    _count?: {
        projectMembers: number;
        assignedTasks: number;
    };
}


// --- Mock Data for Roles (can be moved to service later if needed) ---
const rolesData = [
    { id: "1", title: "Admin", count: 2, desc: "Full system access & settings" },
    { id: "2", title: "Project Manager", count: 5, desc: "Manage projects & resources" },
    { id: "3", title: "Team Member", count: 12, desc: "Execute tasks & log time" },
    { id: "4", title: "Viewer", count: 3, desc: "Read-only access" },
];


// --- Styles ---
const glassStyle = {
    background: "#F2EAE5",
    borderRadius: "16px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
};

// --- Components ---

const UserRow = ({ user, onMenuOpen, onEdit }: {
    user: SystemUser,
    onMenuOpen: (e: React.MouseEvent<HTMLButtonElement>, user: SystemUser) => void,
    onEdit: (user: SystemUser) => void
}) => {
    // Map ResourceStatus to UI friendly status
    const getStatusUI = (isActive: boolean) => {
        if (isActive) return { label: "Active", color: "#4CAF50", bg: "rgba(76, 175, 80, 0.1)" };
        return { label: "Inactive", color: "#757575", bg: "rgba(117, 117, 117, 0.1)" };
    };

    const uiStatus = getStatusUI(user.isActive ?? true);
    const fullName = user.firstName ? `${user.firstName} ${user.lastName}` : (user.name || "Unknown User");

    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            mb: 2,
            borderRadius: "12px",
            bgcolor: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.4)",
            transition: "all 0.2s ease",
            "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }
        }}>
            {/* Avatar & Name */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "30%" }}>
                <Avatar sx={{ bgcolor: "#E65F2B", width: 40, height: 40, fontSize: "16px", fontWeight: 600 }}>{fullName.charAt(0)}</Avatar>
                <Box>
                    <Typography variant="subtitle2" fontWeight="700" color="#1A1A1A">{fullName}</Typography>
                    <Typography variant="caption" color="#666666">{user.email}</Typography>
                </Box>
            </Box>

            {/* Role */}
            <Box sx={{ width: "20%", display: "flex", alignItems: "center" }}>
                <StatusBadge label={user.role} variant="grey" />
            </Box>

            {/* Projects */}
            <Box sx={{ width: "15%" }}>
                <Typography variant="caption" color="#666666" fontWeight={500}>{(user as any)._count?.projectMembers || user.activeProjects || 0} Projects</Typography>
            </Box>

            {/* Tasks */}
            <Box sx={{ width: "15%" }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TaskAlt sx={{ fontSize: 14, color: '#666' }} />
                    <Typography variant="caption" color="#666666" fontWeight={500}>{(user as any)._count?.assignedTasks || user.activeTasks || 0} Tasks</Typography>
                </Box>
            </Box>

            {/* Status */}
            <Box sx={{ width: "10%", display: "flex", alignItems: "center" }}>
                <StatusBadge label={uiStatus.label} variant={getStatusBadgeVariant(uiStatus.label)} />
            </Box>

            {/* Actions */}
            <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton size="small" sx={{ color: "#666666" }} onClick={() => onEdit(user)}><Edit fontSize="small" /></IconButton>
                <IconButton size="small" onClick={(e) => onMenuOpen(e, user)}><MoreHoriz fontSize="small" /></IconButton>
            </Box>
        </Box>
    );
};

const RoleCard = ({ role, onViewPermissions }: { role: { title: string, count: number, desc: string, id: string }, onViewPermissions: (role: any) => void }) => (
    <Box sx={{
        background: "#FFFFFF",
        borderRadius: "16px",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
        padding: "20px",
        minWidth: "220px"
    }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight="700" color="#1A1A1A">{role.title}</Typography>
            <Chip label={`${role.count} Users`} size="small" sx={{ bgcolor: "rgba(0,0,0,0.05)", fontWeight: 600 }} />
        </Box>
        <Typography variant="body2" color="#666666" sx={{ mb: 1, minHeight: "40px" }}>{role.desc}</Typography>
        <Button
            variant="outlined"
            fullWidth
            onClick={() => onViewPermissions(role)}
            sx={{
                borderRadius: "20px",
                textTransform: "none",
                color: "#E65F2B",
                borderColor: "rgba(230, 95, 43, 0.5)",
                "&:hover": { borderColor: "#E65F2B", bgcolor: "rgba(230, 95, 43, 0.04)" },
                "&:focus": { borderColor: "#E65F2B" }
            }}
        >
            Manage Permissions
        </Button>
    </Box>
);

// --- Main Page ---

const Users = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [users, setUsers] = useState<SystemUser[]>([]);
    const [loading, setLoading] = useState(true);

    const [inviteUserOpen, setInviteUserOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [roleDrawerOpen, setRoleDrawerOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
    const [editUserOpen, setEditUserOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Edit fields state
    const [editFirstName, setEditFirstName] = useState("");
    const [editLastName, setEditLastName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editRole, setEditRole] = useState("");
    const [editActive, setEditActive] = useState(true);
    const [saving, setSaving] = useState(false);

    const handleViewPermissions = (role: any) => {
        setSelectedRole(role);
        setRoleDrawerOpen(true);
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getUsers();
            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((u: SystemUser) => {
        const fullName = u.firstName ? `${u.firstName} ${u.lastName}` : (u.name || "");
        const matchesSearch = fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.email || "").toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = filterStatus === "All" ||
            (filterStatus === "Active" && u.isActive) ||
            (filterStatus === "Inactive" && !u.isActive);
        return matchesSearch && matchesFilter;
    });

    const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>, user: SystemUser) => {
        e.stopPropagation();
        setMenuAnchor(e.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        if (!showDeleteConfirm) {
            setSelectedUser(null);
        }
    };



    const handleEditUser = (user: SystemUser) => {
        setSelectedUser(user);
        setEditFirstName(user.firstName || "");
        setEditLastName(user.lastName || "");
        setEditEmail(user.email || "");
        setEditRole(user.role || "");
        setEditActive(user.isActive ?? true);
        setEditUserOpen(true);
    };

    const handleSaveUser = async () => {
        if (!selectedUser) return;
        setSaving(true);
        try {
            await userService.updateUser(selectedUser.id || (selectedUser as any).userId, {
                firstName: editFirstName,
                lastName: editLastName,
                email: editEmail,
                role: editRole,
                isActive: editActive
            });
            fetchUsers();
            setEditUserOpen(false);
        } catch (err) {
            console.error("Failed to update user:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedUser) {
            try {
                await userService.deleteUser(selectedUser.id || (selectedUser as any).userId);
                fetchUsers();
                setShowDeleteConfirm(false);
                handleMenuClose();
            } catch (err) {
                console.error("Failed to deactivate user:", err);
            }
        }
    };



    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress sx={{ color: Brand.primary }} />
            </Box>
        )
    }

    return (
        <Box sx={{ pb: 6 }}>
            <TopBar
                title="Users"
                searchPlaceholder="Search users by name, email, role..."
                onSearch={setSearchQuery}
            />

            {/* Roles & Permissions */}
            {/* Roles & Permissions */}
            <Box sx={{ ...glassStyle, padding: "24px", mb: 4 }}>
                <Typography variant="h6" fontWeight="700" color="#1A1A1A" mb={3}>Roles & Permissions</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 3 }}>
                    {rolesData.map(role => (
                        <RoleCard key={role.id} role={role} onViewPermissions={handleViewPermissions} />
                    ))}
                </Box>
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
                <Box sx={{ display: "flex", gap: 1 }}>
                    {["All", "Active", "Inactive"].map(status => (
                        <Chip
                            key={status}
                            label={status}
                            clickable
                            onClick={() => setFilterStatus(status)}
                            sx={{
                                bgcolor: filterStatus === status ? "#E65F2B" : "rgba(255,255,255,0.5)",
                                color: filterStatus === status ? "#fff" : "#666",
                                fontWeight: 600,
                                "&:hover": {
                                    bgcolor: filterStatus === status ? "#E65F2B" : "rgba(255,255,255,0.8)",
                                }
                            }}
                        />
                    ))}
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<PersonAdd />}
                        onClick={() => setInviteUserOpen(true)}
                        sx={{
                            borderRadius: "20px",
                            textTransform: "none",
                            color: "#E65F2B",
                            borderColor: "#E65F2B",
                            "&:hover": { borderColor: "#BF491F", bgcolor: "rgba(230, 95, 43, 0.04)" },
                            "&:focus": { borderColor: "#BF491F" }
                        }}
                    >
                        Invite User
                    </Button>
                </Box>
            </Box>

            {/* All Users */}
            <Box sx={{ ...glassStyle, padding: "24px" }}>
                <Typography variant="h6" fontWeight="700" color="#1A1A1A" mb={3}>All Users</Typography>
                <Box>
                    {filteredUsers.length > 0 ? filteredUsers.map(user => (
                        <UserRow
                            key={user.id || user.userId}
                            user={user}
                            onMenuOpen={handleMenuOpen}
                            onEdit={handleEditUser}
                        />
                    )) : (
                        <Typography sx={{ textAlign: "center", color: "#666666", py: 4 }}>No users found.</Typography>
                    )}
                </Box>
            </Box>

            {/* Action Menu */}
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

                        <MenuItem onClick={() => { handleEditUser(selectedUser!); handleMenuClose(); }} sx={{ gap: 1.5, fontSize: "14px", fontWeight: 500, color: "#1A1A1A", py: 1 }}>
                            <Edit fontSize="small" />
                            Edit User
                        </MenuItem>
                        <MenuItem onClick={handleDeleteClick} sx={{ gap: 1.5, fontSize: "14px", fontWeight: 500, color: "#D32F2F", py: 1 }}>
                            <DeleteOutline fontSize="small" />
                            Deactivate
                        </MenuItem>
                    </>
                ) : (
                    <>
                        <Typography variant="caption" sx={{ px: 2, py: 1, color: "#666", display: "block", fontWeight: 600 }}>
                            Deactivate {selectedUser?.firstName ? `${selectedUser.firstName} ${selectedUser.lastName}` : (selectedUser as any)?.name || "User"}?
                        </Typography>
                        <MenuItem onClick={handleConfirmDelete} sx={{ gap: 1.5, fontSize: "14px", fontWeight: 700, color: "#D32F2F", py: 1, bgcolor: "#FEF2F2" }}>
                            <DeleteOutline fontSize="small" />
                            Yes, Deactivate
                        </MenuItem>
                        <MenuItem onClick={() => setShowDeleteConfirm(false)} sx={{ gap: 1.5, fontSize: "14px", fontWeight: 500, color: "#666", py: 1 }}>
                            <Close fontSize="small" />
                            Cancel
                        </MenuItem>
                    </>
                )}
            </Menu>

            <InviteUserDrawer
                open={inviteUserOpen}
                onClose={() => setInviteUserOpen(false)}
                onInviteSuccess={fetchUsers}
            />

            <RoleDetailsDrawer
                open={roleDrawerOpen}
                onClose={() => setRoleDrawerOpen(false)}
                role={selectedRole}
            />



            {/* Edit User Drawer */}
            <RightDrawer
                open={editUserOpen}
                onClose={() => setEditUserOpen(false)}
                title="Edit User"
                actions={
                    <>
                        <Button variant="outlined" onClick={() => setEditUserOpen(false)} sx={{ borderRadius: "8px", textTransform: "none", color: Brand.primary, borderColor: Brand.primary, fontWeight: 600, "&:hover": { borderColor: Brand.primary, bgcolor: "rgba(230, 95, 43, 0.04)" } }}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleSaveUser}
                            disabled={saving}
                            sx={{ bgcolor: Brand.primary, borderRadius: "8px", textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "#BF491F" } }}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </>
                }
            >
                {selectedUser && (
                    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, pb: 3, borderBottom: "1px solid #eee" }}>
                            <Avatar sx={{ bgcolor: Brand.primary, width: 64, height: 64, fontSize: "24px" }}>
                                {(selectedUser.firstName || (selectedUser as any).name || "U").charAt(0)}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight={700} color={Text.primary}>
                                    {selectedUser.firstName ? `${selectedUser.firstName} ${selectedUser.lastName}` : (selectedUser as any).name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">{selectedUser.email}</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    value={editFirstName}
                                    onChange={(e) => setEditFirstName(e.target.value)}
                                    InputProps={{ sx: { borderRadius: "10px" } }}
                                />
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={editLastName}
                                    onChange={(e) => setEditLastName(e.target.value)}
                                    InputProps={{ sx: { borderRadius: "10px" } }}
                                />
                            </Box>

                            <TextField
                                fullWidth
                                label="Email Address"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                InputProps={{ sx: { borderRadius: "10px" } }}
                            />

                            <TextField
                                select
                                fullWidth
                                label="Role"
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value)}
                                InputProps={{ sx: { borderRadius: "10px" } }}
                            >
                                <MenuItem value="ADMIN">Admin</MenuItem>
                                <MenuItem value="MANAGER">Manager</MenuItem>
                                <MenuItem value="MEMBER">Member</MenuItem>
                            </TextField>

                            <Box>
                                <Typography variant="subtitle2" fontWeight={600} color={Text.primary} mb={1}>Status</Typography>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Chip
                                        label="Active"
                                        clickable
                                        onClick={() => setEditActive(true)}
                                        sx={{
                                            bgcolor: editActive ? Brand.primary : "#F3F4F6",
                                            color: editActive ? "#fff" : "#666",
                                            fontWeight: 600
                                        }}
                                    />
                                    <Chip
                                        label="Inactive"
                                        clickable
                                        onClick={() => setEditActive(false)}
                                        sx={{
                                            bgcolor: !editActive ? "#D32F2F" : "#F3F4F6",
                                            color: !editActive ? "#fff" : "#666",
                                            fontWeight: 600
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                )}
            </RightDrawer>
        </Box>
    );
};

export default Users;
