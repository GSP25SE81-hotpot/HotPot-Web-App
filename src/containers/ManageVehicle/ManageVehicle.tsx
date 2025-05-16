/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Alert,
  Box,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import vehicleService from "../../api/Services/vehicleService";
import {
  ActionButton,
  AddButton,
  CancelButton,
  ControlsContainer,
  DialogSubtitle,
  EmptyMessage,
  EmptyRow,
  EnhancedDialogContent,
  EnhancedDialogTitle,
  FormDivider,
  FormSection,
  FormSectionTitle,
  PageContainer,
  PageHeader,
  SaveButton,
  SortableTableCell,
  StatusChip,
  StyledDialog,
  StyledDialogActions,
  StyledFormControl,
  StyledTable,
  StyledTableRow,
  StyledTextField,
  TableHeader,
  TypeChip,
} from "../../components/manager/styles/ManageVehicleStyles";
import { VehicleStatus, VehicleType } from "../../types/orderManagement";
import {
  CreateVehicleRequest,
  UpdateVehicleRequest,
  VehicleDTO,
} from "../../types/vehicle";

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
  const [sortBy, setSortBy] = useState<string>("status");
  const [sortDescending, setSortDescending] = useState<boolean>(true);
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
      setVehicles(res.items || []);
      setTotal(res.totalCount || 0);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setVehicles([]);
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
    <PageContainer>
      <PageHeader variant="h4">Quản lý phương tiện</PageHeader>

      <ControlsContainer>
        <TextField
          size="small"
          label="Tìm kiếm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
          variant="outlined"
        />
        <AddButton onClick={() => handleOpenDialog()}>
          Thêm phương tiện
        </AddButton>
      </ControlsContainer>

      <StyledTable>
        <TableHeader>
          <TableRow>
            <TableCell>Tên</TableCell>
            <TableCell>Biển số</TableCell>
            <SortableTableCell
              onClick={() => handleSort("type")}
              active={sortBy === "type"}
            >
              Loại {sortBy === "type" && (sortDescending ? "▼" : "▲")}
            </SortableTableCell>
            <SortableTableCell
              onClick={() => handleSort("status")}
              active={sortBy === "status"}
            >
              Trạng thái {sortBy === "status" && (sortDescending ? "▼" : "▲")}
            </SortableTableCell>
            <TableCell>Ghi chú</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <StyledTableRow key={vehicle.vehicleId}>
              <TableCell>{vehicle.name}</TableCell>
              <TableCell>{vehicle.licensePlate}</TableCell>
              <TableCell>
                <TypeChip type={vehicle.type}>
                  {vehicle.type === VehicleType.Car ? "Ô tô" : "Xe máy"}
                </TypeChip>
              </TableCell>
              <TableCell>
                <StatusChip status={vehicle.status}>
                  {vehicle.status === VehicleStatus.Available
                    ? "Sẵn sàng"
                    : vehicle.status === VehicleStatus.InUse
                    ? "Đang sử dụng"
                    : "Không khả dụng"}
                </StatusChip>
              </TableCell>
              <TableCell>{vehicle.notes}</TableCell>
              <TableCell>
                <ActionButton
                  size="small"
                  variant="outlined"
                  onClick={() => handleOpenDialog(vehicle)}
                >
                  Sửa
                </ActionButton>
                <ActionButton
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => handleDelete(vehicle.vehicleId)}
                >
                  Xóa
                </ActionButton>
              </TableCell>
            </StyledTableRow>
          ))}
          {vehicles.length === 0 && (
            <EmptyRow>
              <EmptyMessage colSpan={6}>Không có dữ liệu</EmptyMessage>
            </EmptyRow>
          )}
        </TableBody>
      </StyledTable>

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
        sx={{
          marginTop: 2,
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
        }}
      />

      {/* Enhanced Add/Edit Dialog */}
      <StyledDialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <EnhancedDialogTitle>
          <Typography variant="h6" fontWeight={600}>
            {editVehicle ? "Cập nhật phương tiện" : "Thêm phương tiện"}
          </Typography>
          <DialogSubtitle>
            {editVehicle
              ? "Chỉnh sửa thông tin phương tiện hiện có"
              : "Thêm phương tiện mới vào hệ thống"}
          </DialogSubtitle>
        </EnhancedDialogTitle>

        <EnhancedDialogContent>
          <FormSection>
            <FormSectionTitle>Thông tin cơ bản</FormSectionTitle>
            <StyledTextField
              label="Tên phương tiện"
              fullWidth
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              variant="outlined"
              placeholder="Nhập tên phương tiện"
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ color: "primary.main", mr: 1 }}>
                    <span role="img" aria-label="vehicle">
                      🚗
                    </span>
                  </Box>
                ),
              }}
            />
            <StyledTextField
              label="Biển số"
              fullWidth
              value={form.licensePlate}
              onChange={(e) =>
                setForm((f) => ({ ...f, licensePlate: e.target.value }))
              }
              variant="outlined"
              placeholder="Nhập biển số xe"
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ color: "primary.main", mr: 1 }}>
                    <span role="img" aria-label="license">
                      🔢
                    </span>
                  </Box>
                ),
              }}
            />
          </FormSection>

          <FormDivider />

          <FormSection>
            <FormSectionTitle>Phân loại</FormSectionTitle>
            <StyledFormControl fullWidth variant="outlined">
              <InputLabel>Loại phương tiện</InputLabel>
              <Select
                value={form.type}
                label="Loại phương tiện"
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: Number(e.target.value) }))
                }
              >
                <MenuItem value={VehicleType.Car}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <span
                      role="img"
                      aria-label="car"
                      style={{ marginRight: 8 }}
                    >
                      🚗
                    </span>
                    Ô tô
                  </Box>
                </MenuItem>
                <MenuItem value={VehicleType.Scooter}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <span
                      role="img"
                      aria-label="scooter"
                      style={{ marginRight: 8 }}
                    >
                      🛵
                    </span>
                    Xe máy
                  </Box>
                </MenuItem>
              </Select>
            </StyledFormControl>

            <StyledFormControl fullWidth variant="outlined">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={form.status}
                label="Trạng thái"
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: Number(e.target.value) }))
                }
              >
                <MenuItem value={VehicleStatus.Available}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      component="span"
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: "success.main",
                        mr: 1,
                        display: "inline-block",
                      }}
                    />
                    Sẵn sàng
                  </Box>
                </MenuItem>
                <MenuItem value={VehicleStatus.InUse}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      component="span"
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: "warning.main",
                        mr: 1,
                        display: "inline-block",
                      }}
                    />
                    Đang sử dụng
                  </Box>
                </MenuItem>
                <MenuItem value={VehicleStatus.Unavailable}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      component="span"
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: "error.main",
                        mr: 1,
                        display: "inline-block",
                      }}
                    />
                    Không khả dụng
                  </Box>
                </MenuItem>
              </Select>
            </StyledFormControl>
          </FormSection>

          <FormDivider />

          <FormSection>
            <FormSectionTitle>Thông tin bổ sung</FormSectionTitle>
            <StyledTextField
              label="Ghi chú"
              fullWidth
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              variant="outlined"
              multiline
              rows={3}
              placeholder="Nhập ghi chú về phương tiện (nếu có)"
            />
          </FormSection>
        </EnhancedDialogContent>

        <StyledDialogActions>
          <CancelButton onClick={handleCloseDialog}>Hủy</CancelButton>
          <SaveButton onClick={handleSave}>
            {editVehicle ? "Cập nhật" : "Thêm"}
          </SaveButton>
        </StyledDialogActions>
      </StyledDialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{
            width: "100%",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            fontWeight: 500,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default ManageVehicle;
