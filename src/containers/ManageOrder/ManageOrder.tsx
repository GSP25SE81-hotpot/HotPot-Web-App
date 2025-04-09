import React, { useEffect, useState } from "react";
import { Alert, CircularProgress } from "@mui/material";
import {
  orderManagementService,
  OrderCountsDTO,
} from "../../api/Services/orderManagementService";
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

// Default counts to use when API fails
const defaultCounts: OrderCountsDTO = {
  pendingCount: 0,
  processingCount: 0,
  shippedCount: 0,
  deliveredCount: 0,
  cancelledCount: 0,
  returningCount: 0,
  completedCount: 0,
  totalCount: 0,
};

const ManageOrder: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderCounts, setOrderCounts] = useState<OrderCountsDTO>(defaultCounts);

  // Add this effect to log state changes
  useEffect(() => {
    // console.log("orderCounts state updated:", orderCounts);
  }, [orderCounts]);

  useEffect(() => {
    const fetchOrderCounts = async () => {
      try {
        setLoading(true);
        // console.log("Đang tải số lượng đơn hàng...");
        const counts = await orderManagementService.getOrderCounts();
        // console.log("API trả về số lượng:", counts);
        // Create a new object to ensure React detects the state change
        const newCounts: OrderCountsDTO = {
          pendingCount: counts.pendingCount || 0,
          processingCount: counts.processingCount || 0,
          shippedCount: counts.shippedCount || 0,
          deliveredCount: counts.deliveredCount || 0,
          cancelledCount: counts.cancelledCount || 0,
          returningCount: counts.returningCount || 0,
          completedCount: counts.completedCount || 0,
          totalCount: counts.totalCount || 0,
        };
        // console.log("Cập nhật số lượng đơn hàng thành:", newCounts);
        setOrderCounts(newCounts);
        setError(null);
      } catch (err) {
        console.error("Lỗi trong fetchOrderCounts:", err);
        setError("Không thể tải số lượng đơn hàng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderCounts();
  }, []);

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
          {/* Still show the UI with default counts even if there's an error */}
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
