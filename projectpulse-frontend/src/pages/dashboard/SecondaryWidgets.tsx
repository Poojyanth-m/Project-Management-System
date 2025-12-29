import { Box, Typography, Chip, LinearProgress, Avatar, AvatarGroup, CircularProgress } from "@mui/material";
import { Status, Text, Backgrounds, Brand, getLoadColor } from "../../theme/colors";
import StatusBadge from "../../components/common/StatusBadge";
import { getStatusBadgeVariant } from "../../utils/badgeHelpers";

const glassCard = {
  background: Backgrounds.card,
  borderRadius: "24px",
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
};

const TaskStatusOverview = () => {
  const data = [
    { label: "Completed", value: 45, color: Status.completed.main },
    { label: "In progress", value: 28, color: Status.inProgress.main },
    { label: "At risk", value: 13, color: Status.atRisk.main },
    { label: "Blocked", value: 6, color: Status.blocked.main },
  ];

  return (
    <Box sx={{ ...glassCard, padding: "24px", flex: 1, minWidth: 280 }}>
      <Typography
        sx={{
          fontFamily: "'Aeonik Pro TRIAL'",
          fontWeight: 600,
          fontSize: "18px",
          color: "#1A1A1A",
          mb: 3,
        }}
      >
        Task status overview
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {data.map((item) => (
          <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: item.color,
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                minWidth: "90px",
                fontFamily: "'Aeonik Pro TRIAL'",
                fontSize: "14px",
                fontWeight: 500,
                color: "#1A1A1A",
              }}
            >
              {item.label}
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <LinearProgress
                variant="determinate"
                value={item.value}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  background: "rgba(0,0,0,0.05)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: item.color,
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
            <Typography
              sx={{
                minWidth: "40px",
                textAlign: "right",
                fontFamily: "'Aeonik Pro TRIAL'",
                fontSize: "14px",
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              {item.value}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const UpcomingDeadlines = () => {
  const items = [
    { title: "Datascale AI app", date: "Jun 20, 2023", status: "Delayed" },
    { title: "Media channel branding", date: "Jul 13, 2023", status: "At risk" },
    { title: "Website builder development", date: "Mar 15, 2024", status: "On going" },
  ];

  return (
    <Box sx={{ ...glassCard, padding: "24px", flex: 1, minWidth: 280 }}>
      <Typography
        sx={{
          fontFamily: "'Aeonik Pro TRIAL'",
          fontWeight: 600,
          fontSize: "18px",
          color: "#1A1A1A",
          mb: 3,
        }}
      >
        Upcoming deadlines
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {items.map((item) => (
          <Box
            key={item.title}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 1.5,
              px: 2,
              borderRadius: "12px",
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.02)",
              }
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography sx={{ fontFamily: "'Aeonik Pro TRIAL'", fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>
                {item.title}
              </Typography>
              <Typography sx={{ fontSize: "12px", color: "#666666" }}>{item.date}</Typography>
            </Box>

            <StatusBadge
              label={item.status}
              variant={getStatusBadgeVariant(item.status)}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const TeamWorkload = () => {
  const members = [
    { name: "Alex", load: 90 },
    { name: "Meian", load: 70 },
    { name: "Ken", load: 55 },
    { name: "Sam", load: 40 },
  ];

  return (
    <Box sx={{ ...glassCard, padding: "24px", flex: 1, minWidth: 280 }}>
      <Typography
        sx={{
          fontFamily: "'Aeonik Pro TRIAL'",
          fontWeight: 600,
          fontSize: "18px",
          color: "#1A1A1A",
          mb: 3,
        }}
      >
        Team workload
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {members.map((m) => (
          <Box key={m.name} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: Brand.primary,
                width: 32,
                height: 32,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {m.name.charAt(0)}
            </Avatar>

            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                <Typography
                  sx={{
                    fontFamily: "'Aeonik Pro TRIAL'",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#1A1A1A",
                  }}
                >
                  {m.name}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Aeonik Pro TRIAL'",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#1A1A1A",
                  }}
                >
                  {m.load}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={m.load}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  background: "rgba(0,0,0,0.05)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: getLoadColor(m.load),
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const SecondaryWidgets = () => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        md: "repeat(3, 1fr)"
      },
      gap: "16px",
      width: "100%",
      mt: 3,
    }}
  >
    <TaskStatusOverview />
    <UpcomingDeadlines />
    <TeamWorkload />
  </Box>
);

export default SecondaryWidgets;
