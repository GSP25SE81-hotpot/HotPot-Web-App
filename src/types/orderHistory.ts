import { OrderStatus } from "./orderManagement";

// src/types/order.types.ts
export interface OrderItemDto {
  orderDetailId: number;
  itemName: string;
  itemType: string;
  quantity: number;
  volumeWeight?: number;
  unit?: string;
  price: number;
  isRental: boolean;

  // Rental-specific properties
  rentalStartDate?: Date;
  expectedReturnDate?: Date;
  actualReturnDate?: Date;
  lateFee?: number;
  damageFee?: number;
  rentalNotes?: string;
  returnCondition?: string;
  rentalDuration?: number;
  rentalEndDate?: Date;
}

export interface OrderHistoryDto {
  orderId: number;
  orderCode: string;
  userId: number;
  customerName?: string;
  address: string;
  notes: string;
  totalPrice: number;
  status: OrderStatus;
  statusName: string;
  hotpotDeposit?: number;
  createdAt: Date;
  updatedAt?: Date;
  hasShipping: boolean;
  hasFeedback: boolean;
  items: OrderItemDto[];
}

export interface OrderHistoryFilterRequest {
  startDate?: Date;
  endDate?: Date;
  status?: OrderStatus;
  customerName?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
