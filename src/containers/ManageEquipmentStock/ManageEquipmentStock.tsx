import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { alpha } from "@mui/material/styles";
import { PieChart } from "@mui/x-charts/PieChart";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import stockService from "../../api/Services/stockService";
import {
  AnimatedButton,
  DashboardContainer,
  StyledCard,
} from "../../components/StyledComponents";
import { EquipmentDashboardResponse } from "../../types/stock";

const ManageEquipmentStock: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // State for equipment dashboard data
  const [dashboardData, setDashboardData] =
    useState<EquipmentDashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await stockService.getEquipmentDashboard();

        if (response.success && response.data) {
          // No need to check length or access [0] - data is the complete dashboard object
          setDashboardData(response.data);
        } else {
          setError(response.message || "Failed to fetch dashboard data");
        }
      } catch (err) {
        setError("Error fetching dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // If no data is available, show a message
  if (!dashboardData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography>No equipment data available</Typography>
      </Box>
    );
  }

  // Calculate equipment utilization percentage
  const utilizationPercentage =
    dashboardData.totalEquipmentCount > 0
      ? Math.round(
          (dashboardData.totalAvailableCount /
            dashboardData.totalEquipmentCount) *
            100
        )
      : 0;

  // Prepare data for pie chart from statusSummary
  const equipmentCategoriesData = dashboardData.statusSummary.map(
    (status, index) => ({
      id: index,
      value: status.totalCount,
      label: status.equipmentType,
    })
  );

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
                  Quản lý thiết bị
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Tổng quan về tình trạng thiết bị
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}></Stack>
            </Stack>
          </Grid>

          {/* Equipment Status Card */}
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
                      Tình trạng thiết bị
                    </Typography>
                    <Chip
                      label={`${dashboardData.totalAvailableCount} sẵn sàng`}
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
                      <Typography>Thiết bị sẵn sàng sử dụng</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {utilizationPercentage}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={utilizationPercentage}
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

                  {/* Alert for low stock items */}
                  {dashboardData.totalLowStockCount > 0 && (
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
                            {dashboardData.totalLowStockCount} thiết bị sắp hết
                            hàng
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Cần bổ sung thêm
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          variant="outlined"
                          color="warning"
                          sx={{ ml: "auto" }}
                          onClick={() => navigate("/low-stock")}
                        >
                          Xem chi tiết
                        </Button>
                      </Stack>
                    </Box>
                  )}

                  {/* Low stock utensils list */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Dụng cụ sắp hết hàng
                    </Typography>
                    {dashboardData.lowStockUtensils.length > 0 ? (
                      dashboardData.lowStockUtensils
                        .slice(0, 3)
                        .map((utensil) => (
                          <Stack
                            key={utensil.utensilId}
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
                                {utensil.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {utensil.utensilTypeName} • Còn{" "}
                                {utensil.quantity}
                              </Typography>
                            </Box>
                            <Chip
                              label={
                                utensil.status ? "Sẵn sàng" : "Không sẵn sàng"
                              }
                              size="small"
                              color={utensil.status ? "success" : "error"}
                            />
                          </Stack>
                        ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Không có dụng cụ nào sắp hết hàng
                      </Typography>
                    )}
                  </Box>
                  <Stack direction="row" spacing={2}>
                    <AnimatedButton
                      variant="contained"
                      onClick={() => navigate("/low-stock-utensil")}
                      endIcon={<ArrowForwardIcon />}
                      fullWidth
                    >
                      Xem dụng cụ sắp hết hàng
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
                      Tình trạng thiết bị
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
                      {dashboardData.statusSummary
                        .slice(0, 3)
                        .map((status, index) => (
                          <Avatar
                            key={index}
                            sx={{
                              bgcolor: [
                                theme.palette.primary.main,
                                theme.palette.secondary.main,
                                theme.palette.success.main,
                              ][index % 3],
                            }}
                          >
                            {status.equipmentType.charAt(0)}
                          </Avatar>
                        ))}
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
                      {equipmentCategoriesData.length > 0 ? (
                        <PieChart
                          series={[
                            {
                              data: equipmentCategoriesData,
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
                      ) : (
                        <Typography>No data available for chart</Typography>
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Phân loại thiết bị
                      </Typography>
                      {dashboardData.statusSummary.map((status, index) => (
                        <Stack
                          key={index}
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
                                bgcolor: [
                                  theme.palette.primary.main,
                                  theme.palette.secondary.main,
                                  theme.palette.success.main,
                                  theme.palette.warning.main,
                                ][index % 4],
                                mr: 1,
                              }}
                            />
                            <Typography variant="body2">
                              {status.equipmentType}
                            </Typography>
                          </Box>
                          <Typography variant="body2" fontWeight="medium">
                            {status.totalCount}
                          </Typography>
                        </Stack>
                      ))}
                    </Box>
                  </Stack>
                  <Divider />

                  {/* Unavailable Equipment Section */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Thiết bị không sẵn sàng
                    </Typography>

                    {/* Unavailable HotPots */}
                    {dashboardData.unavailableHotPots.length > 0 && (
                      <>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1, mb: 0.5 }}
                        >
                          Nồi lẩu không sẵn sàng
                        </Typography>
                        {dashboardData.unavailableHotPots
                          .slice(0, 2)
                          .map((hotpot) => (
                            <Stack
                              key={hotpot.hotPotInventoryId}
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{
                                py: 1,
                                borderBottom: `1px solid ${alpha(
                                  theme.palette.divider,
                                  0.1
                                )}`,
                              }}
                            >
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {hotpot.hotpotName}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  SN: {hotpot.seriesNumber}
                                </Typography>
                              </Box>
                              <Chip
                                label={hotpot.status}
                                size="small"
                                color="error"
                              />
                            </Stack>
                          ))}
                      </>
                    )}

                    {/* Unavailable Utensils */}
                    {dashboardData.unavailableUtensils.length > 0 && (
                      <>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1.5, mb: 0.5 }}
                        >
                          Dụng cụ không sẵn sàng
                        </Typography>
                        {dashboardData.unavailableUtensils
                          .slice(0, 2)
                          .map((utensil) => (
                            <Stack
                              key={utensil.utensilId}
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{
                                py: 1,
                                borderBottom: `1px solid ${alpha(
                                  theme.palette.divider,
                                  0.1
                                )}`,
                              }}
                            >
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {utensil.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {utensil.utensilTypeName} • {utensil.material}
                                </Typography>
                              </Box>
                              <Chip
                                label="Không sẵn sàng"
                                size="small"
                                color="error"
                              />
                            </Stack>
                          ))}
                      </>
                    )}

                    {dashboardData.unavailableHotPots.length === 0 &&
                      dashboardData.unavailableUtensils.length === 0 && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ py: 1 }}
                        >
                          Tất cả thiết bị đều sẵn sàng sử dụng
                        </Typography>
                      )}
                  </Box>

                  {/* Equipment Status Summary */}
                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography variant="subtitle2">
                        Tổng quan tình trạng
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dashboardData.totalUnavailableCount} /{" "}
                        {dashboardData.totalEquipmentCount} thiết bị
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={
                        (dashboardData.totalUnavailableCount /
                          dashboardData.totalEquipmentCount) *
                        100
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
                        label={`${dashboardData.totalAvailableCount} Sẵn sàng`}
                        color="success"
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        icon={<ScheduleIcon fontSize="small" />}
                        label={`${dashboardData.totalUnavailableCount} Không sẵn sàng`}
                        color="warning"
                        variant="outlined"
                      />
                    </Stack>
                  </Box>

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={2}>
                    <AnimatedButton
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate("/equipment-availability")}
                      endIcon={<ArrowForwardIcon />}
                      sx={{ flex: 1 }}
                    >
                      Quản lý dụng cụ
                    </AnimatedButton>
                  </Stack>
                </Stack>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </Box>
    </DashboardContainer>
  );
};

export default ManageEquipmentStock;
