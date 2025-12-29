import { useState } from "react";
import { Box, Typography, Button, IconButton, Chip, Menu, MenuItem, Tabs, Tab, TextField } from "@mui/material";
import { Add, MoreHoriz, FilterList, KeyboardArrowDown, AttachFile, DeleteOutline, Edit, Close } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/layout/TopBar";
import { useProjectContext, type Project } from "../../context/ProjectContext";
import { Status, Brand, Backgrounds, getProgressColor, Text } from "../../theme/colors";
import { RightDrawer } from "../../components/common/RightDrawer";
import { EmptyState } from "../../components/common/EmptyState";
import FileManager from "../../components/files/FileManager";

const glassStyle = {
  background: Backgrounds.card,
  borderRadius: "14px",
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
};

import StatusBadge from "../../components/common/StatusBadge";
import { getStatusBadgeVariant } from "../../utils/badgeHelpers";

const StatusChip = ({ status }: { status: string }) => {
  return <StatusBadge label={status} variant={getStatusBadgeVariant(status)} />;
};

const ProjectDetailsDrawer = ({ project, open, onClose }: { project: Project | null, open: boolean, onClose: () => void }) => {
  const [tabIndex, setTabIndex] = useState(0);

  if (!project) return null;

  const headerContent = (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
          {project.category}
        </Typography>
      </Box>
      <Typography variant="h4" fontWeight={700} sx={{ color: Text.primary, mb: 2 }}>
        {project.name}
      </Typography>
      <StatusChip status={project.status} />
    </Box>
  );

  return (
    <RightDrawer
      open={open}
      onClose={onClose}
      header={headerContent}
      contentSx={{ p: 0, gap: 0 }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "white", px: 4 }}>
        <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} sx={{ "& .MuiTabs-indicator": { bgcolor: Brand.primary } }}>
          <Tab label="Overview" sx={{ textTransform: "none", fontWeight: 600, "&.Mui-selected": { color: Brand.primary } }} />
          <Tab label="Files" icon={<AttachFile fontSize="small" />} iconPosition="start" sx={{ textTransform: "none", fontWeight: 600, "&.Mui-selected": { color: Brand.primary } }} />
        </Tabs>
      </Box>

      <Box sx={{ p: 4, flex: 1, overflowY: "auto" }}>
        {tabIndex === 0 && (
          <Box>
            <Typography variant="subtitle2" fontWeight={700} mb={1}>About Project</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Project details and description would go here.
            </Typography>

            <Box sx={{ p: 2, bgcolor: "rgba(0,0,0,0.02)", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)", mt: 2 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={1}>PROGRESS</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flex: 1, height: "8px", bgcolor: "#eee", borderRadius: "4px", overflow: "hidden" }}>
                  <Box sx={{ width: `${project.progress}%`, height: "100%", bgcolor: getProgressColor(project.progress) }} />
                </Box>
                <Typography variant="body2" fontWeight={700}>{project.progress}%</Typography>
              </Box>
            </Box>
          </Box>
        )}
        {tabIndex === 1 && (
          <FileManager entityType="PROJECT" entityId={project.id.toString()} />
        )}
      </Box>
    </RightDrawer>
  );
};

const Projects = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { projects, deleteProject, updateProject } = useProjectContext();
  const [activeFilter, setActiveFilter] = useState<Project["status"] | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuProject, setMenuProject] = useState<Project | null>(null);

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, project: Project) => {
    event.stopPropagation();
    setActionMenuAnchor(event.currentTarget);
    setMenuProject(project);
  };

  // Menu State
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const filterOpen = Boolean(filterAnchorEl);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleFilterClose = (option?: Project["status"] | "All") => {
    if (option) setActiveFilter(option);
    setFilterAnchorEl(null);
  };

  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState<Project["status"]>("Active");

  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (menuProject) {
      setEditName(menuProject.name);
      setEditStatus(menuProject.status);
      setEditDrawerOpen(true);
      handleActionMenuClose();
    }
  };

  const handleEditSubmit = () => {
    if (menuProject && editName.trim()) {
      updateProject(menuProject.id, { name: editName, status: editStatus });
      enqueueSnackbar("Project updated successfully", { variant: "success" });
      setEditDrawerOpen(false);
    }
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (menuProject) {
      deleteProject(menuProject.id);
      enqueueSnackbar(`Project "${menuProject.name}" deleted successfully`, { variant: "success" });
      handleActionMenuClose();
    }
  };

  const handleActionMenuClose = (event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    setActionMenuAnchor(null);
    setMenuProject(null);
    setShowDeleteConfirm(false);
  };

  // 1. Filter
  let displayProjects = projects.filter(p => {
    const matchesStatus = activeFilter === "All" || p.status === activeFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <TopBar
        title="Projects"
        searchPlaceholder="Search projects by name..."
        onSearch={setSearchQuery}
      />

      {/* Actions Row */}
      <Box sx={{
        ...glassStyle,
        padding: "20px 24px",
        mb: 4,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1A1A1A" }}>All Projects</Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Filter Dropdown */}
          <Button
            startIcon={<FilterList />}
            endIcon={<KeyboardArrowDown />}
            onClick={handleFilterClick}
            sx={{
              padding: "8px 16px",
              color: "#1A1A1A",
              textTransform: "none",
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.5)",
              "&:hover": { backgroundColor: "#FFFBEB", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.06)" },
            }}
          >
            {activeFilter === "All" ? "Filter: All" : `Filter: ${activeFilter}`}
          </Button>
          <Menu
            anchorEl={filterAnchorEl}
            open={filterOpen}
            onClose={() => handleFilterClose()}
          >
            <MenuItem onClick={() => handleFilterClose("All")}>All</MenuItem>
            <MenuItem onClick={() => handleFilterClose("Active")}>Active</MenuItem>
            <MenuItem onClick={() => handleFilterClose("Completed")}>Completed</MenuItem>
            <MenuItem onClick={() => handleFilterClose("On Hold")}>On Hold</MenuItem>
          </Menu>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/projects/create")}
            sx={{
              backgroundColor: "#E65F2B",
              color: "#fff",
              borderRadius: "24px",
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(230, 95, 43, 0.4)",
              "&:hover": { backgroundColor: "#BF491F" },
            }}
          >
            New Project
          </Button>
        </Box>
      </Box>

      {/* Projects Grid or Empty State */}
      {projects.length === 0 ? (
        <EmptyState message="No projects found. Please create a project first." height="50vh" />
      ) : displayProjects.length === 0 ? (
        <EmptyState message="No projects match your search filters." height="50vh" />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
            pb: 4 // padding bottom for scrolling
          }}
        >
          {displayProjects.map((project) => (
            <Box
              key={project.id}
              sx={{
                ...glassStyle,
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                transition: "transform 0.2s, background-color 0.2s",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                  backgroundColor: "#FFFBEB",
                  boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.06)",
                },
              }}
              onClick={() => setSelectedProject(project)}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Chip
                    label={project.category}
                    size="small"
                    sx={{ backgroundColor: "rgba(0,0,0,0.05)", mb: 1, fontSize: '10px', height: '24px', fontWeight: 600 }}
                  />
                  <Typography variant="h6" fontWeight="700" sx={{ lineHeight: 1.2, color: "#1A1A1A" }}>
                    {project.name}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={(e) => handleActionMenuOpen(e, project)}>
                  <MoreHoriz />
                </IconButton>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <StatusChip status={project.status} />
                <Typography variant="caption" sx={{ color: "#666666", fontWeight: 500 }}>
                  Due: {project.dueDate}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" fontWeight="600" color="text.secondary">Progress</Typography>
                  <Typography variant="caption" fontWeight="700" sx={{ color: "#1A1A1A" }}>{project.progress}%</Typography>
                </Box>
                <Box sx={{ width: "100%", height: "8px", backgroundColor: "rgba(0,0,0,0.05)", borderRadius: "4px", overflow: 'hidden' }}>
                  <Box
                    sx={{
                      width: `${project.progress}%`,
                      height: "100%",
                      backgroundColor: getProgressColor(project.progress),
                      borderRadius: "4px"
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ pt: 2, borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ display: 'flex', marginLeft: '8px' }}>
                  {[...Array(Math.min(project.members, 3))].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: [Brand.primary, Status.completed.main, Status.inProgress.main][i],
                        border: '2px solid rgba(255,255,255,0.8)',
                        marginLeft: '-10px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                  ))}
                  {project.members > 3 && (
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: Status.blocked.main,
                        border: '2px solid rgba(255,255,255,0.8)',
                        marginLeft: '-10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#1A1A1A'
                      }}
                    >
                      +{project.members - 3}
                    </Box>
                  )}
                </Box>
                <Typography variant="caption" sx={{ color: "#666666", fontWeight: 500 }}>
                  {project.members} Members
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <ProjectDetailsDrawer
        project={selectedProject}
        open={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />

      {/* Card Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={() => handleActionMenuClose()}
        onClick={(e) => e.stopPropagation()} // Prevent any stray clicks from bubbling
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
              Edit Project
            </MenuItem>
            <MenuItem onClick={handleDeleteClick} sx={{ gap: 1.5, fontSize: "14px", fontWeight: 500, color: "#D32F2F", py: 1 }}>
              <DeleteOutline fontSize="small" />
              Delete
            </MenuItem>
          </>
        ) : (
          <>
            <Typography variant="caption" sx={{ px: 2, py: 1, color: "#666", display: "block", fontWeight: 600 }}>
              Are you sure?
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

      {/* Edit Drawer */}
      <RightDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        title="Edit Project"
        actions={
          <>
            <Button variant="outlined" onClick={() => setEditDrawerOpen(false)} sx={{ borderRadius: "8px", textTransform: "none", color: Brand.primary, borderColor: Brand.primary, fontWeight: 600, "&:hover": { borderColor: Brand.primary, bgcolor: "rgba(230, 95, 43, 0.04)" } }}>Cancel</Button>
            <Button onClick={handleEditSubmit} variant="contained" sx={{ bgcolor: Brand.primary, borderRadius: "8px", textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "#BF491F" } }}>Save Changes</Button>
          </>
        }
      >
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Project Name"
            fullWidth
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            variant="outlined"
            InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
          />
          <TextField
            select
            label="Status"
            fullWidth
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value as Project["status"])}
            variant="outlined"
            InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="On Hold">On Hold</MenuItem>
          </TextField>
        </Box>
      </RightDrawer>

    </>
  );
};

export default Projects;