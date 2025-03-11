import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { FrontendOrder, FrontendStaff } from "../../../types/orderManagement";
import { StyledSelect } from "../../../components/StyledComponents";

interface AssignStaffDialogProps {
  open: boolean;
  onClose: () => void;
  order: FrontendOrder;
  staffList: FrontendStaff[];
  onAssignStaff: (staffId: number) => Promise<boolean>;
}

const AssignStaffDialog: React.FC<AssignStaffDialogProps> = ({
  open,
  onClose,
  order,
  staffList,
  onAssignStaff,
}) => {
  const [selectedStaff, setSelectedStaff] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (selectedStaff !== "") {
      setLoading(true);
      try {
        await onAssignStaff(Number(selectedStaff));
        setSelectedStaff("");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setSelectedStaff("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {order.assignedTo
          ? "Thay đổi nhân viên giao hàng"
          : "Phân công nhân viên giao hàng"}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {order.assignedTo
            ? "Chọn nhân viên mới để giao đơn hàng này."
            : "Chọn nhân viên để giao đơn hàng này."}
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Nhân viên</InputLabel>
          <StyledSelect
            value={selectedStaff}
            label="Nhân viên"
            onChange={(e) => setSelectedStaff(e.target.value as number)}
          >
            {staffList.map((staff) => (
              <MenuItem key={staff.id} value={staff.id}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {staff.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1">{staff.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {staff.assignedOrders} đơn hàng đang giao •{" "}
                      {staff.availability}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>
        {staffList.length === 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Không có nhân viên giao hàng nào khả dụng. Vui lòng thêm nhân viên
            mới.
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button
          onClick={handleAssign}
          variant="contained"
          disabled={selectedStaff === "" || staffList.length === 0 || loading}
        >
          {loading
            ? "Đang xử lý..."
            : order.assignedTo
            ? "Cập nhật"
            : "Phân công"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignStaffDialog;
