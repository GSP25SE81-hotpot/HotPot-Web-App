import {
  OrderSize,
  OrderStatus,
  StaffTaskType,
  VehicleType,
} from "../../../../types/orderManagement";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";

// Helper function to get vehicle icon based on type
export const getVehicleIcon = (type?: VehicleType) => {
  if (type === VehicleType.Car) {
    return <DirectionsCarIcon fontSize="small" />;
  } else if (type === VehicleType.Scooter) {
    return <TwoWheelerIcon fontSize="small" />;
  }
  return undefined;
};

// Helper function to get vehicle type name in Vietnamese
export const getVehicleTypeName = (type?: VehicleType): string => {
  if (type === VehicleType.Car) {
    return "Ô tô";
  } else if (type === VehicleType.Scooter) {
    return "Xe máy";
  }
  return "Không có";
};

// Helper function to translate order status into Vietnamese
export const getVietnameseOrderStatusLabel = (status: OrderStatus): string => {
  const statusMap = {
    [OrderStatus.Pending]: "Chờ xử lý",
    [OrderStatus.Processing]: "Đang xử lý",
    [OrderStatus.Shipping]: "Đang giao",
    [OrderStatus.Delivered]: "Đã giao",
    [OrderStatus.Completed]: "Hoàn thành",
    [OrderStatus.Cancelled]: "Đã hủy",
    [OrderStatus.Returning]: "Đang trả",
  } as Record<OrderStatus, string>;
  return statusMap[status] || "Không xác định";
};

// Helper function to translate order size into Vietnamese
export const getVietnameseOrderSizeLabel = (size: OrderSize): string => {
  const sizeMap: Record<OrderSize, string> = {
    [OrderSize.Small]: "Nhỏ",
    [OrderSize.Large]: "Lớn",
  };
  return sizeMap[size] || "Không xác định";
};

// Helper function to translate task type into Vietnamese
export const getVietnameseTaskTypeLabel = (type: StaffTaskType): string => {
  const typeMap: Record<StaffTaskType, string> = {
    [StaffTaskType.Preparation]: "Chuẩn bị",
    [StaffTaskType.Shipping]: "Giao hàng",
    [StaffTaskType.Pickup]: "Nhận hàng",
  };
  return typeMap[type] || "Không xác định";
};
