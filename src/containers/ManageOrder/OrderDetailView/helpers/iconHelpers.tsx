// src/pages/OrderManagement/components/helpers/iconHelpers.ts
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { VehicleType } from "../../../../types/orderManagement";

export const getVehicleIcon = (type?: VehicleType) => {
  if (type === VehicleType.Car) {
    return <DirectionsCarIcon fontSize="small" />;
  } else if (type === VehicleType.Scooter) {
    return <TwoWheelerIcon fontSize="small" />;
  }
  return undefined;
};

export const getVehicleTypeName = (type?: VehicleType): string => {
  if (type === VehicleType.Car) {
    return "Ô tô";
  } else if (type === VehicleType.Scooter) {
    return "Xe máy";
  }
  return "Không có";
};

export const getItemTypeDisplay = (itemType: string) => {
  switch (itemType) {
    case "Ingredient":
      return { label: "Nguyên liệu", color: "primary" };
    case "Customization":
      return { label: "Tùy chỉnh", color: "secondary" };
    case "Combo":
      return { label: "Combo", color: "success" };
    case "Utensil":
      return { label: "Dụng cụ", color: "info" };
    case "Hotpot":
      return { label: "Nồi lẩu", color: "warning" };
    default:
      return { label: itemType, color: "default" };
  }
};

export const getVietnameseOrderStatusLabel = (status: number): string => {
  switch (status) {
    case 0: // OrderStatus.Cart
      return "Trong giỏ hàng";
    case 1: // OrderStatus.Pending
      return "Chờ xử lý";
    case 2: // OrderStatus.Processing
      return "Đang xử lý";
    case 3: // OrderStatus.Processed
      return "Đã xử lý";
    case 4: // OrderStatus.Shipping
      return "Đang giao";
    case 5: // OrderStatus.Delivered
      return "Đã giao";
    case 6: // OrderStatus.Cancelled
      return "Đã hủy";
    case 7: // OrderStatus.Returning
      return "Đang trả hàng";
    case 8: // OrderStatus.Completed
      return "Hoàn thành";
    default:
      return `Trạng thái ${status}`;
  }
};
