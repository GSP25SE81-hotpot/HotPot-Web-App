// src/pages/OrderHistoryPage.tsx
import { Box, Collapse, Typography } from "@mui/material";
import React, { useState } from "react";
import { orderHistoryService } from "../../api/Services/orderHistoryService";
import { StyledContainer } from "../../components/StyledComponents";
import { OrderHistoryFilterRequest } from "../../types/orderHistory";
import { exportOrdersToExcel } from "../../utils/excelExport";
import OrderHistoryFilter from "./OrderHistoryFilter";
import OrderHistoryList from "./OrderHistoryList";
import OrderHistoryQuickActions from "./OrderHistoryQuickActions";
import { toast } from "react-toastify";

const OrderHistory: React.FC = () => {
  const [filter, setFilter] = useState<OrderHistoryFilterRequest>({
    pageNumber: 1,
    pageSize: 10,
  });

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isExporting, setIsExporting] = useState(false);

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
      toast.info("Đang chuẩn bị xuất dữ liệu...");

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

      toast.success("Xuất dữ liệu thành công!");
    } catch (error) {
      console.error("Lỗi khi xuất dữ liệu:", error);

      toast.error("Có lỗi xảy ra khi xuất dữ liệu");
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
    </StyledContainer>
  );
};

export default OrderHistory;
