import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar, Chip, IconButton, Button, LinearProgress, TextField, MenuItem, Menu, CircularProgress, Tabs, Tab } from "@mui/material";
import {
  People,
  WarningAmber,
  AssignmentInd,
  MoreHoriz,
  CheckCircleOutline,
  ArrowDropUp,
  ArrowDropDown,
  Add,
  Edit,
  TaskAlt,
  Close,
  PersonAdd,
  DeleteOutline
} from "@mui/icons-material";
import TopBar from "../../components/layout/TopBar";
import { Brand, Text } from "../../theme/colors";
import { RightDrawer } from "../../components/common/RightDrawer";
import StatusBadge from "../../components/common/StatusBadge";
import { getStatusBadgeVariant } from "../../utils/badgeHelpers";
import { InviteUserDrawer } from "../../components/users/InviteUserDrawer";
import type { Resource, TeamStats, ResourceStatus } from "../../types/resource";
import { resourceService } from "../../services/resourceService";
import api from "../../services/api";

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

const ResourceRow = ({ resource, onMenuOpen }: { resource: Resource, onMenuOpen: (event: React.MouseEvent<HTMLButtonElement>, resource: Resource) => void }) => {
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
      {/* User Info */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "25%" }}>
        <Avatar sx={{ bgcolor: Brand.primary, width: 40, height: 40 }}>{resource.name.charAt(0)}</Avatar>
        <Box>
          <Typography variant="subtitle2" fontWeight="700" color="#1A1A1A">{resource.name}</Typography>
          <Typography variant="caption" color="#666666">{resource.role}</Typography>
        </Box>
      </Box>

      {/* Projects */}
      <Box sx={{ width: "20%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 0.5 }}>
          {resource.projectNames.length > 0 ? (
            <>
              <Chip label={resource.projectNames[0]} size="small" sx={{ fontSize: "10px", height: "20px", bgcolor: "#F3F4F6", fontWeight: 500 }} />
              {resource.projectNames.length > 1 && <Chip label={`+${resource.projectNames.length - 1}`} size="small" sx={{ fontSize: "10px", height: "20px", bgcolor: "#F3F4F6", fontWeight: 500 }} />}
            </>
          ) : <Typography variant="caption" color="#666666">-</Typography>}
        </Box>
      </Box>

      {/* Tasks */}
      <Box sx={{ width: "12%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <TaskAlt sx={{ fontSize: 14, color: '#666' }} />
          <Typography variant="body2" fontWeight="600" color="#1A1A1A">{resource.activeTasks}</Typography>
        </Box>
      </Box>

      {/* Allocation */}
      <Box sx={{ width: "22%", pr: 2, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="caption" fontWeight="700" color={resource.utilization > 100 ? "error" : "textPrimary"}>{resource.utilization}%</Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={Math.min(resource.utilization, 100)}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: "#E5E7EB",
            "& .MuiLinearProgress-bar": { bgcolor: resource.utilization > 100 ? "#D32F2F" : resource.utilization >= 75 ? "#EF5350" : resource.utilization < 50 ? "#4CAF50" : "#E65F2B" }
          }}
        />
      </Box>

      {/* Status */}
      <Box sx={{ width: "12%", display: "flex", alignItems: "center" }}>
        <StatusBadge
          label={resource.status.replace("_", " ")}
          variant={getStatusBadgeVariant(resource.status)}
        />
      </Box>

      {/* Action */}
      <IconButton size="small" onClick={(e) => onMenuOpen(e, resource)}><MoreHoriz /></IconButton>
    </Box>
  );
};

const WorkloadChart = ({ resources }: { resources: Resource[] }) => (
  <Box sx={{ ...glassStyle, padding: "24px", mt: 4 }}>
    <Typography variant="h6" fontWeight="700" mb={3} color="#1A1A1A">Workload Distribution</Typography>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {resources.map(res => (
        <Box key={res.userId} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" fontWeight="600" width="120px" noWrap title={res.name} sx={{ color: "#1A1A1A" }}>{res.name}</Typography>
          <Box sx={{ flex: 1, display: "flex", height: "32px", borderRadius: "6px", bgcolor: "#F3F4F6", overflow: "hidden", position: "relative" }}>
            <Box
              sx={{
                width: `${Math.min(res.utilization, 100)}%`,
                bgcolor: res.utilization > 100 ? "#EF5350" : res.utilization > 75 ? "#FFB74D" : "#66BB6A",
                height: "100%",
                display: "flex",
                alignItems: "center",
                px: 1
              }}
            >
              {res.utilization > 20 && <Typography variant="caption" fontWeight="700" color="white">{res.utilization}%</Typography>}
            </Box>
            {/* Overtime bar visual */}
            {res.utilization > 100 && (
              <Box sx={{ width: `${res.utilization - 100}%`, bgcolor: "#D32F2F", height: "100%" }} />
            )}
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

const AssignResourceDrawer = ({ open, onClose, resources, onSuccess, preSelectedResource }: {
  open: boolean,
  onClose: () => void,
  resources: Resource[],
  onSuccess: () => void,
  preSelectedResource?: Resource | null
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedResource, setSelectedResource] = useState("");
  const [targetResource, setTargetResource] = useState(""); // For reassigning
  const [selectedProject, setSelectedProject] = useState("");
  const [allocationPercentage, setAllocationPercentage] = useState(100);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Set pre-selected resource if provided
  useEffect(() => {
    if (preSelectedResource) {
      setSelectedResource(preSelectedResource.userId);
    } else {
      setSelectedResource("");
    }
  }, [preSelectedResource, open]);

  // Fetch projects when drawer opens
  useEffect(() => {
    if (open) {
      const fetchProjects = async () => {
        try {
          const response = await api.get('/projects');
          setProjects(response.data.data || []);
        } catch (error) {
          console.error("Failed to fetch projects", error);
        }
      };
      fetchProjects();
    }
  }, [open]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (!preSelectedResource) {
      setSelectedResource("");
    }
    setTargetResource("");
    setSelectedProject("");
    setAllocationPercentage(100);
  };

  const handleAssign = async () => {
    if (!selectedResource || !selectedProject) return;

    setLoading(true);
    try {
      if (activeTab === 0) {
        // Assign logic
        await resourceService.assignResource({
          resourceId: selectedResource,
          projectId: selectedProject,
          percentage: allocationPercentage
        });
      } else {
        // Reassign logic (mock for now as backend might need a specific endpoint, 
        // but we'll use assignResource which can act as update/reassign)
        await resourceService.assignResource({
          resourceId: targetResource,
          projectId: selectedProject,
          percentage: allocationPercentage
        });
      }
      onSuccess();
      onClose();
      if (!preSelectedResource) {
        setSelectedResource("");
      }
      setTargetResource("");
      setSelectedProject("");
      setAllocationPercentage(100);
    } catch (error) {
      console.error("Failed to assign resource:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RightDrawer
      open={open}
      onClose={onClose}
      title={activeTab === 0 ? "Assign Resource" : "Reassign Resource"}
      actions={
        <>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: "8px", textTransform: "none", color: Brand.primary, borderColor: Brand.primary, fontWeight: 600 }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAssign}
            disabled={loading || !selectedResource || !selectedProject || (activeTab === 1 && !targetResource)}
            sx={{ bgcolor: Brand.primary, borderRadius: "8px", textTransform: "none" }}
          >
            {loading ? "Processing..." : (activeTab === 0 ? "Assign" : "Reassign")}
          </Button>
        </>
      }
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="resource actions tabs" textColor="primary" indicatorColor="primary">
          <Tab label="Assign New" sx={{ textTransform: "none", fontWeight: 600 }} />
          <Tab label="Reassign Existing" sx={{ textTransform: "none", fontWeight: 600 }} />
        </Tabs>
      </Box>

      {activeTab === 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Assign a resource to a new project or task.
          </Typography>
          <TextField
            select
            fullWidth
            label="Resource"
            value={selectedResource}
            onChange={(e) => setSelectedResource(e.target.value)}
            sx={{ mt: 1 }}
            InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
          >
            {resources.map(r => <MenuItem key={r.userId} value={r.userId}>{r.name} ({r.utilization}% utilized)</MenuItem>)}
          </TextField>
          <TextField
            select
            fullWidth
            label="Project"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
          >
            {projects.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
          </TextField>
          <TextField
            label="Allocation %"
            type="number"
            value={allocationPercentage}
            onChange={(e) => setAllocationPercentage(Number(e.target.value))}
            InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" }, inputProps: { min: 1, max: 100 } }}
          />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Reassign tasks and projects from one resource to another.
          </Typography>
          <TextField
            select
            fullWidth
            label="From Resource"
            value={selectedResource}
            onChange={(e) => setSelectedResource(e.target.value)}
            InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
          >
            {resources.map(r => <MenuItem key={r.userId} value={r.userId}>{r.name} ({r.utilization}% utilized)</MenuItem>)}
          </TextField>

          <TextField
            select
            fullWidth
            label="Project to Reassign"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
            disabled={!selectedResource}
          >
            {projects.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
          </TextField>

          <TextField
            select
            fullWidth
            label="Reassign To (New Resource)"
            value={targetResource}
            onChange={(e) => setTargetResource(e.target.value)}
            InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
          >
            {resources.filter(r => r.userId !== selectedResource).map(r => (
              <MenuItem key={r.userId} value={r.userId}>{r.name} ({r.utilization}% utilized)</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Allocation %"
            type="number"
            value={allocationPercentage}
            onChange={(e) => setAllocationPercentage(Number(e.target.value))}
            InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" }, inputProps: { min: 1, max: 100 } }}
          />
        </Box>
      )}
    </RightDrawer>
  );
};

const Team = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [inviteUserOpen, setInviteUserOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load backend data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [data, teamStats] = await Promise.all([
        resourceService.getResources(),
        resourceService.getTeamStats()
      ]);
      setResources(data);
      setStats(teamStats);
    } catch (error) {
      console.error("Failed to load resources", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredResources = resources.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, resource: Resource) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedResource(resource);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    if (!showDeleteConfirm) {
      setSelectedResource(null);
    }
  };

  const handleEditAllocation = () => {
    setAssignDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedResource) {
      try {
        await resourceService.deleteResource(selectedResource.userId);
        setShowDeleteConfirm(false);
        handleMenuClose();
        fetchData();
      } catch (error) {
        console.error("Failed to delete resource:", error);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: Brand.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 6 }}>
      <TopBar
        title="Team & Resources"
        searchPlaceholder="Search by resource, role, or project..."
        onSearch={setSearchQuery}
      />

      {stats && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
          <StatCard label="Total Resources" value={stats.totalResources} icon={<People />} color={Brand.primary} trend="up" trendLabel="+2" />
          <StatCard label="Available" value={stats.available} icon={<CheckCircleOutline />} color="#4CAF50" />
          <StatCard label="Overallocated" value={stats.overallocated} icon={<WarningAmber />} color="#D32F2F" trend="down" trendLabel="-1" />
          <StatCard label="Avg. Utilization" value={`${stats.avgUtilization}%`} icon={<AssignmentInd />} color="#2B8CBE" />
        </Box>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Box sx={{ ...glassStyle, padding: "24px" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" fontWeight="700" color="#1A1A1A">Resource Allocation</Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setAssignDialogOpen(true)}
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  color: Brand.primary,
                  borderColor: Brand.primary,
                  "&:hover": { borderColor: "#BF491F", bgcolor: "rgba(230, 95, 43, 0.04)" }
                }}
              >
                Assign Resource
              </Button>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => setInviteUserOpen(true)}
                sx={{ borderRadius: "20px", textTransform: "none", bgcolor: Brand.primary, "&:hover": { bgcolor: "#BF491F" }, mr: 2 }}
              >
                Invite User
              </Button>
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, mb: 1, pr: 6 }}>
              <Typography sx={{ width: "25%", variant: "caption", color: "#666666", fontWeight: 600, fontSize: "12px", textTransform: "uppercase" }}>Resource</Typography>
              <Typography sx={{ width: "20%", textAlign: "center", variant: "caption", color: "#666666", fontWeight: 600, fontSize: "12px", textTransform: "uppercase" }}>Assigned Projects</Typography>
              <Typography sx={{ width: "12%", textAlign: "center", variant: "caption", color: "#666666", fontWeight: 600, fontSize: "12px", textTransform: "uppercase" }}>Active Tasks</Typography>
              <Typography sx={{ width: "22%", variant: "caption", color: "#666666", fontWeight: 600, fontSize: "12px", textTransform: "uppercase" }}>Utilization</Typography>
              <Typography sx={{ width: "12%", variant: "caption", color: "#666666", fontWeight: 600, fontSize: "12px", textTransform: "uppercase" }}>Status</Typography>
            </Box>

            {filteredResources.map(res => (
              <ResourceRow key={res.userId} resource={res} onMenuOpen={handleMenuOpen} />
            ))}
          </Box>
        </Box>
        <WorkloadChart resources={resources} />
      </Box>

      <AssignResourceDrawer
        open={assignDialogOpen}
        onClose={() => {
          setAssignDialogOpen(false);
          setSelectedResource(null);
        }}
        resources={resources}
        onSuccess={fetchData}
        preSelectedResource={selectedResource}
      />
      <InviteUserDrawer open={inviteUserOpen} onClose={() => setInviteUserOpen(false)} />

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
            <MenuItem onClick={handleEditAllocation} sx={{ gap: 1.5, fontSize: "14px", fontWeight: 500, color: "#1A1A1A", py: 1 }}>
              <Edit fontSize="small" />
              Edit Allocation
            </MenuItem>
            <MenuItem onClick={handleDeleteClick} sx={{ gap: 1.5, fontSize: "14px", fontWeight: 500, color: "#D32F2F", py: 1 }}>
              <DeleteOutline fontSize="small" />
              Remove
            </MenuItem>
          </>
        ) : (
          <>
            <Typography variant="caption" sx={{ px: 2, py: 1, color: "#666", display: "block", fontWeight: 600 }}>
              Remove {selectedResource?.name}?
            </Typography>
            <MenuItem onClick={handleConfirmDelete} sx={{ gap: 1.5, fontSize: "14px", fontWeight: 700, color: "#D32F2F", py: 1, bgcolor: "#FEF2F2" }}>
              <DeleteOutline fontSize="small" />
              Yes, Remove
            </MenuItem>
            <MenuItem onClick={() => setShowDeleteConfirm(false)} sx={{ gap: 1.5, fontSize: "14px", fontWeight: 500, color: "#666", py: 1 }}>
              <Close fontSize="small" />
              Cancel
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default Team;