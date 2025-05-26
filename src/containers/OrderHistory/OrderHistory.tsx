// src/pages/OrderHistoryPage.tsx
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import OrderHistoryList from "./OrderHistoryList";
import OrderHistoryFilter from "./OrderHistoryFilter";
import { OrderHistoryFilterRequest } from "../../types/orderHistory";
import { StyledContainer } from "../../components/StyledComponents";

const OrderHistory: React.FC = () => {
  const [filter, setFilter] = useState<OrderHistoryFilterRequest>({
    pageNumber: 1,
    pageSize: 10,
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
          Lịch sử đơn hàng
        </Typography>

        <OrderHistoryFilter onFilterChange={handleFilterChange} />

        <Box sx={{ mt: 3 }}>
          <OrderHistoryList
            filter={filter}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </Box>
      </Box>
    </StyledContainer>
  );
};

export default OrderHistory;
