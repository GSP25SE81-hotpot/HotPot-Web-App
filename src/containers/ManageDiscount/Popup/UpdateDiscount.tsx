import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { DiscountType } from "../../../types/discountType";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import adminDiscountApi from "../../../api/Services/adminDiscountAPI";

interface UpdateDiscountProps {
  open: boolean;
  onClose: () => void;
  discount: DiscountType | null;
  fetchDiscounts: () => void;
}

const UpdateDiscount: React.FC<UpdateDiscountProps> = ({
  open,
  onClose,
  discount,
  fetchDiscounts,
}) => {
  const [formData, setFormData] = useState<Partial<DiscountType>>({});
  const [updateDuration, setUpdateDuration] = useState(false);
  const [updatePointCost, setUpdatePointCost] = useState(false);

  useEffect(() => {
    if (discount) {
      setFormData({
        title: discount.title,
        description: discount.description,
        discountPercentage: discount.discountPercentage,
        date: discount.date,
        duration: discount.duration,
        pointCost: discount.pointCost,
        isActive: discount.isActive,
      });
    }
  }, [discount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!discount) return;

    try {
      const updateData = {
        ...formData,
        updateDuration,
        updatePointCost,
      };

      await adminDiscountApi.updateDiscount(discount.discountId, updateData);
      fetchDiscounts();
      onClose();
    } catch (error) {
      console.error("Error updating discount:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Cập nhật ưu đãi</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tên ưu đãi"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Tỷ lệ giảm (%)"
              name="discountPercentage"
              type="number"
              value={formData.discountPercentage || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Điểm cần"
              name="pointCost"
              type="number"
              value={formData.pointCost || ""}
              onChange={handleChange}
              disabled={!updatePointCost}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={updatePointCost}
                  onChange={() => setUpdatePointCost(!updatePointCost)}
                />
              }
              label="Cập nhật điểm"
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              label="Ngày bắt đầu"
              value={formData.date ? dayjs(formData.date) : null}
              onChange={(date) =>
                setFormData((prev) => ({ ...prev, date: date?.toISOString() }))
              }
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              label="Ngày kết thúc"
              value={formData.duration ? dayjs(formData.duration) : null}
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  duration: date?.toISOString(),
                }))
              }
              disabled={!updateDuration}
              sx={{ width: "100%" }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={updateDuration}
                  onChange={() => setUpdateDuration(!updateDuration)}
                />
              }
              label="Cập nhật thời hạn"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  name="isActive"
                  checked={formData.isActive || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                />
              }
              label="Kích hoạt ưu đãi"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateDiscount;
