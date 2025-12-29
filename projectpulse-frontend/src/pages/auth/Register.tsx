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
import { Email, Lock, Person, Close } from "@mui/icons-material";

interface RegisterProps {
  open: boolean;
  onClose: () => void;
}

const Register = ({ open, onClose }: RegisterProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: 'error' });
      return;
    }
    setIsLoading(true);

    try {
      // Split name into first and last name as backend likely expects them
      const names = formData.name.split(" ");
      const firstName = names[0];
      const lastName = names.slice(1).join(" ") || "";

      await api.post("/auth/register", {
        email: formData.email,
        password: formData.password,
        firstName,
        lastName: lastName || ".", // Provide a placeholder if empty to satisfy potential required validators
        role: "MEMBER"
      });

      enqueueSnackbar("Registration successful! Please log in.", { variant: 'success' });
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      onClose();
    } catch (error: any) {
      console.error("Registration failed", error);
      enqueueSnackbar(error.response?.data?.message || "Registration failed", { variant: 'error' });
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
        Create Account
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
          Join Project Pulse and start managing your projects efficiently.
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Name field */}
          <TextField
            fullWidth
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange("name")}
            disabled={isLoading}
            sx={{
              mb: 2,
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
                  <Person sx={{ color: "#6b7280" }} />
                </Box>
              ),
            }}
          />

          {/* Email field */}
          <TextField
            fullWidth
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange("email")}
            disabled={isLoading}
            sx={{
              mb: 2,
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

          {/* Password field */}
          <TextField
            fullWidth
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange("password")}
            disabled={isLoading}
            sx={{
              mb: 2,
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
                  <Lock sx={{ color: "#6b7280" }} />
                </Box>
              ),
            }}
          />

          {/* Confirm Password field */}
          <TextField
            fullWidth
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange("confirmPassword")}
            disabled={isLoading}
            sx={{
              mb: 3,
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
                  <Lock sx={{ color: "#6b7280" }} />
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
          disabled={isLoading || !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
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
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Register;