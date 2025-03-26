import React, { useEffect, useState } from "react";
import { Alert, CircularProgress } from "@mui/material";
import {
  OrderStatus,
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
import OrderStatusCard from "./ManageOrderComponents/OrderStatusCard";
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
    console.log("orderCounts state updated:", orderCounts);
  }, [orderCounts]);

  useEffect(() => {
    const fetchOrderCounts = async () => {
      try {
        setLoading(true);
        console.log("Fetching order counts...");

        const counts = await orderManagementService.getOrderCounts();
        console.log("API returned counts:", counts);

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

        console.log("Setting order counts to:", newCounts);
        setOrderCounts(newCounts);
        setError(null);
      } catch (err) {
        console.error("Error in fetchOrderCounts:", err);
        setError("Failed to load order counts. Please try again later.");
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
      <DashboardTitle variant="h4">Order Management</DashboardTitle>
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
          <StatusCardsGrid>
            <OrderStatusCard
              status={OrderStatus.Pending}
              count={orderCounts.pendingCount}
            />
            <OrderStatusCard
              status={OrderStatus.Processing}
              count={orderCounts.processingCount}
            />
            <OrderStatusCard
              status={OrderStatus.Shipping}
              count={orderCounts.shippedCount}
            />
            <OrderStatusCard
              status={OrderStatus.Delivered}
              count={orderCounts.deliveredCount}
            />
            <OrderStatusCard
              status={OrderStatus.Cancelled}
              count={orderCounts.cancelledCount}
            />
            <OrderStatusCard
              status={OrderStatus.Returning}
              count={orderCounts.returningCount}
            />
            <OrderStatusCard
              status={OrderStatus.Completed}
              count={orderCounts.completedCount}
            />
          </StatusCardsGrid>
          <StyledTabsContainer>
            <StyledTabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <StyledTab label="Unallocated Orders" />
              <StyledTab label="Pending Deliveries" />
              <StyledTab label="All Orders" />
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
          <StatusCardsGrid>
            <OrderStatusCard
              status={OrderStatus.Pending}
              count={orderCounts.pendingCount}
            />
            <OrderStatusCard
              status={OrderStatus.Processing}
              count={orderCounts.processingCount}
            />
            <OrderStatusCard
              status={OrderStatus.Shipping}
              count={orderCounts.shippedCount}
            />
            <OrderStatusCard
              status={OrderStatus.Delivered}
              count={orderCounts.deliveredCount}
            />
          </StatusCardsGrid>
          <StyledTabsContainer>
            <StyledTabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <StyledTab label="Unallocated Orders" />
              <StyledTab label="Pending Deliveries" />
              <StyledTab label="All Orders" />
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
