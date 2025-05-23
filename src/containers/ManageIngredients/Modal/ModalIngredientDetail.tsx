/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Paper,
  Divider,
  Grid2,
  Chip,
  Skeleton,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Tooltip,
  TablePagination,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import React, { ReactNode, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import InventoryIcon from "@mui/icons-material/Inventory";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import UpdateIcon from "@mui/icons-material/Update";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ArchiveIcon from "@mui/icons-material/Archive";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import HistoryIcon from "@mui/icons-material/History";
import BusinessIcon from "@mui/icons-material/Business";
import { colors } from "../../../styles/Color/color";
import adminIngredientsAPI from "../../../api/Services/adminIngredientsAPI";

interface DetailPopupIngredientProps {
  handleOpen: boolean;
  handleClose: () => void;
  dataIngredient: any;
}

interface DetailItemProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  fullWidth?: boolean;
}

interface BatchItem {
  ingredientBatchId: number;
  ingredientId: number;
  ingredientName: string;
  initialQuantity: number;
  remainingQuantity: number;
  unit: string;
  measurementValue: number;
  physicalQuantity: number;
  formattedQuantity: string;
  bestBeforeDate: string;
  batchNumber: string;
  receivedDate: string;
  daysUntilExpiration: number;
  isExpired: boolean;
  provideCompany?: string;
}

interface PriceHistoryItem {
  ingredientPriceId: number;
  price: number;
  effectiveDate: string;
  ingredientID: number;
  ingredientName: string;
}

const DetailPopupIngredient: React.FC<DetailPopupIngredientProps> = ({
  handleOpen,
  handleClose,
  dataIngredient,
}) => {
  // State
  const [detailData, setDetailData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [batchPage, setBatchPage] = React.useState(0);
  const [batchRowsPerPage, setBatchRowsPerPage] = React.useState(5);
  const [pricePage, setPricePage] = React.useState(0);
  const [priceRowsPerPage, setPriceRowsPerPage] = React.useState(5);

  // Batch pagination
  const handleChangeBatchPage = (event: unknown, newPage: number) => {
    setBatchPage(newPage);
  };

  const handleChangeBatchRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBatchRowsPerPage(parseInt(event.target.value, 10));
    setBatchPage(0);
  };

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

  // Call API
  const getIngredientDetail = async () => {
    setLoading(true);
    try {
      const res: any = await adminIngredientsAPI.getListIngredientsDetail(
        dataIngredient?.ingredientId
      );
      const mergedData = {
        ...res?.data,
        batches: res?.data?.batches || dataIngredient?.batches || [],
        prices: res?.data?.prices || dataIngredient?.prices || [],
      };
      setDetailData(mergedData);
    } catch (error) {
      console.error("Error fetching ingredient details:", error);
      setDetailData(dataIngredient);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (handleOpen && dataIngredient?.ingredientId) {
      getIngredientDetail();
    }
  }, [handleOpen, dataIngredient]);

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount === undefined || amount === null) return "N/A";
    return amount.toLocaleString("vi-VN") + " VND";
  };

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

  // Get expiration status color
  const getExpirationColor = (days: number, isExpired: boolean) => {
    if (isExpired) return colors.orange_500;
    if (days <= 3) return colors.orange_500;
    if (days <= 7) return colors.orange_300;
    return colors.green_200;
  };

  // Get expiration status text
  const getExpirationStatus = (days: number, isExpired: boolean) => {
    if (isExpired) return "Đã hết hạn";
    if (days === 0) return "Hết hạn hôm nay";
    if (days === 1) return "Còn 1 ngày";
    return `Còn ${days} ngày`;
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

  return (
    <Dialog
      open={handleOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="xl"
      TransitionComponent={Fade}
      transitionDuration={300}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: colors.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" color={colors.white} fontWeight="bold">
          Chi tiết nguyên liệu
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: colors.white,
            bgcolor: "rgba(255,255,255,0.1)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <Fade in={!loading} timeout={500}>
            <Box>
              {/* Basic Information Section */}
              <Grid2 container spacing={3}>
                {/* Left side - Image and Status */}
                <Grid2 size={{ mobile: 12, desktop: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        mb: 2,
                        position: "relative",
                        overflow: "hidden",
                        width: "100%",
                        maxWidth: 250,
                        height: 250,
                      }}
                    >
                      {detailData?.imageURL ? (
                        <img
                          src={detailData.imageURL}
                          alt={detailData?.name || "Ingredient"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            bgcolor: "rgba(0,0,0,0.1)",
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <InventoryIcon
                            sx={{ fontSize: 64, color: "rgba(0,0,0,0.2)" }}
                          />
                        </Box>
                      )}
                    </Paper>

                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      gutterBottom
                      textAlign="center"
                    >
                      {detailData?.name || "N/A"}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip
                        icon={
                          detailData?.isLowStock ? (
                            <WarningAmberIcon />
                          ) : (
                            <CheckCircleIcon />
                          )
                        }
                        label={
                          detailData?.isLowStock
                            ? "Hàng tồn kho thấp"
                            : "Đủ hàng"
                        }
                        sx={{
                          color: detailData?.isLowStock
                            ? colors.orange_500
                            : colors.green_200,
                          borderColor: detailData?.isLowStock
                            ? colors.orange_500
                            : colors.green_200,
                          fontWeight: "medium",
                        }}
                        variant="outlined"
                      />

                      {priceTrend !== null && (
                        <Chip
                          icon={
                            priceTrend > 0 ? (
                              <TrendingUpIcon />
                            ) : (
                              <TrendingDownIcon />
                            )
                          }
                          label={priceTrend > 0 ? "Tăng giá" : "Giảm giá"}
                          sx={{
                            color:
                              priceTrend > 0
                                ? colors.orange_500
                                : colors.green_200,
                            borderColor:
                              priceTrend > 0
                                ? colors.orange_500
                                : colors.green_200,
                            fontWeight: "medium",
                          }}
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </Stack>

                    {/* Stock Level Indicator */}
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        width: "100%",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Mức tồn kho hiện tại
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ mr: 1 }}
                        >
                          {detailData?.formattedQuantity ||
                            `${detailData?.quantity || 0} ${
                              detailData?.unit || "đơn vị"
                            }`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          / {detailData?.minStockLevel || 0}{" "}
                          {detailData?.unit || "đơn vị"} (tối thiểu)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(
                          (detailData?.quantity /
                            Math.max(detailData?.minStockLevel, 1)) *
                            100,
                          100
                        )}
                        sx={{
                          height: 8,
                          borderRadius: 2,
                          bgcolor: "rgba(0,0,0,0.1)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: detailData?.isLowStock
                              ? colors.orange_500
                              : colors.green_200,
                          },
                        }}
                      />
                    </Paper>
                  </Box>
                </Grid2>

                {/* Right side - Details */}
                <Grid2 size={{ mobile: 12, desktop: 8 }}>
                  <Grid2 container spacing={2}>
                    <DetailItem
                      icon={<CategoryIcon color="primary" />}
                      label="Loại nguyên liệu"
                      value={detailData?.ingredientTypeName || "N/A"}
                    />

                    <DetailItem
                      icon={<MonetizationOnIcon color="primary" />}
                      label="Giá hiện tại"
                      value={formatCurrency(detailData?.price)}
                    />

                    <DetailItem
                      icon={<InventoryIcon color="primary" />}
                      label="Mức tồn kho tối thiểu"
                      value={`${detailData?.minStockLevel || 0} ${
                        detailData?.unit || "đơn vị"
                      }`}
                    />

                    <DetailItem
                      icon={<BusinessIcon color="primary" />}
                      label="Đơn vị đo"
                      value={detailData?.unit || "N/A"}
                    />

                    <Grid2 size={{ mobile: 12 }}>
                      <DetailItem
                        icon={<DescriptionIcon color="primary" />}
                        label="Mô tả"
                        value={detailData?.description || "Không có mô tả"}
                        fullWidth
                      />
                    </Grid2>

                    <DetailItem
                      icon={<CalendarTodayIcon color="primary" />}
                      label="Ngày tạo"
                      value={formatDate(detailData?.createdAt)}
                    />

                    <DetailItem
                      icon={<UpdateIcon color="primary" />}
                      label="Cập nhật lần cuối"
                      value={formatDate(detailData?.updatedAt)}
                    />
                  </Grid2>
                </Grid2>
              </Grid2>

              <Divider sx={{ my: 3 }} />

              {/* Summary Cards */}
              <Grid2 container spacing={2} sx={{ mb: 3 }}>
                <Grid2 size={{ mobile: 12, tablet: 6, desktop: 3 }}>
                  <Card elevation={2} sx={{ height: "100%" }}>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <ReceiptLongIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Tổng số lô
                        </Typography>
                      </Box>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="primary"
                      >
                        {detailData?.batches?.length || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid2>

                <Grid2 size={{ mobile: 12, tablet: 6, desktop: 3 }}>
                  <Card elevation={2} sx={{ height: "100%" }}>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <CheckCircleIcon
                          sx={{ mr: 1, color: colors.green_200 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Lô còn hạn
                        </Typography>
                      </Box>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ color: colors.green_200 }}
                      >
                        {detailData?.batches?.filter(
                          (b: BatchItem) => !b.isExpired
                        )?.length || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid2>

                <Grid2 size={{ mobile: 12, tablet: 6, desktop: 3 }}>
                  <Card elevation={2} sx={{ height: "100%" }}>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <WarningAmberIcon
                          sx={{ mr: 1, color: colors.orange_300 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Lô sắp hết hạn
                        </Typography>
                      </Box>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ color: colors.orange_300 }}
                      >
                        {detailData?.batches?.filter(
                          (b: BatchItem) =>
                            !b.isExpired && b.daysUntilExpiration <= 7
                        )?.length || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid2>

                <Grid2 size={{ mobile: 12, tablet: 6, desktop: 3 }}>
                  <Card elevation={2} sx={{ height: "100%" }}>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <HistoryIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Lịch sử giá
                        </Typography>
                      </Box>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="primary"
                      >
                        {detailData?.prices?.length || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid2>
              </Grid2>

              {/* Tabs-like sections */}
              <Grid2 container spacing={3}>
                {/* Batches Section */}
                <Grid2 size={{ mobile: 12, desktop: 6 }}>
                  <Paper
                    elevation={2}
                    sx={{ p: 3, borderRadius: 2, height: "fit-content" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <ReceiptLongIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" fontWeight="bold">
                        Danh sách lô hàng ({detailData?.batches?.length || 0})
                      </Typography>
                    </Box>

                    {detailData?.batches?.length > 0 ? (
                      <>
                        <TableContainer
                          component={Paper}
                          sx={{ boxShadow: 2, borderRadius: 2 }}
                        >
                          <Table>
                            <TableHead>
                              <TableRow sx={{ bgcolor: "rgba(0,0,0,0.03)" }}>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  Mã lô
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  Số lượng
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  Còn lại
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  Ngày nhận
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  Hạn sử dụng
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  Nguồn nhập
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  Trạng thái
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {detailData.batches.map((batch: BatchItem) => (
                                <TableRow key={batch.ingredientBatchId}>
                                  <TableCell>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <ArchiveIcon
                                        fontSize="small"
                                        sx={{ mr: 1, color: colors.primary }}
                                      />
                                      {batch.batchNumber}
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    {batch.initialQuantity} {batch.unit}
                                    {batch.measurementValue
                                      ? ` (${batch.physicalQuantity} ${batch.unit})`
                                      : ""}
                                  </TableCell>
                                  <TableCell>
                                    {batch.remainingQuantity} {batch.unit}
                                    {batch.measurementValue
                                      ? ` (${
                                          batch.remainingQuantity *
                                          batch.measurementValue
                                        } ${batch.unit})`
                                      : ""}
                                  </TableCell>
                                  <TableCell>
                                    {formatDate(batch.receivedDate)}
                                  </TableCell>
                                  <TableCell>
                                    {formatDate(batch.bestBeforeDate)}
                                  </TableCell>
                                  <TableCell>{batch?.provideCompany}</TableCell>
                                  <TableCell>
                                    <Tooltip
                                      title={`${
                                        batch.isExpired
                                          ? "Đã hết hạn"
                                          : `Còn ${batch.daysUntilExpiration} ngày`
                                      }`}
                                    >
                                      <Chip
                                        size="small"
                                        label={getExpirationStatus(
                                          batch.daysUntilExpiration,
                                          batch.isExpired
                                        )}
                                        sx={{
                                          bgcolor: getExpirationColor(
                                            batch.daysUntilExpiration,
                                            batch.isExpired
                                          ),
                                          color: "white",
                                          fontWeight: "medium",
                                        }}
                                      />
                                    </Tooltip>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25]}
                          component="div"
                          count={detailData?.batches?.length || 0}
                          rowsPerPage={batchRowsPerPage}
                          page={batchPage}
                          onPageChange={handleChangeBatchPage}
                          onRowsPerPageChange={handleChangeBatchRowsPerPage}
                          labelRowsPerPage="Số hàng mỗi trang:"
                          size="small"
                        />
                      </>
                    ) : (
                      <Paper
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          bgcolor: "rgba(0,0,0,0.02)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ReceiptLongIcon
                          sx={{ fontSize: 48, color: "rgba(0,0,0,0.2)", mb: 1 }}
                        />
                        <Typography variant="body1" color="text.secondary">
                          Không có lô hàng nào cho nguyên liệu này
                        </Typography>
                      </Paper>
                    )}
                  </Paper>
                </Grid2>

                {/* Price History Section */}
                <Grid2 size={{ mobile: 12, desktop: 6 }}>
                  <Paper
                    elevation={2}
                    sx={{ p: 3, borderRadius: 2, height: "fit-content" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <HistoryIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" fontWeight="bold">
                        Lịch sử giá ({detailData?.prices?.length || 0})
                      </Typography>
                    </Box>

                    {sortedPrices.length > 0 ? (
                      <>
                        <TableContainer sx={{ maxHeight: 400 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ bgcolor: "rgba(0,0,0,0.03)" }}>
                                <TableCell
                                  sx={{
                                    fontWeight: "bold",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  Giá
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontWeight: "bold",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  Ngày áp dụng
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontWeight: "bold",
                                    fontSize: "0.875rem",
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
                                  pricePage * priceRowsPerPage +
                                    priceRowsPerPage
                                )
                                .map((price: PriceHistoryItem, index) => {
                                  const prevPrice = sortedPrices[index + 1];
                                  const priceChange = prevPrice
                                    ? price.price - prevPrice.price
                                    : 0;

                                  return (
                                    <TableRow
                                      key={`${price.ingredientPriceId}-${price.effectiveDate}`}
                                    >
                                      <TableCell>
                                        <Typography
                                          variant="body2"
                                          fontWeight="medium"
                                        >
                                          {formatCurrency(price.price)}
                                        </Typography>
                                        {index === 0 && (
                                          <Chip
                                            label="Hiện tại"
                                            size="small"
                                            color="primary"
                                            sx={{
                                              mt: 0.5,
                                              fontSize: "0.7rem",
                                              height: 20,
                                            }}
                                          />
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        <Typography variant="body2">
                                          {formatDateTime(price.effectiveDate)}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        {priceChange !== 0 && (
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
                                              {formatCurrency(priceChange)}
                                            </Typography>
                                          </Box>
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
                          size="small"
                        />
                      </>
                    ) : (
                      <Box
                        sx={{
                          p: 3,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "rgba(0,0,0,0.02)",
                          borderRadius: 2,
                        }}
                      >
                        <HistoryIcon
                          sx={{ fontSize: 48, color: "rgba(0,0,0,0.2)", mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Không có lịch sử giá
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid2>
              </Grid2>
            </Box>
          </Fade>
        )}
      </DialogContent>
    </Dialog>
  );
};

const DetailItem = ({
  icon,
  label,
  value,
  fullWidth = false,
}: DetailItemProps) => (
  <Grid2 size={{ mobile: 12, tablet: fullWidth ? 12 : 6 }}>
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "rgba(0,0,0,0.02)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        {icon}
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          {label}
        </Typography>
      </Box>
      <Typography variant="body1" fontWeight="medium">
        {value}
      </Typography>
    </Paper>
  </Grid2>
);

const LoadingSkeleton = () => (
  <Box>
    {/* Two-column layout for loading */}
    <Grid2 container spacing={3}>
      <Grid2 size={{ mobile: 12, desktop: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height={200}
            sx={{ borderRadius: 2, maxWidth: 200 }}
          />
          <Skeleton variant="text" width={150} height={40} sx={{ mt: 2 }} />
          <Skeleton
            variant="rectangular"
            width={120}
            height={32}
            sx={{ borderRadius: 16, mt: 1, mb: 2 }}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={100}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      </Grid2>
      <Grid2 size={{ mobile: 12, desktop: 8 }}>
        <Grid2 container spacing={2}>
          {[...Array(5)].map((_, index) => (
            <Grid2
              size={{ mobile: 12, tablet: index === 2 ? 12 : 6 }}
              key={index}
            >
              <Skeleton
                variant="rectangular"
                height={80}
                sx={{ borderRadius: 2 }}
              />
            </Grid2>
          ))}
        </Grid2>
      </Grid2>
    </Grid2>

    <Divider sx={{ my: 3 }} />

    {/* Batches loading */}
    <Box sx={{ mb: 3 }}>
      <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
    </Box>

    <Grid2 container spacing={2}>
      {[...Array(3)].map((_, index) => (
        <Grid2 size={{ mobile: 12, desktop: 4 }} key={index}>
          <Skeleton
            variant="rectangular"
            height={80}
            sx={{ borderRadius: 2 }}
          />
        </Grid2>
      ))}
    </Grid2>
  </Box>
);

export default DetailPopupIngredient;
