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
  LineChart,
  Line,
} from "recharts";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import {
  AttachMoney,
  MonetizationOn,
  ShoppingCart,
  People,
} from "@mui/icons-material";
import EmptyData from "../../components/EmptyData";
import adminDashboard from "../../api/Services/adminDashboard";
import {
  getColorForStatus,
  translateMonthToVietnamese,
  translateStatusToVietnamese,
} from "../../utils/formatOrder";

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
      const response: any = await adminDashboard.getDashboard();
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
    return <EmptyData title="Chưa có dữ liệu sẵn có" />;
  }

  // Format monthly data for charts
  const monthlyData =
    dashboardData.monthlyData?.filter((month: any) => month.year === year) ||
    [];

  const monthlyDatas = monthlyData.map((month: any) => {
    return {
      ...month,
      monthName: translateMonthToVietnamese(month?.monthName),
    };
  });

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
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

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <ShoppingCart
                sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
              />
              <Typography variant="h6">Tổng số đơn hàng</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {dashboardData.overallMetrics.totalOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <MonetizationOn
                sx={{ fontSize: 40, color: "success.main", mb: 1 }}
              />
              <Typography variant="h6">Tổng doanh thu</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {formatCurrency(dashboardData.overallMetrics.totalRevenue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <People sx={{ fontSize: 40, color: "info.main", mb: 1 }} />
              <Typography variant="h6">Tổng khách hàng</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {dashboardData.overallMetrics.totalCustomers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <AttachMoney
                sx={{ fontSize: 40, color: "warning.main", mb: 1 }}
              />
              <Typography variant="h6">Giá trị đơn trung bình</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {formatCurrency(dashboardData.overallMetrics.averageOrderValue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Biểu đồ doanh thu và đơn hàng theo tháng
        </Typography>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={monthlyDatas}
            margin={{ top: 15, right: 30, left: 30, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="monthName"
              label={{
                value: "Tháng",
                position: "insideBottomRight",
                offset: -20,
              }}
            />
            <YAxis
              yAxisId="left"
              label={{
                value: "Doanh thu (VND)",
                angle: -90,
                position: "insideLeft",
                dx: -30,
              }}
              tickFormatter={(value) =>
                new Intl.NumberFormat("vi-VN").format(value)
              }
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: "Số đơn hàng",
                angle: -90,
                position: "insideRight",
              }}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "revenue")
                  return [formatCurrency(value), "Doanh thu"];
                return [value, "Số đơn hàng"];
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              name="Doanh thu"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orderCount"
              stroke="#82ca9d"
              name="Số đơn hàng"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Order Status Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Trạng thái đơn hàng
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
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
          </Grid>

          <Grid item xs={12} md={7}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Chi tiết trạng thái
            </Typography>

            <Box sx={{ maxHeight: 300, overflow: "auto" }}>
              {orderStatusData.map((status, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
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
                      <Typography>{status.percentage}%</Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Typography variant="body2">
                      Số lượng: {status.value}
                    </Typography>
                    <Typography variant="body2">
                      Doanh thu: {formatCurrency(status.revenue)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Product Categories Section */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Doanh thu theo loại sản phẩm
        </Typography>

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Tổng quan" />
          <Tab label="Nguyên liệu" />
          <Tab label="Combo" />
          <Tab label="Đồ dùng" />
          <Tab label="Nồi lẩu" />
        </Tabs>

        {tabValue === 0 && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={[dashboardData.overallMetrics.revenueByType]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) =>
                  new Intl.NumberFormat("vi-VN").format(value)
                }
              />
              <Tooltip formatter={(value) => formatCurrency(value)} />
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
              margin={{ top: 10, right: 15, left: 40, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="itemName" />
              <YAxis
                tickFormatter={(value) =>
                  new Intl.NumberFormat("vi-VN").format(value)
                }
              />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar
                name="Sản phẩm tiêu thụ nhiều"
                dataKey="quantitySold"
                fill="#8884d8"
              />
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
              margin={{ top: 10, right: 15, left: 40, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="itemName" />
              <YAxis
                tickFormatter={(value) =>
                  new Intl.NumberFormat("vi-VN").format(value)
                }
              />
              <Tooltip formatter={(value) => formatCurrency(value)} />
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
              margin={{ top: 10, right: 15, left: 40, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="itemName" />
              <YAxis
                tickFormatter={(value) =>
                  new Intl.NumberFormat("vi-VN").format(value)
                }
              />
              <Tooltip formatter={(value) => formatCurrency(value)} />
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
              margin={{ top: 10, right: 15, left: 40, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="itemName" />
              <YAxis
                tickFormatter={(value) =>
                  new Intl.NumberFormat("vi-VN").format(value)
                }
              />
              <Tooltip formatter={(value) => formatCurrency(value)} />
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
