import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Stack,
  LinearProgress,
  Tooltip,
  Chip,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Grid2 from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";



// Custom palette
const customColors = {
  ivory: "#FFFFF0",
  maroon: "#800000",
  palegoldenrod: "#EEE8AA",
  powderblue: "#B0E0E6",
  black: "#000000",
};

// Styled components
const StyledCard = styled(Card)({
  height: "100%",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  backgroundColor: customColors.ivory,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
  },
  border: `1px solid ${customColors.palegoldenrod}`,
});

const StyledIconButton = styled(IconButton)({
  backgroundColor: customColors.maroon,
  color: customColors.ivory,
  "&:hover": { backgroundColor: customColors.black },
  width: 48,
  height: 48,
});

const ActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.shape.borderRadius,
  textTransform: "none",
  fontWeight: 600,
  backgroundColor: customColors.maroon,
  color: customColors.ivory,
  "&:hover": { backgroundColor: customColors.black },
}));

const DashboardContainer = styled(Box)({
  backgroundColor: customColors.ivory,
  minHeight: "100vh",
  padding: "32px",
});

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
          <Grid2 container spacing={4}>
            {/* Title */}
            <Grid2 size={{xs:12}}>
              <Stack direction="row" justifyContent="space-between" mb={4}>
                <Typography variant="h4" component="h1" sx={{ color: customColors.black }}>
                  Manage Rentals and Equipment
                </Typography>
              </Stack>
            </Grid2>

            {/* Active Rentals */}
            <Grid2 size={{xs:12, md:6}}>
              <StyledCard>
                <CardContent>
                  <Stack spacing={3}>
                    <Box>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{ fontWeight: "bold", color: customColors.black }}
                      >
                        Active Rentals
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography sx={{ color: customColors.maroon }}>
                          {stats.activeRentals} Rentals Currently Active
                        </Typography>
                        {stats.overdueReturns > 0 && (
                          <Tooltip title={`Overdue returns: ${stats.overdueReturns}`}>
                            <WarningIcon sx={{ color: customColors.maroon }} />
                          </Tooltip>
                        )}
                      </Stack>
                    </Box>
                    <Box>
                      <Typography sx={{ mb: 1, color: customColors.black }}>Equipment Utilization</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={stats.utilization}
                        sx={{
                          height: 8,
                          bgcolor: customColors.powderblue,
                          "& .MuiLinearProgress-bar": { bgcolor: customColors.maroon },
                        }}
                      />
                      <Typography sx={{ mt: 1, color: customColors.black }}>
                        {stats.utilization}% of total equipment in use
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={2}>
                      <ActionButton
                        onClick={() => navigate("/manage-rental-status")}
                        endIcon={<ArrowForwardIcon />}
                      >
                        View Details
                      </ActionButton>
                      <Tooltip title="Rental Notifications">
                        <StyledIconButton aria-label="Rental Notifications">
                          <NotificationsIcon />
                        </StyledIconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </CardContent>
              </StyledCard>
            </Grid2>

            {/* Equipment Availability */}
            <Grid2 size={{xs:12, md:6}}>
              <StyledCard>
                <CardContent>
                  <Stack spacing={3}>
                    <Box>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{ fontWeight: "bold", color: customColors.black }}
                      >
                        Equipment Availability
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <Typography sx={{ color: customColors.maroon }}>
                          {stats.maintenanceItems} Items Under Maintenance
                        </Typography>
                        <Chip
                          size="small"
                          icon={<CheckCircleIcon />}
                          label={`${stats.totalEquipment - stats.maintenanceItems} Available`}
                          sx={{
                            bgcolor: customColors.palegoldenrod,
                            color: customColors.black,
                          }}
                        />
                      </Stack>
                      <Box>
                        <Typography sx={{ mb: 1, color: customColors.black }}>
                          Maintenance Progress
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(stats.maintenanceItems / stats.totalEquipment) * 100}
                          sx={{
                            height: 8,
                            bgcolor: customColors.powderblue,
                            "& .MuiLinearProgress-bar": { bgcolor: customColors.maroon },
                          }}
                        />
                      </Box>
                    </Box>
                    <ActionButton
                      onClick={() => navigate("/equipment-availability")}
                      endIcon={<ArrowForwardIcon />}
                    >
                      View Equipment
                    </ActionButton>
                  </Stack>
                </CardContent>
              </StyledCard>
            </Grid2>
          </Grid2>
        </Box>
      </DashboardContainer>
   
  );
};

export default ManageRentals;
