/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/PaymentManagement.tsx (updated)
import React, { useState } from "react";
import { Alert, Box, Typography } from "@mui/material";
import { usePaymentActions } from "../../hooks/usePaymentActions";
import { usePayments } from "../../hooks/usePayments";
import {
  PaymentFilterRequest,
  PaymentListItemDto,
  PaymentReceiptDto,
} from "../../types/staffPayment";
import PaymentFilter from "./payments/PaymentFilter";
import PaymentTable from "./payments/PaymentTable";
import PaymentDetailDialog from "./payments/PaymentDetailDialog";
import PaymentReceiptDialog from "./payments/PaymentReceiptDialog";
import { printReceipt } from "./services/receiptService";

const PaymentManagement: React.FC = () => {
  // State for dialogs
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentListItemDto | null>(null);
  const [receipt, setReceipt] = useState<PaymentReceiptDto | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [_orderPayments, setOrderPayments] = useState<any>(null);

  // Custom hooks
  const {
    payments,
    loading,
    error,
    page,
    pageSize,
    totalCount,
    totalPages,
    changePage,
    changePageSize,
    updateFilter,
    refresh,
  } = usePayments();

  const { generateReceipt, getOrderPayments } = usePaymentActions();

  // Handle filter change
  const handleFilterChange = (filter: PaymentFilterRequest) => {
    updateFilter(filter);
  };

  // Handle row click to show payment details
  const handleRowClick = (payment: PaymentListItemDto) => {
    setSelectedPayment(payment);
    setOpenDetailDialog(true);
  };

  // Handle generate receipt
  const handleGenerateReceipt = async (paymentId: number) => {
    const result = await generateReceipt(paymentId);
    if (result) {
      setReceipt(result);
      setOpenReceiptDialog(true);
    }
  };

  // Handle print receipt
  const handlePrintReceipt = () => {
    if (!receipt) return;
    printReceipt(receipt);
  };

  // Handle view order payments
  const handleViewOrderPayments = async (orderId: number) => {
    if (!orderId) return;
    const result = await getOrderPayments(orderId);
    if (result) {
      setOrderPayments(result);
      // You could show these in another dialog or handle as needed
      console.log("Order payments:", result);
      // For now, we'll just show an alert
      alert(
        `Found ${result.payments?.length || 0} payments for order #${orderId}`
      );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý thanh toán
      </Typography>

      {/* Filter Component */}
      <PaymentFilter onFilterChange={handleFilterChange} onRefresh={refresh} />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}

      {/* Payments Table */}
      <PaymentTable
        payments={payments}
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        totalPages={totalPages}
        onPageChange={changePage}
        onPageSizeChange={changePageSize}
        onRowClick={handleRowClick}
        onGenerateReceipt={handleGenerateReceipt}
        onViewOrderPayments={handleViewOrderPayments}
      />

      {/* Dialogs */}
      <PaymentDetailDialog
        open={openDetailDialog}
        payment={selectedPayment}
        onClose={() => setOpenDetailDialog(false)}
        onGenerateReceipt={handleGenerateReceipt}
        onViewOrderPayments={handleViewOrderPayments}
      />

      <PaymentReceiptDialog
        open={openReceiptDialog}
        receipt={receipt}
        onClose={() => setOpenReceiptDialog(false)}
        onPrint={handlePrintReceipt}
      />
    </Box>
  );
};

export default PaymentManagement;
