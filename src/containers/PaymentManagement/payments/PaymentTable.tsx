import React from "react";
import {
  CircularProgress,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { PaymentListItemDto } from "../../../types/staffPayment";
import PaymentStatusChip from "./PaymentStatusChip";
import PaymentActions from "./PaymentActions";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import {
  TableWrapper,
  StyledTableContainer,
  TableHeader,
  HeaderCell,
  ClickableRow,
  LoadingCell,
  EmptyCell,
  PaginationContainer,
  PaginationInfo,
  PaginationControls,
  PageSizeSelector,
  PageSizeLabel,
  PageSizeControl,
  IdCell,
  TransactionCodeCell,
  CustomerNameCell,
  AmountCell,
  OrderCodeCell,
  DateCell,
} from "./PaymentStyle";

// Status translation function
const translatePaymentStatus = (status: string): string => {
  switch (status) {
    case "Success":
      return "Thành công";
    case "Cancelled":
      return "Đã hủy";
    case "Refunded":
      return "Hoàn tiền";
    default:
      return status;
  }
};

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
  onGenerateReceipt: (paymentId: number) => void;
  onViewOrderPayments?: (orderId: number) => void;
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
  onGenerateReceipt,
  onViewOrderPayments,
}) => {
  return (
    <TableWrapper>
      <StyledTableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Mã giao dịch</HeaderCell>
              <HeaderCell>Khách hàng</HeaderCell>
              <HeaderCell align="right">Số tiền</HeaderCell>
              <HeaderCell>Trạng thái</HeaderCell>
              <HeaderCell>Mã đơn hàng</HeaderCell>
              <HeaderCell>Ngày tạo</HeaderCell>
              <HeaderCell align="center"></HeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <LoadingCell colSpan={8}>
                  <CircularProgress />
                </LoadingCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <EmptyCell colSpan={8}>Không tìm thấy thanh toán nào</EmptyCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <ClickableRow
                  key={payment.paymentId}
                  hover
                  onClick={() => onRowClick(payment)}
                >
                  <IdCell>{payment.paymentId}</IdCell>
                  <TransactionCodeCell>
                    {payment.transactionCode}
                  </TransactionCodeCell>
                  <CustomerNameCell>{payment.customerName}</CustomerNameCell>
                  <AmountCell align="right">
                    {formatCurrency(payment.price)}
                  </AmountCell>
                  <TableCell>
                    <PaymentStatusChip
                      status={payment.status}
                      translatedLabel={translatePaymentStatus(payment.status)}
                    />
                  </TableCell>
                  <OrderCodeCell>{payment.orderCode || "N/A"}</OrderCodeCell>
                  <DateCell>{formatDate(payment.createdAt)}</DateCell>
                  <TableCell align="center">
                    <PaymentActions
                      status={payment.status}
                      paymentId={payment.paymentId}
                      orderId={payment.orderId}
                      onGenerateReceipt={onGenerateReceipt}
                      onViewOrderPayments={onViewOrderPayments}
                    />
                  </TableCell>
                </ClickableRow>
              ))
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
      {/* Pagination */}
      <PaginationContainer>
        <PaginationInfo variant="body2">
          Hiển thị {payments.length > 0 ? (page - 1) * pageSize + 1 : 0} -{" "}
          {Math.min(page * pageSize, totalCount)} trong tổng số {totalCount}{" "}
          thanh toán
        </PaginationInfo>
        <PaginationControls>
          <PageSizeSelector>
            <PageSizeLabel variant="body2">Số dòng mỗi trang:</PageSizeLabel>
            <PageSizeControl variant="outlined" size="small">
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
            </PageSizeControl>
          </PageSizeSelector>
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
        </PaginationControls>
      </PaginationContainer>
    </TableWrapper>
  );
};

export default PaymentTable;
