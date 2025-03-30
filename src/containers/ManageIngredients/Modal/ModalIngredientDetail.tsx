/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Paper,
  Divider,
  Grid,
  Chip,
  Skeleton,
  Fade,
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
const DetailPopupIngredient: React.FC<DetailPopupIngredientProps> = ({
  handleOpen,
  handleClose,
  dataIngredient,
}) => {
  // State
  const [detailData, setDetailData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Call API
  const getIngredientDetail = async () => {
    setLoading(true);
    try {
      const res: any = await adminIngredientsAPI.getListIngredientsDetail(
        dataIngredient?.ingredientId
      );
      setDetailData(res?.data);
    } catch (error) {
      console.error("Error fetching ingredient details:", error);
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

  return (
    <Dialog
      open={handleOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
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
              {/* Image and Status */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 3,
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
                    width: 150,
                    height: 150,
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
                  color={detailData?.isLowStock ? "error" : "success"}
                  variant="outlined"
                  sx={{ fontWeight: "medium" }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Details Grid */}
              <Grid container spacing={2}>
                <DetailItem
                  icon={<CategoryIcon color="primary" />}
                  label="Loại"
                  value={detailData?.ingredientTypeName || "N/A"}
                />

                <DetailItem
                  icon={<InventoryIcon color="primary" />}
                  label="Số lượng"
                  value={
                    detailData?.quantity !== undefined
                      ? `${detailData.quantity} đơn vị`
                      : "N/A"
                  }
                />

                <DetailItem
                  icon={<WarningAmberIcon color="primary" />}
                  label="Mức tối thiểu"
                  value={
                    detailData?.minStockLevel !== undefined
                      ? `${detailData.minStockLevel} đơn vị`
                      : "N/A"
                  }
                />

                <DetailItem
                  icon={<MonetizationOnIcon color="primary" />}
                  label="Giá"
                  value={formatCurrency(detailData?.price)}
                />

                <Grid item xs={12}>
                  <DetailItem
                    icon={<DescriptionIcon color="primary" />}
                    label="Mô tả"
                    value={detailData?.description || "Không có mô tả"}
                    fullWidth
                  />
                </Grid>

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
              </Grid>
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
  <Grid item xs={fullWidth ? 12 : 6}>
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
  </Grid>
);

const LoadingSkeleton = () => (
  <Box>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Skeleton
        variant="rectangular"
        width={150}
        height={150}
        sx={{ borderRadius: 2 }}
      />
      <Skeleton variant="text" width={200} height={40} sx={{ mt: 2 }} />
      <Skeleton
        variant="rectangular"
        width={120}
        height={32}
        sx={{ borderRadius: 16, mt: 1 }}
      />
    </Box>

    <Divider sx={{ my: 2 }} />

    <Grid container spacing={2}>
      {[...Array(7)].map((_, index) => (
        <Grid item xs={index === 4 ? 12 : 6} key={index}>
          <Skeleton
            variant="rectangular"
            height={80}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default DetailPopupIngredient;
