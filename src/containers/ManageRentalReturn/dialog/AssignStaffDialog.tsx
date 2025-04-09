/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  SelectChangeEvent,
} from "@mui/material";
import {
  RentOrderDetail,
  Staff,
  PickupAssignmentRequestDto,
} from "../../../types/rentalTypes";
import { allocateStaffForPickup } from "../../../api/Services/rentalService";
import staffService from "../../../api/Services/staffService";
import { format } from "date-fns";

interface AssignStaffDialogProps {
  open: boolean;
  onClose: () => void;
  pickup: RentOrderDetail;
  onSuccess: () => void;
}

const AssignStaffDialog: React.FC<AssignStaffDialogProps> = ({
  open,
  onClose,
  pickup,
  onSuccess,
}) => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      setStaffLoading(true);
      try {
        const availableStaff = await staffService.getAvailableStaff();
        setStaff(availableStaff);
      } catch (error) {
        setError("Failed to load available staff");
      } finally {
        setStaffLoading(false);
      }
    };

    if (open) {
      fetchStaff();
    }
  }, [open]);

  // src/components/manager/AssignStaffDialog.tsx (continued)
  const handleStaffChange = (event: SelectChangeEvent<number | "">) => {
    setSelectedStaffId(event.target.value as number);
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };

  const handleSubmit = async () => {
    if (selectedStaffId === "") {
      setError("Please select a staff member");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const request: PickupAssignmentRequestDto = {
        staffId: selectedStaffId as number,
        rentOrderDetailId: pickup.id,
        notes: notes || undefined,
      };
      await allocateStaffForPickup(request);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Phân công nhân viên cho việc lấy hàng</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="subtitle1" gutterBottom>
            Chi tiết lấy hàng
          </Typography>
          <Box
            sx={{ mb: 3, p: 2, bgcolor: "background.default", borderRadius: 1 }}
          >
            <Typography variant="body2">
              <strong>Khách hàng:</strong> {pickup.customerName}
            </Typography>
            <Typography variant="body2">
              <strong>Thiết bị:</strong> {pickup.equipmentName}
            </Typography>
            <Typography variant="body2">
              <strong>Ngày trả:</strong>{" "}
              {format(new Date(pickup.expectedReturnDate), "MMM dd, yyyy")}
            </Typography>
            <Typography variant="body2">
              <strong>Địa chỉ:</strong>{" "}
              {pickup.customerAddress || "Không cung cấp"}
            </Typography>
            <Typography variant="body2">
              <strong>Điện thoại:</strong>{" "}
              {pickup.customerPhone || "Không cung cấp"}
            </Typography>
          </Box>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="staff-select-label">Phân công nhân viên</InputLabel>
            <Select
              labelId="staff-select-label"
              value={selectedStaffId}
              onChange={handleStaffChange}
              label="Phân công nhân viên"
              disabled={staffLoading}
            >
              {staffLoading ? (
                <MenuItem value="">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Đang tải danh sách nhân viên...
                  </Box>
                </MenuItem>
              ) : (
                staff.map((staffMember) => (
                  <MenuItem key={staffMember.id} value={staffMember.id}>
                    {staffMember.name}{" "}
                    {staffMember.isAvailable ? "(Sẵn sàng)" : "(Bận)"}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <TextField
            label="Ghi chú cho nhân viên"
            multiline
            rows={3}
            fullWidth
            value={notes}
            onChange={handleNotesChange}
            placeholder="Thêm bất kỳ hướng dẫn đặc biệt hoặc ghi chú nào cho nhân viên"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading || selectedStaffId === ""}
        >
          {loading ? <CircularProgress size={24} /> : "Phân công nhân viên"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignStaffDialog;
