/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/usePaymentActions.ts
import { useState } from "react";
import { PaymentReceiptDto } from "../types/staffPayment";
import { staffPaymentService } from "../api/Services/staffPaymentService";
import { toast } from "react-toastify";

export const usePaymentActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const generateReceipt = async (
    paymentId: number
  ): Promise<PaymentReceiptDto | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await staffPaymentService.generateReceipt(paymentId);
      toast.success("Biên lai được tạo thành công");
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(`Failed to generate receipt: ${errorMessage}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add new function to get order payments
  const getOrderPayments = async (orderId: number): Promise<any | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await staffPaymentService.getOrderPayments(orderId);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(`Không thể lấy được đơn hàng thanh toán: ${errorMessage}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateReceipt,
    getOrderPayments,
  };
};
