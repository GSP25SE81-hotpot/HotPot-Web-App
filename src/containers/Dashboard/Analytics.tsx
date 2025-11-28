/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import { AttachMoney, MonetizationOn, People } from "@mui/icons-material";
import EmptyData from "../../components/EmptyData";
import adminDashboard from "../../api/Services/adminDashboard";
import {
  getColorForStatus,
  translateMonthToVietnamese,
  translateStatusToVietnamese,
} from "../../utils/formatOrder";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const formatCurrency = (value: any) => {
  return new Intl.NumberFormat("vi-VN").format(value) + " VND";
};

const Analytics: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [year, setYear] = useState<number>(2025);
  const [tabValue, setTabValue] = useState<number>(0);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);

  const handleYearChange = (event: any) => {
    setYear(event.target.value);
  };

  const handleTabChange = (_event: any, newValue: any) => {
    setTabValue(newValue);
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const params = {
        year: year,
      };
      const response: any = await adminDashboard.getDashboard(params);
      setDashboardData(response);

      // Prepare pie chart data
      if (response?.ordersByStatus?.statusDetails) {
        const pieData = Object.entries(response.ordersByStatus.statusDetails)
          .map(([status, data]: any) => ({
            name: translateStatusToVietnamese(status),
            value: data.count,
            percentage: data.percentage,
            revenue: data.revenue,
            status: translateStatusToVietnamese(status),
          }))
          .filter((item) => item.value > 0);

        setOrderStatusData(pieData);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [year]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const hasData = dashboardData?.overallMetrics?.totalOrders > 0;

  if (!hasData) {
    return (
      <>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Thống kê cửa hàng
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Năm</InputLabel>
            <Select value={year} label="Năm" onChange={handleYearChange}>
              <MenuItem value={2024}>2024</MenuItem>
              <MenuItem value={2025}>2025</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <EmptyData title="Chưa có dữ liệu sẵn có" />
      </>
    );
  }

  // Format monthly data for charts
  const monthlyDatas = dashboardData.monthlyData.map((month: any) => {
    return {
      ...month,
      monthName: translateMonthToVietnamese(month?.monthName),
      donHang: month.orderCount,
      doanhThu: month.revenue,
    };
  });

  console.log(monthlyDatas);

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <Typography variant="h4" sx={{ mb: 3, fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}>
        Thống kê cửa hàng
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Năm</InputLabel>
          <Select value={year} label="Năm" onChange={handleYearChange}>
            <MenuItem value={2024}>2024</MenuItem>
            <MenuItem value={2025}>2025</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Overview Cards */}
      <Grid2 container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center", p: { xs: 2, sm: 3 } }}>
              <AutoAwesomeMosaicIcon
                sx={{ fontSize: { xs: 32, sm: 40 }, color: "primary.main", mb: 1 }}
              />
              <Typography variant="h6" sx={{ fontSize: { xs: "0.9rem", sm: "1.25rem" } }}>Tổng số đơn hàng</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: { xs: "1.5rem", sm: "2rem" } }}>
                {dashboardData.overallMetrics.totalOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center", p: { xs: 2, sm: 3 } }}>
              <MonetizationOn
                sx={{ fontSize: { xs: 32, sm: 40 }, color: "success.main", mb: 1 }}
              />
              <Typography variant="h6" sx={{ fontSize: { xs: "0.9rem", sm: "1.25rem" } }}>Tổng doanh thu</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: { xs: "1rem", sm: "1.5rem", md: "2rem" }, wordBreak: "break-word" }}>
                {formatCurrency(dashboardData.overallMetrics.totalRevenue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center", p: { xs: 2, sm: 3 } }}>
              <People sx={{ fontSize: { xs: 32, sm: 40 }, color: "info.main", mb: 1 }} />
              <Typography variant="h6" sx={{ fontSize: { xs: "0.9rem", sm: "1.25rem" } }}>Tổng khách hàng</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: { xs: "1.5rem", sm: "2rem" } }}>
                {dashboardData.overallMetrics.totalCustomers}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center", p: { xs: 2, sm: 3 } }}>
              <AttachMoney
                sx={{ fontSize: { xs: 32, sm: 40 }, color: "warning.main", mb: 1 }}
              />
              <Typography variant="h6" sx={{ fontSize: { xs: "0.9rem", sm: "1.25rem" } }}>Giá trị đơn trung bình</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: { xs: "1rem", sm: "1.5rem", md: "2rem" }, wordBreak: "break-word" }}>
                {formatCurrency(dashboardData.overallMetrics.averageOrderValue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Charts Section */}
      <Paper elevation={3} sx={{ p: { xs: 1, sm: 2, md: 3 }, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }}>
          Biểu đồ doanh thu và đơn hàng theo tháng
        </Typography>

        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <ResponsiveContainer width="100%" height={350} minWidth={500}>
            <ComposedChart
              data={monthlyDatas}
              margin={{ top: 15, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="monthName"
                tick={{ fontSize: 10 }}
              />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 10 }}
              tickFormatter={(value) =>
                new Intl.NumberFormat("vi-VN").format(value)
              }
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 10 }}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Doanh thu")
                  return [formatCurrency(value), "Doanh thu"];
                return [value, "Số đơn hàng"];
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="doanhThu"
              fill="#8884d8"
              name="Doanh thu"
            />
            <Bar
              yAxisId="right"
              dataKey="donHang"
              fill="#82ca9d"
              name="Số đơn hàng"
            />
          </ComposedChart>
        </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Order Status Section */}
      <Paper elevation={3} sx={{ p: { xs: 1, sm: 2, md: 3 }, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }}>
          Trạng thái đơn hàng
        </Typography>

        <Grid2 container spacing={{ xs: 2, sm: 3 }}>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getColorForStatus(entry.status)}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => {
                    if (name === "value")
                      return [`${value} đơn hàng`, props.payload.status];
                    return [value, name];
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 7 }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: "0.9rem", sm: "1.25rem" } }}>
              Chi tiết trạng thái
            </Typography>

            <Box sx={{ maxHeight: 300, overflow: "auto" }}>
              {orderStatusData.map((status, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    p: { xs: 1, sm: 2 },
                    bgcolor: "background.paper",
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                      {status.status}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          bgcolor: getColorForStatus(status.status),
                          mr: 1,
                        }}
                      />
                      <Typography sx={{ fontSize: { xs: "0.75rem", sm: "1rem" } }}>{status.percentage.toFixed(2)}%</Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}>
                      Số lượng: {status.value}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}>
                      Doanh thu: {formatCurrency(status.revenue)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid2>
        </Grid2>
      </Paper>

      {/* Product Categories Section */}
      <Paper elevation={3} sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        <Typography variant="h5" sx={{ mb: 2, fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }}>
          Doanh thu theo loại sản phẩm
        </Typography>

        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          sx={{ mb: 3 }}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="Tổng quan" sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, minWidth: { xs: 60, sm: 90 } }} />
          <Tab label="Nguyên liệu" sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, minWidth: { xs: 60, sm: 90 } }} />
          <Tab label="Combo" sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, minWidth: { xs: 60, sm: 90 } }} />
          <Tab label="Đồ dùng" sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, minWidth: { xs: 60, sm: 90 } }} />
          <Tab label="Nồi lẩu" sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, minWidth: { xs: 60, sm: 90 } }} />
        </Tabs>

        {tabValue === 0 && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={[dashboardData.overallMetrics.revenueByType]}
              margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(1)} Triệu`;
                  } else if (value >= 1000) {
                    return `${(value / 1000).toFixed(1)} Ngàn`;
                  }
                  return new Intl.NumberFormat("vi-VN").format(value);
                }}
                width={70}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value), "Doanh thu"]}
                labelFormatter={() => "Doanh thu theo loại"}
              />
              <Legend />
              <Bar name="Nguyên liệu" dataKey="ingredients" fill="#8884d8" />
              <Bar name="Combo" dataKey="combos" fill="#82ca9d" />
              <Bar name="Tùy chỉnh" dataKey="customizations" fill="#ffc658" />
              <Bar name="Nồi lẩu" dataKey="hotpots" fill="#ff8042" />
              <Bar name="Đồ dùng" dataKey="utensils" fill="#0088fe" />
              <Bar name="Cọc nồi" dataKey="hotpotDeposits" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {tabValue === 1 &&
        dashboardData.productConsumption.topIngredients.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={dashboardData.productConsumption.topIngredients}
              margin={{ top: 10, right: 30, left: 80, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="itemName" />
              <YAxis
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(1)} Triệu`;
                  } else if (value >= 1000) {
                    return `${(value / 1000).toFixed(1)} Ngàn`;
                  }
                  return new Intl.NumberFormat("vi-VN").format(value);
                }}
                width={70}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value), "Doanh thu"]}
              />
              <Legend />
              <Bar name="Số lượng bán" dataKey="quantitySold" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          tabValue === 1 && (
            <Typography sx={{ textAlign: "center", py: 5 }}>
              Không có dữ liệu nguyên liệu
            </Typography>
          )
        )}

        {tabValue === 2 &&
        dashboardData.productConsumption.topCombos.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={dashboardData.productConsumption.topCombos}
              margin={{ top: 10, right: 30, left: 80, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="itemName" />
              <YAxis
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(1)} Triệu`;
                  } else if (value >= 1000) {
                    return `${(value / 1000).toFixed(1)} Ngàn`;
                  }
                  return new Intl.NumberFormat("vi-VN").format(value);
                }}
                width={70}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value), "Doanh thu"]}
              />
              <Legend />
              <Bar name="Doanh thu" dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          tabValue === 2 && (
            <Typography sx={{ textAlign: "center", py: 5 }}>
              Không có dữ liệu combo
            </Typography>
          )
        )}

        {tabValue === 3 &&
        dashboardData.productConsumption.topUtensils.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={dashboardData.productConsumption.topUtensils}
              margin={{ top: 10, right: 30, left: 80, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="itemName" />
              <YAxis
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(1)} Triệu`;
                  } else if (value >= 1000) {
                    return `${(value / 1000).toFixed(1)} Ngàn`;
                  }
                  return new Intl.NumberFormat("vi-VN").format(value);
                }}
                width={70}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value), "Doanh thu"]}
              />
              <Legend />
              <Bar name="Doanh thu" dataKey="revenue" fill="#0088fe" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          tabValue === 3 && (
            <Typography sx={{ textAlign: "center", py: 5 }}>
              Không có dữ liệu đồ dùng
            </Typography>
          )
        )}

        {tabValue === 4 &&
        dashboardData.productConsumption.topHotpots.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={dashboardData.productConsumption.topHotpots}
              margin={{ top: 10, right: 30, left: 80, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="itemName" />
              <YAxis
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(1)} Triệu`;
                  } else if (value >= 1000) {
                    return `${(value / 1000).toFixed(1)} Ngàn`;
                  }
                  return new Intl.NumberFormat("vi-VN").format(value);
                }}
                width={70}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value), "Doanh thu"]}
              />
              <Legend />
              <Bar name="Doanh thu" dataKey="revenue" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          tabValue === 4 && (
            <Typography sx={{ textAlign: "center", py: 5 }}>
              Không có dữ liệu nồi lẩu
            </Typography>
          )
        )}
      </Paper>
    </Box>
  );
};

export default Analytics;
