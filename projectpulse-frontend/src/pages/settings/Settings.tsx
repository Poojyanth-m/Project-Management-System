import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Switch,
  Divider,
  Avatar,
  IconButton,
  InputAdornment,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  PersonOutline,
  NotificationsOutlined,
  SecurityOutlined,
  CloudUpload,
  Save,
  EmailOutlined,
  BadgeOutlined,
  ArrowForward,
  WarningAmber
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import TopBar from '../../components/layout/TopBar';
import DocumentationDrawer from '../../components/common/DocumentationDrawer';
import { RightDrawer } from '../../components/common/RightDrawer';
import StatusBadge from '../../components/common/StatusBadge';
import { Brand, Text } from '../../theme/colors';
import { userService } from '../../services/userService';
import { settingsService, type UserSettings } from '../../services/settingsService';

// Extended Brand properties for Settings page
const BrandExtended = {
  ...Brand,
  text: Text.primary,
  secondaryText: Text.secondary,
  primaryHover: "#BF491F",
  success: "#2E7D32",
  error: "#D32F2F"
};

// --- Styles & Tokens ---
const glassStyle = {
  background: "#F2EAE5",
  borderRadius: "16px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
};

const innerCardStyle = {
  bgcolor: "rgba(255,255,255,0.7)", // Slightly more opaque for better readability
  border: "1px solid rgba(255,255,255,0.5)",
  borderRadius: "16px",
  p: { xs: 3, md: 4 },
  marginBottom: "24px",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    borderColor: "rgba(255,255,255,0.8)"
  }
};

// --- Profile Section ---
const ProfileSection = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    avatar: ""
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await userService.getMe();
        setFormData({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          avatar: user.avatar || ""
        });
      } catch (err) {
        enqueueSnackbar("Failed to load profile", { variant: "error" });
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await userService.updateMe({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      });
      enqueueSnackbar("Profile updated successfully", { variant: "success" });
      window.dispatchEvent(new Event('user-updated'));
    } catch (err) {
      enqueueSnackbar("Failed to update profile", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      enqueueSnackbar("Image must be less than 2MB", { variant: "warning" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setLoading(true);
      try {
        await userService.updateMe({ avatar: base64String });
        setFormData(prev => ({ ...prev, avatar: base64String }));
        enqueueSnackbar("Avatar updated successfully", { variant: "success" });
        window.dispatchEvent(new Event('user-updated'));
      } catch (err) {
        enqueueSnackbar("Failed to upload avatar", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (fetching) return <Box sx={{ p: 8, display: 'flex', justifyContent: 'center' }}><CircularProgress sx={{ color: BrandExtended.primary }} /></Box>;

  return (
    <Box>
      {/* Profile Header Card */}
      <Box sx={{ ...innerCardStyle, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 4 }}>
        <Box sx={{ position: 'relative' }}>
          <input
            type="file"
            hidden
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
          />
          <Avatar
            src={formData.avatar || "/avatars/default-avatar.png"}
            sx={{
              width: 100,
              height: 100,
              bgcolor: BrandExtended.primary,
              fontSize: 40,
              fontWeight: 700,
              boxShadow: '0 12px 24px rgba(230, 95, 43, 0.25)',
              border: '4px solid #fff'
            }}
          >
            {formData.firstName.charAt(0)}
          </Avatar>
          <IconButton
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              bgcolor: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: '1px solid #f0f0f0',
              width: 36,
              height: 36,
              '&:hover': { bgcolor: '#f8f8f8' }
            }}
            size="small"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <CloudUpload sx={{ color: BrandExtended.primary, fontSize: 20 }} />
          </IconButton>
        </Box>
        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography variant="h5" fontWeight="800" color={BrandExtended.text} sx={{ mb: 0.5 }}>
            {formData.firstName} {formData.lastName}
          </Typography>
          <Typography variant="body1" color={BrandExtended.secondaryText} sx={{ mb: 1.5 }}>
            {formData.role} · Project Pulse
          </Typography>
          <StatusBadge label="Active Status" variant="green" />
        </Box>
      </Box>

      {/* Profile Details Form */}
      <Box sx={innerCardStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h6" fontWeight="700" color={BrandExtended.text}>Personal Information</Typography>
            <Typography variant="body2" color={BrandExtended.secondaryText} sx={{ mt: 0.5 }}>
              Update your personal details and contact info.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            InputProps={{
              startAdornment: <InputAdornment position="start"><BadgeOutlined sx={{ color: BrandExtended.secondaryText }} /></InputAdornment>,
            }}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            InputProps={{
              startAdornment: <InputAdornment position="start"><BadgeOutlined sx={{ color: BrandExtended.secondaryText }} /></InputAdornment>,
            }}
          />
          <TextField
            fullWidth
            label="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            InputProps={{
              startAdornment: <InputAdornment position="start"><EmailOutlined sx={{ color: BrandExtended.secondaryText }} /></InputAdornment>,
            }}
          />
          <TextField
            fullWidth
            label="Role"
            value={formData.role}
            disabled
            helperText="Role cannot be changed by user"
          />
        </Box>

        <Divider sx={{ my: 4, opacity: 0.6 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={!loading && <Save />}
            onClick={handleSave}
            disabled={loading}
            sx={{
              bgcolor: BrandExtended.primary,
              textTransform: 'none',
              borderRadius: "12px",
              px: 4,
              py: 1,
              fontSize: "15px",
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(230, 95, 43, 0.3)",
              '&:hover': { bgcolor: BrandExtended.primaryHover, boxShadow: "0 6px 20px rgba(230, 95, 43, 0.4)" }
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
        {loading && <LinearProgress sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, bgcolor: 'rgba(230,95,43,0.1)', '& .MuiLinearProgress-bar': { bgcolor: BrandExtended.primary } }} />}
      </Box>
    </Box>
  );
};

// --- Notification Section ---
const NotificationSection = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
      } catch (err) {
        enqueueSnackbar("Failed to load notifications settings", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = async (key: keyof UserSettings) => {
    if (!settings) return;
    const newVal = !settings[key];

    // Optimistic update
    setSettings({ ...settings, [key]: newVal });

    try {
      await settingsService.updateSettings({ [key]: newVal });
      enqueueSnackbar("Settings updated", { variant: "success", autoHideDuration: 1000 });
    } catch (err) {
      // Rollback
      setSettings(settings);
      enqueueSnackbar("Failed to update settings", { variant: "error" });
    }
  };

  if (loading) return <Box sx={{ p: 8, display: 'flex', justifyContent: 'center' }}><CircularProgress sx={{ color: BrandExtended.primary }} /></Box>;
  if (!settings) return null;

  const notificationItems = [
    { key: 'productUpdates', title: 'Product Updates', desc: 'News about product features and improvements.' },
    { key: 'commentsNotifications', title: 'Comments & Mentions', desc: 'When someone mentions you or comments on your task.' },
    { key: 'assignmentsNotifications', title: 'Task Assignments', desc: 'When you are assigned to a new task or project.' },
    { key: 'weeklyDigest', title: 'Weekly Digest', desc: 'A summary of your weekly activity and upcoming deadlines.' },
    { key: 'marketingEmails', title: 'Marketing Emails', desc: 'Tips, offers, and best practices.' },
  ];

  return (
    <Box>
      <Box sx={innerCardStyle}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="700" color={BrandExtended.text}>Email Preferences</Typography>
          <Typography variant="body2" color={BrandExtended.secondaryText} sx={{ mt: 0.5 }}>
            Choose which emails you'd like to receive from the Project Pulse team.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Item */}
          {notificationItems.map((item, index, arr) => (
            <Box key={item.key}>
              <Box sx={{
                py: 2.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                '&:hover .title': { color: BrandExtended.primary }
              }}>
                <Box sx={{ pr: 2 }}>
                  <Typography className="title" variant="subtitle1" fontWeight="600" color={BrandExtended.text} sx={{ transition: 'color 0.2s' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color={BrandExtended.secondaryText}>{item.desc}</Typography>
                </Box>
                <Switch
                  checked={settings[item.key as keyof UserSettings] as boolean}
                  onChange={() => handleToggle(item.key as keyof UserSettings)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: BrandExtended.primary },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: BrandExtended.primary }
                  }}
                />
              </Box>
              {index < arr.length - 1 && <Divider sx={{ opacity: 0.5 }} />}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// --- Security Section ---
const SecuritySection = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handlePasswordUpdate = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      enqueueSnackbar("Please fill in all fields", { variant: "error" });
      return;
    }
    if (passwords.new !== passwords.confirm) {
      enqueueSnackbar("New passwords do not match", { variant: "error" });
      return;
    }
    setLoading(true);
    try {
      await settingsService.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      setPasswords({ current: '', new: '', confirm: '' });
      enqueueSnackbar("Password successfully updated", { variant: "success" });
    } catch (err: any) {
      enqueueSnackbar(err.response?.data?.message || "Failed to update password", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteOpen(false);
    try {
      await settingsService.deleteAccount();
      enqueueSnackbar("Account deleted successfully. Logging out...", { variant: "warning" });
      // Redirect or logout after a delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      enqueueSnackbar("Failed to delete account", { variant: "error" });
    }
  };

  return (
    <Box>
      <Box sx={innerCardStyle}>
        <Typography variant="h6" fontWeight="700" color={BrandExtended.text} mb={3}>Security Settings</Typography>

        <Box sx={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            type="password"
            label="Current Password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
          />
          <TextField
            fullWidth
            type="password"
            label="New Password"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            helperText="Minimum 8 characters, at least 1 number"
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm New Password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            error={passwords.new !== passwords.confirm && passwords.confirm !== ''}
            helperText={passwords.new !== passwords.confirm && passwords.confirm !== '' ? "Passwords do not match" : ""}
          />
        </Box>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            onClick={handlePasswordUpdate}
            disabled={loading}
            sx={{
              bgcolor: BrandExtended.primary,
              textTransform: 'none',
              borderRadius: "12px",
              px: 3,
              py: 1,
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(230, 95, 43, 0.3)",
              '&:hover': { bgcolor: BrandExtended.primaryHover }
            }}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </Box>
      </Box>

      <Box sx={{
        ...innerCardStyle,
        bgcolor: 'rgba(254, 242, 242, 0.7)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        '&:hover': {
          borderColor: 'rgba(239, 68, 68, 0.6)',
          boxShadow: '0 8px 24px rgba(220, 38, 38, 0.1)'
        }
      }}>
        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
          <Box sx={{
            p: 1.5,
            borderRadius: "12px",
            bgcolor: "rgba(220, 38, 38, 0.1)",
            color: BrandExtended.error,
            display: "flex"
          }}>
            <WarningAmber />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="700" color={BrandExtended.error}>Delete Account</Typography>
            <Typography variant="body2" color="#7F1D1D" sx={{ mb: 2, mt: 0.5, maxWidth: '500px' }}>
              Permanently delete your account and all of your content. This action is irreversible and cannot be undone.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteOpen(true)}
              endIcon={<ArrowForward />}
              sx={{
                textTransform: 'none',
                borderRadius: "10px",
                borderWidth: "2px",
                fontWeight: 700,
                borderColor: 'rgba(239, 68, 68, 0.5)',
                color: '#d32f2f',
                '&:hover': {
                  borderWidth: "2px",
                  bgcolor: "rgba(239, 68, 68, 0.05)",
                  borderColor: '#d32f2f', // Enforce red border
                  color: '#d32f2f'        // Enforce red text
                },
                '&:focus': {
                  outline: 'none',
                  borderColor: '#d32f2f'
                }
              }}
            >
              Delete Personal Account
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Delete Confirmation Drawer */}
      {/* Delete Confirmation Drawer */}
      <RightDrawer
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Confirm Deletion"
        header={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: BrandExtended.error }}>
            <WarningAmber sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight={700}>Confirm Deletion</Typography>
          </Box>
        }
        actions={
          <>
            <Button
              variant="outlined"
              onClick={() => setDeleteOpen(false)}
              sx={{ borderRadius: "8px", textTransform: 'none', fontWeight: 600, color: BrandExtended.primary, borderColor: BrandExtended.primary }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteAccount}
              sx={{ borderRadius: "8px", textTransform: 'none', fontWeight: 600 }}
            >
              Delete Forever
            </Button>
          </>
        }
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Are you sure you want to delete your account?
            </Typography>
            <Box sx={{ p: 2, bgcolor: '#FEF2F2', borderRadius: '12px', border: '1px solid #FECACA' }}>
              <Typography variant="body2" color="#991B1B" fontWeight={500}>
                This action is <b>permanent</b> and cannot be undone. All your data will be wiped immediately.
              </Typography>
            </Box>
          </Box>
        </Box>
      </RightDrawer>
    </Box>
  );
};



// --- Main Settings Component ---
const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [docOpen, setDocOpen] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const tabs = [
    { label: 'Profile', icon: <PersonOutline /> },
    { label: 'Notifications', icon: <NotificationsOutlined /> },
    { label: 'Security', icon: <SecurityOutlined /> },
  ];

  return (
    <Box sx={{ pb: 6 }}>
      <TopBar title="Settings" />

      <Box sx={{ maxWidth: '1600px', mx: 'auto', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mt: 0 }}>
          {/* Sidebar Tabs */}
          <Box sx={{
            ...glassStyle,
            width: { xs: '100%', md: '280px' },
            p: 2,
            bgcolor: '#F2EAE5',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography variant="overline" color={BrandExtended.secondaryText} sx={{ px: 2, mb: 2, display: 'block', fontWeight: 700, letterSpacing: '1px' }}>
              ACCOUNT
            </Typography>
            <Tabs
              orientation="vertical"
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTab-root': {
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '15px',
                  minHeight: '52px',
                  mb: 1,
                  borderRadius: '12px',
                  color: BrandExtended.secondaryText,
                  opacity: 0.9,
                  flexDirection: 'row',
                  gap: 2,
                  px: 2.5,
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    color: BrandExtended.primary,
                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    opacity: 1
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    color: BrandExtended.text
                  }
                }
              }}
            >
              {tabs.map((tab) => (
                <Tab key={tab.label} label={tab.label} icon={tab.icon} />
              ))}
            </Tabs>

            <Box sx={{ mt: 'auto', px: 2, pt: 4 }}>
              <Box sx={{ bgcolor: 'rgba(230, 95, 43, 0.08)', borderRadius: '16px', p: 3, textAlign: 'center' }}>
                <Box component="img" src="https://cdni.iconscout.com/illustration/premium/thumb/web-development-2974925-2477356.png" sx={{ width: '80%', mb: 2, opacity: 0.8 }} />
                <Typography variant="caption" display="block" color={BrandExtended.secondaryText} sx={{ mb: 1 }}>
                  Need help? Check our docs.
                </Typography>
                <Button
                  size="small"
                  onClick={() => setDocOpen(true)}
                  sx={{
                    color: BrandExtended.primary,
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': { bgcolor: 'rgba(230, 95, 43, 0.1)' }
                  }}
                >
                  Documentation
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Content Area */}
          <Box sx={{
            ...glassStyle,
            flex: 1,
            p: { xs: 2, md: 0 }, // Padding handling managed by inner components sometimes
            bgcolor: 'transparent', // Content area usually transparent in this grid, inner cards handle background
            boxShadow: 'none', // Remove main shadow, let cards float
          }}>
            <Box sx={{ width: '100%' }}>
              {activeTab === 0 && <ProfileSection />}
              {activeTab === 1 && <NotificationSection />}
              {activeTab === 2 && <SecuritySection />}
            </Box>
          </Box>
        </Box>
      </Box>
      <DocumentationDrawer open={docOpen} onClose={() => setDocOpen(false)} />
    </Box>
  );
};

export default Settings;
