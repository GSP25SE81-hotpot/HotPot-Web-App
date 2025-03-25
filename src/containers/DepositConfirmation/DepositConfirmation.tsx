import {
  CheckCircleOutline,
  Close,
  Search,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { useState } from "react";

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  backdropFilter: "blur(10px)",
  borderRadius: 16,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  "& .MuiTableCell-root": {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  },
  "& .MuiTableRow-root": {
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      transform: "translateY(-2px)",
    },
  },
}));

const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.1)",
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: alpha(theme.palette.background.paper, 0.95),
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    background: `linear-gradient(135deg, ${alpha(
      theme.palette.background.paper,
      0.95
    )}, ${alpha(theme.palette.background.default, 0.95)})`,
    backdropFilter: "blur(10px)",
  },
}));

type DepositDetails = {
  id: string;
  customer: string;
  items: string;
  amount: number;
  status: string;
  date: string;
  phone: string;
};

const DepositConfirmation: React.FC = () => {
  const theme = useTheme();
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
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleVerify = (id: string) => {
    if (window.confirm("Are you sure you want to verify this deposit?")) {
      setDeposits((prev) =>
        prev.map((dep) =>
          dep.id === id ? { ...dep, status: "verified" } : dep
        )
      );
    }
  };

  const handleReject = (id: string) => {
    if (window.confirm("Are you sure you want to reject this deposit?")) {
      setDeposits((prev) =>
        prev.map((dep) =>
          dep.id === id ? { ...dep, status: "rejected" } : dep
        )
      );
    }
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
    <Box sx={{ maxWidth: "1400px", mx: "auto", p: 2 }}>
      <StyledCard>
        <CardHeader
          title={
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Xác nhận tiền đặt cọc
            </Typography>
          }
        />
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <StyledTextField
                variant="outlined"
                size="small"
                placeholder="Tên khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                slotProps={{
                  input: <Search sx={{ mr: 1 }} />,
                }}
              />
              <StyledTextField
                select
                variant="outlined"
                size="small"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Trạng thái"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="pending">Chờ xác minh</MenuItem>
                <MenuItem value="verified">Đã xác minh</MenuItem>
                <MenuItem value="rejected">Từ chối</MenuItem>
              </StyledTextField>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              Cần xác minh:{" "}
              {deposits.filter((d) => d.status === "pending").length}
            </Typography>
          </Box>
          <StyledTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Khách hàng</TableCell>
                  <TableCell>Mặt hàng</TableCell>
                  <TableCell>Số tiền</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Hành động</TableCell>
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
                        {deposit.status === "pending"
                          ? "Chờ xác minh"
                          : deposit.status === "verified"
                          ? "Đã xác minh"
                          : "Từ chối"}
                      </Typography>
                    </TableCell>
                    <TableCell>{deposit.date}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <AnimatedIconButton
                          size="small"
                          onClick={() => {
                            setSelectedDeposit(deposit);
                            setDetailsOpen(true);
                          }}
                        >
                          <Visibility />
                        </AnimatedIconButton>
                        {deposit.status === "pending" && (
                          <>
                            <AnimatedIconButton
                              size="small"
                              color="success"
                              onClick={() => handleVerify(deposit.id)}
                            >
                              <CheckCircleOutline />
                            </AnimatedIconButton>
                            <AnimatedIconButton
                              size="small"
                              color="error"
                              onClick={() => handleReject(deposit.id)}
                            >
                              <Close />
                            </AnimatedIconButton>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </CardContent>
      </StyledCard>
      <StyledDialog open={detailsOpen} onClose={() => setDetailsOpen(false)}>
        <DialogTitle>Chi tiết đặt cọc</DialogTitle>
        <DialogContent>
          {selectedDeposit && (
            <Box sx={{ minWidth: 300 }}>
              <Typography>
                <strong>ID:</strong> {selectedDeposit.id}
              </Typography>
              <Typography>
                <strong>Khách hàng:</strong> {selectedDeposit.customer}
              </Typography>
              <Typography>
                <strong>Số điện thoại:</strong> {selectedDeposit.phone}
              </Typography>
              <Typography>
                <strong>Mặt hàng:</strong> {selectedDeposit.items}
              </Typography>
              <Typography>
                <strong>Số tiền:</strong> ${selectedDeposit.amount}
              </Typography>
              <Typography>
                <strong>Ngày:</strong> {selectedDeposit.date}
              </Typography>
              <Typography>
                <strong>Trạng thái:</strong>{" "}
                {selectedDeposit.status === "pending"
                  ? "Chờ xác minh"
                  : selectedDeposit.status === "verified"
                  ? "Đã xác minh"
                  : "Từ chối"}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Đóng</Button>
        </DialogActions>
      </StyledDialog>
    </Box>
  );
};

export default DepositConfirmation;
