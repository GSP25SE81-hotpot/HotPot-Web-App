// src/pages/Staff/CheckDeviceAfterReturn/CheckDeviceAfterReturnPage.tsx
import { Box, Typography } from "@mui/material";
import React from "react";
import MyAssignments from "./MyAssignments/MyAssignments";
import {
  SectionHeading,
  StyledContainer,
  StyledDivider,
} from "../../components/StyledComponents";

export const PickupRental: React.FC = () => {
  return (
    <StyledContainer maxWidth="xl">
      <Box sx={{ mt: 3, mb: 2 }}>
        <SectionHeading variant="h4" component="h1">
          Thu hồi thiết bị
        </SectionHeading>
        <Typography variant="body1" color="text.secondary">
          Quản lý thu hồi, trả thiết bị cho thuê và theo dõi các mục quá hạn
        </Typography>
      </Box>
      <StyledDivider />
      <MyAssignments />
    </StyledContainer>
  );
};

export default PickupRental;
