import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[6],
  },
  border: `1px solid ${theme.palette.divider}`,
}));

const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
}));

const ManageRentals = () => {
  const navigate = useNavigate();

  const stats = {
    activeRentals: 10,
    totalEquipment: 50,
    utilization: 75,
    maintenanceItems: 5,
    overdueReturns: 2,
  };

  return (
    <DashboardContainer>
      <Box sx={{ maxWidth: "xl", margin: "0 auto" }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12 }}>
            <Stack direction="row" justifyContent="space-between" mb={4}>
              <Typography variant="h4" component="h1">
                Quản lý cho thuê và thiết bị
              </Typography>
            </Stack>
          </Grid>

          {/* Active Rentals */}
          <Grid size={{ xs: 12, md: 6 }}>
            <StyledCard>
              <CardContent>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" component="h2" fontWeight="bold">
                      Đồ cho thuê
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography color="text.secondary">
                        {stats.activeRentals} đồ cho thuê còn sẵn
                      </Typography>
                      {stats.overdueReturns > 0 && (
                        <Tooltip
                          title={`Overdue returns: ${stats.overdueReturns}`}
                        >
                          <WarningIcon color="warning" />
                        </Tooltip>
                      )}
                    </Stack>
                  </Box>
                  <Box>
                    <Typography mb={1}>Thiết bị sử dụng</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={stats.utilization}
                      sx={{ height: 8 }}
                    />
                    <Typography mt={1}>
                      {stats.utilization}% tổng số thiết bị đang sử dụng
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      onClick={() => navigate("/manage-rental-status")}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Xem chi tiết
                    </Button>
                    <Tooltip title="Rental Notifications">
                      <IconButton color="primary">
                        <NotificationsIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Equipment Availability */}
          <Grid size={{ xs: 12, md: 6 }}>
            <StyledCard>
              <CardContent>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" component="h2" fontWeight="bold">
                      Thiết bị sẵn có
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <Typography color="text.secondary">
                        {stats.maintenanceItems} các món đang bảo dưỡng
                      </Typography>
                      <Chip
                        size="small"
                        icon={<CheckCircleIcon />}
                        label={`${
                          stats.totalEquipment - stats.maintenanceItems
                        } Available`}
                        color="success"
                      />
                    </Stack>
                    <Box>
                      <Typography mb={1}>Quá trình bảo dưỡng</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          (stats.maintenanceItems / stats.totalEquipment) * 100
                        }
                        sx={{ height: 8 }}
                      />
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/equipment-availability")}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Xem Thiết bị
                  </Button>
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
