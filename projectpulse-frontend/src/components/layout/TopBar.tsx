import { useState, useEffect } from "react";
import { Box, Typography, InputAdornment, TextField, Avatar, Divider } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";

interface TopBarProps {
    title: string;
    onSearch?: (query: string) => void;
    searchPlaceholder?: string;
}

const TopBar = ({ title, onSearch, searchPlaceholder = "Search for anything..." }: TopBarProps) => {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await userService.getMe();
                setUser(data);
            } catch (err) {
                console.error("Failed to fetch user in TopBar", err);
            }
        };
        fetchUser();

        // Optional: Listen for a custom event if we want instant updates across tabs
        window.addEventListener('user-updated', fetchUser);
        return () => window.removeEventListener('user-updated', fetchUser);
    }, []);

    return (
        <Box sx={{ margin: "-32px -32px 32px -32px" }}>
            <Box sx={{
                padding: "32px 32px 24px 32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                {/* Title */}
                <Typography
                    sx={{
                        fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                        fontStyle: "normal",
                        fontWeight: 400,
                        fontSize: "32px",
                        lineHeight: "36px",
                        letterSpacing: "0.005em",
                        color: "#1A1A1A",
                        // border: "0.5px solid #060606" // From figma, but likely a frame border, skipping for text
                    }}
                >
                    {title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Search Bar */}
                    {onSearch && (
                        <Box
                            sx={{
                                width: "336px",
                                height: "48px",
                                backgroundColor: "#FFFFFF",
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.02)",
                                borderRadius: "55px",
                                display: "flex",
                                alignItems: "center",
                                padding: "0 13px", // adjusted to match internal padding
                            }}
                        >
                            <TextField
                                placeholder={searchPlaceholder}
                                onChange={(e) => onSearch(e.target.value)}
                                fullWidth
                                variant="standard" // Removing default borders
                                InputProps={{
                                    disableUnderline: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search sx={{ color: "#000", width: "20px", height: "20px", opacity: 0.4 }} />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        height: "48px",
                                        fontSize: "14px",
                                        color: "#000",
                                        "& input::placeholder": {
                                            color: "rgba(6, 6, 6, 0.4)",
                                            opacity: 1,
                                            fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                                        }
                                    }
                                }}
                            />
                        </Box>
                    )}

                    {/* User Profile */}
                    <Box
                        sx={{
                            // width: "215px", // dynamic width instead
                            height: "48px",
                            backgroundColor: "#FFFFFF",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.02)",
                            borderRadius: "55px",
                            display: "flex",
                            alignItems: "center",
                            padding: "0 10px 0 6px", // Tighter padding: 6px left (near avatar), 10px right
                            // justifyContent: "center", // Removed to avoid centering
                            gap: "8px", // Reduced gap slightly
                            cursor: "pointer",
                            "&:hover": {
                                bgcolor: "#f9f9f9",
                                transition: "background-color 0.2s ease"
                            }
                        }}
                        onClick={() => navigate('/settings')}
                    >
                        {/* Avatar */}
                        <Avatar
                            src={user?.avatar || "/avatars/poojyanth.png"}
                            alt={user?.firstName || "Poojyanth"}
                            sx={{
                                width: 38,
                                height: 38,
                                filter: "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.02))"
                            }}
                        />

                        {/* Text Column */}
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <Typography
                                sx={{
                                    fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                                    fontWeight: 400,
                                    fontSize: "14px",
                                    lineHeight: "16px",
                                    color: "#1A1A1A",
                                }}
                            >
                                {user ? `${user.firstName} ${user.lastName}` : "Poojyanth M"}
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: "'Aeonik Pro TRIAL', sans-serif",
                                    fontWeight: 400,
                                    fontSize: "12px",
                                    lineHeight: "14px",
                                    color: "#666666",
                                }}
                            >
                                {user?.role || "Full Stack Developer"}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Divider sx={{ borderColor: "rgba(0,0,0,0.1)" }} />
        </Box>
    );
};

export default TopBar;
