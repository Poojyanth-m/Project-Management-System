import { useState } from "react";
import { useSnackbar } from "notistack";
import api from "../../services/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Email, Close } from "@mui/icons-material";

interface ForgotPasswordProps {
  open: boolean;
  onClose: () => void;
}

const ForgotPassword = ({ open, onClose }: ForgotPasswordProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      enqueueSnackbar(`If an account exists for ${email}, a reset link has been sent.`, { variant: 'success' });
      setEmail("");
      onClose();
    } catch (error: any) {
      console.error("Forgot password failed", error);
      // For security, it's often better to show the same success message, 
      // but here we might want to respect backend error messages during dev.
      // We'll show a generic error to the user if it fails entirely (500), 
      // or the backend message if meaningful.
      enqueueSnackbar(error.response?.data?.message || "Failed to send reset link. Please try again.", { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#111827",
          fontWeight: 700,
          fontSize: "1.5rem",
        }}
      >
        Reset Password
        <IconButton onClick={onClose} sx={{ color: "#6b7280" }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography
          sx={{
            color: "#374151",
            mb: 3,
            fontSize: "0.95rem",
            lineHeight: 1.6,
          }}
        >
          Enter your email address and we'll send you a link to reset your password.
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.6)",
                },
                "&.Mui-focused": {
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "2px solid rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.2)",
                },
              },
              "& .MuiOutlinedInput-input": {
                color: "#1f2937",
                padding: "14px 16px",
                fontSize: "1rem",
                "&::placeholder": {
                  color: "#9ca3af",
                  opacity: 1,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                  <Email sx={{ color: "#6b7280" }} />
                </Box>
              ),
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "#6b7280",
            textTransform: "none",
            fontSize: "1rem",
            px: 3,
            py: 1.5,
            borderRadius: "12px",
            "&:hover": {
              background: "rgba(107, 114, 128, 0.1)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !email}
          sx={{
            py: 1.5,
            px: 3,
            borderRadius: "12px",
            background: "#F97316",
            color: "white",
            fontWeight: 600,
            fontSize: "1rem",
            textTransform: "none",
            letterSpacing: "0.5px",
            boxShadow: "0 4px 15px rgba(249, 115, 22, 0.4)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(249, 115, 22, 0.6)",
              background: "#EA580C",
            },
            "&:active": {
              transform: "translateY(0)",
            },
            "&.Mui-disabled": {
              background: "#d1d5db",
              color: "rgba(255, 255, 255, 0.7)",
            },
          }}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPassword;