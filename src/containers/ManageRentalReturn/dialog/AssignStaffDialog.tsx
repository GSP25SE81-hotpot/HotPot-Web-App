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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import {
  RentOrderDetailResponse,
  Staff,
  PickupAssignmentRequestDto,
} from "../../../types/rentalTypes";
import { VehicleDTO } from "../../../types/vehicle";
import { allocateStaffForPickup } from "../../../api/Services/rentalService";
import staffService from "../../../api/Services/staffService";
import vehicleService from "../../../api/Services/vehicleService";
import { format } from "date-fns";
import { formatDate } from "../../../utils/formatters";

interface AssignStaffDialogProps {
  open: boolean;
  onClose: () => void;
  pickup: RentOrderDetailResponse;
  onSuccess: () => void;
}

const AssignStaffDialog: React.FC<AssignStaffDialogProps> = ({
  open,
  onClose,
  pickup,
  onSuccess,
}) => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<number | "">("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(true);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setStaffLoading(true);
      setVehiclesLoading(true);

      try {
        // Fetch available staff
        const availableStaff = await staffService.getAvailableStaff();
        setStaff(availableStaff);

        // Fetch available vehicles
        const availableVehicles = await vehicleService.getAvailableVehicles();
        setVehicles(availableVehicles);

        // Set the first equipment item's detail ID as selected by default
        if (pickup.equipmentItems && pickup.equipmentItems.length > 0) {
          setSelectedDetailId(pickup.equipmentItems[0].detailId);
        }
      } catch (error) {
        setError("Failed to load available resources");
      } finally {
        setStaffLoading(false);
        setVehiclesLoading(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, pickup]);

  const handleStaffChange = (event: SelectChangeEvent<number | "">) => {
    setSelectedStaffId(event.target.value as number);
  };

  const handleVehicleChange = (event: SelectChangeEvent<number | "">) => {
    setSelectedVehicleId(event.target.value as number);
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };

  const handleDetailSelect = (detailId: number) => {
    setSelectedDetailId(detailId);
  };

  const handleSubmit = async () => {
    if (selectedStaffId === "") {
      setError("Please select a staff member");
      return;
    }

    if (!selectedDetailId) {
      setError("No equipment item selected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: PickupAssignmentRequestDto = {
        staffId: selectedStaffId as number,
        rentOrderDetailId: selectedDetailId,
        notes: notes || undefined,
      };

      // Add vehicle ID if selected
      if (selectedVehicleId !== "") {
        request.vehicleId = selectedVehicleId as number;
      }

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
              <strong>Ngày bắt đầu thuê:</strong>{" "}
              {format(new Date(pickup.rentalStartDate), "MMM dd, yyyy")}
            </Typography>
            <Typography variant="body2">
              <strong>Ngày trả dự kiến:</strong>{" "}
              {formatDate(pickup.expectedReturnDate)}
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

          <Typography variant="subtitle1" gutterBottom>
            Thiết bị cần lấy
          </Typography>

          <List sx={{ mb: 3, bgcolor: "background.default", borderRadius: 1 }}>
            {pickup.equipmentItems.map((item) => (
              <ListItem
                key={item.detailId}
                disablePadding // Good practice when ListItemButton is a direct child
                sx={{
                  // Your border styling can remain on the ListItem
                  borderLeft:
                    selectedDetailId === item.detailId
                      ? "4px solid #1976d2"
                      : "4px solid transparent",
                }}
              >
                <ListItemButton
                  selected={selectedDetailId === item.detailId}
                  onClick={() => handleDetailSelect(item.detailId)}
                >
                  <ListItemText
                    primary={item.name}
                    secondary={`Loại: ${item.type} | ID: ${item.id}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

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

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="vehicle-select-label">
              Phương tiện (tùy chọn)
            </InputLabel>
            <Select
              labelId="vehicle-select-label"
              value={selectedVehicleId}
              onChange={handleVehicleChange}
              label="Phương tiện (tùy chọn)"
              disabled={vehiclesLoading}
            >
              <MenuItem value="">
                <em>Không sử dụng phương tiện</em>
              </MenuItem>
              {vehiclesLoading ? (
                <MenuItem value="" disabled>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Đang tải danh sách phương tiện...
                  </Box>
                </MenuItem>
              ) : (
                vehicles.map((vehicle) => (
                  <MenuItem key={vehicle.vehicleId} value={vehicle.vehicleId}>
                    {vehicle.name}
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
          disabled={loading || selectedStaffId === "" || !selectedDetailId}
        >
          {loading ? <CircularProgress size={24} /> : "Phân công nhân viên"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignStaffDialog;
