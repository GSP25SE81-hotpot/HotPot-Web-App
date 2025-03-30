/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/LowStockUtensils.tsx
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  Edit as EditIcon,
  ErrorOutline as ErrorOutlineIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  Alert,
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
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { alpha } from "@mui/material/styles";
import React, { useEffect, useMemo, useState } from "react";
import stockService from "../../api/Services/stockService";
import {
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
} from "../../components/manager/styles/LowStockUtensilStyles";
import { NotifyAdminStockRequest, UtensilDto } from "../../types/stock";

// Types
type Order = "asc" | "desc";
type SortableColumn = "name" | "quantity" | "utensilTypeName";

interface HeadCell {
  id: SortableColumn | string;
  label: string;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: "name", label: "Tên dụng cụ", sortable: true },
  { id: "utensilTypeName", label: "Loại dụng cụ", sortable: true },
  { id: "material", label: "Chất liệu", sortable: false },
  { id: "quantity", label: "Số lượng", sortable: true },
  { id: "status", label: "Trạng thái", sortable: false },
  { id: "actions", label: "Hành động", sortable: false },
];

// Component
const LowStockUtensils: React.FC = () => {
  const theme = useTheme();
  const [utensils, setUtensils] = useState<UtensilDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<SortableColumn>("name");
  const [threshold, setThreshold] = useState(5);

  // Dialog states
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openNotifyDialog, setOpenNotifyDialog] = useState(false);
  const [selectedUtensil, setSelectedUtensil] = useState<UtensilDto | null>(
    null
  );
  const [newQuantity, setNewQuantity] = useState(0);
  const [notifyReason, setNotifyReason] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);

  // Fetch data
  const fetchLowStockUtensils = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await stockService.getLowStockUtensils(threshold);

      if (response.success) {
        setUtensils(response.data);
        if (response.data.length === 0) {
          setError(`No utensils found below ${threshold}% stock level`);
        }
      } else {
        setError(response.message);
        setUtensils([]);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred");
      setUtensils([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockUtensils();
  }, []);

  // Handle sort request
  const handleRequestSort = (property: SortableColumn) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Filter and sort utensils
  const filteredUtensils = useMemo(() => {
    // Add a null check before filtering
    if (!utensils || !Array.isArray(utensils)) {
      return [];
    }

    return utensils
      .filter(
        (utensil) =>
          utensil.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          utensil.utensilTypeName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          utensil.material.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];

        if (order === "asc") {
          if (typeof aValue === "string" && typeof bValue === "string") {
            return aValue.localeCompare(bValue);
          }
          return (aValue as number) - (bValue as number);
        } else {
          if (typeof aValue === "string" && typeof bValue === "string") {
            return bValue.localeCompare(aValue);
          }
          return (bValue as number) - (aValue as number);
        }
      });
  }, [utensils, searchQuery, order, orderBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    // Add a null check before calculating stats
    if (!utensils || !Array.isArray(utensils)) {
      return {
        totalItems: 0,
        criticalItems: 0,
        lowItems: 0,
        unavailableItems: 0,
      };
    }

    const totalItems = utensils.length;
    const criticalItems = utensils.filter((u) => u.quantity <= 2).length;
    const lowItems = utensils.filter(
      (u) => u.quantity > 2 && u.quantity <= 5
    ).length;
    const unavailableItems = utensils.filter((u) => !u.status).length;

    return { totalItems, criticalItems, lowItems, unavailableItems };
  }, [utensils]);

  // Handle update quantity
  const handleUpdateQuantity = async () => {
    if (!selectedUtensil || newQuantity < 0) return;

    try {
      setLoading(true);
      await stockService.updateUtensilQuantity(
        selectedUtensil.utensilId,
        newQuantity
      );
      setUpdateSuccess(true);

      // Update local state
      setUtensils((prev) =>
        prev.map((u) =>
          u.utensilId === selectedUtensil.utensilId
            ? { ...u, quantity: newQuantity }
            : u
        )
      );

      setTimeout(() => {
        setUpdateSuccess(false);
        setOpenUpdateDialog(false);
      }, 1500);
    } catch (err) {
      console.error("Error updating utensil quantity:", err);
      setError("Không thể cập nhật số lượng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Handle notify admin
  const handleNotifyAdmin = async () => {
    if (!selectedUtensil || !notifyReason) return;

    try {
      setLoading(true);
      const request: NotifyAdminStockRequest = {
        notificationType: "LowStock",
        equipmentType: "Utensil",
        equipmentId: selectedUtensil.utensilId,
        equipmentName: selectedUtensil.name,
        currentQuantity: selectedUtensil.quantity,
        threshold: threshold,
        reason: notifyReason,
      };

      await stockService.notifyAdminDirectly(request);
      setNotifySuccess(true);

      setTimeout(() => {
        setNotifySuccess(false);
        setOpenNotifyDialog(false);
        setNotifyReason("");
      }, 1500);
    } catch (err) {
      console.error("Error notifying admin:", err);
      setError("Không thể gửi thông báo. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Get status chip color
  const getStatusChip = (utensil: UtensilDto) => {
    if (!utensil.status) {
      return (
        <Chip
          label="Không sẵn sàng"
          size="small"
          color="error"
          icon={<ErrorOutlineIcon />}
        />
      );
    }

    if (utensil.quantity <= 2) {
      return (
        <Chip
          label="Cực kỳ thấp"
          size="small"
          color="error"
          icon={<WarningIcon />}
        />
      );
    }

    if (utensil.quantity <= 5) {
      return (
        <Chip
          label="Sắp hết"
          size="small"
          color="warning"
          icon={<WarningIcon />}
        />
      );
    }

    return (
      <Chip
        label="Đủ dùng"
        size="small"
        color="success"
        icon={<CheckCircleOutlineIcon />}
      />
    );
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Quản lý dụng cụ sắp hết hàng
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Theo dõi và quản lý các dụng cụ có số lượng thấp
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchLowStockUtensils}
        >
          Làm mới
        </Button>
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[2] }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Tổng số dụng cụ
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.totalItems}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Dụng cụ có số lượng thấp
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              bgcolor: alpha(theme.palette.error.main, 0.05),
            }}
          >
            <CardContent>
              <Typography color="error.main" gutterBottom>
                Cực kỳ thấp
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {stats.criticalItems}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Số lượng ≤ 2
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              bgcolor: alpha(theme.palette.warning.main, 0.05),
            }}
          >
            <CardContent>
              <Typography color="warning.main" gutterBottom>
                Sắp hết
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {stats.lowItems}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Số lượng 3-5
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              bgcolor: alpha(theme.palette.info.main, 0.05),
            }}
          >
            <CardContent>
              <Typography color="info.main" gutterBottom>
                Không sẵn sàng
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {stats.unavailableItems}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Dụng cụ không khả dụng
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <TextField
          placeholder="Tìm kiếm dụng cụ..."
          variant="outlined"
          size="small"
          fullWidth
          sx={{ maxWidth: 400 }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="threshold-label">Ngưỡng số lượng</InputLabel>
            <Select
              labelId="threshold-label"
              value={threshold}
              label="Ngưỡng số lượng"
              onChange={(e) => setThreshold(Number(e.target.value))}
            >
              <MenuItem value={2}>≤ 2 (Cực kỳ thấp)</MenuItem>
              <MenuItem value={5}>≤ 5 (Thấp)</MenuItem>
              <MenuItem value={10}>≤ 10 (Vừa phải)</MenuItem>
              <MenuItem value={100}>≥ 20 (Tất cả)</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={fetchLowStockUtensils}
            >
              Thử lại
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Main Table */}
      <StyledTableContainer component={Paper}>
        {loading && <LinearProgress />}
        <Table sx={{ minWidth: 650 }} aria-label="low stock utensils table">
          <StyledTableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <StyledTableCell
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  {headCell.sortable ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() =>
                        handleRequestSort(headCell.id as SortableColumn)
                      }
                    >
                      {headCell.label}
                    </TableSortLabel>
                  ) : (
                    headCell.label
                  )}
                </StyledTableCell>
              ))}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredUtensils.length > 0 ? (
              filteredUtensils.map((utensil) => (
                <StyledTableRow key={utensil.utensilId}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {utensil.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{utensil.utensilTypeName}</TableCell>
                  <TableCell>{utensil.material}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color={
                          utensil.quantity <= 2
                            ? "error.main"
                            : utensil.quantity <= 5
                            ? "warning.main"
                            : "text.primary"
                        }
                      >
                        {utensil.quantity}
                      </Typography>
                      {utensil.quantity <= 2 && (
                        <Tooltip title="Cần bổ sung gấp">
                          <WarningIcon
                            fontSize="small"
                            color="error"
                            sx={{ opacity: 0.8 }}
                          />
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>{getStatusChip(utensil)}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Cập nhật số lượng">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            setSelectedUtensil(utensil);
                            setNewQuantity(utensil.quantity);
                            setOpenUpdateDialog(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Thông báo cho quản trị viên">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => {
                            setSelectedUtensil(utensil);
                            setOpenNotifyDialog(true);
                          }}
                        >
                          <NotificationsIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  {loading ? (
                    <Typography color="text.secondary">
                      Đang tải dữ liệu...
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        Không tìm thấy dụng cụ nào
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchQuery
                          ? "Thử tìm kiếm với từ khóa khác"
                          : "Tất cả dụng cụ đều có số lượng đủ dùng"}
                      </Typography>
                    </>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Summary Section */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems="center"
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Tóm tắt tình trạng
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Hiện có {stats.totalItems} dụng cụ có số lượng thấp, trong đó{" "}
              {stats.criticalItems} dụng cụ ở mức cực kỳ thấp cần bổ sung gấp.
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                label={`${stats.criticalItems} cực kỳ thấp`}
                size="small"
                color="error"
                variant="outlined"
                icon={<WarningIcon />}
                sx={{ mb: 1 }}
              />
              <Chip
                label={`${stats.lowItems} sắp hết`}
                size="small"
                color="warning"
                variant="outlined"
                icon={<WarningIcon />}
                sx={{ mb: 1 }}
              />
              <Chip
                label={`${stats.unavailableItems} không sẵn sàng`}
                size="small"
                color="info"
                variant="outlined"
                icon={<ErrorOutlineIcon />}
                sx={{ mb: 1 }}
              />
            </Stack>
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "none", md: "block" } }}
          />
        </Stack>
      </Paper>

      {/* Update Quantity Dialog */}
      <Dialog
        open={openUpdateDialog}
        onClose={() => !loading && setOpenUpdateDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Cập nhật số lượng dụng cụ</DialogTitle>
        <DialogContent dividers>
          {selectedUtensil && (
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Dụng cụ
                </Typography>
                <Typography variant="h6">{selectedUtensil.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedUtensil.utensilTypeName} • {selectedUtensil.material}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Số lượng hiện tại
                </Typography>
                <Chip
                  label={selectedUtensil.quantity}
                  color={
                    selectedUtensil.quantity <= 2
                      ? "error"
                      : selectedUtensil.quantity <= 5
                      ? "warning"
                      : "default"
                  }
                />
              </Box>
              <TextField
                label="Số lượng mới"
                type="number"
                fullWidth
                value={newQuantity}
                onChange={(e) =>
                  setNewQuantity(Math.max(0, parseInt(e.target.value) || 0))
                }
                slotProps={{
                  input: {
                    inputProps: { min: 0 },
                  },
                }}
                helperText="Nhập số lượng mới sau khi bổ sung"
              />
              {updateSuccess && (
                <Alert severity="success">Cập nhật số lượng thành công!</Alert>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)} disabled={loading}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateQuantity}
            disabled={loading || newQuantity === selectedUtensil?.quantity}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notify Admin Dialog */}
      <Dialog
        open={openNotifyDialog}
        onClose={() => !loading && setOpenNotifyDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Thông báo cho quản trị viên</DialogTitle>
        <DialogContent dividers>
          {selectedUtensil && (
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Dụng cụ cần bổ sung
                </Typography>
                <Typography variant="h6">{selectedUtensil.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedUtensil.utensilTypeName} • Hiện còn:{" "}
                  {selectedUtensil.quantity}
                </Typography>
              </Box>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                Thông báo này sẽ được gửi đến quản trị viên để yêu cầu bổ sung
                dụng cụ.
              </Alert>
              <TextField
                label="Lý do cần bổ sung"
                multiline
                rows={3}
                fullWidth
                value={notifyReason}
                onChange={(e) => setNotifyReason(e.target.value)}
                placeholder="Ví dụ: Cần bổ sung gấp để phục vụ khách hàng vào cuối tuần"
                helperText="Cung cấp thông tin chi tiết để quản trị viên hiểu rõ tình hình"
              />
              {notifySuccess && (
                <Alert severity="success">Đã gửi thông báo thành công!</Alert>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNotifyDialog(false)} disabled={loading}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleNotifyAdmin}
            disabled={loading || !notifyReason}
            color="warning"
            startIcon={<NotificationsIcon />}
          >
            Gửi thông báo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LowStockUtensils;
