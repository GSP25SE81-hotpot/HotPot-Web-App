/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/staffPayment.ts

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface PaymentFilterRequest {
  status?: number;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface PaymentListItemDto {
  paymentId: number;
  transactionCode: number;
  paymentType: string;
  status: string;
  price: number;
  createdAt: string;
  updatedAt?: string;

  // Minimal order information
  orderCode?: string;
  orderId?: number;
  orderStatus: string;

  // Minimal user information
  userId: number;
  customerName: string;
  customerPhone: string;
}

export interface ReceiptItemDto {
  itemType: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ReceiptRentalItemDto {
  name: string;
  quantity: number;
  rentalPrice: number;
  rentalStartDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
}

export interface PaymentReceiptDto {
  receiptId: number;
  orderId: number;
  orderCode: string;
  paymentId: number;
  transactionCode: string;
  amount: number;
  paymentDate: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;

  // Order details
  orderStatus: string;
  deliveryAddress: string;

  // Order items
  soldItems: ReceiptItemDto[];
  rentedItems: ReceiptRentalItemDto[];

  // Pricing summary
  totalAmount: number;

  // Additional fees if applicable
  lateFee?: number;
  damageFee?: number;

  // Notes
  notes: string;
}
