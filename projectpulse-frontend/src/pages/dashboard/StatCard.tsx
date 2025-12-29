// src/pages/dashboard/StatCard.tsx
import { Box, Typography } from "@mui/material";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;          // MUI icon you pass in
  pillColor: string;              // background for circle
  trendText: string;              // "12% increase from last month"
  trendDirection: "up" | "down";  // controls arrow + color
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  pillColor,
  trendText,
  trendDirection,
}) => {
  const trendColor = trendDirection === "up" ? "#1A932E" : "#EE201C";

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "180px",
        background: "#F2EAE5",
        borderRadius: "14px",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.06)",
        },
      }}
    >
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: pillColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ width: 24, height: 24, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {icon}
            </Box>
          </Box>
          <Typography
            sx={{
              fontFamily: "'Aeonik Pro TRIAL'",
              fontWeight: 500,
              fontSize: "16px",
              color: "#666666",
            }}
          >
            {title}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontFamily: "'Aeonik Pro TRIAL'",
            fontWeight: 700,
            fontSize: "32px",
            color: "#1A1A1A",
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          mt: 2
        }}
      >
        {trendDirection === "up" ? (
          <ArrowDropUp sx={{ color: trendColor, fontSize: 24 }} />
        ) : (
          <ArrowDropDown sx={{ color: trendColor, fontSize: 24 }} />
        )}
        <Typography
          sx={{
            fontFamily: "'Aeonik Pro TRIAL'",
            fontWeight: 500,
            fontSize: "12px",
            color: "#666666",
          }}
        >
          {trendText}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatCard;
