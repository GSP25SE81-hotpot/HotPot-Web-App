import BuildIcon from "@mui/icons-material/Build";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import {
  Alert,
  alpha,
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React from "react";
import { DialogActionButton } from "../../../../components/manager/styles/UnallocatedOrdersListStyles";
import {
  OrderSize,
  OrderSizeDTO,
  OrderWithDetailsDTO,
  StaffTaskType,
  VehicleType,
} from "../../../../types/orderManagement";
import { StaffAvailabilityDto } from "../../../../types/staff";
import { VehicleDTO } from "../../../../types/vehicle";
import { formatDate } from "../../../../utils/formatters";
import GroupedVehicleSelection from "../GroupedVehicleSelection";
import {
  getVehicleTypeName,
  getVietnameseOrderSizeLabel,
  getVietnameseTaskTypeLabel,
} from "../utils/orderHelpers";

interface OrderAllocationDialogProps {
  open: boolean;
  onClose: () => void;
  selectedOrder: OrderWithDetailsDTO | null;
  selectedTaskTypes: StaffTaskType[];
  onTaskTypeChange: (taskType: StaffTaskType) => void;
  prepStaff: StaffAvailabilityDto[];
  shippingStaff: StaffAvailabilityDto[];
  selectedPrepStaffIds: number[]; // Changed from selectedPrepStaffId: number
  selectedShippingStaffId: number;
  onPrepStaffChange: (staffIds: number[]) => void; // Changed to accept an array
  onShippingStaffChange: (event: SelectChangeEvent<number>) => void;
  vehicles: VehicleDTO[];
  filteredVehicles: VehicleDTO[];
  selectedVehicleId: number | null;
  onVehicleChange: (event: SelectChangeEvent<string | number>) => void; // Updated type
  orderSize: OrderSizeDTO | null;
  estimatingSize: boolean;
  onAllocate: () => void;
  allocating: boolean;
}

const OrderAllocationDialog: React.FC<OrderAllocationDialogProps> = ({
  open,
  onClose,
  selectedOrder,
  selectedTaskTypes,
  onTaskTypeChange,
  prepStaff,
  shippingStaff,
  selectedPrepStaffIds,
  selectedShippingStaffId,
  onPrepStaffChange,
  onShippingStaffChange,
  vehicles,
  filteredVehicles,
  selectedVehicleId,
  onVehicleChange,
  orderSize,
  estimatingSize,
  onAllocate,
  allocating,
}) => {
  // Debug logs
  // console.log("Dialog - selectedVehicleId:", selectedVehicleId);
  // console.log("Dialog - filteredVehicles:", filteredVehicles);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)",
            padding: 1,
            maxWidth: 450,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.25rem",
          fontWeight: 600,
          pb: 1,
        }}
      >
        Phân công đơn hàng #{selectedOrder?.orderId}
      </DialogTitle>
      <DialogContent sx={{ pt: 2, px: 3, pb: 2 }}>
        {/* Current Assignment Status */}
        {selectedOrder && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, color: "text.secondary" }}
            >
              Trạng thái phân công hiện tại
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {/* Preparation staff status */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BuildIcon
                  fontSize="small"
                  color={
                    selectedOrder.isPreparationStaffAssigned
                      ? "info"
                      : "disabled"
                  }
                />
                <Typography variant="body2">
                  {selectedOrder.isPreparationStaffAssigned &&
                  selectedOrder.preparationAssignments
                    ? `Nhân viên chuẩn bị: ${
                        selectedOrder.preparationAssignments[0].staffName
                      } (${formatDate(
                        selectedOrder.preparationAssignments[0].assignedDate
                      )})`
                    : "Chưa phân công nhân viên chuẩn bị"}
                </Typography>
              </Box>
              {/* Shipping staff status */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocalShippingIcon
                  fontSize="small"
                  color={
                    selectedOrder.isShippingStaffAssigned
                      ? "secondary"
                      : "disabled"
                  }
                />
                <Typography variant="body2">
                  {selectedOrder.isShippingStaffAssigned &&
                  selectedOrder.shippingAssignment
                    ? `Nhân viên giao hàng: ${
                        selectedOrder.shippingAssignment.staffName
                      } (${formatDate(
                        selectedOrder.shippingAssignment.assignedDate
                      )})`
                    : "Chưa phân công nhân viên giao hàng"}
                </Typography>
              </Box>
              {/* Vehicle status */}
              {selectedOrder.vehicleInfo &&
                selectedOrder.vehicleInfo.vehicleId && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {selectedOrder.vehicleInfo.vehicleType ===
                    VehicleType.Car ? (
                      <DirectionsCarIcon fontSize="small" color="primary" />
                    ) : (
                      <TwoWheelerIcon fontSize="small" color="secondary" />
                    )}
                    <Typography variant="body2">
                      Phương tiện: {selectedOrder.vehicleInfo.vehicleName} (
                      {selectedOrder.vehicleInfo.licensePlate})
                    </Typography>
                  </Box>
                )}
            </Box>
          </Box>
        )}
        <Divider sx={{ my: 2 }} />
        {/* Task Type Selection with Checkboxes */}
        <Box sx={{ mb: 3 }}>
          <FormLabel
            component="legend"
            sx={{ color: "text.secondary", mb: 1, fontSize: "0.875rem" }}
          >
            Loại nhiệm vụ
          </FormLabel>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedTaskTypes.includes(
                    StaffTaskType.Preparation
                  )}
                  onChange={() => onTaskTypeChange(StaffTaskType.Preparation)}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <BuildIcon fontSize="small" />
                  <Typography>Chuẩn bị</Typography>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedTaskTypes.includes(StaffTaskType.Shipping)}
                  onChange={() => onTaskTypeChange(StaffTaskType.Shipping)}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocalShippingIcon fontSize="small" />
                  <Typography>Giao hàng</Typography>
                </Box>
              }
            />
            {selectedTaskTypes.length === 1 && (
              <Alert severity="info" sx={{ mt: 1, borderRadius: 2 }}>
                Bạn có thể phân công cả nhân viên chuẩn bị và giao hàng cùng lúc
                để tiết kiệm thời gian.
              </Alert>
            )}
          </FormGroup>
        </Box>
        <Divider sx={{ my: 2 }} />
        {/* Preparation Staff Selection - Only show if preparation task type is selected */}
        {selectedTaskTypes.includes(StaffTaskType.Preparation) && (
          <Box sx={{ mt: 2, mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, color: "text.secondary" }}
            >
              Chọn nhân viên chuẩn bị
            </Typography>
            {/* Display selected staff with remove option */}
            {selectedPrepStaffIds.length > 0 && (
              <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selectedPrepStaffIds.map((staffId) => {
                  const staff = prepStaff.find((s) => s.id === staffId);
                  return (
                    <Chip
                      key={staffId}
                      label={staff?.name || `ID: ${staffId}`}
                      onDelete={() => {
                        const newIds = selectedPrepStaffIds.filter(
                          (id) => id !== staffId
                        );
                        onPrepStaffChange(newIds);
                      }}
                      icon={<BuildIcon fontSize="small" />}
                      color="primary"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  );
                })}
              </Box>
            )}
            {/* Staff selection dropdown */}
            <FormControl fullWidth>
              <InputLabel id="prep-staff-select-label">
                Thêm nhân viên chuẩn bị
              </InputLabel>
              <Select
                labelId="prep-staff-select-label"
                value={0} // Always show placeholder
                label="Thêm nhân viên chuẩn bị"
                onChange={(e) => {
                  const staffId = Number(e.target.value);
                  if (staffId > 0 && !selectedPrepStaffIds.includes(staffId)) {
                    onPrepStaffChange([...selectedPrepStaffIds, staffId]);
                  }
                }}
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <MenuItem value={0} disabled>
                  Chọn một nhân viên chuẩn bị
                </MenuItem>
                {prepStaff
                  .filter((staff) => !selectedPrepStaffIds.includes(staff.id))
                  .map((staffMember) => (
                    <MenuItem
                      key={staffMember.id}
                      value={staffMember.id}
                      sx={{
                        borderRadius: 1,
                        my: 0.5,
                        "&:hover": {
                          backgroundColor: (theme) =>
                            alpha(theme.palette.primary.main, 0.08),
                        },
                        "&.Mui-selected": {
                          backgroundColor: (theme) =>
                            alpha(theme.palette.primary.main, 0.12),
                          "&:hover": {
                            backgroundColor: (theme) =>
                              alpha(theme.palette.primary.main, 0.16),
                          },
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <BuildIcon fontSize="small" color="info" />
                          <Typography>{staffMember.name}</Typography>
                        </Box>
                        {staffMember.assignmentCount > 0 && (
                          <Box
                            component="span"
                            sx={{
                              ml: 2,
                              bgcolor: "action.hover",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: "0.75rem",
                              fontWeight: "medium",
                              color: "text.secondary",
                            }}
                          >
                            {staffMember.assignmentCount} đơn
                          </Box>
                        )}
                      </Box>
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {selectedPrepStaffIds.length === 0 && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mt: 1, display: "flex", alignItems: "center", gap: 0.5 }}
              >
                Vui lòng chọn ít nhất một nhân viên chuẩn bị
              </Typography>
            )}
          </Box>
        )}
        {selectedTaskTypes.includes(StaffTaskType.Preparation) &&
          selectedTaskTypes.includes(StaffTaskType.Shipping) && (
            <Divider sx={{ my: 2 }} />
          )}
        {/* Shipping Staff and Vehicle Selection - Only show if shipping task type is selected */}
        {selectedTaskTypes.includes(StaffTaskType.Shipping) && (
          <>
            {/* Order Size Information */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Thông tin đơn hàng
              </Typography>
              {estimatingSize ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2">
                    Đang ước tính kích thước đơn hàng...
                  </Typography>
                </Box>
              ) : orderSize ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={`Kích thước: ${getVietnameseOrderSizeLabel(
                        orderSize.size
                      )}`}
                      size="small"
                      color={
                        orderSize.size === OrderSize.Large
                          ? "warning"
                          : "success"
                      }
                    />
                    <Chip
                      label={`Phương tiện đề xuất: ${getVehicleTypeName(
                        orderSize.suggestedVehicleType
                      )}`}
                      size="small"
                      color="info"
                      icon={
                        orderSize.suggestedVehicleType === VehicleType.Car ? (
                          <DirectionsCarIcon fontSize="small" />
                        ) : (
                          <TwoWheelerIcon fontSize="small" />
                        )
                      }
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 0.5 }}
                  >
                    {orderSize.size === OrderSize.Large
                      ? "Đơn hàng lớn, nên sử dụng ô tô để vận chuyển."
                      : "Đơn hàng nhỏ, có thể sử dụng xe máy để vận chuyển."}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Không thể ước tính kích thước đơn hàng.
                </Typography>
              )}
            </Box>
            {/* Shipping Staff Selection */}
            <Box sx={{ mt: 2, mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Chọn nhân viên giao hàng
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="shipping-staff-select-label">
                  Chọn nhân viên giao hàng
                </InputLabel>
                <Select
                  labelId="shipping-staff-select-label"
                  value={selectedShippingStaffId}
                  label="Chọn nhân viên giao hàng"
                  onChange={onShippingStaffChange}
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                >
                  <MenuItem value={0} disabled>
                    Chọn một nhân viên giao hàng
                  </MenuItem>
                  {shippingStaff.map((staffMember) => (
                    <MenuItem
                      key={staffMember.id}
                      value={staffMember.id}
                      sx={{
                        borderRadius: 1,
                        my: 0.5,
                        backgroundColor: staffMember.preparedThisOrder
                          ? (theme) => alpha(theme.palette.success.light, 0.1)
                          : "inherit",
                        "&:hover": {
                          backgroundColor: staffMember.preparedThisOrder
                            ? (theme) => alpha(theme.palette.success.light, 0.2)
                            : (theme) =>
                                alpha(theme.palette.primary.main, 0.08),
                        },
                        "&.Mui-selected": {
                          backgroundColor: staffMember.preparedThisOrder
                            ? (theme) => alpha(theme.palette.success.main, 0.15)
                            : (theme) =>
                                alpha(theme.palette.primary.main, 0.12),
                          "&:hover": {
                            backgroundColor: staffMember.preparedThisOrder
                              ? (theme) =>
                                  alpha(theme.palette.success.main, 0.25)
                              : (theme) =>
                                  alpha(theme.palette.primary.main, 0.16),
                          },
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <LocalShippingIcon
                            fontSize="small"
                            color={
                              staffMember.preparedThisOrder
                                ? "success"
                                : "secondary"
                            }
                          />
                          <Typography>{staffMember.name}</Typography>
                          {staffMember.preparedThisOrder && (
                            <Chip
                              label="Đã chuẩn bị đơn này"
                              size="small"
                              color="success"
                              sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
                            />
                          )}
                        </Box>
                        {staffMember.assignmentCount > 0 && (
                          <Box
                            component="span"
                            sx={{
                              ml: 2,
                              bgcolor: "action.hover",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: "0.75rem",
                              fontWeight: "medium",
                              color: "text.secondary",
                            }}
                          >
                            {staffMember.assignmentCount} đơn
                          </Box>
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {/* Vehicle Selection - Updated with Grouped Vehicles */}
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Chọn phương tiện vận chuyển
              </Typography>

              <GroupedVehicleSelection
                vehicles={filteredVehicles}
                selectedVehicleId={selectedVehicleId}
                onVehicleChange={(event) => {
                  // console.log("Vehicle change in dialog:", event.target.value);
                  onVehicleChange(event as SelectChangeEvent<number>);
                }}
                orderSize={orderSize}
                disabled={!selectedShippingStaffId}
              />

              {/* Warning for large orders with scooter selection */}
              {orderSize &&
                orderSize.size === OrderSize.Large &&
                selectedVehicleId &&
                vehicles.find((v) => v.vehicleId === selectedVehicleId)
                  ?.type === VehicleType.Scooter && (
                  <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                    Đơn hàng lớn nên sử dụng ô tô để vận chuyển. Xe máy có thể
                    không đủ không gian.
                  </Alert>
                )}
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <DialogActionButton
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.text.secondary,
            "&:hover": {
              backgroundColor: (theme) =>
                alpha(theme.palette.text.secondary, 0.08),
            },
          }}
        >
          Hủy bỏ
        </DialogActionButton>
        <DialogActionButton
          onClick={onAllocate}
          variant="contained"
          disabled={
            allocating ||
            (selectedTaskTypes.includes(StaffTaskType.Preparation) &&
              selectedPrepStaffIds.length === 0) ||
            (selectedTaskTypes.includes(StaffTaskType.Shipping) &&
              !selectedShippingStaffId)
          }
          sx={{
            backgroundColor: (theme) => theme.palette.primary.main,
            color: "white",
            "&:hover": {
              backgroundColor: (theme) => theme.palette.primary.dark,
            },
            "&.Mui-disabled": {
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.3),
              color: "white",
            },
          }}
        >
          {allocating ? (
            <CircularProgress size={24} color="inherit" />
          ) : selectedTaskTypes.length > 1 ? (
            "Phân công chuẩn bị và giao hàng"
          ) : (
            `Phân công ${getVietnameseTaskTypeLabel(selectedTaskTypes[0])}`
          )}
        </DialogActionButton>
      </DialogActions>
    </Dialog>
  );
};

export default OrderAllocationDialog;
