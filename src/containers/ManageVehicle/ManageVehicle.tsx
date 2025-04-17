/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import vehicleService from "../../api/Services/vehicleService";
import {
  VehicleDTO,
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from "../../types/vehicle";
import { VehicleType, VehicleStatus } from "../../types/orderManagement";

const defaultForm: CreateVehicleRequest = {
  name: "",
  licensePlate: "",
  type: VehicleType.Car,
  status: VehicleStatus.Available,
  notes: "",
};

const ManageVehicle: React.FC = () => {
  const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("status"); // Default sort by status
  const [sortDescending, setSortDescending] = useState<boolean>(true); // Default descending
  const [openDialog, setOpenDialog] = useState(false);
  const [editVehicle, setEditVehicle] = useState<VehicleDTO | null>(null);
  const [form, setForm] = useState<CreateVehicleRequest>(defaultForm);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const [_loading, setLoading] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await vehicleService.getAllVehicles({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        searchTerm: search,
        sortBy,
        sortDescending,
      });
      setVehicles(res.items || []); // Add fallback to empty array
      setTotal(res.totalCount || 0); // Add fallback to 0
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setVehicles([]); // Reset to empty array on error
      setTotal(0);
      setSnackbar({
        open: true,
        message: "Có lỗi khi tải dữ liệu phương tiện!",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line
  }, [page, rowsPerPage, search, sortBy, sortDescending]);

  const handleOpenDialog = async (vehicle?: VehicleDTO) => {
    if (vehicle) {
      // Fetch latest vehicle data by ID
      const latest = await vehicleService.getVehicleById(vehicle.vehicleId);
      const v = latest || vehicle;
      setEditVehicle(v);
      setForm({
        name: v.name,
        licensePlate: v.licensePlate,
        type: v.type,
        status: v.status,
        notes: v.notes || "",
      });
    } else {
      setEditVehicle(null);
      setForm(defaultForm);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditVehicle(null);
    setForm(defaultForm);
  };

  const handleSave = async () => {
    let success = false;
    if (editVehicle) {
      // Update
      const updated = await vehicleService.updateVehicle(
        editVehicle.vehicleId,
        form as UpdateVehicleRequest
      );
      success = !!updated;
    } else {
      // Create
      const created = await vehicleService.createVehicle(form);
      success = !!created;
    }
    if (success) {
      setSnackbar({
        open: true,
        message: "Lưu phương tiện thành công!",
        severity: "success",
      });
      fetchVehicles();
      handleCloseDialog();
    } else {
      setSnackbar({
        open: true,
        message: "Có lỗi khi lưu phương tiện!",
        severity: "error",
      });
    }
  };

  const handleDelete = async (vehicleId: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa phương tiện này?")) return;
    const success = await vehicleService.deleteVehicle(vehicleId);
    if (success) {
      setSnackbar({
        open: true,
        message: "Xóa phương tiện thành công!",
        severity: "success",
      });
      fetchVehicles();
    } else {
      setSnackbar({
        open: true,
        message: "Có lỗi khi xóa phương tiện!",
        severity: "error",
      });
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      // If clicking the same column, toggle direction
      setSortDescending(!sortDescending);
    } else {
      // If clicking a new column, sort by that column in descending order
      setSortBy(column);
      setSortDescending(true);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý phương tiện
      </Typography>
      <Box sx={{ display: "flex", mb: 2, gap: 2 }}>
        <TextField
          size="small"
          label="Tìm kiếm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
        />
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Thêm phương tiện
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tên</TableCell>
            <TableCell>Biển số</TableCell>
            <TableCell
              onClick={() => handleSort("type")}
              sx={{ cursor: "pointer" }}
            >
              Loại {sortBy === "type" && (sortDescending ? "▼" : "▲")}
            </TableCell>
            <TableCell
              onClick={() => handleSort("status")}
              sx={{ cursor: "pointer" }}
            >
              Trạng thái {sortBy === "status" && (sortDescending ? "▼" : "▲")}
            </TableCell>
            <TableCell>Ghi chú</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.vehicleId}>
              <TableCell>{vehicle.name}</TableCell>
              <TableCell>{vehicle.licensePlate}</TableCell>
              <TableCell>
                {vehicle.type === VehicleType.Car ? "Ô tô" : "Xe máy"}
              </TableCell>
              <TableCell>
                {vehicle.status === VehicleStatus.Available
                  ? "Sẵn sàng"
                  : vehicle.status === VehicleStatus.InUse
                  ? "Đang sử dụng"
                  : "Không khả dụng"}
              </TableCell>
              <TableCell>{vehicle.notes}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleOpenDialog(vehicle)}>
                  Sửa
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(vehicle.vehicleId)}
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {vehicles.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />
      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editVehicle ? "Cập nhật phương tiện" : "Thêm phương tiện"}
        </DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          <TextField
            margin="dense"
            label="Tên phương tiện"
            fullWidth
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="Biển số"
            fullWidth
            value={form.licensePlate}
            onChange={(e) =>
              setForm((f) => ({ ...f, licensePlate: e.target.value }))
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Loại</InputLabel>
            <Select
              value={form.type}
              label="Loại"
              onChange={(e) =>
                setForm((f) => ({ ...f, type: Number(e.target.value) }))
              }
            >
              <MenuItem value={VehicleType.Car}>Ô tô</MenuItem>
              <MenuItem value={VehicleType.Scooter}>Xe máy</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={form.status}
              label="Trạng thái"
              onChange={(e) =>
                setForm((f) => ({ ...f, status: Number(e.target.value) }))
              }
            >
              <MenuItem value={VehicleStatus.Available}>Sẵn sàng</MenuItem>
              <MenuItem value={VehicleStatus.InUse}>Đang sử dụng</MenuItem>
              <MenuItem value={VehicleStatus.Unavailable}>
                Không khả dụng
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Ghi chú"
            fullWidth
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleSave}>
            {editVehicle ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageVehicle;
