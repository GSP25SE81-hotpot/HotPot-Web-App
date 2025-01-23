import {
  AttachMoney,
  CalendarToday,
  CreditCard,
  Description,
  Receipt,
  Search,
  SvgIconComponent,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useState } from "react";

interface Transaction {
  id: string;
  customerName: string;
  type: "rental" | "purchase" | "deposit";
  items: string;
  amount: number;
  deposit: number;
  status: "pending" | "completed" | "refunded" | "failed";
  date: string;
  paymentMethod: "credit_card" | "cash" | "bank_transfer";
}

interface SummaryCardProps {
  icon: SvgIconComponent;
  title: string;
  value: string;
  color: string;
}

const PaymentManagement: React.FC = () => {
  const [transactions] = useState<Transaction[]>([
    {
      id: "TXN-2024-001",
      customerName: "John Smith",
      type: "rental",
      items: "Premium Hot Pot Set (48hrs)",
      amount: 75.0,
      deposit: 50.0,
      status: "pending",
      date: "2024-01-22",
      paymentMethod: "credit_card",
    },
    {
      id: "TXN-2024-002",
      customerName: "Emma Wilson",
      type: "purchase",
      items: "Sauce Set + Ingredients Pack",
      amount: 45.0,
      deposit: 0,
      status: "completed",
      date: "2024-01-22",
      paymentMethod: "cash",
    },
    {
      id: "TXN-2024-003",
      customerName: "Michael Chang",
      type: "rental",
      items: "Standard Hot Pot Set (24hrs)",
      amount: 45.0,
      deposit: 30.0,
      status: "refunded",
      date: "2024-01-21",
      paymentMethod: "credit_card",
    },
  ]);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showNewPayment, setShowNewPayment] = useState(false);

  const getTotalAmount = (transaction: Transaction): number => {
    return transaction.amount + (transaction.deposit || 0);
  };

  const getStatusColor = (status: Transaction["status"]): string => {
    const colors: Record<Transaction["status"], string> = {
      pending: "#fff3cd",
      completed: "#d4edda",
      refunded: "#cce5ff",
      failed: "#f8d7da",
    };
    return colors[status];
  };

  const getStatusTextColor = (status: Transaction["status"]): string => {
    const colors: Record<Transaction["status"], string> = {
      pending: "#856404",
      completed: "#155724",
      refunded: "#004085",
      failed: "#721c24",
    };
    return colors[status];
  };

  const SummaryCard: React.FC<SummaryCardProps> = ({
    icon: Icon,
    title,
    value,
    color,
  }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: "50%",
              p: 1,
              mr: 2,
            }}
          >
            <Icon sx={{ color: color, fontSize: 24 }} />
          </Box>
          <Box>
            <Typography color="textSecondary" variant="body2">
              {title}
            </Typography>
            <Typography variant="h6">{value}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const NewPaymentForm = () => (
    <Modal
      open={showNewPayment}
      onClose={() => setShowNewPayment(false)}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Thanh toán mới
          </Typography>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Loại giao dịch</InputLabel>
                  <Select defaultValue="rental" label="Transaction Type">
                    <MenuItem value="rental">Thanh toán tiền thuê</MenuItem>
                    <MenuItem value="purchase">Thanh toán mua hàng</MenuItem>
                    <MenuItem value="deposit">Thanh toán tiền cọc</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Customer Name" />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField fullWidth label="Amount" type="number" />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Deposit (if applicable)"
                  type="number"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Phương thức thanh toán</InputLabel>
                  <Select defaultValue="credit_card" label="Payment Method">
                    <MenuItem value="credit_card">Thẻ tín dụng</MenuItem>
                    <MenuItem value="cash">Tiền mặt</MenuItem>
                    <MenuItem value="bank_transfer">
                      Chuyển khoản ngân hàng
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Items" multiline rows={3} />
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setShowNewPayment(false)}
              >
                Hủy bỏ
              </Button>
              <Button variant="contained" color="primary">
                Quy trình thanh toán
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Modal>
  );

  const TransactionDetailsModal = () => (
    <Modal
      open={!!selectedTransaction}
      onClose={() => setSelectedTransaction(null)}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 600, width: "100%" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Chi tiết giao dịch - {selectedTransaction?.id}
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 6 }}>
              <Typography color="textSecondary" variant="body2">
                Tên khách hàng
              </Typography>
              <Typography variant="body1">
                {selectedTransaction?.customerName}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography color="textSecondary" variant="body2">
                Loại giao dịch
              </Typography>
              <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
                {selectedTransaction?.type}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography color="textSecondary" variant="body2">
                Mặt hàng
              </Typography>
              <Typography variant="body1">
                {selectedTransaction?.items}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography color="textSecondary" variant="body2">
                Số lượng
              </Typography>
              <Typography variant="body1">
                ${selectedTransaction?.amount.toFixed(2)}
              </Typography>
            </Grid>
            {selectedTransaction && selectedTransaction.deposit > 0 && (
              <Grid size={{ xs: 6 }}>
                <Typography color="textSecondary" variant="body2">
                  Tiền gửi
                </Typography>
                <Typography variant="body1">
                  ${selectedTransaction.deposit.toFixed(2)}
                </Typography>
              </Grid>
            )}
          </Grid>

          {selectedTransaction?.status === "pending" && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Giao dịch này đang chờ xử lý. Vui lòng xác minh thông tin thanh
              toán trước khi xử lý.
            </Alert>
          )}

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}
          >
            <Button
              variant="outlined"
              onClick={() => setSelectedTransaction(null)}
            >
              Đóng
            </Button>
            {selectedTransaction?.status === "pending" && (
              <Button variant="contained" color="success">
                Process Payment
              </Button>
            )}
            {selectedTransaction?.status === "completed" && (
              <Button variant="outlined">In Biên lai</Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Modal>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            icon={AttachMoney}
            title="Today's Revenue"
            value="$1,234.00"
            color="#2196f3"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            icon={CreditCard}
            title="Pending Payments"
            value="5"
            color="#4caf50"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            icon={Receipt}
            title="Active Deposits"
            value="$450.00"
            color="#ff9800"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            icon={Description}
            title="Total Transactions"
            value="128"
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h5">Payment Management</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowNewPayment(true)}
            >
              Thanh toán mới
            </Button>
          </Box>

          {/* Filters */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
            <TextField
              size="small"
              placeholder="Search transactions..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 250 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select label="Type" defaultValue="all">
                <MenuItem value="all">Tất cả các loại</MenuItem>
                <MenuItem value="rental">Rental</MenuItem>
                <MenuItem value="purchase">Purchase</MenuItem>
                <MenuItem value="deposit">Deposit</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select label="Status" defaultValue="all">
                <MenuItem value="all">Trạng thái</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="refunded">Refunded</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<CalendarToday />}
              size="small"
            >
              Date Range
            </Button>
          </Box>

          {/* Transactions Table */}
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Khách hàng</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.customerName}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {transaction.type}
                    </TableCell>
                    <TableCell>{transaction.items}</TableCell>
                    <TableCell>
                      ${getTotalAmount(transaction).toFixed(2)}
                      {transaction.deposit > 0 && (
                        <Typography
                          variant="caption"
                          display="block"
                          color="textSecondary"
                        >
                          (Includes ${transaction.deposit} deposit)
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: getStatusColor(transaction.status),
                          color: getStatusTextColor(transaction.status),
                          py: 0.5,
                          px: 1,
                          borderRadius: 1,
                          display: "inline-block",
                          fontSize: "0.875rem",
                        }}
                      >
                        {transaction.status.charAt(0).toUpperCase() +
                          transaction.status.slice(1)}
                      </Box>
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Modals */}
      {showNewPayment && <NewPaymentForm />}
      {selectedTransaction && <TransactionDetailsModal />}
    </Box>
  );
};

export default PaymentManagement;
