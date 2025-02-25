import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ScheduleIcon from "@mui/icons-material/Schedule";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { alpha, styled } from "@mui/material/styles";
import { PieChart } from "@mui/x-charts/PieChart";
import { useNavigate } from "react-router-dom";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  backgroundColor: theme.palette.background.paper,
  borderRadius: 16,
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `0 12px 24px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
  },
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "10px 24px",
  transition: "all 0.2s ease-in-out",
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const ManageRentals = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Enhanced mock data
  const stats = {
    activeRentals: 10,
    totalEquipment: 50,
    utilization: 75,
    maintenanceItems: 5,
    overdueReturns: 2,
    pendingReturns: 3,
    recentRentals: 8,
    revenue: 12500,
  };

  // Mock data for charts
  const equipmentCategories = [
    { id: 0, value: 25, label: "Cookware" },
    { id: 1, value: 15, label: "Hotpots" },
    { id: 2, value: 10, label: "Utensils" },
  ];

  // Mock recent rentals
  const recentRentals = [
    {
      id: "R-2024-001",
      customer: "John Smith",
      items: 3,
      date: "2024-02-20",
      status: "Active",
    },
    {
      id: "R-2024-002",
      customer: "Emily Johnson",
      items: 2,
      date: "2024-02-19",
      status: "Overdue",
    },
    {
      id: "R-2024-003",
      customer: "Michael Brown",
      items: 1,
      date: "2024-02-18",
      status: "Pending Return",
    },
  ];

  return (
    <DashboardContainer>
      <Box sx={{ maxWidth: "xl", margin: "0 auto" }}>
        {/* Header with key stats */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              mb={4}
              spacing={2}
            >
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  gutterBottom
                >
                  Quản lý cho thuê và thiết bị
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Tổng quan về tình trạng thiết bị và đơn hàng
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Tooltip title="Thông báo">
                  <IconButton
                    color="primary"
                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                  >
                    <Badge badgeContent={stats.overdueReturns} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </Grid>

          {/* Active Rentals Card */}
          <Grid size={{ xs: 12, md: 5 }}>
            <StyledCard>
              <CardContent>
                <Stack spacing={3}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" component="h2" fontWeight="bold">
                      Đồ cho thuê
                    </Typography>
                    <Chip
                      label={`${stats.activeRentals} đang hoạt động`}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: "medium" }}
                    />
                  </Box>

                  <Box>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      mb={1}
                    >
                      <Typography>Thiết bị đang sử dụng</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stats.utilization}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={stats.utilization}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 5,
                          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                        },
                      }}
                    />
                  </Box>

                  {/* Alert for overdue returns */}
                  {stats.overdueReturns > 0 && (
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        borderRadius: 2,
                        border: `1px solid ${alpha(
                          theme.palette.warning.main,
                          0.3
                        )}`,
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <WarningIcon color="warning" />
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {stats.overdueReturns} đơn thuê quá hạn trả
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Cần liên hệ với khách hàng
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          variant="outlined"
                          color="warning"
                          sx={{ ml: "auto" }}
                          onClick={() => navigate("/overdue-rentals")}
                        >
                          Xem chi tiết
                        </Button>
                      </Stack>
                    </Box>
                  )}

                  {/* Recent rentals list */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Đơn thuê gần đây
                    </Typography>
                    {recentRentals.map((rental) => (
                      <Stack
                        key={rental.id}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          py: 1.5,
                          borderBottom: `1px solid ${alpha(
                            theme.palette.divider,
                            0.1
                          )}`,
                        }}
                      >
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {rental.customer}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {rental.id} • {rental.items} items
                          </Typography>
                        </Box>
                        <Chip
                          label={rental.status}
                          size="small"
                          color={
                            rental.status === "Active"
                              ? "primary"
                              : rental.status === "Overdue"
                              ? "error"
                              : "warning"
                          }
                        />
                      </Stack>
                    ))}
                  </Box>

                  <Stack direction="row" spacing={2}>
                    <AnimatedButton
                      variant="contained"
                      onClick={() => navigate("/manage-rental-status")}
                      endIcon={<ArrowForwardIcon />}
                      fullWidth
                    >
                      Quản lý đơn thuê
                    </AnimatedButton>
                  </Stack>
                </Stack>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Equipment Availability Card */}
          <Grid size={{ xs: 12, md: 7 }}>
            <StyledCard>
              <CardContent>
                <Stack spacing={3}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" component="h2" fontWeight="bold">
                      Thiết bị sẵn có
                    </Typography>
                    <AvatarGroup
                      max={3}
                      sx={{
                        "& .MuiAvatar-root": {
                          width: 30,
                          height: 30,
                          fontSize: "0.8rem",
                        },
                      }}
                    >
                      <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                        C
                      </Avatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        H
                      </Avatar>
                      <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                        U
                      </Avatar>
                    </AvatarGroup>
                  </Box>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Box
                      sx={{
                        flex: 1,
                        minHeight: 180,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PieChart
                        series={[
                          {
                            data: equipmentCategories,
                            innerRadius: 50,
                            outerRadius: 80,
                            paddingAngle: 2,
                            cornerRadius: 4,
                            startAngle: -90,
                            endAngle: 270,
                            cx: 100,
                            cy: 100,
                          },
                        ]}
                        width={200}
                        height={180}
                        slotProps={{
                          legend: { hidden: true },
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Phân loại thiết bị
                      </Typography>
                      {equipmentCategories.map((category) => (
                        <Stack
                          key={category.id}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mb: 1 }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                bgcolor:
                                  theme.palette[
                                    category.id === 0
                                      ? "primary"
                                      : category.id === 1
                                      ? "secondary"
                                      : "success"
                                  ].main,
                                mr: 1,
                              }}
                            />
                            <Typography variant="body2">
                              {category.label}
                            </Typography>
                          </Box>
                          <Typography variant="body2" fontWeight="medium">
                            {category.value}
                          </Typography>
                        </Stack>
                      ))}
                    </Box>
                  </Stack>
                  <Divider />
                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography variant="subtitle2">
                        Tình trạng bảo dưỡng
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stats.maintenanceItems} / {stats.totalEquipment} thiết
                        bị
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={
                        (stats.maintenanceItems / stats.totalEquipment) * 100
                      }
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 5,
                          background: `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
                        },
                      }}
                    />
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      mt={1}
                    >
                      <Chip
                        size="small"
                        icon={<CheckCircleIcon fontSize="small" />}
                        label={`${
                          stats.totalEquipment - stats.maintenanceItems
                        } Sẵn sàng`}
                        color="success"
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        icon={<ScheduleIcon fontSize="small" />}
                        label={`${stats.maintenanceItems} Đang bảo dưỡng`}
                        color="warning"
                        variant="outlined"
                      />
                    </Stack>
                  </Box>

                  <AnimatedButton
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/equipment-availability")}
                    endIcon={<ArrowForwardIcon />}
                    fullWidth
                  >
                    Quản lý thiết bị
                  </AnimatedButton>
                </Stack>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </Box>
    </DashboardContainer>
  );
};

export default ManageRentals;
