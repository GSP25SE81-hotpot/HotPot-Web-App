import {
  Box,
  CircularProgress,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  PickupAssignmentRequestDto,
  RentOrderDetailResponse,
  Staff,
} from "../../../types/rentalTypes";
import { VehicleDTO } from "../../../types/vehicle";
import { formatDate } from "../../../utils/formatters";
import {
  CancelButton,
  DetailBox,
  DetailText,
  EquipmentList,
  EquipmentListItem,
  EquipmentListItemButton,
  EquipmentListItemText,
  LoadingWrapper,
  SectionTitle,
  StaffMenuItem,
  StyledAlert,
  StyledDialog,
  StyledDialogActions,
  StyledDialogContent,
  StyledDialogTitle,
  StyledFormControlSelect,
  StyledFormDivider,
  StyledNotesField,
  SubmitButton,
  VehicleMenuItem,
} from "./AssignStaffDialogStyle";
import staffService from "../../../api/Services/staffService";
import vehicleService from "../../../api/Services/vehicleService";
import { allocateStaffForPickup } from "../../../api/Services/rentalService";

interface AssignStaffDialogProps {
  open: boolean;
  onClose: () => void;
  pickup: RentOrderDetailResponse;
  onSuccess: (staffName: string, customerName: string) => void;
}

// Confirmation Dialog Component
interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  staffName: string;
  customerName: string;
  equipmentName: string;
  notes: string;
  vehicleName?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  staffName,
  customerName,
  equipmentName,
  notes,
  vehicleName,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Xác nhận phân công</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Bạn có chắc chắn muốn phân công như sau?
        </Typography>
        <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Nhân viên:</strong> {staffName}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Khách hàng:</strong> {customerName}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Thiết bị:</strong> {equipmentName}
          </Typography>
          {vehicleName && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Phương tiện:</strong> {vehicleName}
            </Typography>
          )}
          <Typography variant="body2">
            <strong>Ghi chú:</strong> {notes}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Xác nhận phân công
        </Button>
      </DialogActions>
    </Dialog>
  );
};

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

  // Confirmation dialog state
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedStaffId("");
      setSelectedVehicleId("");
      setNotes("");
      setError(null);
      setSelectedDetailId(null);
      setShowConfirmation(false);
    }
  }, [open]);

  useEffect(() => {
    const fetchData = async () => {
      if (!open) return;

      setStaffLoading(true);
      setVehiclesLoading(true);
      setError(null);

      try {
        // Fetch available staff with better error handling
        console.log("Fetching available staff...");
        const staffResponse = await staffService.getAvailableStaff();
        console.log("Staff response:", staffResponse);

        if (Array.isArray(staffResponse)) {
          setStaff(staffResponse);
        } else {
          console.error("Invalid staff response format:", staffResponse);
          setError("Định dạng dữ liệu nhân viên không hợp lệ");
        }

        // Fetch available vehicles with better error handling
        console.log("Fetching available vehicles...");
        const vehiclesResponse = await vehicleService.getAvailableVehicles();
        console.log("Vehicles response:", vehiclesResponse);

        if (Array.isArray(vehiclesResponse)) {
          setVehicles(vehiclesResponse);
        } else {
          console.error("Invalid vehicles response format:", vehiclesResponse);
          setError("Định dạng dữ liệu phương tiện không hợp lệ");
        }

        // Set the first equipment item's detail ID as selected by default
        if (pickup.equipmentItems && pickup.equipmentItems.length > 0) {
          setSelectedDetailId(pickup.equipmentItems[0].detailId);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Không thể tải dữ liệu cần thiết. Vui lòng thử lại sau.");
      } finally {
        setStaffLoading(false);
        setVehiclesLoading(false);
      }
    };

    fetchData();
  }, [open, pickup]);

  const handleStaffChange = (event: SelectChangeEvent<number | "">) => {
    setSelectedStaffId(event.target.value as number);
    setError(null); // Clear error when user makes selection
  };

  const handleVehicleChange = (event: SelectChangeEvent<number | "">) => {
    setSelectedVehicleId(event.target.value as number);
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
    setError(null); // Clear error when user types
  };

  const handleDetailSelect = (detailId: number) => {
    setSelectedDetailId(detailId);
    setError(null); // Clear error when user selects equipment
  };

  const handleAssignClick = () => {
    // Validation
    if (selectedStaffId === "") {
      setError("Vui lòng chọn nhân viên");
      return;
    }
    if (!selectedDetailId) {
      setError("Vui lòng chọn thiết bị");
      return;
    }
    if (!notes.trim()) {
      setError("Vui lòng nhập ghi chú cho nhân viên");
      return;
    }

    // Show confirmation dialog
    setShowConfirmation(true);
  };

  const handleConfirmAssignment = async () => {
    setLoading(true);
    setError(null);
    setShowConfirmation(false);

    try {
      const request: PickupAssignmentRequestDto = {
        staffId: selectedStaffId as number,
        rentOrderDetailId: selectedDetailId!,
        notes: notes.trim(),
      };

      if (selectedVehicleId !== "") {
        request.vehicleId = selectedVehicleId as number;
      }

      await allocateStaffForPickup(request);
      console.log(request);

      // Get staff and equipment names for success message
      const selectedStaff = staff.find((s) => s.id === selectedStaffId);
      // const selectedEquipment = pickup.equipmentItems.find(
      //   (item) => item.detailId === selectedDetailId
      // );

      const staffName = selectedStaff?.name || "Nhân viên";
      const customerName = pickup.customerName;

      // Call success callback with names
      onSuccess(staffName, customerName);
    } catch (err) {
      console.error("Assignment error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Không thể phân công nhân viên. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  // Get names for confirmation dialog
  const selectedStaff = staff.find((s) => s.id === selectedStaffId);
  const selectedEquipment = pickup.equipmentItems.find(
    (item) => item.detailId === selectedDetailId
  );
  const selectedVehicle = vehicles.find(
    (v) => v.vehicleId === selectedVehicleId
  );

  const isFormValid =
    selectedStaffId !== "" && selectedDetailId && notes.trim();

  return (
    <>
      <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <StyledDialogTitle>
          Phân công nhân viên cho việc lấy hàng
        </StyledDialogTitle>
        <StyledDialogContent>
          <Box sx={{ mt: 2 }}>
            {error && <StyledAlert severity="error">{error}</StyledAlert>}

            <SectionTitle>Chi tiết lấy hàng</SectionTitle>
            <DetailBox>
              <DetailText>
                <strong>Khách hàng:</strong> {pickup.customerName}
              </DetailText>
              <DetailText>
                <strong>Ngày bắt đầu thuê:</strong>{" "}
                {formatDate(pickup.rentalStartDate)}
              </DetailText>
              <DetailText>
                <strong>Ngày trả dự kiến:</strong>{" "}
                {formatDate(pickup.expectedReturnDate)}
              </DetailText>
              <DetailText>
                <strong>Địa chỉ:</strong>{" "}
                {pickup.customerAddress || "Không cung cấp"}
              </DetailText>
              <DetailText>
                <strong>Điện thoại:</strong>{" "}
                {pickup.customerPhone || "Không cung cấp"}
              </DetailText>
            </DetailBox>

            <SectionTitle>Thiết bị cần lấy</SectionTitle>
            <EquipmentList>
              {pickup.equipmentItems.map((item) => (
                <EquipmentListItem
                  key={item.detailId}
                  disablePadding
                  selected={selectedDetailId === item.detailId}
                >
                  <EquipmentListItemButton
                    selected={selectedDetailId === item.detailId}
                    onClick={() => handleDetailSelect(item.detailId)}
                  >
                    <EquipmentListItemText
                      primary={item.name}
                      secondary={`Loại: ${item.type} | ID: ${item.id}`}
                    />
                  </EquipmentListItemButton>
                </EquipmentListItem>
              ))}
            </EquipmentList>

            <StyledFormDivider />

            <StyledFormControlSelect fullWidth>
              <InputLabel id="staff-select-label">
                Phân công nhân viên *
              </InputLabel>
              <Select
                labelId="staff-select-label"
                value={selectedStaffId}
                onChange={handleStaffChange}
                label="Phân công nhân viên *"
                disabled={staffLoading}
                error={selectedStaffId === "" && error !== null}
              >
                {staffLoading ? (
                  <MenuItem value="">
                    <LoadingWrapper>
                      <CircularProgress size={20} />
                      Đang tải danh sách nhân viên...
                    </LoadingWrapper>
                  </MenuItem>
                ) : (
                  staff.map((staffMember) => (
                    <StaffMenuItem
                      key={staffMember.id}
                      value={staffMember.id}
                      isAvailable={staffMember.isAvailable}
                    >
                      {staffMember.name}
                      <span className="staff-status">
                        ({staffMember.isAvailable ? "Sẵn sàng" : "Bận"})
                      </span>
                    </StaffMenuItem>
                  ))
                )}
              </Select>
            </StyledFormControlSelect>

            <StyledFormControlSelect fullWidth>
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
                    <LoadingWrapper>
                      <CircularProgress size={20} />
                      Đang tải danh sách phương tiện...
                    </LoadingWrapper>
                  </MenuItem>
                ) : (
                  vehicles.map((vehicle) => (
                    <VehicleMenuItem
                      key={vehicle.vehicleId}
                      value={vehicle.vehicleId}
                    >
                      {vehicle.name}
                    </VehicleMenuItem>
                  ))
                )}
              </Select>
            </StyledFormControlSelect>

            <StyledNotesField
              label="Ghi chú cho nhân viên *"
              multiline
              rows={3}
              fullWidth
              value={notes}
              onChange={handleNotesChange}
              placeholder="Thêm bất kỳ hướng dẫn đặc biệt hoặc ghi chú nào cho nhân viên"
              required
              error={!notes.trim() && error !== null}
            />
          </Box>
        </StyledDialogContent>
        <StyledDialogActions>
          <CancelButton onClick={onClose} disabled={loading}>
            Hủy
          </CancelButton>
          <SubmitButton
            onClick={handleAssignClick}
            variant="contained"
            color="primary"
            disabled={
              !isFormValid || loading || staffLoading || vehiclesLoading
            }
          >
            Phân công nhân viên
          </SubmitButton>
        </StyledDialogActions>
      </StyledDialog>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirmation}
        onClose={handleCancelConfirmation}
        onConfirm={handleConfirmAssignment}
        staffName={selectedStaff?.name || ""}
        customerName={pickup.customerName}
        equipmentName={selectedEquipment?.name || ""}
        vehicleName={selectedVehicle?.name}
        notes={notes}
      />
    </>
  );
};

export default AssignStaffDialog;
