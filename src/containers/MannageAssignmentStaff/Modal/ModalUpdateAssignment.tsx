/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Grid,
  InputAdornment,
  Divider,
  IconButton,
  Slide,
  Paper,
  Chip,
} from "@mui/material";
import {
  Close,
  SaveAlt,
  ErrorOutline,
  Note,
  Assignment,
} from "@mui/icons-material";
import StaffAssignemtAPI from "../../../api/Services/staffAssignmentAPI";
import { toast } from "react-toastify";

interface AssignmentCompletionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  assignment?: Partial<any>;
  assignId: any;
}

const Transition = React.forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const AssignmentCompletionDialog: React.FC<
  AssignmentCompletionDialogProps
> = ({ open, onClose, onSave, assignment = {}, assignId }) => {
  const [formData, setFormData] = useState<any>({
    rentOrderId: assignment.orderId || 0,
    returnCondition: assignment.returnCondition || "",
    notes: assignment.notes || "",
  });

  console.log(assignment);

  const [errors, setErrors] = useState<Partial<Record<keyof any, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "damageFee" ? Number(value) : value,
    });
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof any, string>> = {};

    if (!formData.returnCondition.trim()) {
      newErrors.returnCondition = "Vui lòng nhập tình trạng khi trả";
    }

    if (formData.damageFee < 0) {
      newErrors.damageFee = "Phí hư hỏng không thể là số âm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const submissionData: any = {
        ...formData,
        completedDate: new Date().toISOString(),
        assignmentId: assignId,
      };

      console.log(submissionData);

      const res = await StaffAssignemtAPI.updateAssignment(submissionData);

      console.log(res);

      toast.success("Cập nhật thành công");
      onSave();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason === "backdropClick") return;
        onClose();
      }}
      aria-hidden={false}
      maxWidth="md"
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Paper
        sx={{
          position: "absolute",
          right: 16,
          top: 16,
          zIndex: 1,
          borderRadius: "50%",
        }}
      >
        <Chip
          label="Hoàn thành công việc"
          color="primary"
          icon={<Assignment />}
          sx={{ fontWeight: "medium" }}
        />
      </Paper>

      <DialogTitle
        sx={{
          pt: 3,
          pb: 2,
          background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
          color: "white",
          fontWeight: "bold",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Typography variant="h5" component="div">
          Cập Nhật Công Việc
        </Typography>
        <Typography
          variant="subtitle2"
          component="p"
          sx={{ opacity: 0.8, mt: 0.5 }}
        >
          Ghi nhận việc hoàn thành nhiệm vụ và tình trạng trả hàng
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }}>
              <Chip label="Đánh giá tình trạng" />
            </Divider>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Tình trạng khi trả"
              name="returnCondition"
              value={formData.returnCondition}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              error={!!errors.returnCondition}
              helperText={errors.returnCondition}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ErrorOutline
                      color={errors.returnCondition ? "error" : "primary"}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Ghi chú"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Note color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, bgcolor: "#f5f5f5" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          startIcon={<Close />}
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          startIcon={<SaveAlt />}
          sx={{
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          Xác nhận hoàn thành
        </Button>
      </DialogActions>
    </Dialog>
  );
};
