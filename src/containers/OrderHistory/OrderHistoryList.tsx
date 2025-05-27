/* eslint-disable react-hooks/exhaustive-deps */
// src/components/OrderHistory/OrderHistoryList.tsx
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FeedbackIcon from "@mui/icons-material/Feedback";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect, useState } from "react";
import { orderHistoryService } from "../../api/Services/orderHistoryService";
import { StyledChip, StyledTable } from "../../components/StyledComponents";
import {
  OrderHistoryDto,
  OrderHistoryFilterRequest,
  PagedResult,
} from "../../types/orderHistory";
import {
  translateItemType,
  translateOrderStatus,
} from "../../utils/formatOrder";
import { formatCurrency, formatDate } from "../../utils/formatters";
import {
  CustomerNameTypography,
  EmptyStateIcon,
  EmptyStateMessage,
  EmptyStatePaper,
  EmptyStateTitle,
  FeatureChip,
  FeeTypography,
  OrderCode,
  OrderDateContainer,
  OrderDetailLabel,
  OrderDetailValue,
  OrderHistoryAccordion,
  OrderHistoryAccordionDetails,
  OrderHistoryAccordionSummary,
  OrderHistoryContainer,
  OrderHistoryPagination,
  OrderItemName,
  OrderItemsTableContainer,
  OrderItemType,
  OrderPrice,
  OrderStatusContainer,
  RentalDateLabel,
  RentalDateValue,
  RentalInfoContainer,
  RentalItemContainer,
} from "./OrderHistoryStyled";

interface OrderHistoryListProps {
  filter: OrderHistoryFilterRequest;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void; // Add this new prop
  viewMode?: "list" | "grid"; // Add this new prop with optional marker
}

const OrderHistoryList: React.FC<OrderHistoryListProps> = ({
  filter,
  onPageChange,
  onPageSizeChange, // Add this new prop
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [orderHistory, setOrderHistory] =
    useState<PagedResult<OrderHistoryDto> | null>(null);
  const [expandedPanel, setExpandedPanel] = useState<number | false>(false);

  useEffect(() => {
    fetchOrderHistory();
  }, [filter]);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      const result = await orderHistoryService.getOrderHistory(filter);
      setOrderHistory(result);
    } catch (error) {
      console.error("Không thể tải lịch sử đơn hàng:", error);
      // Xử lý lỗi (hiển thị thông báo, v.v.)
    } finally {
      setLoading(false);
    }
  };

  const handleAccordionChange =
    (orderId: number) =>
    (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedPanel(isExpanded ? orderId : false);
    };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!orderHistory || orderHistory.items.length === 0) {
    return (
      <EmptyStatePaper>
        <EmptyStateIcon>
          <i className="fas fa-receipt"></i>
        </EmptyStateIcon>
        <EmptyStateTitle>Không tìm thấy đơn hàng</EmptyStateTitle>
        <EmptyStateMessage>
          Hãy điều chỉnh bộ lọc hoặc kiểm tra lại sau
        </EmptyStateMessage>
      </EmptyStatePaper>
    );
  }

  return (
    <OrderHistoryContainer>
      {orderHistory.items.map((order) => (
        <OrderHistoryAccordion
          key={order.orderId}
          expanded={expandedPanel === order.orderId}
          onChange={handleAccordionChange(order.orderId)}
        >
          <OrderHistoryAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid
              container
              alignItems="center"
              spacing={3}
              sx={{
                width: "100%",
                px: 2,
              }}
            >
              <Grid size={{ xs: 12, sm: 3 }}>
                <Box>
                  <OrderCode>{order.orderCode}</OrderCode>
                  <CustomerNameTypography>
                    {order.customerName || "Không có tên khách hàng"}
                  </CustomerNameTypography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <OrderStatusContainer>
                  <StyledChip
                    label={translateOrderStatus(order.status)}
                    status={order.status.toString()}
                    size="small"
                  />
                </OrderStatusContainer>
              </Grid>
              <Grid size={{ xs: 6, sm: 2 }}>
                <OrderPrice>{formatCurrency(order.totalPrice)}</OrderPrice>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <OrderDateContainer>
                  <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {formatDate(order.createdAt.toString())}
                </OrderDateContainer>
              </Grid>
            </Grid>
          </OrderHistoryAccordionSummary>
          <OrderHistoryAccordionDetails>
            <Grid container spacing={5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  gutterBottom
                  sx={{
                    fontSize: "1.25rem",
                    mb: 3,
                    position: "relative",
                    paddingBottom: 1.5,
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: 40,
                      height: 3,
                      backgroundColor: "primary.main",
                      opacity: 0.7,
                      borderRadius: 1.5,
                    },
                  }}
                >
                  Chi Tiết Đơn Hàng
                </Typography>
                <Box sx={{ mt: 3, mb: 2 }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 6 }}>
                      <OrderDetailLabel sx={{ mb: 1 }}>
                        Địa chỉ:
                      </OrderDetailLabel>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <OrderDetailValue sx={{ mb: 1 }}>
                        {order.address}
                      </OrderDetailValue>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <OrderDetailLabel sx={{ mb: 1 }}>
                        Ghi chú:
                      </OrderDetailLabel>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <OrderDetailValue sx={{ mb: 1 }}>
                        {order.notes || "Không có ghi chú"}
                      </OrderDetailValue>
                    </Grid>
                    {order.hotpotDeposit && (
                      <>
                        <Grid size={{ xs: 6 }}>
                          <OrderDetailLabel sx={{ mb: 1 }}>
                            Đặt cọc lẩu:
                          </OrderDetailLabel>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <OrderDetailValue
                            sx={{
                              mb: 1,
                              fontWeight: 600,
                              color: "primary.main",
                            }}
                          >
                            {formatCurrency(order.hotpotDeposit)}
                          </OrderDetailValue>
                        </Grid>
                      </>
                    )}
                    <Grid size={{ xs: 6 }}>
                      <OrderDetailLabel sx={{ mb: 1 }}>
                        Cập nhật lần cuối:
                      </OrderDetailLabel>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <OrderDetailValue sx={{ mb: 1 }}>
                        {order.updatedAt
                          ? formatDate(order.updatedAt.toString())
                          : "Chưa cập nhật"}
                      </OrderDetailValue>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                        {order.hasShipping && (
                          <FeatureChip
                            icon={<LocalShippingIcon />}
                            label="Đã giao hàng"
                            size="small"
                            sx={{
                              px: 2,
                              py: 2.5,
                              height: "auto",
                              "& .MuiChip-label": {
                                px: 1,
                                fontSize: "0.8rem",
                              },
                              "& .MuiChip-icon": {
                                fontSize: "1.2rem",
                              },
                            }}
                          />
                        )}
                        {order.hasFeedback && (
                          <FeatureChip
                            icon={<FeedbackIcon />}
                            label="Có phản hồi"
                            size="small"
                            color="success"
                            sx={{
                              px: 2,
                              py: 2.5,
                              height: "auto",
                              "& .MuiChip-label": {
                                px: 1,
                                fontSize: "0.8rem",
                              },
                              "& .MuiChip-icon": {
                                fontSize: "1.2rem",
                              },
                            }}
                          />
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  gutterBottom
                  sx={{
                    fontSize: "1.25rem",
                    mb: 3,
                    position: "relative",
                    paddingBottom: 1.5,
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: 40,
                      height: 3,
                      backgroundColor: "primary.main",
                      opacity: 0.7,
                      borderRadius: 1.5,
                    },
                  }}
                >
                  Các Mặt Hàng
                </Typography>
                <OrderItemsTableContainer sx={{ mb: 4 }}>
                  <StyledTable size="small" sx={{ "& th, & td": { p: 2 } }}>
                    <thead>
                      <tr>
                        <th>Mặt hàng</th>
                        <th>Loại</th>
                        <th>SL</th>
                        <th>Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.orderDetailId}>
                          <td>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                py: 0.5,
                              }}
                            >
                              <OrderItemName sx={{ mb: 0.5 }}>
                                {item.itemName}
                              </OrderItemName>
                              {item.isRental && (
                                <OrderItemType>Cho thuê</OrderItemType>
                              )}
                            </Box>
                          </td>
                          <td>{translateItemType(item.itemType)}</td>
                          <td>{item.quantity}</td>
                          <td>{formatCurrency(item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </StyledTable>
                </OrderItemsTableContainer>
                {order.items.some((item) => item.isRental) && (
                  <RentalInfoContainer sx={{ p: 3 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      sx={{
                        fontSize: "1rem",
                        mb: 2,
                      }}
                    >
                      Thông Tin Cho Thuê
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    {order.items
                      .filter((item) => item.isRental)
                      .map((rentalItem) => (
                        <RentalItemContainer
                          key={`rental-${rentalItem.orderDetailId}`}
                          sx={{ p: 3, mb: 3 }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{ mb: 2, fontSize: "0.95rem" }}
                          >
                            {rentalItem.itemName}
                          </Typography>
                          <Grid container spacing={3}>
                            {rentalItem.rentalStartDate && (
                              <Grid size={{ xs: 6 }}>
                                <RentalDateLabel sx={{ mb: 0.75 }}>
                                  Ngày bắt đầu:
                                </RentalDateLabel>
                                <RentalDateValue sx={{ mb: 2 }}>
                                  {formatDate(
                                    rentalItem.rentalStartDate.toString()
                                  )}
                                </RentalDateValue>
                              </Grid>
                            )}
                            {rentalItem.expectedReturnDate && (
                              <Grid size={{ xs: 6 }}>
                                <RentalDateLabel sx={{ mb: 0.75 }}>
                                  Ngày trả dự kiến:
                                </RentalDateLabel>
                                <RentalDateValue sx={{ mb: 2 }}>
                                  {formatDate(
                                    rentalItem.expectedReturnDate.toString()
                                  )}
                                </RentalDateValue>
                              </Grid>
                            )}
                            {rentalItem.actualReturnDate && (
                              <Grid size={{ xs: 6 }}>
                                <RentalDateLabel sx={{ mb: 0.75 }}>
                                  Ngày trả thực tế:
                                </RentalDateLabel>
                                <RentalDateValue sx={{ mb: 2 }}>
                                  {formatDate(
                                    rentalItem.actualReturnDate.toString()
                                  )}
                                </RentalDateValue>
                              </Grid>
                            )}
                            {rentalItem.lateFee !== undefined &&
                              rentalItem.lateFee > 0 && (
                                <Grid size={{ xs: 6 }}>
                                  <RentalDateLabel sx={{ mb: 0.75 }}>
                                    Phí trễ hạn:
                                  </RentalDateLabel>
                                  <FeeTypography sx={{ mb: 2 }}>
                                    {formatCurrency(rentalItem.lateFee)}
                                  </FeeTypography>
                                </Grid>
                              )}
                            {rentalItem.damageFee !== undefined &&
                              rentalItem.damageFee > 0 && (
                                <Grid size={{ xs: 6 }}>
                                  <RentalDateLabel sx={{ mb: 0.75 }}>
                                    Phí hư hỏng:
                                  </RentalDateLabel>
                                  <FeeTypography sx={{ mb: 2 }}>
                                    {formatCurrency(rentalItem.damageFee)}
                                  </FeeTypography>
                                </Grid>
                              )}
                            {rentalItem.rentalNotes && (
                              <Grid size={{ xs: 12 }}>
                                <RentalDateLabel sx={{ mb: 0.75 }}>
                                  Ghi chú:
                                </RentalDateLabel>
                                <RentalDateValue sx={{ mb: 1 }}>
                                  {rentalItem.rentalNotes}
                                </RentalDateValue>
                              </Grid>
                            )}
                          </Grid>
                        </RentalItemContainer>
                      ))}
                  </RentalInfoContainer>
                )}
              </Grid>
            </Grid>
          </OrderHistoryAccordionDetails>
        </OrderHistoryAccordion>
      ))}
      <OrderHistoryPagination
        component="div"
        count={orderHistory.totalCount}
        page={orderHistory.pageNumber - 1}
        onPageChange={(_, page) => onPageChange(page + 1)}
        rowsPerPage={orderHistory.pageSize}
        rowsPerPageOptions={[10, 25, 50]}
        onRowsPerPageChange={(event) => {
          const newPageSize = parseInt(event.target.value, 10);
          onPageSizeChange(newPageSize); // Use the new prop
        }}
        labelRowsPerPage="Số dòng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
        }
        getItemAriaLabel={(type) => {
          if (type === "first") return "Đến trang đầu tiên";
          if (type === "last") return "Đến trang cuối cùng";
          if (type === "next") return "Đến trang tiếp theo";
          return "Quay lại trang trước";
        }}
      />
    </OrderHistoryContainer>
  );
};

export default OrderHistoryList;
