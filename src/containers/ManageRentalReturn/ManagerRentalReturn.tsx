// src/components/manager/ManagerRentalDashboard.tsx
import AssignmentIcon from "@mui/icons-material/Assignment";
import ListAltIcon from "@mui/icons-material/ListAlt";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Box, CardActions, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AnimatedButton,
  CardDescription,
  CardIcon,
  CardTitle,
  DashboardContainer,
  SectionContainer,
  StyledCard,
  StyledContainer,
  StyledDivider,
  StyledPaper,
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
            Quản lý thu hồi
          </Typography>

          <SectionContainer>
            <StyledDivider />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                <StyledCard sx={{ height: "100%" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <CardIcon>
                        <AssignmentIcon />
                      </CardIcon>
                      <CardTitle>Phân công thu hồi</CardTitle>
                    </Box>
                    <CardDescription>
                      Xem và phân công nhân viên đến thu hồi thiết bị từ khách
                      hàng.
                    </CardDescription>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <AnimatedButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => navigateTo("/unassigned-pickups")}
                    >
                      Quản lý thu hồi chưa được chỉ định
                    </AnimatedButton>
                  </CardActions>
                </StyledCard>
              </Grid>

              <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                <StyledCard sx={{ height: "100%" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <CardIcon>
                        <ListAltIcon />
                      </CardIcon>
                      <CardTitle>Theo dõi nhiệm vụ</CardTitle>
                    </Box>
                    <CardDescription>
                      Xem tất cả các nhiệm vụ hiện tại của nhân viên và theo dõi
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
                      Xem nhiệm vụ của nhân viên
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
