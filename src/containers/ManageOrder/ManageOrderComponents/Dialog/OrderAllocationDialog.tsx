import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Divider,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  alpha,
  SelectChangeEvent,
  ListSubheader,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { DialogActionButton } from "../../../../components/manager/styles/UnallocatedOrdersListStyles";
import {
  OrderWithDetailsDTO,
  StaffTaskType,
  OrderSizeDTO,
  OrderSize,
  VehicleType,
} from "../../../../types/orderManagement";
import { StaffAvailabilityDto } from "../../../../types/staff";
import { VehicleDTO } from "../../../../types/vehicle";
import { formatDate } from "../../../../utils/formatters";
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
  selectedPrepStaffId: number;
  selectedShippingStaffId: number;
  onPrepStaffChange: (event: SelectChangeEvent<number>) => void;
  onShippingStaffChange: (event: SelectChangeEvent<number>) => void;
  vehicles: VehicleDTO[];
  filteredVehicles: VehicleDTO[];
  selectedVehicleId: number | null;
  onVehicleChange: (event: SelectChangeEvent<number>) => void;
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
  selectedPrepStaffId,
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
  // Group vehicles by type
  const scooters = filteredVehicles.filter(
    (v) => v.type === VehicleType.Scooter
  );
  const cars = filteredVehicles.filter((v) => v.type === VehicleType.Car);

  // Determine which vehicle type to show first based on order size
  const showScootersFirst = !orderSize || orderSize.size === OrderSize.Small;

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
                  selectedOrder.preparationAssignment
                    ? `Nhân viên chuẩn bị: ${
                        selectedOrder.preparationAssignment.staffName
                      } (${formatDate(
                        selectedOrder.preparationAssignment.assignedDate
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
            <FormControl fullWidth>
              <InputLabel id="prep-staff-select-label">
                Chọn nhân viên chuẩn bị
              </InputLabel>
              <Select
                labelId="prep-staff-select-label"
                value={selectedPrepStaffId}
                label="Chọn nhân viên chuẩn bị"
                onChange={onPrepStaffChange}
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
                {prepStaff.map((staffMember) => (
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
              <FormControl fullWidth>
                <InputLabel id="vehicle-select-label">
                  Chọn phương tiện
                </InputLabel>
                <Select
                  labelId="vehicle-select-label"
                  value={selectedVehicleId || 0}
                  label="Chọn phương tiện"
                  onChange={onVehicleChange}
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  <MenuItem value={0}>Không sử dụng phương tiện</MenuItem>

                  {/* Show vehicles grouped by type, with order based on order size */}
                  {showScootersFirst ? (
                    <>
                      {/* Scooters Group */}
                      {scooters.length > 0 && (
                        <>
                          <ListSubheader
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              backgroundColor: (theme) =>
                                alpha(theme.palette.secondary.light, 0.1),
                              borderRadius: 1,
                              my: 0.5,
                            }}
                          >
                            <TwoWheelerIcon
                              fontSize="small"
                              color="secondary"
                            />
                            <Typography variant="body2" fontWeight={600}>
                              Xe máy
                            </Typography>
                            {orderSize?.suggestedVehicleType ===
                              VehicleType.Scooter && (
                              <Chip
                                label="Đề xuất"
                                size="small"
                                color="success"
                                variant="outlined"
                                sx={{ height: 20, fontSize: "0.7rem" }}
                              />
                            )}
                          </ListSubheader>
                          {scooters.map((vehicle) => (
                            <MenuItem
                              key={vehicle.vehicleId}
                              value={vehicle.vehicleId}
                              sx={{
                                borderRadius: 1,
                                my: 0.5,
                                ml: 2, // Indent to show grouping
                                "&:hover": {
                                  backgroundColor: (theme) =>
                                    alpha(theme.palette.secondary.main, 0.08),
                                },
                                "&.Mui-selected": {
                                  backgroundColor: (theme) =>
                                    alpha(theme.palette.secondary.main, 0.12),
                                  "&:hover": {
                                    backgroundColor: (theme) =>
                                      alpha(theme.palette.secondary.main, 0.16),
                                  },
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "100%",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <TwoWheelerIcon
                                    fontSize="small"
                                    color="secondary"
                                  />
                                  <Typography>{vehicle.name}</Typography>
                                </Box>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "text.secondary" }}
                                >
                                  {vehicle.licensePlate}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </>
                      )}

                      {/* Cars Group */}
                      {cars.length > 0 && (
                        <>
                          <ListSubheader
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              backgroundColor: (theme) =>
                                alpha(theme.palette.primary.light, 0.1),
                              borderRadius: 1,
                              my: 0.5,
                            }}
                          >
                            <DirectionsCarIcon
                              fontSize="small"
                              color="primary"
                            />
                            <Typography variant="body2" fontWeight={600}>
                              Ô tô
                            </Typography>
                            {orderSize?.suggestedVehicleType ===
                              VehicleType.Car && (
                              <Chip
                                label="Đề xuất"
                                size="small"
                                color="success"
                                variant="outlined"
                                sx={{ height: 20, fontSize: "0.7rem" }}
                              />
                            )}
                          </ListSubheader>
                          {cars.map((vehicle) => (
                            <MenuItem
                              key={vehicle.vehicleId}
                              value={vehicle.vehicleId}
                              sx={{
                                borderRadius: 1,
                                my: 0.5,
                                ml: 2, // Indent to show grouping
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
                                  width: "100%",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <DirectionsCarIcon
                                    fontSize="small"
                                    color="primary"
                                  />
                                  <Typography>{vehicle.name}</Typography>
                                </Box>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "text.secondary" }}
                                >
                                  {vehicle.licensePlate}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Cars Group (shown first for large orders) */}
                      {cars.length > 0 && (
                        <>
                          <ListSubheader
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              backgroundColor: (theme) =>
                                alpha(theme.palette.primary.light, 0.1),
                              borderRadius: 1,
                              my: 0.5,
                            }}
                          >
                            <DirectionsCarIcon
                              fontSize="small"
                              color="primary"
                            />
                            <Typography variant="body2" fontWeight={600}>
                              Ô tô
                            </Typography>
                            {orderSize?.suggestedVehicleType ===
                              VehicleType.Car && (
                              <Chip
                                label="Đề xuất"
                                size="small"
                                color="success"
                                variant="outlined"
                                sx={{ height: 20, fontSize: "0.7rem" }}
                              />
                            )}
                          </ListSubheader>
                          {cars.map((vehicle) => (
                            <MenuItem
                              key={vehicle.vehicleId}
                              value={vehicle.vehicleId}
                              sx={{
                                borderRadius: 1,
                                my: 0.5,
                                ml: 2, // Indent to show grouping
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
                                  width: "100%",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <DirectionsCarIcon
                                    fontSize="small"
                                    color="primary"
                                  />
                                  <Typography>{vehicle.name}</Typography>
                                </Box>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "text.secondary" }}
                                >
                                  {vehicle.licensePlate}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </>
                      )}

                      {/* Scooters Group */}
                      {scooters.length > 0 && (
                        <>
                          <ListSubheader
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              backgroundColor: (theme) =>
                                alpha(theme.palette.secondary.light, 0.1),
                              borderRadius: 1,
                              my: 0.5,
                            }}
                          >
                            <TwoWheelerIcon
                              fontSize="small"
                              color="secondary"
                            />
                            <Typography variant="body2" fontWeight={600}>
                              Xe máy
                            </Typography>
                            {orderSize?.suggestedVehicleType ===
                              VehicleType.Scooter && (
                              <Chip
                                label="Đề xuất"
                                size="small"
                                color="success"
                                variant="outlined"
                                sx={{ height: 20, fontSize: "0.7rem" }}
                              />
                            )}
                          </ListSubheader>
                          {scooters.map((vehicle) => (
                            <MenuItem
                              key={vehicle.vehicleId}
                              value={vehicle.vehicleId}
                              sx={{
                                borderRadius: 1,
                                my: 0.5,
                                ml: 2, // Indent to show grouping
                                "&:hover": {
                                  backgroundColor: (theme) =>
                                    alpha(theme.palette.secondary.main, 0.08),
                                },
                                "&.Mui-selected": {
                                  backgroundColor: (theme) =>
                                    alpha(theme.palette.secondary.main, 0.12),
                                  "&:hover": {
                                    backgroundColor: (theme) =>
                                      alpha(theme.palette.secondary.main, 0.16),
                                  },
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "100%",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <TwoWheelerIcon
                                    fontSize="small"
                                    color="secondary"
                                  />
                                  <Typography>{vehicle.name}</Typography>
                                </Box>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "text.secondary" }}
                                >
                                  {vehicle.licensePlate}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </>
                      )}
                    </>
                  )}

                  {filteredVehicles.length === 0 && (
                    <MenuItem disabled>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontStyle="italic"
                      >
                        Không có phương tiện khả dụng
                      </Typography>
                    </MenuItem>
                  )}
                </Select>
              </FormControl>

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

              {/* Recommendation based on order size */}
              {orderSize && !estimatingSize && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    color: "text.secondary",
                    fontStyle: "italic",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  {orderSize.size === OrderSize.Small ? (
                    <>
                      <TwoWheelerIcon fontSize="small" color="action" />
                      Đơn hàng nhỏ, có thể sử dụng xe máy để tiết kiệm chi phí
                    </>
                  ) : (
                    <>
                      <DirectionsCarIcon fontSize="small" color="action" />
                      Đơn hàng lớn, nên sử dụng ô tô để đảm bảo đủ không gian
                    </>
                  )}
                </Typography>
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
              !selectedPrepStaffId) ||
            (selectedTaskTypes.includes(StaffTaskType.Shipping) &&
              (!selectedShippingStaffId || !selectedVehicleId))
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
