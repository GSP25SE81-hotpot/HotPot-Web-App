import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid2,
} from "@mui/material";
import { DiscountType } from "../../../types/discountType";

interface DiscountDetailProps {
  open: boolean;
  onClose: () => void;
  discount: DiscountType | null;
}

const DiscountDetail: React.FC<DiscountDetailProps> = ({
  open,
  onClose,
  discount,
}) => {
  if (!discount) return null;

  // Calculate end date based on start date + duration
  const getEndDate = () => {
    if (!discount.duration) return "Không có";

    try {
      const startDate = new Date(discount.date);
      const durationMs = Number(discount.duration) * 1000;
      const endDate = new Date(startDate.getTime() + durationMs);
      return endDate.toLocaleDateString();
    } catch (error) {
      console.error("Invalid date format", error);
      return "Không xác định";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chi tiết ưu đãi</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Typography variant="h6">{discount.title}</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {discount.description}
          </Typography>
        </Box>

        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 6 }}>
            <Typography variant="body1">
              <strong>Tỷ lệ giảm:</strong> {discount.discountPercentage}%
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <Typography variant="body1">
              <strong>Điểm cần:</strong> {discount.pointCost}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <Typography variant="body1">
              <strong>Ngày bắt đầu:</strong>{" "}
              {new Date(discount.date).toLocaleDateString()}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <Typography variant="body1">
              <strong>Ngày kết thúc:</strong> {getEndDate()}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <Typography variant="body1">
              <strong>Trạng thái:</strong>{" "}
              {discount.isActive ? "Đang hoạt động" : "Không hoạt động"}
            </Typography>
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DiscountDetail;
