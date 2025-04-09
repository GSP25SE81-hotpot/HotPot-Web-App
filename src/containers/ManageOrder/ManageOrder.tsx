// src/pages/OrderManagement/OrderManagementDashboard.tsx
import React, { useState, useEffect } from "react";
import { CircularProgress, Alert } from "@mui/material";
import { OrderStatus } from "../../api/Services/orderManagementService";
import OrderStatusCard from "./ManageOrderComponents/OrderStatusCard";
import UnallocatedOrdersList from "./ManageOrderComponents/UnallocatedOrdersList";
import PendingDeliveriesList from "./ManageOrderComponents/PendingDeliveriesList";
import OrdersByStatusList from "./ManageOrderComponents/OrdersByStatusList";
import { orderManagementService } from "../../api/Services/orderManagementService";
import {
  DashboardWrapper,
  DashboardTitle,
  StatusCardsGrid,
  StyledTabsContainer,
  StyledTabs,
  StyledTab,
  StyledTabPanel,
  LoadingContainer,
  ErrorContainer,
} from "../../components/manager/styles/OrderManagementStyles";

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
  const [orderCounts, setOrderCounts] = useState<Record<OrderStatus, number>>({
    [OrderStatus.Pending]: 0,
    [OrderStatus.Processing]: 0,
    [OrderStatus.Shipping]: 0,
    [OrderStatus.Delivered]: 0,
    [OrderStatus.Cancelled]: 0,
    [OrderStatus.Returning]: 0,
    [OrderStatus.Completed]: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderCounts = async () => {
      try {
        setLoading(true);
        const counts: Record<OrderStatus, number> = {
          [OrderStatus.Pending]: 0,
          [OrderStatus.Processing]: 0,
          [OrderStatus.Shipping]: 0,
          [OrderStatus.Delivered]: 0,
          [OrderStatus.Cancelled]: 0,
          [OrderStatus.Returning]: 0,
          [OrderStatus.Completed]: 0,
        };

        // Fetch counts for each status
        for (const status of Object.values(OrderStatus)) {
          if (typeof status === "number") {
            try {
              const orders = await orderManagementService.getOrdersByStatus(
                status
              );
              // Check if orders is defined and has a length property
              counts[status as OrderStatus] = orders?.length || 0;
            } catch (statusError) {
              console.error(
                `Error fetching orders for status ${status}:`,
                statusError
              );
              // Continue with other statuses even if one fails
            }
          }
        }

        setOrderCounts(counts);
        setError(null);
      } catch (err) {
        console.error("Error fetching order counts:", err);
        setError("Failed to load order statistics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderCounts();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
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
        <ErrorContainer>
          <Alert severity="error">{error}</Alert>
        </ErrorContainer>
      ) : (
        <>
          <StatusCardsGrid>
            <OrderStatusCard
              status={OrderStatus.Pending}
              count={orderCounts[OrderStatus.Pending]}
            />
            <OrderStatusCard
              status={OrderStatus.Processing}
              count={orderCounts[OrderStatus.Processing]}
            />
            <OrderStatusCard
              status={OrderStatus.Shipping}
              count={orderCounts[OrderStatus.Shipping]}
            />
            <OrderStatusCard
              status={OrderStatus.Delivered}
              count={orderCounts[OrderStatus.Delivered]}
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
