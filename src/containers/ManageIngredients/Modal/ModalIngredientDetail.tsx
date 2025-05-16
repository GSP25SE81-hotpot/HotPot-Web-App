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
import DateRangeIcon from "@mui/icons-material/DateRange";
import ArchiveIcon from "@mui/icons-material/Archive";
import { colors } from "../../../styles/Color/color";
import adminIngredientsAPI from "../../../api/Services/adminIngredientsAPI";
import TablePagination from "@mui/material/TablePagination";

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
}

const DetailPopupIngredient: React.FC<DetailPopupIngredientProps> = ({
  handleOpen,
  handleClose,
  dataIngredient,
}) => {
  // State
  const [detailData, setDetailData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  //paginate
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // Call API
  const getIngredientDetail = async () => {
    setLoading(true);
    try {
      const res: any = await adminIngredientsAPI.getListIngredientsDetail(
        dataIngredient?.ingredientId
      );
      // Merge batch data from API response with any batches data we have
      const mergedData = {
        ...res?.data,
        batches: res?.data?.batches || dataIngredient?.batches || [],
      };
      setDetailData(mergedData);
    } catch (error) {
      console.error("Error fetching ingredient details:", error);
      // If API fails, use the dataIngredient that was passed in
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

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount === undefined || amount === null) return "N/A";
    return amount.toLocaleString("vi-VN") + " VND";
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

  return (
    <Dialog
      open={handleOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
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
                        maxWidth: 200,
                        height: 200,
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

                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {detailData?.name || "N/A"}
                    </Typography>

                    <Chip
                      icon={
                        detailData?.isLowStock ? (
                          <WarningAmberIcon />
                        ) : (
                          <CheckCircleIcon />
                        )
                      }
                      label={
                        detailData?.isLowStock ? "Hàng tồn kho thấp" : "Đủ hàng"
                      }
                      sx={{
                        color: detailData?.isLowStock
                          ? colors.orange_500
                          : colors.green_200,
                        borderColor: detailData?.isLowStock
                          ? colors.orange_500
                          : colors.green_200,
                        fontWeight: "medium",
                        mb: 2,
                      }}
                      variant="outlined"
                    />

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
                      label="Loại"
                      value={detailData?.ingredientTypeName || "N/A"}
                    />

                    <DetailItem
                      icon={<MonetizationOnIcon color="primary" />}
                      label="Giá"
                      value={formatCurrency(detailData?.price)}
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

              {/* Batches Section */}
              <Box sx={{ mb: 3 }}>
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
                              Trạng thái
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {detailData.batches.map((batch: BatchItem) => (
                            <TableRow key={batch.ingredientBatchId}>
                              <TableCell>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
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
                      count={detailData?.batches?.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      labelRowsPerPage="Số hàng mỗi trang:"
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
              </Box>

              {/* Batch Summary */}
              {detailData?.batches?.length > 0 && (
                <Grid2 container spacing={2}>
                  <Grid2 size={{ mobile: 12, desktop: 4 }}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: colors.primary + "10",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <InventoryIcon
                          color="primary"
                          fontSize="small"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Tổng số lô
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight="bold">
                        {detailData?.batches?.length || 0} lô
                      </Typography>
                    </Paper>
                  </Grid2>
                  <Grid2 size={{ mobile: 12, desktop: 4 }}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: colors.green_200 + "20",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <CheckCircleIcon
                          sx={{ mr: 1, color: colors.green_200 }}
                          fontSize="small"
                        />
                        <Typography variant="body2" color="text.secondary">
                          Còn hạn sử dụng
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight="bold">
                        {detailData?.batches?.filter(
                          (b: BatchItem) => !b.isExpired
                        )?.length || 0}{" "}
                        lô
                      </Typography>
                    </Paper>
                  </Grid2>
                  <Grid2 size={{ mobile: 12, desktop: 4 }}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: colors.orange_300 + "20",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <DateRangeIcon
                          sx={{ mr: 1, color: colors.orange_300 }}
                          fontSize="small"
                        />
                        <Typography variant="body2" color="text.secondary">
                          Lô sắp hết hạn
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight="bold">
                        {detailData?.batches?.filter(
                          (b: BatchItem) =>
                            !b.isExpired && b.daysUntilExpiration <= 7
                        )?.length || 0}{" "}
                        lô
                      </Typography>
                    </Paper>
                  </Grid2>
                </Grid2>
              )}
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
