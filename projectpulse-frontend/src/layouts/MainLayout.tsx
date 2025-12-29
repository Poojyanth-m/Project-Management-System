import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "../components/layout/Sidebar";

const SIDEBAR_EXPANDED = 280;
const SIDEBAR_COLLAPSED = 80;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

    return (
        <Box
            sx={{
                height: "100vh",
                background: "#EBDFD7",
                overflow: "hidden",
                display: "flex",
            }}
        >
            <Sidebar
                collapsed={collapsed}
                onCollapse={setCollapsed}
                width={sidebarWidth}
            />

            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    padding: "32px",
                    overflow: "auto",
                    position: "relative",
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
