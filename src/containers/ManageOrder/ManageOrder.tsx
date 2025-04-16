import React, { useState } from "react";
import { Alert, CircularProgress } from "@mui/material";

import {
  DashboardTitle,
  DashboardWrapper,
  ErrorContainer,
  LoadingContainer,
  StatusCardsGrid,
  StyledTab,
  StyledTabPanel,
  StyledTabs,
  StyledTabsContainer,
} from "../../components/manager/styles/OrderManagementStyles";
import OrdersByStatusList from "./ManageOrderComponents/OrdersByStatusList";
import PendingDeliveriesList from "./ManageOrderComponents/PendingDeliveriesList";
import UnallocatedOrdersList from "./ManageOrderComponents/UnallocatedOrdersList";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <StyledTabPanel
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </StyledTabPanel>
  );
}

const ManageOrder: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading] = useState(true);
  const [error] = useState<string | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <DashboardWrapper>
      <DashboardTitle variant="h4">Quản lý đơn hàng</DashboardTitle>
      {loading ? (
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      ) : error ? (
        <>
          <ErrorContainer>
            <Alert severity="error">{error}</Alert>
          </ErrorContainer>
          <StyledTabsContainer>
            <StyledTabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <StyledTab label="Đơn hàng đang chờ duyệt" />
              <StyledTab label="Đơn hàng đã duyệt" />
              <StyledTab label="Tất cả đơn hàng" />
            </StyledTabs>
            <TabPanel value={activeTab} index={0}>
              <UnallocatedOrdersList />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <PendingDeliveriesList />
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              <OrdersByStatusList />
            </TabPanel>
          </StyledTabsContainer>
        </>
      ) : (
        <>
          <StatusCardsGrid></StatusCardsGrid>
          <StyledTabsContainer>
            <StyledTabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <StyledTab label="Đơn hàng đang chờ duyệt" />
              <StyledTab label="Đơn hàng đã duyệt" />
              <StyledTab label="Tất cả đơn hàng" />
            </StyledTabs>
            <TabPanel value={activeTab} index={0}>
              <UnallocatedOrdersList />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <PendingDeliveriesList />
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              <OrdersByStatusList />
            </TabPanel>
          </StyledTabsContainer>
        </>
      )}
    </DashboardWrapper>
  );
};

export default ManageOrder;
