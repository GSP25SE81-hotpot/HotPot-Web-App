// src/pages/OrderHistoryPage.tsx
import React, { useState } from "react";
import { Box, Typography, Collapse, Snackbar, Alert } from "@mui/material";
import OrderHistoryList from "./OrderHistoryList";
import OrderHistoryFilter from "./OrderHistoryFilter";
import OrderHistoryQuickActions from "./OrderHistoryQuickActions";
import { OrderHistoryFilterRequest } from "../../types/orderHistory";
import { StyledContainer } from "../../components/StyledComponents";
import { orderHistoryService } from "../../api/Services/orderHistoryService";
import { exportOrdersToExcel } from "../../utils/excelExport";

const OrderHistory: React.FC = () => {
  const [filter, setFilter] = useState<OrderHistoryFilterRequest>({
    pageNumber: 1,
    pageSize: 10,
  });

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isExporting, setIsExporting] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const handleFilterChange = (newFilter: OrderHistoryFilterRequest) => {
    setFilter({
      ...newFilter,
      pageNumber: 1,
      pageSize: filter.pageSize || 10,
    });
  };

  const handlePageChange = (pageNumber: number) => {
    setFilter((prev) => ({
      ...prev,
      pageNumber,
    }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilter((prev) => ({
      ...prev,
      pageSize,
      pageNumber: 1, // Reset to first page
    }));
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setNotification({
        open: true,
        message: "Đang chuẩn bị xuất dữ liệu...",
        severity: "info",
      });

      // Create a filter for export that gets all records
      const exportFilter: OrderHistoryFilterRequest = {
        ...filter,
        pageNumber: 1,
        pageSize: 1000, // Get a large number of records
      };

      // Fetch all orders for export
      const result = await orderHistoryService.getOrderHistory(exportFilter);

      // Generate filename with date
      const date = new Date().toISOString().split("T")[0];
      const fileName = `lich-su-don-hang-${date}.xlsx`;

      // Export to Excel
      await exportOrdersToExcel(result.items, fileName);

      setNotification({
        open: true,
        message: "Xuất dữ liệu thành công!",
        severity: "success",
      });
    } catch (error) {
      console.error("Lỗi khi xuất dữ liệu:", error);
      setNotification({
        open: true,
        message: "Có lỗi xảy ra khi xuất dữ liệu",
        severity: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <StyledContainer maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 600,
            position: "relative",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: 60,
              height: 4,
              borderRadius: 2,
              backgroundColor: "primary.main",
            },
          }}
        >
          Lịch Sử Đơn Hàng
        </Typography>

        <OrderHistoryQuickActions
          onExport={handleExport}
          onPrint={handlePrint}
          onToggleView={setViewMode}
          currentView={viewMode}
          onToggleFilterPanel={toggleFilterPanel}
          isFilterPanelOpen={isFilterPanelOpen}
          isExporting={isExporting}
        />

        <Collapse in={isFilterPanelOpen}>
          <OrderHistoryFilter onFilterChange={handleFilterChange} />
        </Collapse>

        <Box sx={{ mt: 3 }}>
          <OrderHistoryList
            filter={filter}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            viewMode={viewMode}
          />
        </Box>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default OrderHistory;
