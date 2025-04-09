// src/hooks/usePaymentActions.ts
import { useState } from "react";
import {
  ConfirmDepositRequest,
  ProcessPaymentRequest,
  PaymentDetailDto,
  PaymentReceiptDto,
  PaymentStatus,
} from "../types/staffPayment";
import { staffPaymentService } from "../api/Services/staffPaymentService";
import { toast } from "react-toastify";

export const usePaymentActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const confirmDeposit = async (
    request: ConfirmDepositRequest
  ): Promise<PaymentDetailDto | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await staffPaymentService.confirmDeposit(request);
      toast.success("Deposit confirmed successfully");
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(`Failed to confirm deposit: ${errorMessage}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (
    request: ProcessPaymentRequest
  ): Promise<PaymentReceiptDto | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await staffPaymentService.processPayment(request);
      const statusMessage = getStatusMessage(request.newStatus);
      toast.success(`Payment ${statusMessage} successfully`);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(`Failed to process payment: ${errorMessage}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateReceipt = async (
    paymentId: number
  ): Promise<PaymentReceiptDto | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await staffPaymentService.generateReceipt(paymentId);
      toast.success("Receipt generated successfully");
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

  const getStatusMessage = (status: PaymentStatus): string => {
    switch (status) {
      case PaymentStatus.Success:
        return "approved";
      case PaymentStatus.Cancelled:
        return "cancelled";
      case PaymentStatus.Refunded:
        return "refunded";
      default:
        return "processed";
    }
  };

  return {
    loading,
    error,
    confirmDeposit,
    processPayment,
    generateReceipt,
  };
};
