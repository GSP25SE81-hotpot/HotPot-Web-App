/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/staffPaymentService.ts
import axiosClient from "../axiosInstance";
import {
  PaymentFilterRequest,
  ConfirmDepositRequest,
  ProcessPaymentRequest,
  PaymentDetailDto,
  PaymentListItemDto,
  PaymentReceiptDto,
  PagedResult,
} from "../../types/staffPayment";

const STAFF_PAYMENT_API = "/staff/payments";

export const staffPaymentService = {
  /**
   * Get paginated list of payments with filtering
   */
  getPayments: async (
    filter: PaymentFilterRequest,
    pageNumber: number = 1,
    pageSize: number = 20
  ): Promise<PagedResult<PaymentListItemDto>> => {
    try {
      // Convert filter to query params
      const params = new URLSearchParams();

      if (filter.status !== undefined)
        params.append("Status", filter.status.toString());
      if (filter.fromDate) params.append("FromDate", filter.fromDate);
      if (filter.toDate) params.append("ToDate", filter.toDate);
      if (filter.sortBy) params.append("SortBy", filter.sortBy);
      if (filter.sortDescending !== undefined)
        params.append("SortDescending", filter.sortDescending.toString());

      params.append("pageNumber", pageNumber.toString());
      params.append("pageSize", pageSize.toString());

      const response = await axiosClient.get<
        any,
        PagedResult<PaymentListItemDto>
      >(`${STAFF_PAYMENT_API}?${params.toString()}`);

      return response;
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  },

  /**
   * Confirm a deposit payment
   */
  confirmDeposit: async (
    request: ConfirmDepositRequest
  ): Promise<PaymentDetailDto> => {
    try {
      const response = await axiosClient.post<any, PaymentDetailDto>(
        `${STAFF_PAYMENT_API}/confirm-deposit`,
        request
      );

      return response;
    } catch (error) {
      console.error("Error confirming deposit:", error);
      throw error;
    }
  },

  /**
   * Process a payment (update status)
   */
  processPayment: async (
    request: ProcessPaymentRequest
  ): Promise<PaymentReceiptDto> => {
    try {
      const response = await axiosClient.post<any, PaymentReceiptDto>(
        `${STAFF_PAYMENT_API}/process`,
        request
      );

      return response;
    } catch (error) {
      console.error("Error processing payment:", error);
      throw error;
    }
  },

  /**
   * Generate a receipt for a payment
   */
  generateReceipt: async (paymentId: number): Promise<PaymentReceiptDto> => {
    try {
      const response = await axiosClient.get<any, PaymentReceiptDto>(
        `${STAFF_PAYMENT_API}/receipt/${paymentId}`
      );

      return response;
    } catch (error) {
      console.error("Error generating receipt:", error);
      throw error;
    }
  },
};
