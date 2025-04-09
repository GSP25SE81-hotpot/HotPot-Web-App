/* eslint-disable @typescript-eslint/no-explicit-any */
import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import AddIcon from "@mui/icons-material/Add";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import FilterListIcon from "@mui/icons-material/FilterList";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PersonIcon from "@mui/icons-material/Person";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { alpha, styled } from "@mui/material/styles";
import React, { useMemo, useState } from "react";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  transition: "all 0.3s ease-in-out",
  borderRadius: 16,
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `0 12px 20px -10px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiSelect-select": {
    padding: theme.spacing(1, 2),
    minWidth: 180,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: 8,
  },
}));

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
  },
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => ({
  borderRadius: 8,
  fontWeight: 600,
  "& .MuiChip-icon": {
    marginLeft: 4,
  },
  ...(status === "In Use" && {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  }),
  ...(status === "Ready for Pickup" && {
    backgroundColor: alpha(theme.palette.warning.main, 0.1),
    color: theme.palette.warning.main,
    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
  }),
  ...(status === "Completed" && {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.main,
    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
  }),
}));

// Enhanced interface with more details
interface HotpotRental {
  id: number;
  hotpotName: string;
  status: string;
  customerName: string;
  customerPhone?: string;
  duration?: string;
  startTime?: string;
  endTime?: string;
  lastUpdated?: string;
  notes?: string;
  items?: string[];
  deposit?: number;
  totalAmount?: number;
  timeRemaining?: number; // percentage
}

// Enhanced initial data
const initialRentals: HotpotRental[] = [
  {
    id: 1,
    hotpotName: "Premium Hotpot Set",
    customerName: "John Doe",
    customerPhone: "0901-234-567",
    status: "In Use",
    lastUpdated: "1 hour ago",
    duration: "2 hours",
    startTime: "14:30",
    endTime: "16:30",
    timeRemaining: 40,
    notes: "Customer requested extra chopsticks",
    items: ["Hotpot base", "Gas stove", "Utensil set"],
    deposit: 500000,
    totalAmount: 350000,
  },
  {
    id: 2,
    hotpotName: "Basic Hotpot Set",
    customerName: "Jane Smith",
    customerPhone: "0912-345-678",
    status: "Ready for Pickup",
    lastUpdated: "3 hours ago",
    duration: "3 hours",
    startTime: "12:00",
    endTime: "15:00",
    timeRemaining: 0,
    notes: "First-time customer",
    items: ["Hotpot base", "Gas stove"],
    deposit: 300000,
    totalAmount: 250000,
  },
  {
    id: 3,
    hotpotName: "Family Hotpot Set",
    customerName: "Emily Johnson",
    customerPhone: "0923-456-789",
    status: "Completed",
    lastUpdated: "Yesterday",
    duration: "4 hours",
    startTime: "18:00",
    endTime: "22:00",
    timeRemaining: 0,
    notes: "Regular customer, VIP discount applied",
    items: [
      "Large hotpot base",
      "Gas stove",
      "Premium utensil set",
      "Extra bowls",
    ],
    deposit: 700000,
    totalAmount: 500000,
  },
  {
    id: 4,
    hotpotName: "Deluxe Hotpot Set",
    customerName: "Michael Brown",
    customerPhone: "0934-567-890",
    status: "In Use",
    lastUpdated: "30 minutes ago",
    duration: "3 hours",
    startTime: "19:00",
    endTime: "22:00",
    timeRemaining: 70,
    notes: "Birthday celebration",
    items: [
      "Deluxe hotpot base",
      "Gas stove",
      "Premium utensil set",
      "Party decorations",
    ],
    deposit: 800000,
    totalAmount: 650000,
  },
  {
    id: 5,
    hotpotName: "Couple Hotpot Set",
    customerName: "Sarah Wilson",
    customerPhone: "0945-678-901",
    status: "Ready for Pickup",
    lastUpdated: "2 hours ago",
    duration: "2 hours",
    startTime: "17:00",
    endTime: "19:00",
    timeRemaining: 0,
    items: ["Small hotpot base", "Gas stove", "Basic utensil set"],
    deposit: 400000,
    totalAmount: 300000,
  },
];

const ManageRentalStatus: React.FC = () => {
  const theme = useTheme();
  const [rentals, setRentals] = useState<HotpotRental[]>(initialRentals);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRental, setSelectedRental] = useState<HotpotRental | null>(
    null
  );
  const [tempStatus, setTempStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentTab, setCurrentTab] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  // Filter rentals based on search query and status filter
  const filteredRentals = useMemo(() => {
    return rentals.filter((rental) => {
      const matchesSearch =
        rental.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rental.hotpotName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rental.id.toString().includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" || rental.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rentals, searchQuery, statusFilter]);

  // Group rentals by status for tabs
  const activeRentals = useMemo(
    () => filteredRentals.filter((r) => r.status === "In Use"),
    [filteredRentals]
  );

  const readyForPickupRentals = useMemo(
    () => filteredRentals.filter((r) => r.status === "Ready for Pickup"),
    [filteredRentals]
  );

  const completedRentals = useMemo(
    () => filteredRentals.filter((r) => r.status === "Completed"),
    [filteredRentals]
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Use":
        return <RestaurantIcon fontSize="small" />;
      case "Ready for Pickup":
        return <PendingActionsIcon fontSize="small" />;
      case "Completed":
        return <DoneAllIcon fontSize="small" />;
      default:
        return <DoneAllIcon fontSize="small" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Use":
        return "primary";
      case "Ready for Pickup":
        return "warning";
      case "Completed":
        return "success";
      default:
        return "info";
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    const rental = rentals.find((r) => r.id === id);
    if (rental) {
      setSelectedRental(rental);
      setTempStatus(newStatus);
      setOpenDialog(true);
    }
  };

  const handleConfirmStatus = () => {
    if (selectedRental && tempStatus) {
      setRentals((prev) =>
        prev.map((rental) =>
          rental.id === selectedRental.id
            ? { ...rental, status: tempStatus, lastUpdated: "Just now" }
            : rental
        )
      );
      setOpenDialog(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleViewDetails = (rental: HotpotRental) => {
    setSelectedRental(rental);
    setOpenDetailsDialog(true);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<unknown>) => {
    setStatusFilter(event.target.value as string);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      {/* Header with stats */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            mb={3}
            spacing={2}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Quản lý cho thuê lẩu
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Theo dõi và quản lý trạng thái các bộ lẩu đang cho thuê
              </Typography>
            </Box>
          </Stack>
        </Grid>

        {/* Search and filter */}
        <Grid size={{ xs: 12 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mb: 3, mt: 1 }}
            alignItems="center"
          >
            <StyledTextField
              placeholder="Tìm kiếm theo tên khách hàng, tên bộ lẩu hoặc ID"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              size="small"
            />

            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel id="status-filter-label">
                Lọc theo trạng thái
              </InputLabel>
              <StyledSelect
                labelId="status-filter-label"
                value={statusFilter}
                label="Lọc theo trạng thái"
                onChange={handleStatusFilterChange}
                startAdornment={
                  <FilterListIcon fontSize="small" sx={{ mr: 1 }} />
                }
              >
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                <MenuItem value="In Use">Đang sử dụng</MenuItem>
                <MenuItem value="Ready for Pickup">Chờ trả</MenuItem>
                <MenuItem value="Completed">Hoàn thành</MenuItem>
              </StyledSelect>
            </FormControl>
          </Stack>
        </Grid>

        {/* Tabs */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              aria-label="rental status tabs"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                },
              }}
            >
              <Tab
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>Tất cả</Typography>
                    <Chip
                      label={filteredRentals.length}
                      size="small"
                      sx={{ height: 20, fontSize: "0.75rem" }}
                    />
                  </Stack>
                }
              />
              <Tab
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>Đang sử dụng</Typography>
                    <Chip
                      label={activeRentals.length}
                      size="small"
                      color="primary"
                      sx={{ height: 20, fontSize: "0.75rem" }}
                    />
                  </Stack>
                }
              />
              <Tab
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>Chờ trả</Typography>
                    <Chip
                      label={readyForPickupRentals.length}
                      size="small"
                      color="warning"
                      sx={{ height: 20, fontSize: "0.75rem" }}
                    />
                  </Stack>
                }
              />
              <Tab
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>Hoàn thành</Typography>
                    <Chip
                      label={completedRentals.length}
                      size="small"
                      color="success"
                      sx={{ height: 20, fontSize: "0.75rem" }}
                    />
                  </Stack>
                }
              />
            </Tabs>
          </Box>
        </Grid>

        {/* Rental cards */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {(currentTab === 0
                ? filteredRentals
                : currentTab === 1
                ? activeRentals
                : currentTab === 2
                ? readyForPickupRentals
                : completedRentals
              ).map((rental) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={rental.id}>
                  <StyledCard>
                    <CardContent>
                      <Stack spacing={2}>
                        {/* Card header with status */}
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Avatar
                              sx={{
                                bgcolor: alpha(
                                  theme.palette[getStatusColor(rental.status)]
                                    .main,
                                  0.1
                                ),
                                color:
                                  theme.palette[getStatusColor(rental.status)]
                                    .main,
                                width: 40,
                                height: 40,
                              }}
                            >
                              {getStatusIcon(rental.status)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {rental.hotpotName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                ID: #{rental.id}
                              </Typography>
                            </Box>
                          </Stack>
                          <StatusChip
                            status={rental.status}
                            label={rental.status}
                            size="small"
                            icon={getStatusIcon(rental.status)}
                          />
                        </Stack>

                        <Divider />

                        {/* Customer info */}
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            sx={{
                              bgcolor: theme.palette.primary.main,
                              width: 32,
                              height: 32,
                            }}
                          >
                            <PersonIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {rental.customerName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {rental.customerPhone}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* Time info */}
                        <Stack spacing={1}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="body2" color="text.secondary">
                              Thời gian thuê:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {rental.duration}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="body2" color="text.secondary">
                              Giờ bắt đầu - kết thúc:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {rental.startTime} - {rental.endTime}
                            </Typography>
                          </Stack>

                          {rental.status === "In Use" &&
                            rental.timeRemaining !== undefined && (
                              <Box>
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Thời gian còn lại:
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    fontWeight="medium"
                                  >
                                    {rental.timeRemaining}%
                                  </Typography>
                                </Stack>
                                <LinearProgress
                                  variant="determinate"
                                  value={rental.timeRemaining}
                                  sx={{
                                    mt: 0.5,
                                    height: 6,
                                    borderRadius: 3,
                                    bgcolor: alpha(
                                      theme.palette.primary.main,
                                      0.1
                                    ),
                                  }}
                                />
                              </Box>
                            )}
                        </Stack>

                        {/* Actions */}
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="space-between"
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewDetails(rental)}
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              flex: 1,
                            }}
                          >
                            Chi tiết
                          </Button>

                          <FormControl sx={{ flex: 1 }} size="small">
                            <StyledSelect
                              value={rental.status}
                              onChange={(e: any) =>
                                handleStatusChange(rental.id, e.target.value)
                              }
                              sx={{
                                "& .MuiSelect-select": {
                                  py: 1,
                                  fontSize: "0.875rem",
                                  fontWeight: 500,
                                },
                              }}
                            >
                              <MenuItem value="In Use">Đang sử dụng</MenuItem>
                              <MenuItem value="Ready for Pickup">
                                Chờ trả
                              </MenuItem>
                              <MenuItem value="Completed">Hoàn thành</MenuItem>
                            </StyledSelect>
                          </FormControl>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}

              {/* Empty state */}
              {(currentTab === 0
                ? filteredRentals
                : currentTab === 1
                ? activeRentals
                : currentTab === 2
                ? readyForPickupRentals
                : completedRentals
              ).length === 0 && (
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      p: 4,
                      textAlign: "center",
                      bgcolor: alpha(theme.palette.background.paper, 0.5),
                      borderRadius: 3,
                      border: `1px dashed ${alpha(theme.palette.divider, 0.5)}`,
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      Không tìm thấy đơn thuê nào
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* Status change confirmation dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn thay đổi trạng thái của{" "}
            <strong>{selectedRental?.hotpotName}</strong> từ{" "}
            <Chip
              label={selectedRental?.status}
              size="small"
              color={getStatusColor(selectedRental?.status || "")}
              sx={{ mx: 0.5 }}
            />
            sang{" "}
            <Chip
              label={tempStatus}
              size="small"
              color={getStatusColor(tempStatus)}
              sx={{ mx: 0.5 }}
            />
            ?
          </Typography>

          {tempStatus === "Completed" && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: alpha(theme.palette.success.main, 0.1),
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Hoàn thành đơn thuê sẽ:
              </Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                <li>Đánh dấu thiết bị đã được trả</li>
                <li>Tính toán phí thuê cuối cùng</li>
                <li>Hoàn trả tiền đặt cọc cho khách hàng</li>
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmStatus}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rental details dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6">Chi tiết đơn thuê</Typography>
            <Chip
              label={selectedRental?.status}
              size="small"
              color={getStatusColor(selectedRental?.status || "")}
            />
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {selectedRental && (
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Thông tin bộ lẩu
                </Typography>
                <Typography variant="h6">
                  {selectedRental.hotpotName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: #{selectedRental.id}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Thông tin khách hàng
                </Typography>
                <Typography variant="body1">
                  {selectedRental.customerName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Số điện thoại: {selectedRental.customerPhone}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Thời gian thuê
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Thời lượng
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedRental.duration}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Cập nhật cuối
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedRental.lastUpdated}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Giờ bắt đầu
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedRental.startTime}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Giờ kết thúc
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedRental.endTime}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>

                {selectedRental.status === "In Use" &&
                  selectedRental.timeRemaining !== undefined && (
                    <Box sx={{ mt: 2 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AccessTimeIcon fontSize="small" color="primary" />
                          <Typography variant="body2">
                            Thời gian còn lại
                          </Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight="medium">
                          {selectedRental.timeRemaining}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={selectedRental.timeRemaining}
                        sx={{
                          mt: 1,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        }}
                      />
                    </Box>
                  )}
              </Box>

              <Divider />

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Danh sách thiết bị
                </Typography>
                {selectedRental.items &&
                  selectedRental.items.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
              </Box>

              <Divider />

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Thông tin thanh toán
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Tiền đặt cọc
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          maximumFractionDigits: 0,
                        }).format(selectedRental.deposit || 0)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Tổng tiền thuê
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          maximumFractionDigits: 0,
                        }).format(selectedRental.totalAmount || 0)}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>

              {selectedRental.notes && (
                <>
                  <Divider />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Ghi chú
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.default, 0.5),
                      }}
                    >
                      <Typography variant="body2">
                        {selectedRental.notes}
                      </Typography>
                    </Paper>
                  </Box>
                </>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDetailsDialog(false)}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Đóng
          </Button>
          {selectedRental && selectedRental.status !== "Completed" && (
            <Button
              variant="contained"
              color={selectedRental.status === "In Use" ? "warning" : "success"}
              onClick={() => {
                setOpenDetailsDialog(false);
                handleStatusChange(
                  selectedRental.id,
                  selectedRental.status === "In Use"
                    ? "Ready for Pickup"
                    : "Completed"
                );
              }}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              {selectedRental.status === "In Use"
                ? "Đánh dấu chờ trả"
                : "Hoàn thành đơn thuê"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageRentalStatus;
