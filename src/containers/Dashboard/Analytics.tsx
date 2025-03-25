/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
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
} from "recharts";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { AttachMoney, MonetizationOn, ShoppingCart } from "@mui/icons-material";
import EmptyData from "../../components/EmptyData";

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

const years = [2025, 2024];

const dashboardData = {
  totalOrders: 10234,
  totalProfit: 1500000000, // 1.5 billion VND
  totalRevenue: 5000000000, // 5 billion VND
  monthlyStatistics: [
    {
      month: "Jan",
      totalOrders: 850,
      totalProfit: 120000000,
      totalRevenue: 450000000,
    },
    {
      month: "Feb",
      totalOrders: 760,
      totalProfit: 100000000,
      totalRevenue: 400000000,
    },
    {
      month: "Mar",
      totalOrders: 900,
      totalProfit: 130000000,
      totalRevenue: 470000000,
    },
    {
      month: "Apr",
      totalOrders: 1100,
      totalProfit: 160000000,
      totalRevenue: 500000000,
    },
    {
      month: "May",
      totalOrders: 980,
      totalProfit: 140000000,
      totalRevenue: 460000000,
    },
    {
      month: "Jun",
      totalOrders: 1200,
      totalProfit: 170000000,
      totalRevenue: 520000000,
    },
    {
      month: "Jul",
      totalOrders: 1150,
      totalProfit: 155000000,
      totalRevenue: 490000000,
    },
    {
      month: "Aug",
      totalOrders: 1080,
      totalProfit: 145000000,
      totalRevenue: 480000000,
    },
    {
      month: "Sep",
      totalOrders: 970,
      totalProfit: 135000000,
      totalRevenue: 460000000,
    },
    {
      month: "Oct",
      totalOrders: 1040,
      totalProfit: 150000000,
      totalRevenue: 470000000,
    },
    {
      month: "Nov",
      totalOrders: 920,
      totalProfit: 125000000,
      totalRevenue: 440000000,
    },
    {
      month: "Dec",
      totalOrders: 1100,
      totalProfit: 160000000,
      totalRevenue: 500000000,
    },
  ],
};

const dataPie = [
  { status: "Completed", value: 5000 },
  { status: "Pending", value: 2500 },
  { status: "Canceled", value: 1200 },
  { status: "Refunded", value: 500 },
];

const getColorForStatus = (status: string) => {
  switch (status) {
    case "Completed":
      return "#4caf50";
    case "Pending":
      return "#ff9800";
    case "Canceled":
      return "#f44336";
    case "Refunded":
      return "#9c27b0";
    default:
      return "#ccc";
  }
};

const Analytics: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(event.target.value as number);
  };

  const hasData = dashboardData?.totalOrders > 0;

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <FormControl sx={{ mb: 2, minWidth: 120 }} size="small">
        <InputLabel>Năm</InputLabel>
        <Select label="Năm" value={selectedYear} onChange={handleYearChange}>
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {!hasData ? (
        <EmptyData title="Chưa có dữ liệu sẵn có" />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-evenly", gap: 2 }}>
            {[
              {
                icon: <ShoppingCart />,
                title: "Tổng số đơn hàng",
                value: dashboardData.totalOrders,
              },
              {
                icon: <AttachMoney />,
                title: "Tổng lợi nhuận",
                value: dashboardData.totalProfit,
              },
              {
                icon: <MonetizationOn />,
                title: "Tổng doanh thu",
                value: dashboardData.totalRevenue,
              },
            ].map(({ icon, title, value }, index) => (
              <Card
                key={index}
                sx={{ width: 250, textAlign: "center", padding: 2 }}
              >
                <CardActionArea>
                  <CardContent>
                    {icon}
                    <Typography variant="h6">{title}</Typography>
                    <Typography variant="body1">
                      {new Intl.NumberFormat("vi-VN").format(value)} VND
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>

          <Divider sx={{ width: "100%", my: 2 }} />

          <Box sx={{ display: "flex", gap: 2 }}>
            <BarChart
              width={600}
              height={400}
              data={dashboardData.monthlyStatistics}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalOrders" fill="#4caf50" />
            </BarChart>

            <PieChart width={400} height={400}>
              <Pie
                data={dataPie}
                dataKey="value"
                outerRadius={120}
                label={renderCustomizedLabel}
              >
                {dataPie.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getColorForStatus(entry.status)}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Box>

          <Divider sx={{ width: "100%", my: 2 }} />

          <BarChart
            width={1200}
            height={400}
            data={dashboardData.monthlyStatistics}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={(value) =>
                new Intl.NumberFormat("vi-VN").format(value)
              }
            />
            <Legend />
            <Bar dataKey="totalProfit" fill="#ff9800" />
            <Bar dataKey="totalRevenue" fill="#f44336" />
          </BarChart>
        </Box>
      )}
    </Box>
  );
};

export default Analytics;
