// src/pages/payments/PaymentTable.tsx
import React from "react";
import {
  Box,
  CircularProgress,
  FormControl,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { PaymentListItemDto } from "../../../types/staffPayment";
import PaymentStatusChip from "./PaymentStatusChip";
import PaymentActions from "./PaymentActions";
import { formatCurrency, formatDate } from "../../../utils/formatters";

interface PaymentTableProps {
  payments: PaymentListItemDto[];
  loading: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRowClick: (payment: PaymentListItemDto) => void;
  onConfirmDeposit: (paymentId: number, orderId: number) => void;
  onGenerateReceipt: (paymentId: number) => void;
  onProcessPayment: (payment: PaymentListItemDto) => void;
}

const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  loading,
  page,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  onConfirmDeposit,
  onGenerateReceipt,
  onProcessPayment,
}) => {
  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Transaction Code</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow
                  key={payment.paymentId}
                  hover
                  onClick={() => onRowClick(payment)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{payment.paymentId}</TableCell>
                  <TableCell>{payment.transactionCode}</TableCell>
                  <TableCell>{payment.customerName}</TableCell>
                  // src/pages/payments/PaymentTable.tsx (continued)
                  <TableCell align="right">
                    {formatCurrency(payment.price)}
                  </TableCell>
                  <TableCell>
                    <PaymentStatusChip status={payment.status} />
                  </TableCell>
                  <TableCell>{payment.orderId || "-"}</TableCell>
                  <TableCell>{formatDate(payment.createdAt)}</TableCell>
                  <TableCell align="center">
                    <PaymentActions
                      status={payment.status}
                      paymentId={payment.paymentId}
                      orderId={payment.orderId}
                      onConfirmDeposit={onConfirmDeposit}
                      onGenerateReceipt={onGenerateReceipt}
                      onProcessPayment={() => onProcessPayment(payment)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing {payments.length > 0 ? (page - 1) * pageSize + 1 : 0} -{" "}
          {Math.min(page * pageSize, totalCount)} of {totalCount} payments
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
              Rows per page:
            </Typography>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 80 }}>
              <Select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                displayEmpty
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => onPageChange(newPage)}
            color="primary"
            size="medium"
            showFirstButton
            showLastButton
            shape="rounded"
            variant="outlined"
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default PaymentTable;
