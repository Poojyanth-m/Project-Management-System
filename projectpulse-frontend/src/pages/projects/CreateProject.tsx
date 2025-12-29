import { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Avatar,
    Chip,
    styled,
    InputAdornment,
    Radio,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemButton
} from '@mui/material';
import {
    CalendarToday,
    AccessTime,
    ShortText,
    CheckCircle,
    PersonAdd,
    FlagOutlined,
    Add
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useProjectContext } from '../../context/ProjectContext';

// --- Styled Components ---

// Shared Glass Style (matching other pages)
const glassStyle = {
    background: "rgba(255,255,255,0.34)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "14px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
};

const SectionCard = styled(Box)(({ theme }) => ({
    ...glassStyle,
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
}));

const TemplateCard = styled(Box)<{ selected?: boolean }>(({ theme, selected }) => ({
    borderRadius: '12px',
    padding: theme.spacing(2),
    cursor: 'pointer',
    backgroundColor: selected ? 'rgba(230, 95, 43, 0.05)' : 'rgba(255, 255, 255, 0.4)',
    border: `2px solid ${selected ? '#E65F2B' : 'transparent'}`,
    transition: 'all 0.2s ease',
    position: 'relative',
    '&:hover': {
        border: `2px solid ${selected ? '#E65F2B' : '#E5E7EB'}`,
        transform: 'translateY(-2px)',
    }
}));

// --- Mock Data ---

const templates = [
    { id: 'scratch', title: 'Start from Scratch', desc: 'Empty project with no predefined tasks.', count: 0, duration: 'Flexible' },
    { id: 'agile', title: 'Agile Development', desc: 'Sprints, backlog, and bug tracking setup.', count: 42, duration: 'Recurring' },
    { id: 'website', title: 'Website Redesign', desc: 'Wireframing, design, and dev phases.', count: 50, duration: '8 Weeks' },
    { id: 'marketing', title: 'Marketing Campaign', desc: 'Content calendar and social media plan.', count: 28, duration: '6 Weeks' },
];

const teamMembers = [
    { id: 0, name: 'Poojyanth', avatar: 'P', color: '#1F2937', role: 'Full Stack Developer' },
    { id: 1, name: 'Rakshitha', avatar: 'R', color: '#E65F2B', role: 'Backend Developer' },
    { id: 2, name: 'Prakriti', avatar: 'P', color: '#6B7280', role: 'Scrum Master' },
    { id: 3, name: 'Sanjana', avatar: 'S', color: '#2E7D32', role: 'Product Owner' },
    { id: 4, name: 'Venkata', avatar: 'V', color: '#F57C00', role: 'Frontend Developer' },
];

const categories = ['Software Development', 'Marketing', 'Academic', 'Internal', 'Custom', 'Event Planning'];

const CreateProject = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    // Form State
    const [selectedTemplate, setSelectedTemplate] = useState('scratch');
    const [projectName, setProjectName] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [selectedTeam, setSelectedTeam] = useState<number[]>([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dateError, setDateError] = useState('');

    // Project Manager State
    const [projectManager, setProjectManager] = useState({
        name: 'Poojyanth',
        avatar: 'P',
        role: 'Full Stack Developer'
    });
    const [managerDialogOpen, setManagerDialogOpen] = useState(false);

    // Context
    const { addProject } = useProjectContext();

    // Date validation handlers
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

    // Handlers
    const handleCreate = async () => {
        // Validation
        if (!projectName.trim() || !startDate || !endDate) {
            enqueueSnackbar('Enter all mandatory fields first', { variant: 'error' });
            return;
        }

        if (dateError) {
            enqueueSnackbar('Please fix date errors before creating project', { variant: 'error' });
            return;
        }

        try {
            await addProject({
                name: projectName,
                description: projectDesc,
                status: "PLANNED", // Corrected enum value
                startDate: startDate,
                endDate: endDate,
                category: category,
                memberIds: selectedTeam,
            });
            enqueueSnackbar('Project created successfully!', { variant: 'success' });
            navigate('/projects');
        } catch (error) {
            console.error("Failed to create project", error);
            enqueueSnackbar('Failed to create project', { variant: 'error' });
        }
    };

    const toggleMember = (id: number) => {
        if (selectedTeam.includes(id)) {
            setSelectedTeam(selectedTeam.filter(mid => mid !== id));
        } else {
            setSelectedTeam([...selectedTeam, id]);
        }
    };

    const handleSelectManager = (member: typeof teamMembers[0]) => {
        setProjectManager({
            name: member.name,
            avatar: member.avatar,
            role: member.role
        });
        setManagerDialogOpen(false);
    };

    return (
        <Box sx={{ pb: 10, display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
            {/* 1. Page Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h4" fontWeight="400" color="#1F2937" sx={{ letterSpacing: '-0.5px', fontFamily: "'Aeonik Pro TRIAL'" }}>
                        Create New Project
                    </Typography>
                    <Typography variant="body1" color="#6B7280" sx={{ mt: 1, fontFamily: "'Aeonik Pro TRIAL'" }}>
                        Set up your project details and start collaborating instantly
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreate}
                        sx={{
                            bgcolor: '#E65F2B',
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: '8px',
                            px: 3,
                            '&:hover': { bgcolor: '#BF491F' },
                            boxShadow: '0 4px 12px rgba(230, 95, 43, 0.3)'
                        }}
                    >
                        Create Project
                    </Button>
                </Box>
            </Box>

            {/* 2. Project Setup Card */}
            <SectionCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'rgba(230, 95, 43, 0.1)', color: '#E65F2B', mr: 2 }}>
                        <ShortText />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="700" color="#1F2937" sx={{ fontFamily: "'Aeonik Pro TRIAL'" }}>Project Details</Typography>
                        <Typography variant="caption" color="#6B7280">Basic information about your initiative</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
                    <Box sx={{ gridColumn: 'span 12' }}>
                        <TextField
                            fullWidth
                            label={
                                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    Project Name <Typography component="span" sx={{ color: '#9CA3AF' }}>*</Typography>
                                </Box>
                            }
                            placeholder="e.g. Q4 Marketing Blitz"
                            variant="outlined"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            InputProps={{ sx: { bgcolor: 'rgba(255,255,255,0.4)' } }}
                        />
                    </Box>
                    <Box sx={{ gridColumn: 'span 12' }}>
                        <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={3}
                            placeholder="Briefly describe the goals and scope..."
                            variant="outlined"
                            value={projectDesc}
                            onChange={(e) => setProjectDesc(e.target.value)}
                            InputProps={{ sx: { bgcolor: 'rgba(255,255,255,0.4)' } }}
                        />
                    </Box>
                    <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={category}
                                label="Category"
                                onChange={(e) => setCategory(e.target.value)}
                                sx={{ bgcolor: 'rgba(255,255,255,0.4)' }}
                            >
                                {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </SectionCard>

            {/* 3. Ownership & Timeline */}
            <SectionCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'rgba(5, 150, 105, 0.1)', color: '#059669', mr: 2 }}>
                        <CalendarToday />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="700" color="#1F2937" sx={{ fontFamily: "'Aeonik Pro TRIAL'" }}>Ownership & Timeline</Typography>
                        <Typography variant="caption" color="#6B7280">Assign responsibilities and deadlines</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
                    <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                        <Typography variant="subtitle2" fontWeight="600" mb={1} color="#1F2937">
                            Project Manager <span style={{ color: '#9CA3AF' }}>*</span>
                        </Typography>
                        <Box sx={{
                            p: 1.5,
                            border: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            bgcolor: 'rgba(255,255,255,0.4)',
                            minHeight: '56px'
                        }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#333' }}>{projectManager.avatar}</Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight="700" color="#1F2937">{projectManager.name}</Typography>
                                <Typography variant="caption" color="#666">
                                    {projectManager.role}
                                </Typography>
                            </Box>
                            <Button
                                size="small"
                                sx={{ textTransform: 'none' }}
                                onClick={() => setManagerDialogOpen(true)}
                            >
                                Change
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                        <Typography variant="subtitle2" fontWeight="600" mb={1} color="#1F2937">Priority</Typography>
                        <FormControl fullWidth size="small">
                            <Select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                startAdornment={<InputAdornment position="start"><FlagOutlined fontSize="small" /></InputAdornment>}
                                sx={{ bgcolor: 'rgba(255,255,255,0.4)', height: '56px' }}
                            >
                                <MenuItem value="Low">Low Priority</MenuItem>
                                <MenuItem value="Medium">Medium Priority</MenuItem>
                                <MenuItem value="High">High Priority</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                        <TextField
                            fullWidth
                            type="date"
                            label={
                                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    Start Date <Typography component="span" sx={{ color: '#9CA3AF' }}>*</Typography>
                                </Box>
                            }
                            value={startDate}
                            onChange={(e) => handleStartDateChange(e.target.value)}
                            error={!!dateError && dateError.includes("Start date")}
                            helperText={dateError.includes("Start date") ? dateError : ""}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                                max: endDate || undefined,
                            }}
                            InputProps={{ sx: { bgcolor: 'rgba(255,255,255,0.4)', height: '56px' } }}
                        />
                    </Box>
                    <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                        <TextField
                            fullWidth
                            type="date"
                            label={
                                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    End Date <Typography component="span" sx={{ color: '#9CA3AF' }}>*</Typography>
                                </Box>
                            }
                            value={endDate}
                            onChange={(e) => handleEndDateChange(e.target.value)}
                            error={!!dateError && dateError.includes("End date")}
                            helperText={dateError.includes("End date") ? dateError : ""}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                                min: startDate || undefined,
                            }}
                            InputProps={{ sx: { bgcolor: 'rgba(255,255,255,0.4)', height: '56px' } }}
                        />
                    </Box>

                    <Box sx={{ gridColumn: 'span 12' }}>
                        <Typography variant="subtitle2" fontWeight="600" mb={1.5} color="#1F2937">Team Members</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {teamMembers.filter(m => m.name !== 'Poojyanth').map(member => (
                                <Chip
                                    key={member.id}
                                    avatar={<Avatar sx={{ bgcolor: member.color, color: '#fff' }}>{member.avatar}</Avatar>}
                                    label={`${member.name} (${member.role})`}
                                    onClick={() => toggleMember(member.id)}
                                    variant={selectedTeam.includes(member.id) ? 'filled' : 'outlined'}
                                    sx={{
                                        borderRadius: '20px',
                                        fontWeight: 500,
                                        bgcolor: selectedTeam.includes(member.id) ? 'rgba(230, 95, 43, 0.1)' : 'rgba(255,255,255,0.4)',
                                        color: selectedTeam.includes(member.id) ? '#E65F2B' : '#666',
                                        border: selectedTeam.includes(member.id) ? '1px solid #E65F2B' : '1px solid rgba(0,0,0,0.1)',
                                        '&:hover': {
                                            bgcolor: selectedTeam.includes(member.id) ? 'rgba(230, 95, 43, 0.15)' : 'rgba(255,255,255,0.6)',
                                        }
                                    }}
                                    icon={selectedTeam.includes(member.id) ? <CheckCircle fontSize="small" /> : <PersonAdd fontSize="small" />}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </SectionCard>

            {/* 4. Template Selection */}
            <SectionCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'rgba(107, 114, 128, 0.1)', color: '#6B7280', mr: 2 }}>
                        <AccessTime />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="700" color="#1F2937" sx={{ fontFamily: "'Aeonik Pro TRIAL'" }}>Project Templates</Typography>
                        <Typography variant="caption" color="#6B7280" sx={{ fontFamily: "'Aeonik Pro TRIAL'" }}>Start faster with professionally crafted project structures</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
                    {templates.map((template) => (
                        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }} key={template.id}>
                            <TemplateCard
                                selected={selectedTemplate === template.id}
                                onClick={() => setSelectedTemplate(template.id)}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="700" color="#1F2937">{template.title}</Typography>
                                    <Radio
                                        checked={selectedTemplate === template.id}
                                        size="small"
                                        sx={{ color: '#E65F2B', p: 0, '&.Mui-checked': { color: '#E65F2B' } }}
                                    />
                                </Box>
                                <Typography variant="body2" color="#6B7280" sx={{ mb: 2, height: '40px', overflow: 'hidden' }}>
                                    {template.desc}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Chip label={`${template.count} Tasks`} size="small" sx={{ height: 20, fontSize: '10px', bgcolor: 'rgba(255,255,255,0.5)' }} />
                                    <Chip label={template.duration} size="small" sx={{ height: 20, fontSize: '10px', bgcolor: 'rgba(255,255,255,0.5)' }} />
                                </Box>
                            </TemplateCard>
                        </Box>
                    ))}
                </Box>
            </SectionCard>

            {/* Manager Selection Dialog */}
            <Dialog
                open={managerDialogOpen}
                onClose={() => setManagerDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        minWidth: '450px',
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: '#111827', fontSize: '20px', pb: 1 }}>
                    Select Project Manager
                </DialogTitle>
                <DialogContent sx={{ pb: 1 }}>
                    <Typography variant="body2" color="#6B7280" sx={{ mb: 2 }}>
                        Choose who will lead this project. They will have full administrative access.
                    </Typography>
                    <List disablePadding>
                        {teamMembers.map((member) => (
                            <ListItem key={member.id} disablePadding sx={{ mb: 1 }}>
                                <ListItemButton
                                    onClick={() => handleSelectManager(member)}
                                    selected={projectManager.name === member.name}
                                    sx={{
                                        borderRadius: '12px',
                                        border: '1px solid',
                                        borderColor: projectManager.name === member.name ? '#E65F2B' : 'transparent',
                                        bgcolor: projectManager.name === member.name ? 'rgba(230, 95, 43, 0.04) !important' : 'rgba(243, 244, 246, 0.5)',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            bgcolor: 'rgba(230, 95, 43, 0.08)',
                                            transform: 'translateY(-1px)'
                                        }
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: member.color, color: '#fff' }}>
                                            {member.avatar}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={member.name}
                                        secondary={member.role}
                                        primaryTypographyProps={{
                                            fontWeight: projectManager.name === member.name ? 700 : 600,
                                            color: '#1F2937'
                                        }}
                                        secondaryTypographyProps={{
                                            color: '#6B7280',
                                            fontSize: '13px'
                                        }}
                                    />
                                    {projectManager.name === member.name && (
                                        <CheckCircle sx={{ color: '#E65F2B', fontSize: 20 }} />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setManagerDialogOpen(false)}
                        sx={{
                            textTransform: 'none',
                            color: '#6B7280',
                            fontWeight: 600,
                            borderRadius: '8px',
                            '&:hover': { bgcolor: '#F3F4F6' }
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CreateProject;
