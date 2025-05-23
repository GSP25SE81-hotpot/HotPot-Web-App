import { format, differenceInDays } from "date-fns";
import { vi } from "date-fns/locale";
import { OrderStatus } from "../types/orderManagement";

export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
};

export const formatDetailDate = (dateString: string): string => {
  return format(new Date(dateString), "dd/MM/yyyy, HH:mm", { locale: vi });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const getDaysOverdue = (expectedDate: string): number => {
  const today = new Date();
  const expected = new Date(expectedDate);
  return differenceInDays(today, expected);
};

export const getOrderStatusLabel = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.Pending:
      return "Pending";
    case OrderStatus.Processing:
      return "Processing";
    case OrderStatus.Shipping:
      return "Shipping";
    case OrderStatus.Delivered:
      return "Delivered";
    case OrderStatus.Cancelled:
      return "Cancelled";
    case OrderStatus.Returning:
      return "Returning";
    case OrderStatus.Completed:
      return "Completed";
    default:
      return "Unknown";
  }
};

export const getOrderStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.Pending:
      return "#FFA726"; // Orange
    case OrderStatus.Processing:
      return "#42A5F5"; // Blue
    case OrderStatus.Shipping:
      return "#7E57C2"; // Purple
    case OrderStatus.Delivered:
      return "#66BB6A"; // Green
    case OrderStatus.Cancelled:
      return "#EF5350"; // Red
    case OrderStatus.Returning:
      return "#78909C"; // Blue Grey
    case OrderStatus.Completed:
      return "#26A69A"; // Teal
    default:
      return "#9E9E9E"; // Grey
  }
};
