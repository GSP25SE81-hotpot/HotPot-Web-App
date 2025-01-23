import {
  CheckCircleOutline,
  Close,
  ErrorOutline,
  Search,
  Visibility,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  MenuItem,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

type DepositDetails = {
  id: string;
  customer: string;
  items: string;
  amount: number;
  status: string;
  date: string;
  phone: string;
};

const DepositConfirmation = () => {
  const [deposits, setDeposits] = useState<DepositDetails[]>([
    {
      id: "DEP-2024-001",
      customer: "John Smith",
      items: "Premium Hot Pot Set + 4 Plates",
      amount: 50.0,
      status: "pending",
      date: "2024-01-22",
      phone: "+1 (555) 123-4567",
    },
    {
      id: "DEP-2024-002",
      customer: "Emma Wilson",
      items: "Deluxe Hot Pot + 6 Plates",
      amount: 75.0,
      status: "pending",
      date: "2024-01-22",
      phone: "+1 (555) 234-5678",
    },
    {
      id: "DEP-2024-003",
      customer: "Michael Chang",
      items: "Standard Hot Pot Set",
      amount: 40.0,
      status: "verified",
      date: "2024-01-21",
      phone: "+1 (555) 345-6789",
    },
  ]);

  const [selectedDeposit, setSelectedDeposit] = useState<DepositDetails | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleVerify = (id: string) => {
    setDeposits((prev) =>
      prev.map((dep) => (dep.id === id ? { ...dep, status: "verified" } : dep))
    );
  };

  const handleReject = (id: string) => {
    setDeposits((prev) =>
      prev.map((dep) => (dep.id === id ? { ...dep, status: "rejected" } : dep))
    );
  };

  const filteredDeposits = deposits.filter((deposit) => {
    const matchesSearch = deposit.customer
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || deposit.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 2 }}>
      <Card>
        <CardHeader
          title={
            <Typography variant="h5" fontWeight="bold">
              Quản lý tiền
            </Typography>
          }
        />
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search deposits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1 }} />,
                }}
              />
              <TextField
                select
                variant="outlined"
                size="small"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">Trạng thái</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="verified">Verified</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </TextField>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Pending Verifications:{" "}
              {deposits.filter((d) => d.status === "pending").length}
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Khách hàng</TableCell>
                  <TableCell>Mặt hàng</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDeposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell>{deposit.id}</TableCell>
                    <TableCell>{deposit.customer}</TableCell>
                    <TableCell>{deposit.items}</TableCell>
                    <TableCell>${deposit.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            deposit.status === "pending"
                              ? "orange"
                              : deposit.status === "verified"
                              ? "green"
                              : "red",
                        }}
                      >
                        {deposit.status.charAt(0).toUpperCase() +
                          deposit.status.slice(1)}
                      </Typography>
                    </TableCell>
                    <TableCell>{deposit.date}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => setSelectedDeposit(deposit)}
                        >
                          <Visibility />
                        </IconButton>
                        {deposit.status === "pending" && (
                          <>
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleVerify(deposit.id)}
                            >
                              <CheckCircleOutline />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleReject(deposit.id)}
                            >
                              <Close />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      {selectedDeposit && (
        <Modal
          open={Boolean(selectedDeposit)}
          onClose={() => setSelectedDeposit(null)}
        >
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
              p: 3,
              maxWidth: 600,
              mx: "auto",
              mt: 5,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Deposit Details - {selectedDeposit.id}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography>
                <strong>Tên khách hàng:</strong> {selectedDeposit.customer}
              </Typography>
              <Typography>
                <strong>Số điện thoại:</strong> {selectedDeposit.phone}
              </Typography>
              <Typography>
                <strong>Vật phẩm cho thuê:</strong> {selectedDeposit.items}
              </Typography>
              <Typography>
                <strong>Số tiền:</strong> ${selectedDeposit.amount}
              </Typography>
            </Box>
            <Alert severity="warning" sx={{ mt: 2 }}>
              <ErrorOutline sx={{ mr: 1 }} />
              Vui lòng xác minh ID của khách hàng và thanh toán trước khi xác
              nhận tiền đặt cọc.
            </Alert>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setSelectedDeposit(null)}
              >
                Đóng
              </Button>
              {selectedDeposit.status === "pending" && (
                <>
                  <Button
                    color="error"
                    onClick={() => {
                      handleReject(selectedDeposit.id);
                      setSelectedDeposit(null);
                    }}
                  >
                    Từ chối
                  </Button>
                  <Button
                    color="success"
                    onClick={() => {
                      handleVerify(selectedDeposit.id);
                      setSelectedDeposit(null);
                    }}
                  >
                    Xác minh tiền gửi
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default DepositConfirmation;
