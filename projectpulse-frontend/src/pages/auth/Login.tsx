import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  GitHub,
} from "@mui/icons-material";

import ForgotPassword from "./ForgotPassword";
import Register from "./Register";
import ProjectManagerIcon from "../../assets/project-pulse-logo-final.png";
import api from "../../services/api";

const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const AppleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="black" />
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [floatingElements] = useState(() => {
    const numElements = 10;
    return Array.from({ length: numElements }, (_, i) => {
      const width = Math.floor(Math.random() * 100) + 50;
      const height = Math.floor(Math.random() * 100) + 50;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const key = `float-${i}`;
      return { key, width, height, top, left };
    });
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { accessToken, user } = res.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      enqueueSnackbar("Login successful!", { variant: "success" });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Invalid email or password. Please try again.", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setForgotPasswordOpen(true);
  };

  const handleSocialLogin = (provider: string) => {
    enqueueSnackbar(`${provider} login initiated`, { variant: "info" });
  };

  const handleSignUp = () => {
    setRegisterOpen(true);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#CDB8A5",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        padding: { xs: 2, md: 0 },
      }}
    >
      {/* Login Details Container */}
      <Box
        sx={{
          width: { xs: "100%", md: "1366px" },
          height: { xs: "auto", md: "768px" },
          maxWidth: "1366px",
          background: "linear-gradient(90deg, #FEDCC5 0%, #FED6BB 85.1%)",
          borderRadius: "24px",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Left side - Login Form */}
        <Box
          sx={{
            flex: { xs: 1, md: 1.5 },
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            borderRight: { md: "1px solid rgba(255, 255, 255, 0.4)" },
            padding: { xs: 4, sm: 5, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.5)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)",
              zIndex: 0,
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
              zIndex: 0,
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              maxWidth: "480px",
              margin: "0 auto",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Logo inside a box */}
            <Box
              sx={{
                width: 120,
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                overflow: 'hidden'
              }}
            >
              <Box
                component="img"
                src={ProjectManagerIcon}
                alt="Project logo"
                sx={{
                  width: '160%', // Zoom in to remove the excess background padding
                  height: '160%',
                  objectFit: "contain",
                  transform: 'scale(1.2)' // Further zoom to make icons prominent
                }}
              />
            </Box>

            {/* Login title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#F97316",
                mb: 3,
                fontSize: { xs: "1.4rem", sm: "1.6rem" },
              }}
            >
              Login
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              {/* Email field */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: "#374151",
                    fontWeight: 500,
                    mb: 1,
                    fontSize: "0.95rem",
                  }}
                >
                  Email
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  placeholder="example@gmail.com"
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
                      <InputAdornment position="start">
                        <Email sx={{ color: "#6b7280" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Password field */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#374151",
                      fontWeight: 500,
                      fontSize: "0.95rem",
                    }}
                  >
                    Password
                  </Typography>
                  <Button
                    onClick={handleForgotPassword}
                    sx={{
                      color: "#F97316",
                      textTransform: "none",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      padding: "4px 8px",
                      minWidth: "auto",
                      "&:hover": {
                        background: "rgba(249, 115, 22, 0.1)",
                        borderRadius: "6px",
                      },
                    }}
                  >
                    Forgot Password?
                  </Button>
                </Box>
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#6b7280" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "#6b7280" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Login button */}
              <Button
                type="submit"
                fullWidth
                disabled={isLoading || !email || !password}
                sx={{
                  py: 1.75,
                  borderRadius: "12px",
                  background: "#F97316",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  letterSpacing: "0.5px",
                  boxShadow: "0 4px 15px rgba(249, 115, 22, 0.4)",
                  transition: "all 0.3s ease",
                  mb: 3,
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
                {isLoading ? "Logging in..." : "Sign in"}
              </Button>

              {/* Divider */}
              <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
                <Divider sx={{ flex: 1, background: "rgba(203, 213, 224, 0.5)" }} />
                <Typography
                  sx={{
                    px: 2,
                    color: "#6b7280",
                    fontSize: "0.9rem",
                    fontWeight: 400,
                  }}
                >
                  Or Continue With
                </Typography>
                <Divider sx={{ flex: 1, background: "rgba(203, 213, 224, 0.5)" }} />
              </Box>

              {/* Social login buttons */}
              <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                {[
                  { icon: <GoogleIcon />, color: "#DB4437", name: "Google" },
                  { icon: <GitHub />, color: "#000000", name: "GitHub" },
                  { icon: <AppleIcon />, color: "#000000", name: "Apple" },
                ].map((social, index) => (
                  <Button
                    key={index}
                    fullWidth
                    onClick={() => handleSocialLogin(social.name)}
                    sx={{
                      py: 1.5,
                      borderRadius: "12px",
                      background: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(229, 231, 235, 0.8)",
                      color: social.color,
                      textTransform: "none",
                      fontSize: "1.25rem",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 1)",
                        border: `1px solid ${social.color}`,
                        transform: "translateY(-2px)",
                        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1)`,
                      },
                    }}
                  >
                    {social.icon}
                  </Button>
                ))}
              </Box>

              {/* Sign up link */}
              <Typography
                align="center"
                sx={{
                  color: "#6b7280",
                  fontSize: "0.95rem",
                }}
              >
                {"Don't have an account yet? "}
                <Button
                  onClick={handleSignUp}
                  sx={{
                    color: "#F97316",
                    textTransform: "none",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    padding: "4px 8px",
                    minWidth: "auto",
                    "&:hover": {
                      background: "rgba(249, 115, 22, 0.1)",
                      borderRadius: "6px",
                    },
                  }}
                >
                  Register for free
                </Button>
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right side - Illustration area */}
        <Box
          sx={{
            flex: 1,
            background: "rgba(230, 95, 43, 0.05)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            borderTopRightRadius: { xs: 0, md: "24px" },
            borderBottomRightRadius: { xs: 0, md: "24px" },
            padding: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            minHeight: { xs: "300px", md: "auto" },
            boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.3)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(135deg, rgba(230, 95, 43, 0.1) 0%, rgba(254, 215, 170, 0.15) 100%)",
              zIndex: 0,
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
              zIndex: 0,
            },
          }}
        >
          {/* 3D Illustration Container */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {/* Floating Elements with professional staggered animation - Moved behind illustration */}
            {floatingElements.map((element, index) => (
              <Box
                key={element.key}
                sx={{
                  position: "absolute",
                  width: `${element.width}px`,
                  height: `${element.height}px`,
                  top: `${element.top}%`,
                  left: `${element.left}%`,
                  background: "rgba(255, 255, 255, 0.15)",
                  borderRadius: "50%",
                  backdropFilter: "blur(4px)",
                  zIndex: 1,
                  animation: `floatAround 8s ease-in-out ${index * 0.5}s infinite`,
                  "@keyframes floatAround": {
                    "0%, 100%": { transform: "translate(0, 0)" },
                    "25%": { transform: "translate(10px, -15px)" },
                    "50%": { transform: "translate(-5px, -25px)" },
                    "75%": { transform: "translate(-15px, -10px)" },
                  },
                }}
              />
            ))}

            {/* 3D Illustration */}
            <Box
              sx={{
                width: "100%",
                maxWidth: "500px",
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                mb: 4,
                position: "relative",
                zIndex: 2,
              }}
            >
              <Box
                component="img"
                src="/illustrations/login-team.png"
                alt="Team Collaboration Illustration"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "center",
                  borderRadius: "64px",
                  overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(230, 95, 43, 0.08)",
                  animation: "revealScale 1.2s cubic-bezier(0.2, 0.8, 0.2, 1), gentleFloat 6s ease-in-out 1.2s infinite",
                  "@keyframes revealScale": {
                    "0%": { transform: "translateY(30px) scale(0.95)", opacity: 0 },
                    "100%": { transform: "translateY(0) scale(1)", opacity: 1 },
                  },
                  "@keyframes gentleFloat": {
                    "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
                    "33%": { transform: "translateY(-12px) rotate(0.5deg)" },
                    "66%": { transform: "translateY(-5px) rotate(-0.5deg)" },
                  },
                }}
              />
            </Box>

            {/* ProjectPulse Branding */}
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                textAlign: "center",
                px: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  background:
                    "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 700,
                  mb: 1.5,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                Project Pulse
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#374151",
                  fontWeight: 500,
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  lineHeight: 1.4,
                  whiteSpace: "nowrap",
                }}
              >
                Plan smarter. Collaborate seamlessly. Deliver with confidence.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <ForgotPassword
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />
      <Register open={registerOpen} onClose={() => setRegisterOpen(false)} />
    </Box>
  );
};

export default Login;
