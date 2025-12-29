import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    IconButton,
    Divider,
} from "@mui/material";
import {
    Add,
    ChevronLeft,
    ChevronRight,
    Logout,
    GridViewOutlined,
    BusinessCenterOutlined,
    FormatListBulletedOutlined,
    ScheduleOutlined,
    GroupOutlined,
    LayersOutlined,
    SettingsOutlined,
    ViewTimelineOutlined,
    AccountBalanceWalletOutlined,
    Assessment,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import ProjectManagerIcon from "../../assets/project-pulse-logo-final.png";

const ResourceMgmtIcon = () => (
    <svg width="24" height="24" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12.1445 18.3341C12.1445 17.7012 11.6315 17.1882 10.9987 17.1882C10.3659 17.1882 9.85286 17.7012 9.85286 18.3341C9.85286 18.9669 10.3659 19.4799 10.9987 19.4799C11.6315 19.4799 12.1445 18.9669 12.1445 18.3341ZM10.9987 15.8132C12.3909 15.8132 13.5195 16.9418 13.5195 18.3341C13.5195 19.7263 12.3909 20.8549 10.9987 20.8549C9.60648 20.8549 8.47786 19.7263 8.47786 18.3341C8.47786 16.9418 9.60648 15.8132 10.9987 15.8132Z" fill="currentColor" />
        <path fillRule="evenodd" clipRule="evenodd" d="M19.4775 18.3341C19.4775 17.7012 18.9645 17.1882 18.3317 17.1882C17.6989 17.1882 17.1859 17.7012 17.1859 18.3341C17.1859 18.9669 17.6989 19.4799 18.3317 19.4799C18.9645 19.4799 19.4775 18.9669 19.4775 18.3341ZM18.3317 15.8132C19.7239 15.8132 20.8525 16.9418 20.8525 18.3341C20.8525 19.7263 19.7239 20.8549 18.3317 20.8549C16.9395 20.8549 15.8109 19.7263 15.8109 18.3341C15.8109 16.9418 16.9395 15.8132 18.3317 15.8132Z" fill="currentColor" />
        <path fillRule="evenodd" clipRule="evenodd" d="M4.81055 18.3341C4.81055 17.7012 4.29754 17.1882 3.66471 17.1882C3.03189 17.1882 2.51888 17.7012 2.51888 18.3341C2.51888 18.9669 3.03189 19.4799 3.66471 19.4799C4.29754 19.4799 4.81055 18.9669 4.81055 18.3341ZM3.66471 15.8132C5.05693 15.8132 6.18555 16.9418 6.18555 18.3341C6.18555 19.7263 5.05693 20.8549 3.66471 20.8549C2.2725 20.8549 1.14388 19.7263 1.14388 18.3341C1.14388 16.9418 2.2725 15.8132 3.66471 15.8132Z" fill="currentColor" />
        <path fillRule="evenodd" clipRule="evenodd" d="M12.1445 3.66732C12.1445 3.03449 11.6315 2.52148 10.9987 2.52148C10.3659 2.52148 9.85286 3.03449 9.85286 3.66732C9.85286 4.30014 10.3659 4.81315 10.9987 4.81315C11.6315 4.81315 12.1445 4.30014 12.1445 3.66732ZM10.9987 1.14648C12.3909 1.14648 13.5195 2.2751 13.5195 3.66732C13.5195 5.05954 12.3909 6.18815 10.9987 6.18815C9.60648 6.18815 8.47786 5.05954 8.47786 3.66732C8.47786 2.2751 9.60648 1.14648 10.9987 1.14648Z" fill="currentColor" />
        <path fillRule="evenodd" clipRule="evenodd" d="M10.998 4.81323C11.3777 4.81323 11.6855 5.12104 11.6855 5.50073L11.6855 16.5007C11.6855 16.8804 11.3777 17.1882 10.998 17.1882C10.6184 17.1882 10.3105 16.8804 10.3105 16.5007L10.3105 5.50073C10.3105 5.12104 10.6184 4.81323 10.998 4.81323Z" fill="currentColor" />
        <path fillRule="evenodd" clipRule="evenodd" d="M18.1307 10.2853C18.7634 10.9181 19.0195 11.8113 19.0195 12.834L19.0195 16.5007C19.0195 16.8803 18.7117 17.1882 18.332 17.1882C17.9523 17.1882 17.6445 16.8803 17.6445 16.5007L17.6445 12.834C17.6445 12.0233 17.4423 11.5415 17.1584 11.2576C16.8745 10.9737 16.3927 10.7715 15.582 10.7715L6.41537 10.7715C5.60467 10.7715 5.12293 10.9737 4.839 11.2576C4.55507 11.5415 4.35287 12.0233 4.35287 12.834L4.35286 16.5007C4.35286 16.8803 4.04506 17.1882 3.66536 17.1882C3.28567 17.1882 2.97786 16.8803 2.97786 16.5007L2.97787 12.834C2.97787 11.8113 3.23399 10.9181 3.86673 10.2853C4.49947 9.65261 5.39272 9.39648 6.41537 9.39648L15.582 9.39648C16.6047 9.39648 17.4979 9.65261 18.1307 10.2853Z" fill="currentColor" />
    </svg>
);

/* ---------- Menu Items ---------- */
const menuItems = [
    { label: "Dashboard", icon: <GridViewOutlined />, path: "/dashboard" },
    { label: "Projects", icon: <BusinessCenterOutlined />, path: "/projects" },
    { label: "Tasks", icon: <FormatListBulletedOutlined />, path: "/tasks" },
    { label: "Timeline", icon: <ViewTimelineOutlined />, path: "/timeline" },
    { label: "Time Tracking", icon: <ScheduleOutlined />, path: "/time-tracking" },
    { label: "Budget", icon: <AccountBalanceWalletOutlined />, path: "/budget" },
    { label: "Analytics", icon: <Assessment />, path: "/analytics" },
    { label: "Resource Mgmt", icon: <ResourceMgmtIcon />, path: "/team" },
    { label: "Users", icon: <GroupOutlined />, path: "/users" },
    { label: "Project Template", icon: <LayersOutlined />, path: "/templates" },
    { label: "Settings", icon: <SettingsOutlined />, path: "/settings" },
];

interface SidebarProps {
    collapsed: boolean;
    onCollapse: (val: boolean) => void;
    width: number;
}

const Sidebar = ({ collapsed, onCollapse, width }: SidebarProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();
    const isCreateActive = location.pathname === '/projects/create';

    const handleLogout = () => {
        enqueueSnackbar("Logged out successfully", { variant: "success" });
        navigate("/login");
    };

    return (
        <Box
            sx={{
                height: "100%",
                width: width,
                minWidth: width,
                position: "relative",
                transition: "width 0.3s ease",
                zIndex: 1200,
            }}
        >
            <Box
                sx={{
                    height: "100%",
                    width: "100%",
                    background: "#060606",
                    padding: collapsed ? "24px 8px" : "24px 16px", // Reduced padding when collapsed to fit 64px logo
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    overflowX: "hidden",
                    transition: "padding 0.3s ease",
                }}
            >
                {/* ---------- TOP SECTION ---------- */}
                <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    {/* Brand */}
                    <Box
                        onClick={() => navigate('/dashboard')}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: collapsed ? "center" : "flex-start",
                            width: "100%",
                            gap: collapsed ? 0 : "16px",
                            mb: 6,
                            pl: collapsed ? 0 : 1,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            "&:hover": { opacity: 0.9 }
                        }}
                    >
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                overflow: 'hidden',
                                borderRadius: '12px'
                            }}
                        >
                            <img
                                src={ProjectManagerIcon}
                                alt="Project Pulse"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transform: 'scale(1.5)' // Zoom in to focus on icons
                                }}
                            />
                        </Box>

                        {!collapsed && (
                            <Typography
                                sx={{
                                    color: "#FFFFFF",
                                    fontSize: "22px",
                                    fontWeight: 400,
                                    letterSpacing: "0.01em",
                                    lineHeight: "26px",
                                    fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                                }}
                            >
                                Project Pulse
                            </Typography>
                        )}
                    </Box>

                    {/* Create Project */}
                    <Button
                        fullWidth
                        onClick={() => navigate('/projects/create')}
                        sx={{
                            height: 48,
                            borderRadius: "24px",
                            background: isCreateActive ? "#FFFFFF" : "transparent",
                            color: isCreateActive ? "#E65F2B" : "#EDEDED",
                            textTransform: "none",
                            fontSize: "14px",
                            fontWeight: 500,
                            justifyContent: collapsed ? "center" : "flex-start",
                            gap: collapsed ? 0 : "12px",
                            mb: 3,
                            "&:hover": {
                                background: isCreateActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.05)",
                            },
                        }}
                    >
                        <Box
                            sx={{
                                width: 34,
                                height: 34,
                                borderRadius: "50%",
                                background: "#E65F2B",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Add sx={{ color: "#fff", fontSize: 20 }} />
                        </Box>
                        {!collapsed && "Create New Project"}
                    </Button>

                    {/* Menu */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {menuItems.map((item) => {
                            const active = location.pathname === item.path;
                            return (
                                <Button
                                    key={item.label}
                                    fullWidth
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        height: 46,
                                        borderRadius: "22px",
                                        justifyContent: collapsed ? "center" : "flex-start",
                                        px: collapsed ? 0 : 2,
                                        gap: collapsed ? 0 : "14px",
                                        textTransform: "none",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        color: active ? "#E65F2B" : "#EDEDED",
                                        background: active ? "#FFFFFF" : "transparent",
                                        "&:hover": {
                                            background: active ? "#FFFFFF" : "#1E1E1E",
                                        },
                                        "& svg": {
                                            fill: active ? "#E65F2B" : "currentColor" // Ensure SVGs color correctly
                                        }
                                    }}
                                >
                                    {/* Clone icon to pass props if needed, or just rely on CSS color inheritance */}
                                    <Box component="span" sx={{ display: 'flex', color: active ? '#E65F2B' : 'inherit' }}>
                                        {item.icon}
                                    </Box>
                                    {!collapsed && item.label}
                                </Button>
                            );
                        })}
                    </Box>
                </Box>

                {/* ---------- LOGOUT ---------- */}
                <Box sx={{ mt: 4 }}>
                    <Divider sx={{ backgroundColor: "#333", mb: 2 }} />
                    <Button
                        fullWidth
                        onClick={handleLogout}
                        sx={{
                            height: 46,
                            borderRadius: "22px",
                            justifyContent: collapsed ? "center" : "flex-start",
                            px: collapsed ? 0 : 2,
                            gap: collapsed ? 0 : "14px",
                            textTransform: "none",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#EDEDED",
                            "&:hover": { background: "#1E1E1E" },
                        }}
                    >
                        <Logout />
                        {!collapsed && "Logout"}
                    </Button>
                </Box>
            </Box>

            {/* Chevron Button - Positioned on the edge */}
            <IconButton
                onClick={() => onCollapse(!collapsed)}
                sx={{
                    position: "absolute",
                    top: "104px",
                    transform: "translateY(-50%)",
                    right: "-16px",
                    width: 32,
                    height: 32,
                    background: "#FFFFFF",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    "&:hover": { background: "#F5F5F5" },
                    zIndex: 1300,
                    border: "1px solid rgba(0,0,0,0.05)"
                }}
            >
                {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
        </Box>
    );
};

export default Sidebar;
