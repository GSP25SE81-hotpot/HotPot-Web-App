/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Divider,
} from "@mui/material";
import React, { useState } from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import HistoryIcon from "@mui/icons-material/History";
import CloseIcon from "@mui/icons-material/Close";

const colors = {
  orange_500: "#ff9800",
  green_200: "#4caf50",
};

interface PriceHistoryItem {
  ingredientPriceId: number;
  price: number;
  effectiveDate: string;
  ingredientID: number;
  ingredientName: string;
}

interface ModalViewPriceProps {
  open: boolean;
  onClose: () => void;
  detailData: any;
}

const ModalViewPrice: React.FC<ModalViewPriceProps> = ({
  open,
  onClose,
  detailData,
}) => {
  const [pricePage, setPricePage] = useState(0);
  const [priceRowsPerPage, setPriceRowsPerPage] = useState(5);

  // Get price trend
  const getPriceTrend = (prices: PriceHistoryItem[]) => {
    if (!prices || prices.length < 2) return null;
    const sortedPrices = [...prices].sort(
      (a, b) =>
        new Date(b.effectiveDate).getTime() -
        new Date(a.effectiveDate).getTime()
    );
    const currentPrice = sortedPrices[0].price;
    const previousPrice = sortedPrices[1].price;
    return currentPrice - previousPrice;
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const priceTrend = detailData?.prices
    ? getPriceTrend(detailData.prices)
    : null;
  const sortedPrices = detailData?.prices
    ? [...detailData.prices].sort(
        (a, b) =>
          new Date(b.effectiveDate).getTime() -
          new Date(a.effectiveDate).getTime()
      )
    : [];

  // Price pagination
  const handleChangePricePage = (_event: unknown, newPage: number) => {
    setPricePage(newPage);
  };

  const handleChangePriceRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPriceRowsPerPage(parseInt(event.target.value, 10));
    setPricePage(0);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount === undefined || amount === null) return "N/A";
    return amount.toLocaleString("vi-VN") + " VND";
  };

  // Get current price for header display
  const currentPrice = sortedPrices.length > 0 ? sortedPrices[0].price : null;

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason === "backdropClick") return;
        onClose();
      }}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Chi tiết giá - {detailData?.name || "N/A"}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Current Price Summary */}
        {currentPrice && (
          <Paper
            elevation={1}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              bgcolor: "primary.50",
              border: "1px solid",
              borderColor: "primary.200",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Giá hiện tại
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {formatCurrency(currentPrice)}
                </Typography>
              </Box>
              {priceTrend !== null && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {priceTrend > 0 ? (
                    <TrendingUpIcon
                      fontSize="large"
                      sx={{ color: colors.orange_500, mr: 1 }}
                    />
                  ) : priceTrend < 0 ? (
                    <TrendingDownIcon
                      fontSize="large"
                      sx={{ color: colors.green_200, mr: 1 }}
                    />
                  ) : null}
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body2" color="text.secondary">
                      So với lần trước
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        color:
                          priceTrend > 0
                            ? colors.orange_500
                            : priceTrend < 0
                            ? colors.green_200
                            : "text.primary",
                      }}
                    >
                      {priceTrend > 0 ? "+" : ""}
                      {formatCurrency(Math.abs(priceTrend))}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        )}

        <Divider sx={{ mb: 3 }} />

        {/* Price History Section */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <HistoryIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              Lịch sử giá ({detailData?.prices?.length || 0})
            </Typography>
          </Box>

          {sortedPrices.length > 0 ? (
            <>
              <TableContainer sx={{ maxHeight: 400, mb: 2 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                          bgcolor: "grey.50",
                        }}
                      >
                        Giá
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                          bgcolor: "grey.50",
                        }}
                      >
                        Ngày áp dụng
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                          bgcolor: "grey.50",
                        }}
                      >
                        Thay đổi
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedPrices
                      .slice(
                        pricePage * priceRowsPerPage,
                        pricePage * priceRowsPerPage + priceRowsPerPage
                      )
                      .map((price: PriceHistoryItem, index) => {
                        const actualIndex =
                          pricePage * priceRowsPerPage + index;
                        const prevPrice = sortedPrices[actualIndex + 1];
                        const priceChange = prevPrice
                          ? price.price - prevPrice.price
                          : 0;

                        return (
                          <TableRow
                            key={`${price.ingredientPriceId}-${price.effectiveDate}`}
                            sx={{
                              "&:hover": { bgcolor: "grey.50" },
                              ...(actualIndex === 0 && {
                                bgcolor: "primary.50",
                              }),
                            }}
                          >
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Typography variant="body2" fontWeight="medium">
                                  {formatCurrency(price.price)}
                                </Typography>
                                {actualIndex === 0 && (
                                  <Chip
                                    label="Hiện tại"
                                    size="small"
                                    color="primary"
                                    sx={{
                                      mt: 0.5,
                                      fontSize: "0.7rem",
                                      height: 20,
                                      width: "fit-content",
                                    }}
                                  />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {formatDateTime(price.effectiveDate)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {priceChange !== 0 ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {priceChange > 0 ? (
                                    <TrendingUpIcon
                                      fontSize="small"
                                      sx={{
                                        color: colors.orange_500,
                                        mr: 0.5,
                                      }}
                                    />
                                  ) : (
                                    <TrendingDownIcon
                                      fontSize="small"
                                      sx={{
                                        color: colors.green_200,
                                        mr: 0.5,
                                      }}
                                    />
                                  )}
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color:
                                        priceChange > 0
                                          ? colors.orange_500
                                          : colors.green_200,
                                      fontWeight: "medium",
                                    }}
                                  >
                                    {priceChange > 0 ? "+" : ""}
                                    {formatCurrency(Math.abs(priceChange))}
                                  </Typography>
                                </Box>
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  -
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={sortedPrices.length}
                rowsPerPage={priceRowsPerPage}
                page={pricePage}
                onPageChange={handleChangePricePage}
                onRowsPerPageChange={handleChangePriceRowsPerPage}
                labelRowsPerPage="Số hàng mỗi trang:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`
                }
                size="small"
              />
            </>
          ) : (
            <Box
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "grey.50",
                borderRadius: 2,
                border: "2px dashed",
                borderColor: "grey.300",
              }}
            >
              <HistoryIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
              <Typography
                variant="h6"
                color="text.secondary"
                fontWeight="medium"
              >
                Không có lịch sử giá
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Chưa có dữ liệu giá nào được ghi nhận cho sản phẩm này
              </Typography>
            </Box>
          )}
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default ModalViewPrice;
