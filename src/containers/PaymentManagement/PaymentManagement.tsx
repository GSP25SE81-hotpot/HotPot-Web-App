/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/PaymentManagement.tsx (updated)
import React, { useState } from "react";
import { Alert, Box, Typography } from "@mui/material";
import { usePaymentActions } from "../../hooks/usePaymentActions";
import { usePayments } from "../../hooks/usePayments";
import {
  PaymentDetailDto,
  PaymentFilterRequest,
  PaymentListItemDto,
  PaymentReceiptDto,
  PaymentStatus,
  ProcessPaymentRequest,
} from "../../types/staffPayment";
import PaymentFilter from "./payments/PaymentFilter";
import PaymentTable from "./payments/PaymentTable";
import PaymentDetailDialog from "./payments/PaymentDetailDialog";
import ProcessPaymentDialog from "./payments/ProcessPaymentDialog";
import PaymentReceiptDialog from "./payments/PaymentReceiptDialog";
import { printReceipt } from "./services/receiptService";

const PaymentManagement: React.FC = () => {
  // State for dialogs
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentListItemDto | null>(null);
  const [_paymentDetail, setPaymentDetail] = useState<PaymentDetailDto | null>(
    null
  );
  const [receipt, setReceipt] = useState<PaymentReceiptDto | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [processingAction, setProcessingAction] =
    useState<PaymentStatus | null>(null);

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

  const {
    loading: actionLoading,
    error: actionError,
    confirmDeposit,
    processPayment,
    generateReceipt,
  } = usePaymentActions();

  // Handle filter change
  const handleFilterChange = (filter: PaymentFilterRequest) => {
    updateFilter(filter);
  };

  // Handle row click to show payment details
  const handleRowClick = (payment: PaymentListItemDto) => {
    setSelectedPayment(payment);
    setOpenDetailDialog(true);
  };

  // Handle confirm deposit
  const handleConfirmDeposit = async (paymentId: number, orderId: number) => {
    const result = await confirmDeposit({ paymentId, orderId });
    if (result) {
      setPaymentDetail(result);
      refresh();
      // Close the detail dialog if it's open
      setOpenDetailDialog(false);
    }
  };

  // Handle process payment
  const handleProcessPayment = async (status: PaymentStatus) => {
    if (!selectedPayment) return;

    setProcessingAction(status);

    const request: ProcessPaymentRequest = {
      paymentId: selectedPayment.paymentId,
      orderId: selectedPayment.orderId || 0,
      newStatus: status,
      generateReceipt: status === PaymentStatus.Success,
    };

    const result = await processPayment(request);
    if (result) {
      setReceipt(result);
      setOpenConfirmDialog(false);
      setOpenDetailDialog(false);
      if (status === PaymentStatus.Success) {
        setOpenReceiptDialog(true);
      }
      refresh();
    }

    setProcessingAction(null);
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Payment Management
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
        onConfirmDeposit={handleConfirmDeposit}
        onGenerateReceipt={handleGenerateReceipt}
        onProcessPayment={(payment) => {
          setSelectedPayment(payment);
          setOpenConfirmDialog(true);
        }}
      />

      {/* Dialogs */}
      <PaymentDetailDialog
        open={openDetailDialog}
        payment={selectedPayment}
        onClose={() => setOpenDetailDialog(false)}
        onProcessPayment={() => {
          setOpenDetailDialog(false);
          setOpenConfirmDialog(true);
        }}
        onConfirmDeposit={handleConfirmDeposit}
      />

      <ProcessPaymentDialog
        open={openConfirmDialog}
        payment={selectedPayment}
        onClose={() => setOpenConfirmDialog(false)}
        onProcessPayment={handleProcessPayment}
        processingAction={processingAction}
        actionLoading={actionLoading}
        actionError={actionError}
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
