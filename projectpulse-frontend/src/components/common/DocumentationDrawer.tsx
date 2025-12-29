import {
    Typography,
    Box,
    Button,
    IconButton,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Close,
    Code,
    Layers,
    Speed,
    CheckCircle,
    Web
} from '@mui/icons-material';
import { RightDrawer } from './RightDrawer';

interface DocumentationDrawerProps {
    open: boolean;
    onClose: () => void;
}

const DocumentationDrawer = ({ open, onClose }: DocumentationDrawerProps) => {
    return (
        <RightDrawer
            open={open}
            onClose={onClose}
            contentSx={{ p: 0 }}
            actions={
                <>
                    <Button onClick={onClose} variant="outlined" sx={{ borderRadius: "8px", textTransform: "none", color: "#E65F2B", borderColor: "#E65F2B", fontWeight: 600 }}>Close Documentation</Button>
                    <Button variant="contained" onClick={onClose} sx={{ bgcolor: "#E65F2B", borderRadius: '8px', textTransform: 'none', px: 3, "&:hover": { bgcolor: "#BF491F" } }}>
                        Back to Settings
                    </Button>
                </>
            }
        >
            {/* Header */}
            <Box sx={{
                p: 3,
                background: 'linear-gradient(135deg, #FFF0E3 0%, #FDFBF7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(0,0,0,0.06)'
            }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                        <Typography variant="h5" fontWeight="800" color="#1A1A1A">Project Pulse</Typography>
                        <Chip
                            label="v2.4.0"
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: 10,
                                fontWeight: 700,
                                bgcolor: '#1A1A1A',
                                color: 'white'
                            }}
                        />
                    </Box>
                    <Typography variant="body2" color="#666">
                        Enterprise Project Management System Documentation
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ bgcolor: "rgba(0,0,0,0.05)", ml: 2, color: "#666", "&:hover": { bgcolor: "rgba(0,0,0,0.1)" } }}>
                    <Close sx={{ fontSize: 20 }} />
                </IconButton>
            </Box>

            {/* Content Scrollable */}
            <Box sx={{ p: 4, bgcolor: '#FAFAFA', overflowY: "auto", flex: 1 }}>
                {/* Introduction */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="subtitle1" fontWeight="700" color="#E65F2B" mb={1} sx={{ letterSpacing: '1px', fontSize: '12px', textTransform: 'uppercase' }}>
                        Overview
                    </Typography>
                    <Typography variant="h6" fontWeight="700" color="#1A1A1A" mb={2}>
                        Streamlining workflows with intelligent design.
                    </Typography>
                    <Typography variant="body1" color="#4B5563" lineHeight={1.8}>
                        Project Pulse is a comprehensive Project Management System designed to unify teams, simplify complex workflows, and provide deep visibility into organizational performance. By centralizing task orchestration, resource allocation, and budget tracking, it transforms how teams plan and execute. The platform focuses on eliminating administrative friction, allowing you to focus on high-impact delivery with real-time analytics and intelligent milestone tracking.
                    </Typography>
                </Box>

                {/* Tech Stack Grid */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="subtitle1" fontWeight="700" color="#E65F2B" mb={3} sx={{ letterSpacing: '1px', fontSize: '12px', textTransform: 'uppercase' }}>
                        Technology Stack
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        {[
                            { icon: <Web />, title: 'React 18', desc: 'Component-based UI library' },
                            { icon: <Code />, title: 'TypeScript', desc: 'Type-safe development' },
                            { icon: <Speed />, title: 'Vite', desc: 'Next-gen frontend tooling' },
                            { icon: <Layers />, title: 'Material UI', desc: 'Core component system' },
                        ].map((tech) => (
                            <Box key={tech.title} sx={{
                                p: 2.5,
                                bgcolor: 'white',
                                borderRadius: '16px',
                                border: '1px solid rgba(0,0,0,0.06)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                            }}>
                                <Box sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '10px',
                                    bgcolor: 'rgba(230, 95, 43, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#E65F2B'
                                }}>
                                    {tech.icon}
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="700" color="#1A1A1A">{tech.title}</Typography>
                                    <Typography variant="caption" color="#666">{tech.desc}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Key Features */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="subtitle1" fontWeight="700" color="#E65F2B" mb={2} sx={{ letterSpacing: '1px', fontSize: '12px', textTransform: 'uppercase' }}>
                        Key Modules
                    </Typography>
                    <List disablePadding>
                        {[
                            { title: 'Interactive Dashboard', desc: 'Real-time project tracking with visual progress indicators.' },
                            { title: 'Kanban Task Board', desc: 'Drag-and-drop task management with custom status columns.' },
                            { title: 'User Directory', desc: 'Role-based access control (RBAC) and profile management.' },
                            { title: 'Settings Hub', desc: 'Centralized configuration for profile, notifications, and security.' },
                        ].map((feature, idx) => (
                            <ListItem key={idx} sx={{
                                px: 3,
                                py: 2,
                                mb: 1.5,
                                bgcolor: 'white',
                                borderRadius: '12px',
                                border: '1px solid rgba(0,0,0,0.04)'
                            }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="subtitle2" fontWeight="700" color="#1A1A1A">{feature.title}</Typography>}
                                    secondary={<Typography variant="body2" color="#666">{feature.desc}</Typography>}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {/* Design System */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="700" color="#E65F2B" mb={2} sx={{ letterSpacing: '1px', fontSize: '12px', textTransform: 'uppercase' }}>
                        Design Philosophy
                    </Typography>
                    <Box sx={{
                        p: 3,
                        background: 'linear-gradient(135deg, #1A1A1A 0%, #2D3748 100%)',
                        borderRadius: '20px',
                        color: 'white'
                    }}>
                        <Typography variant="h6" fontWeight="700" mb={1}>Glassmorphism</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                            Our UI uses translucency and background blur to establish hierarchy.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Box sx={{ bgcolor: '#E65F2B', px: 2, py: 1, borderRadius: '8px', fontSize: '12px', fontWeight: 600 }}>Brand Orange</Box>
                            <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', px: 2, py: 1, borderRadius: '8px', fontSize: '12px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)' }}>Glass Surface</Box>
                            <Box sx={{ bgcolor: '#EBDFD7', px: 2, py: 1, borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#1A1A1A' }}>Beige Base</Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </RightDrawer>
    );
};

export default DocumentationDrawer;
