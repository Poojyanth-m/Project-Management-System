import { useState } from "react";
import { Box, Typography, Menu, MenuItem } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";

interface FilterDropdownProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
}

const FilterDropdown = ({ options, value, onChange }: FilterDropdownProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (option: string) => {
        onChange(option);
        handleClose();
    };

    return (
        <>
            <Box
                onClick={handleClick}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 16px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "20px",
                    cursor: "pointer",
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.02)",
                    transition: "all 0.2s",
                    "&:hover": {
                        boxShadow: "0px 4px 8px rgba(0,0,0,0.08)",
                    },
                }}
            >
                <Typography sx={{ fontFamily: "'Aeonik Pro TRIAL'", fontSize: "13px", color: "#1A1A1A" }}>
                    {value}
                </Typography>
                <KeyboardArrowDown sx={{ fontSize: "16px", color: "#666666" }} />
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        mt: 1,
                        borderRadius: "12px",
                        boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                        minWidth: "150px",
                    },
                }}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option}
                        onClick={() => handleSelect(option)}
                        selected={option === value}
                        sx={{
                            fontSize: "14px",
                            fontFamily: "'Aeonik Pro TRIAL'",
                            "&.Mui-selected": {
                                backgroundColor: "rgba(230, 95, 43, 0.1)",
                                "&:hover": {
                                    backgroundColor: "rgba(230, 95, 43, 0.15)",
                                },
                            },
                        }}
                    >
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default FilterDropdown;
