// src/types/payment.types.ts

export enum PaymentStatus {
  Pending = 1,
  Success = 2,
  Cancelled = 3,
  Refunded = 4,
}

export enum OrderStatus {
  Pending = 1,
  Processing = 2,
  Shipping = 3,
  Delivered = 4,
  Cancelled = 5,
  Returning = 6,
  Completed = 7,
}

export interface PaymentFilterRequest {
  status?: PaymentStatus;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface ConfirmDepositRequest {
  orderId: number;
  paymentId: number;
}

export interface ProcessPaymentRequest {
  orderId: number;
  paymentId: number;
  newStatus: PaymentStatus;
  generateReceipt?: boolean;
}

export interface OrderInfoDto {
  orderId: number;
  status: string;
  totalPrice: number;
  address: string;
  notes?: string;
}

export interface UserInfoDto {
  userId: number;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface ReceiptInfoDto {
  receiptId: number;
  receiptNumber: string;
  generatedAt: string;
}

export interface PaymentDetailDto {
  paymentId: number;
  transactionCode: number;
  paymentType: string;
  status: string;
  price: number;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  order?: OrderInfoDto;
  user: UserInfoDto;
  receipt?: ReceiptInfoDto;
}

export interface PaymentListItemDto {
  paymentId: number;
  transactionCode: number;
  paymentType: string;
  status: string;
  price: number;
  createdAt: string;
  updatedAt?: string;
  orderId?: number;
  orderStatus: string;
  userId: number;
  customerName: string;
  customerPhone: string;
}

export interface PaymentReceiptDto {
  receiptId: number;
  orderId: number;
  paymentId: number;
  transactionCode: string;
  amount: number;
  paymentDate: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
