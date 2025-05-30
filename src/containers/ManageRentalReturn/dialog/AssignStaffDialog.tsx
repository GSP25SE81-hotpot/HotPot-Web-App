import {
  Box,
  CircularProgress,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
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

        // Reset form fields when dialog opens
        setSelectedStaffId("");
        setSelectedVehicleId("");
        setNotes("");
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Không thể tải dữ liệu cần thiết. Vui lòng thử lại sau.");
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

    setLoading(true);
    setError(null);

    try {
      const request: PickupAssignmentRequestDto = {
        staffId: selectedStaffId as number,
        rentOrderDetailId: selectedDetailId,
        notes: notes.trim(),
      };

      if (selectedVehicleId !== "") {
        request.vehicleId = selectedVehicleId as number;
      }

      await allocateStaffForPickup(request);
      onSuccess(); // Just call onSuccess - let parent handle the rest
      onClose(); // Close the dialog
    } catch (err) {
      console.error("Assignment error:", err);
      // Improved error message extraction
      setError(
        err instanceof Error
          ? err.message
          : "Không thể phân công nhân viên. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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
                    {staffMember.name}{" "}
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
            label="Ghi chú cho nhân viên"
            multiline
            rows={3}
            fullWidth
            value={notes}
            onChange={handleNotesChange}
            placeholder="Thêm bất kỳ hướng dẫn đặc biệt hoặc ghi chú nào cho nhân viên"
            required
          />
        </Box>
      </StyledDialogContent>
      <StyledDialogActions>
        <CancelButton onClick={onClose}>Hủy</CancelButton>
        <SubmitButton
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={
            loading ||
            selectedStaffId === "" ||
            !selectedDetailId ||
            !notes.trim()
          }
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Đang xử lý...
            </>
          ) : (
            "Phân công nhân viên"
          )}
        </SubmitButton>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default AssignStaffDialog;
