import React, { useState } from "react";
import { Alert } from "@mui/material";
import {
  DashboardTitle,
  DashboardWrapper,
  ErrorContainer,
} from "../../components/manager/styles/OrderManagementStyles";
import OrdersByStatusList from "./ManageOrderComponents/OrdersByStatusList";

const ManageOrder: React.FC = () => {
  const [error] = useState<string | null>(null);

  return (
    <DashboardWrapper>
      <DashboardTitle variant="h4">Quản lý đơn hàng</DashboardTitle>
      {error && (
        <ErrorContainer>
          <Alert severity="error">{error}</Alert>
        </ErrorContainer>
      )}
      <OrdersByStatusList />
    </DashboardWrapper>
  );
};

export default ManageOrder;
