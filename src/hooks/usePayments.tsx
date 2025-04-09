// src/hooks/usePayments.ts
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { staffPaymentService } from "../api/Services/staffPaymentService";
import {
  PaymentFilterRequest,
  PaymentListItemDto,
} from "../types/staffPayment";

export const usePayments = (
  initialFilter: PaymentFilterRequest = {},
  initialPage: number = 1,
  initialPageSize: number = 10
) => {
  const [payments, setPayments] = useState<PaymentListItemDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<PaymentFilterRequest>(initialFilter);
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await staffPaymentService.getPayments(
        filter,
        page,
        pageSize
      );
      setPayments(result.items);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, [filter, page, pageSize]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const updateFilter = (newFilter: PaymentFilterRequest) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when filter changes
  };

  const changePage = (newPage: number) => {
    setPage(newPage);
  };

  const changePageSize = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when page size changes
  };

  return {
    payments,
    loading,
    error,
    filter,
    page,
    pageSize,
    totalCount,
    totalPages,
    updateFilter,
    changePage,
    changePageSize,
    refresh: fetchPayments,
  };
};
