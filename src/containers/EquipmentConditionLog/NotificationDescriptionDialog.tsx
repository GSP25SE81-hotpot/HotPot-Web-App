// src/components/manager/NotificationDescriptionDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { MaintenanceScheduleType } from "../../api/Services/equipmentConditionService";

interface NotificationDescriptionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (description: string) => void;
  issueName: string;
  equipmentName: string;
  scheduleType: MaintenanceScheduleType;
}

const NotificationDescriptionDialog: React.FC<
  NotificationDescriptionDialogProps
> = ({ open, onClose, onSubmit, issueName, equipmentName, scheduleType }) => {
  const [description, setDescription] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (!description.trim()) {
      setError(true);
      return;
    }
    onSubmit(description);
    setDescription("");
    setError(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {scheduleType === MaintenanceScheduleType.Emergency
          ? "Chi tiết thông báo khẩn cấp"
          : "Chi tiết thông báo"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Vấn đề: {issueName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thiết bị: {equipmentName}
          </Typography>
        </Box>
        {scheduleType === MaintenanceScheduleType.Emergency && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Đây sẽ được gửi như một thông báo khẩn cấp đến các quản trị viên.
          </Alert>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="Mô tả"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (e.target.value.trim()) {
              setError(false);
            }
          }}
          error={error}
          helperText={
            error ? "Mô tả là bắt buộc" : "Vui lòng cung cấp chi tiết về vấn đề"
          }
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy bỏ</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color={
            scheduleType === MaintenanceScheduleType.Emergency
              ? "error"
              : "primary"
          }
        >
          Gửi thông báo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationDescriptionDialog;
