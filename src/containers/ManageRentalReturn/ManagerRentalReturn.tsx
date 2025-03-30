// src/components/manager/ManagerRentalDashboard.tsx
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalculateIcon from "@mui/icons-material/Calculate";
import EventIcon from "@mui/icons-material/Event";
import HistoryIcon from "@mui/icons-material/History";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Box, CardActions, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CardDescription,
  CardIcon,
  CardTitle,
  DashboardContainer,
  SectionContainer,
  SectionHeading,
  StyledDivider,
  StyledCard,
  AnimatedButton,
  StyledPaper,
  StyledContainer,
} from "../../components/StyledComponents";

const ManagerRentalDashboard: React.FC = () => {
  const navigate = useNavigate();
  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <StyledContainer maxWidth="xl">
      <StyledPaper elevation={0}>
        <DashboardContainer>
          <Typography variant="h4" gutterBottom>
            Bảng điều khiển quản lý cho thuê
          </Typography>
          <SectionContainer>
            <SectionHeading variant="h5">Quản lý lấy hàng</SectionHeading>
            <StyledDivider />
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <StyledCard sx={{ height: "100%" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <CardIcon>
                        <AssignmentIcon />
                      </CardIcon>
                      <CardTitle>Lấy hàng chưa phân công</CardTitle>
                    </Box>
                    <CardDescription>
                      Xem và phân công nhân viên cho việc lấy thiết bị cần thu
                      hồi từ khách hàng.
                    </CardDescription>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <AnimatedButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => navigateTo("/unassigned-pickups")}
                    >
                      Quản lý lấy hàng chưa phân công
                    </AnimatedButton>
                  </CardActions>
                </StyledCard>
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <StyledCard sx={{ height: "100%" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <CardIcon>
                        <PersonAddIcon />
                      </CardIcon>
                      <CardTitle>Phân công nhân viên</CardTitle>
                    </Box>
                    <CardDescription>
                      Trực tiếp phân công nhân viên cho nhiệm vụ lấy hàng và
                      cung cấp hướng dẫn cho họ.
                    </CardDescription>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <AnimatedButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => navigateTo("/unassigned-pickups")}
                    >
                      Phân công nhân viên
                    </AnimatedButton>
                  </CardActions>
                </StyledCard>
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <StyledCard sx={{ height: "100%" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <CardIcon>
                        <ListAltIcon />
                      </CardIcon>
                      <CardTitle>Phân công hiện tại</CardTitle>
                    </Box>
                    <CardDescription>
                      Xem tất cả các phân công nhân viên hiện tại và theo dõi
                      tiến độ của họ.
                    </CardDescription>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <AnimatedButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => navigateTo("/current-assignments")}
                    >
                      Xem phân công hiện tại
                    </AnimatedButton>
                  </CardActions>
                </StyledCard>
              </Grid>
            </Grid>
          </SectionContainer>
          <SectionContainer>
            <SectionHeading variant="h5">Lịch sử cho thuê</SectionHeading>
            <StyledDivider />
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <StyledCard sx={{ height: "100%" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <CardIcon>
                        <HistoryIcon />
                      </CardIcon>
                      <CardTitle>Lịch sử cho thuê</CardTitle>
                    </Box>
                    <CardDescription>
                      Tìm kiếm và xem lịch sử cho thuê theo thiết bị, khách hàng
                      hoặc kho lẩu.
                    </CardDescription>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <AnimatedButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => navigateTo("/rental-history")}
                    >
                      Xem lịch sử cho thuê
                    </AnimatedButton>
                  </CardActions>
                </StyledCard>
              </Grid>
            </Grid>
          </SectionContainer>
          <SectionContainer>
            <SectionHeading variant="h5">Công cụ quản lý</SectionHeading>
            <StyledDivider />
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <StyledCard sx={{ height: "100%" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <CardIcon>
                        <CalculateIcon />
                      </CardIcon>
                      <CardTitle>Máy tính phí trễ hạn</CardTitle>
                    </Box>
                    <CardDescription>
                      Tính phí trễ hạn cho các đơn thuê quá hạn dựa trên ngày
                      trả thực tế.
                    </CardDescription>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <AnimatedButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => navigateTo("/calculate-late-fee")}
                    >
                      Tính phí trễ hạn
                    </AnimatedButton>
                  </CardActions>
                </StyledCard>
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <StyledCard sx={{ height: "100%" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <CardIcon>
                        <EventIcon />
                      </CardIcon>
                      <CardTitle>Điều chỉnh ngày trả</CardTitle>
                    </Box>
                    <CardDescription>
                      Điều chỉnh ngày trả chỉ dành cho các trường hợp đặc biệt.
                    </CardDescription>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <AnimatedButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => navigateTo("/adjust-return-date")}
                    >
                      Điều chỉnh ngày trả
                    </AnimatedButton>
                  </CardActions>
                </StyledCard>
              </Grid>
            </Grid>
          </SectionContainer>
        </DashboardContainer>
      </StyledPaper>
    </StyledContainer>
  );
};

export default ManagerRentalDashboard;
