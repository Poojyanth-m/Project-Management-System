import { useState } from "react";
import { Box, Typography, Button, IconButton, Chip, Avatar, Tabs, Tab, TextField, MenuItem } from "@mui/material";
import {
    Close,
    Add
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { Brand, Text, Backgrounds } from "../../theme/colors";
import { RightDrawer } from "../../components/common/RightDrawer";

// --- Types ---
interface Template {
    id: string;
    title: string;
    description: string;
    category: string;
    tasksCount: number;
    milestonesCount: number;
    duration: string;
    roles: string[];
    creator: {
        name: string;
        role: string;
        avatarColor: string;
    };
    usageCount: number;
    isFeatured?: boolean;
}

// --- Mock Data ---
const categories = ["All Templates", "Software Development", "Marketing", "Academic Projects", "Event Planning", "Custom"];

const initialTemplates: Template[] = [
    {
        id: "1",
        title: "Agile Software Development Suite",
        description: "A complete ecosystem for modern dev teams. Includes sprint planning, backlog refinement, QA cycles, and release checklists. Perfect for serious product teams.",
        category: "Software Development",
        tasksCount: 42,
        milestonesCount: 8,
        duration: "Recurring",
        roles: ["PO", "Dev", "QA", "Scrum Master"],
        creator: { name: "Sarah Jenkins", role: "Agile Coach", avatarColor: "#E65F2B" },
        usageCount: 1250,
        isFeatured: true
    },
    {
        id: "2",
        title: "Product Launch GTM",
        description: "Go-to-market strategy covering content, PR, and social.",
        category: "Marketing",
        tasksCount: 35,
        milestonesCount: 6,
        duration: "30 Days",
        roles: ["Marketing", "Design", "Sales"],
        creator: { name: "Mike Ross", role: "Marketing Lead", avatarColor: "#6B7280" },
        usageCount: 850
    },
    {
        id: "3",
        title: "Academic Thesis Framework",
        description: "Structured guide for research, analysis, and writing phases.",
        category: "Academic Projects",
        tasksCount: 15,
        milestonesCount: 3,
        duration: "3 Months",
        roles: ["Student", "Advisor"],
        creator: { name: "Dr. Emily W.", role: "Professor", avatarColor: "#2E7D32" },
        usageCount: 420
    },
    {
        id: "4",
        title: "Corporate Retreat Plan",
        description: "Logistics, venues, and activities for team offsites.",
        category: "Event Planning",
        tasksCount: 40,
        milestonesCount: 5,
        duration: "2 Months",
        roles: ["HR", "Admin"],
        creator: { name: "Jessica Pearson", role: "HR Director", avatarColor: "#9C27B0" },
        usageCount: 120
    },
    {
        id: "5",
        title: "Full Website Redesign",
        description: "From wireframes to production deployment.",
        category: "Software Development",
        tasksCount: 50,
        milestonesCount: 8,
        duration: "8 Weeks",
        roles: ["Designer", "Dev", "Client"],
        creator: { name: "David Kim", role: "Product Designer", avatarColor: "#F57C00" },
        usageCount: 2200
    },
    {
        id: "6",
        title: "Q4 Marketing Blitz",
        description: "End-of-year high intensity campaign structure.",
        category: "Marketing",
        tasksCount: 28,
        milestonesCount: 4,
        duration: "6 Weeks",
        roles: ["Marketing", "Sales"],
        creator: { name: "Rachel Zane", role: "CMO", avatarColor: "#D32F2F" },
        usageCount: 180
    },
    {
        id: "7",
        title: "My Custom Workflow",
        description: "A tailored process for internal audits and compliance checks.",
        category: "Custom",
        tasksCount: 12,
        milestonesCount: 2,
        duration: "1 Week",
        roles: ["Auditor", "Manager"],
        creator: { name: "You", role: "Project Manager", avatarColor: "#333" },
        usageCount: 5
    }
];

// --- Styles ---
const glassStyle = {
    background: Backgrounds.card,
    borderRadius: "24px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
};

const hoverEffect = {
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 24px rgba(0,0,0,0.06)",
        background: Backgrounds.cardAlt
    }
};

// --- Components ---

const FeaturedTemplateCard = ({ template, onPreview, onUse }: { template: Template, onPreview: (t: Template) => void, onUse: (t: Template) => void }) => (
    <Box sx={{
        ...glassStyle,
        p: 0,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        overflow: "hidden",
        mb: 4,
        background: "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,251,235,0.6) 100%)",
        border: "1px solid rgba(230, 95, 43, 0.2)",
        ...hoverEffect
    }} onClick={() => onPreview(template)}>
        <Box sx={{ p: 4, flex: 2, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Typography variant="caption" sx={{ bgcolor: "rgba(230, 95, 43, 0.1)", color: Brand.primary, fontWeight: 700, px: 1, py: 0.5, borderRadius: "8px" }}>
                    FEATURED TEMPLATE
                </Typography>
                <Typography variant="caption" sx={{ fontFamily: "'Aeonik Pro TRIAL', sans-serif", color: Text.muted, fontWeight: 600 }}>Used by {template.usageCount}+ teams</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 3, mb: 2, alignItems: "flex-start" }}>
                <Avatar sx={{ width: 80, height: 80, fontSize: "32px", bgcolor: template.creator.avatarColor, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}>
                    {template.creator.name.charAt(0)}
                </Avatar>
                <Box sx={{ pt: 1 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                            fontWeight: 400,
                            color: Text.primary,
                            letterSpacing: "-0.5px",
                            lineHeight: 1.1,
                            mb: 1
                        }}
                    >
                        {template.title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                                color: Text.secondary,
                                fontWeight: 600
                            }}
                        >
                            Created by {template.creator.name}
                        </Typography>
                        <Typography variant="caption" color={Text.muted}>•</Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                                color: Text.muted,
                                fontWeight: 500
                            }}
                        >
                            {template.creator.role}
                        </Typography>
                    </Box>
                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                            color: Text.secondary,
                            mt: 2,
                            maxWidth: "600px",
                            lineHeight: 1.6
                        }}
                    >
                        {template.description}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 4, mt: 2, alignItems: "center" }}>
                <Box>
                    <Typography variant="h6" sx={{ fontFamily: "'Aeonik Pro TRIAL', sans-serif", fontWeight: "500", color: Text.primary }}>{template.tasksCount}</Typography>
                    <Typography variant="caption" sx={{ fontFamily: "'Aeonik Pro TRIAL', sans-serif", color: Text.muted }}>Tasks</Typography>
                </Box>
                <Typography color={Text.muted} variant="h5" fontWeight={300}>/</Typography>
                <Box>
                    <Typography variant="h6" sx={{ fontFamily: "'Aeonik Pro TRIAL', sans-serif", fontWeight: "500", color: Text.primary }}>{template.milestonesCount}</Typography>
                    <Typography variant="caption" sx={{ fontFamily: "'Aeonik Pro TRIAL', sans-serif", color: Text.muted }}>Milestones</Typography>
                </Box>
                <Typography color={Text.muted} variant="h5" fontWeight={300}>/</Typography>
                <Box>
                    <Typography variant="h6" sx={{ fontFamily: "'Aeonik Pro TRIAL', sans-serif", fontWeight: "500", color: Text.primary }}>{template.duration}</Typography>
                    <Typography variant="caption" sx={{ fontFamily: "'Aeonik Pro TRIAL', sans-serif", color: Text.muted }}>Duration</Typography>
                </Box>
            </Box>
        </Box>
        <Box sx={{ flex: 1, bgcolor: "rgba(230, 95, 43, 0.03)", p: 4, display: "flex", flexDirection: "column", justifyContent: "center", gap: 2, borderLeft: "1px solid rgba(0,0,0,0.03)" }}>
            <Typography
                variant="subtitle2"
                sx={{
                    fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                    fontWeight: 700,
                    color: Text.primary
                }}
            >
                Included Roles
            </Typography>
            <Box sx={{ display: "flex", ml: 1, mb: 2 }}>
                {template.roles.map((r, i) => (
                    <Avatar key={i} sx={{ width: 32, height: 32, fontSize: "12px", bgcolor: ["#1F2937", "#E65F2B", "#4B5563"][i % 3], border: "2px solid #fff", marginLeft: "-8px" }}>
                        {r.charAt(0)}
                    </Avatar>
                ))}
            </Box>
            <Button variant="contained" size="large" sx={{ bgcolor: Brand.primary, textTransform: "none", borderRadius: "12px", boxShadow: "0 4px 12px rgba(230, 95, 43, 0.3)", "&:hover": { bgcolor: "#BF491F" } }} onClick={(e) => { e.stopPropagation(); onUse(template); }}>
                Use Template
            </Button>
            <Button variant="text" sx={{ color: Text.secondary, textTransform: "none", fontWeight: 600 }}>
                View Full Preview
            </Button>
        </Box>
    </Box>
);

const StandardTemplateCard = ({ template, onPreview, onUse }: { template: Template, onPreview: (t: Template) => void, onUse: (t: Template) => void }) => (
    <Box sx={{ ...glassStyle, p: 3, display: "flex", flexDirection: "column", height: "100%", minHeight: "260px", justifyContent: "space-between", ...hoverEffect }} onClick={() => onPreview(template)}>
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "flex-start" }}>
                <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Avatar sx={{ width: 44, height: 44, borderRadius: "50%", bgcolor: template.creator.avatarColor }}>
                        {template.creator.name.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                                fontWeight: 700,
                                color: Text.primary
                            }}
                        >
                            {template.creator.name}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                                color: Text.secondary,
                                fontWeight: 500
                            }}
                        >
                            {template.creator.role}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Typography
                variant="h6"
                sx={{
                    fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                    fontWeight: 400,
                    color: Text.primary,
                    fontSize: "1.1rem",
                    mb: 0.5
                }}
            >
                {template.title}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                    color: Text.secondary,
                    mb: 3,
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                }}
            >
                {template.description}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3, pb: 3, borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                <Typography variant="caption" sx={{ fontFamily: "'Aeonik Pro TRIAL', sans-serif", fontWeight: 500, color: Text.muted }}>{template.tasksCount} Tasks</Typography>
                <Typography variant="caption" sx={{ color: Text.muted }}>•</Typography>
                <Typography variant="caption" sx={{ fontFamily: "'Aeonik Pro TRIAL', sans-serif", fontWeight: 500, color: Text.muted }}>{template.milestonesCount} Milestones</Typography>
                <Typography variant="caption" sx={{ color: Text.muted }}>•</Typography>
                <Typography variant="caption" sx={{ fontFamily: "'Aeonik Pro TRIAL', sans-serif", fontWeight: 500, color: Text.muted }}>{template.duration}</Typography>
            </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="caption" sx={{ fontFamily: "'Aeonik Pro TRIAL', sans-serif", fontWeight: "600", color: Brand.primary, cursor: "pointer" }}>Preview Details</Typography>
            <Button variant="outlined" size="small" sx={{ borderRadius: "20px", textTransform: "none", color: Text.primary, borderColor: "#ddd", bgcolor: "#fff", "&:hover": { borderColor: "#bbb" } }} onClick={(e) => { e.stopPropagation(); onUse(template); }}>
                Use
            </Button>
        </Box>
    </Box>
);

// --- Drawers & Modals ---

const TemplatePreviewDrawer = ({ template, open, onClose, onUse, onDuplicate }: { template: Template | null, open: boolean, onClose: () => void, onUse: (t: Template) => void, onDuplicate: (t: Template) => void }) => {
    if (!template) return null;

    return (
        <RightDrawer
            open={open}
            onClose={onClose}
            contentSx={{ p: 0 }}
            actions={
                <>
                    <Button fullWidth variant="outlined" onClick={() => onDuplicate(template)} sx={{ borderRadius: "8px", borderColor: Brand.primary, color: Brand.primary, fontWeight: 600 }}>Duplicate</Button>
                    <Button fullWidth variant="contained" sx={{ bgcolor: Brand.primary, "&:hover": { bgcolor: "#BF491F" } }} onClick={() => onUse(template)}>Use Template</Button>
                </>
            }
        >
            <Box sx={{ position: "relative" }}>
                {/* Close is handled by RightDrawer usually, but here we custom render headerless. 
                     Actually RightDrawer adds Close if header/title exists. 
                     Here we have NO header/title prop, so we must render close button or rely on internal logic? 
                     User can click overlay to close. 
                     But the design has absolute close button. 
                     I'll replicate it inside children. */}
                <IconButton onClick={onClose} sx={{ position: "absolute", right: 16, top: 16, bgcolor: "rgba(0,0,0,0.05)", zIndex: 10, color: "#666", "&:hover": { bgcolor: "rgba(0,0,0,0.1)" } }}>
                    <Close />
                </IconButton>
                <Box sx={{ height: "200px", bgcolor: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
                    <Avatar sx={{ width: 88, height: 88, fontSize: "32px", bgcolor: template.creator.avatarColor }}>
                        {template.creator.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ textAlign: "center" }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                                fontWeight: 700,
                                color: Text.primary
                            }}
                        >
                            {template.creator.name}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                                color: Text.secondary
                            }}
                        >
                            {template.creator.role}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ p: 4, bgcolor: "#fff", borderBottom: "1px solid #eee" }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                        fontWeight: 700,
                        color: Text.primary,
                        mb: 1
                    }}
                >
                    {template.title}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                        color: Text.secondary,
                        mb: 3,
                        lineHeight: 1.6
                    }}
                >
                    {template.description}
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip label={template.category} size="small" sx={{ bgcolor: "#F3F4F6", fontWeight: 600, color: "#555" }} />
                    <Chip label={`${template.usageCount} Uses`} size="small" sx={{ bgcolor: "rgba(230, 95, 43, 0.1)", color: "#E65F2B", fontWeight: 600 }} />
                </Box>
            </Box>

            <Box sx={{ p: 4 }}>
                <Typography variant="subtitle2" fontWeight="700" color="#999" sx={{ textTransform: "uppercase", letterSpacing: "1px", mb: 3 }}>At a Glance</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, mb: 4 }}>
                    <Box sx={{ p: 2, bgcolor: "#F9FAFB", borderRadius: "12px", border: "1px solid #eee", textAlign: "center" }}>
                        <Typography variant="h6" fontWeight="800" color={Text.primary}>{template.tasksCount}</Typography>
                        <Typography variant="caption" color={Text.secondary}>Tasks</Typography>
                    </Box>
                    <Box sx={{ p: 2, bgcolor: "#F9FAFB", borderRadius: "12px", border: "1px solid #eee", textAlign: "center" }}>
                        <Typography variant="h6" fontWeight="800" color={Text.primary}>{template.milestonesCount}</Typography>
                        <Typography variant="caption" color={Text.secondary}>Milestones</Typography>
                    </Box>
                    <Box sx={{ p: 2, bgcolor: "#F9FAFB", borderRadius: "12px", border: "1px solid #eee", textAlign: "center" }}>
                        <Typography variant="h6" fontWeight="800" color={Text.primary}>{template.duration}</Typography>
                        <Typography variant="caption" color={Text.secondary}>Duration</Typography>
                    </Box>
                </Box>

                <Typography
                    variant="subtitle2"
                    sx={{
                        fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                        fontWeight: 700,
                        color: "#999",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        mb: 3
                    }}
                >
                    Workflow Preview
                </Typography>
                <Box sx={{ borderLeft: "2px solid #E5E7EB", pl: 3, ml: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                    {[1, 2, 3].map((i) => (
                        <Box key={i} sx={{ position: "relative" }}>
                            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#fff", border: "3px solid #E65F2B", position: "absolute", left: "-31px", top: "5px" }} />
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                                    fontWeight: 700,
                                    color: Text.primary
                                }}
                            >
                                Phase {i}: {i === 1 ? "Planning" : i === 2 ? "Execution" : "Review"}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                                    color: Text.secondary,
                                    fontSize: "13px"
                                }}
                            >
                                Contains {i * 4} tasks and {i} approval gate.
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </RightDrawer>
    );
};

const CreateTemplateDrawer = ({ open, onClose, onSubmit }: { open: boolean, onClose: () => void, onSubmit: () => void }) => {
    return (
        <RightDrawer
            open={open}
            onClose={onClose}
            header={
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#FFFBEB", color: "#E65F2B", width: 48, height: 48 }}>
                        <Box component="span" sx={{ fontSize: "24px", fontWeight: "bold" }}>+</Box>
                    </Avatar>
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{
                                fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                                fontWeight: 700,
                                color: Text.primary
                            }}
                        >
                            Create Template
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                                color: Text.secondary
                            }}
                        >
                            Define a new standard workflow
                        </Typography>
                    </Box>
                </Box>
            }
            actions={
                <>
                    <Button variant="outlined" onClick={onClose} sx={{ borderRadius: "8px", textTransform: "none", color: Brand.primary, borderColor: Brand.primary, fontWeight: 600 }}>Cancel</Button>
                    <Button variant="contained" sx={{ bgcolor: Brand.primary, textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 4, "&:hover": { bgcolor: "#BF491F" } }} onClick={onSubmit}>
                        Create Template
                    </Button>
                </>
            }
        >
            <Box>
                <Typography variant="subtitle2" fontWeight="700" color="#374151" mb={1}>Template Details</Typography>
                <TextField
                    label="Template Name"
                    fullWidth
                    variant="outlined"
                    placeholder="e.g., Marketing Campaign v2"
                    InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    placeholder="Describe the purpose and goals..."
                    InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
                />
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <Box>
                    <Typography variant="subtitle2" fontWeight="700" color="#374151" mb={1}>Category</Typography>
                    <TextField select fullWidth defaultValue="Software Development" InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}>
                        {categories.filter(c => c !== "All Templates").map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                <Box>
                    <Typography variant="subtitle2" fontWeight="700" color="#374151" mb={1}>Duration</Typography>
                    <TextField fullWidth variant="outlined" placeholder="e.g. 2 Weeks" InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }} />
                </Box>
            </Box>

            <Box>
                <Typography variant="subtitle2" fontWeight="700" color="#374151" mb={1}>Default Roles</Typography>
                <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: "12px", border: "1px solid #ddd" }}>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                        <Chip label="Manager" onDelete={() => { }} sx={{ borderRadius: "8px", bgcolor: "#E5E7EB", color: "#4B5563", fontWeight: 600 }} />
                        <Chip label="Developer" onDelete={() => { }} sx={{ borderRadius: "8px", bgcolor: "#E5E7EB", color: "#4B5563", fontWeight: 600 }} />
                    </Box>
                    <Button startIcon={<Box component="span" sx={{ fontSize: "18px" }}>+</Box>} size="small" sx={{ textTransform: "none" }}>
                        Add Role
                    </Button>
                </Box>
            </Box>

            <Box>
                <Typography variant="subtitle2" fontWeight="700" color="#374151" mb={1}>Initial Structure (Optional)</Typography>
                <Box sx={{ p: 3, bgcolor: "#F9FAFB", borderRadius: "12px", border: "1px dashed #ccc", textAlign: "center", cursor: "pointer", "&:hover": { borderColor: "#E65F2B" } }}>
                    <Typography variant="body2" color="#666" fontWeight={500}>+ Add Phase or Milestone</Typography>
                </Box>
            </Box>
        </RightDrawer>
    );
};



const Templates = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [showCreateDrawer, setShowCreateDrawer] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleUseTemplate = (template: Template) => {
        enqueueSnackbar(`Using template: ${template.title}`, { variant: 'success', autoHideDuration: 2000 });
        setSelectedTemplate(null);
    };

    const handleDuplicateTemplate = (template: Template) => {
        enqueueSnackbar(`Template "${template.title}" duplicated!`, { variant: 'info', autoHideDuration: 2000 });
        setSelectedTemplate(null);
    };



    const handleCreate = () => {
        setShowCreateDrawer(false);
        enqueueSnackbar("New template created successfully.", { variant: "success", autoHideDuration: 2000 });
    };

    const currentCategory = categories[activeTab];
    const featuredTemplate = initialTemplates.find(t => t.isFeatured);
    const standardTemplates = initialTemplates.filter(t => !t.isFeatured && (currentCategory === "All Templates" || t.category === currentCategory));

    // Custom View logic
    const isCustomTab = currentCategory === "Custom";

    return (
        <Box sx={{ pb: 8 }}>
            {/* 1. Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 4, pt: 2 }}>
                <Box>
                    <Typography
                        sx={{
                            fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                            fontStyle: "normal",
                            fontWeight: 400,
                            fontSize: "32px",
                            lineHeight: "36px",
                            letterSpacing: "0.005em",
                            color: "#1A1A1A",
                        }}
                    >
                        Project Templates
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                            color: Text.secondary,
                            mt: 0.5
                        }}
                    >
                        Start faster with professionally crafted project structures
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>

                    <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: "24px", textTransform: "none", bgcolor: Brand.primary, "&:hover": { bgcolor: "#BF491F" }, px: 3 }} onClick={() => setShowCreateDrawer(true)}>Create Template</Button>
                </Box>
            </Box>

            {/* 2. Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="template categories"
                    TabIndicatorProps={{ style: { backgroundColor: "#E65F2B", height: 3 } }}
                    sx={{
                        "& .MuiTab-root": {
                            fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "15px",
                            minHeight: "48px",
                            color: "#666"
                        },
                        "& .Mui-selected": { color: "#E65F2B !important" }
                    }}
                >
                    {categories.map((cat) => (
                        <Tab key={cat} label={cat} />
                    ))}
                </Tabs>
            </Box>

            {/* 3. Featured Section (Only on All Templates) */}
            {activeTab === 0 && featuredTemplate && (
                <Box>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                            fontWeight: 700,
                            color: "#9CA3AF",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            mb: 2
                        }}
                    >
                        Featured Collection
                    </Typography>
                    <FeaturedTemplateCard template={featuredTemplate} onPreview={setSelectedTemplate} onUse={handleUseTemplate} />
                </Box>
            )}

            {/* 4. Grid Section */}
            <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                            fontWeight: 700,
                            color: "#9CA3AF",
                            textTransform: "uppercase",
                            letterSpacing: "1px"
                        }}
                    >
                        {activeTab === 0 ? "More Templates" : `${currentCategory}`}
                    </Typography>
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 4 }}>
                    {/* Add New Custom Card (Only in Custom tab) */}
                    {isCustomTab && (
                        <Box onClick={() => setShowCreateDrawer(true)} sx={{
                            border: "2px dashed #ccc",
                            borderRadius: "24px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            minHeight: "260px",
                            height: "100%",
                            color: "#999",
                            bgcolor: "rgba(255, 255, 255, 0.4)",
                            transition: "all 0.2s",
                            "&:hover": { borderColor: "#E65F2B", color: "#E65F2B", bgcolor: "#FFFBEB" }
                        }}>
                            <Avatar sx={{ bgcolor: "transparent", color: "inherit", width: 56, height: 56, border: "2px solid", mb: 2 }}>+</Avatar>
                            <Typography sx={{ fontFamily: "'Aeonik Pro TRIAL', sans-serif", fontWeight: 700 }}>Create New Template</Typography>
                        </Box>
                    )}

                    {standardTemplates.map(template => (
                        <StandardTemplateCard key={template.id} template={template} onPreview={setSelectedTemplate} onUse={handleUseTemplate} />
                    ))}
                </Box>
            </Box>

            <TemplatePreviewDrawer
                template={selectedTemplate}
                open={Boolean(selectedTemplate)}
                onClose={() => setSelectedTemplate(null)}
                onUse={handleUseTemplate}
                onDuplicate={handleDuplicateTemplate}
            />

            <CreateTemplateDrawer
                open={showCreateDrawer}
                onClose={() => setShowCreateDrawer(false)}
                onSubmit={handleCreate}
            />


        </Box>
    );
};

export default Templates;
