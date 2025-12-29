import { useState } from "react";
import { Box, Typography, Button, TextField, MenuItem, CircularProgress } from "@mui/material";
import { RightDrawer } from "../common/RightDrawer";
import { Brand } from "../../theme/colors";
import { resourceService } from "../../services/resourceService";
import { useSnackbar } from "notistack";

interface InviteUserDrawerProps {
    open: boolean;
    onClose: () => void;
    onInviteSuccess?: () => void;
}

export const InviteUserDrawer = ({ open, onClose, onInviteSuccess }: InviteUserDrawerProps) => {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("Member");
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async () => {
        if (!email) {
            enqueueSnackbar("Email is required", { variant: "error" });
            return;
        }
        setLoading(true);
        try {
            await resourceService.inviteUser(email, role);
            enqueueSnackbar(`Invitation sent to ${email}`, { variant: "success" });
            if (onInviteSuccess) onInviteSuccess();
            onClose();
            setEmail(""); // Reset
            setRole("Member");
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Failed to send invite", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <RightDrawer
            open={open}
            onClose={onClose}
            title="Invite User"
            actions={
                <>
                    <Button onClick={onClose} variant="outlined" sx={{ borderRadius: "8px", textTransform: "none", color: Brand.primary, borderColor: Brand.primary, fontWeight: 600 }}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{ bgcolor: Brand.primary, borderRadius: "8px", textTransform: "none", "&:hover": { bgcolor: "#BF491F" } }}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Send Invite"}
                    </Button>
                </>
            }
        >
            <Typography variant="body2" mb={3} color="text.secondary">
                Invite a new member to join your organization workspace.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
                <TextField
                    label="Email Address"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
                />
                <TextField
                    select
                    fullWidth
                    label="Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
                >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Member">Member</MenuItem>
                    <MenuItem value="Viewer">Viewer</MenuItem>
                </TextField>
            </Box>
        </RightDrawer>
    );
};
