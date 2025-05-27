/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Alert,
  Box,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import equipmentConditionService, {
  CreateEquipmentConditionRequest,
  EquipmentConditionFilterDto,
  MaintenanceStatus,
} from "../../api/Services/equipmentConditionService";
import {
  StatusChip,
  StyledBox,
  StyledButton,
  StyledDialog,
  StyledPaper,
  StyledTable,
  StyledTextField,
  getStatusText,
} from "../../components/manager/styles/EquipmentConditionLogStyles";
import stockService from "../../api/Services/stockService";
import { HotPotInventoryDto } from "../../types/stock";

// Định nghĩa cấu hình cột cho việc sắp xếp
interface ColumnConfig {
  field: string;
  label: string;
  sortable: boolean;
}

const EquipmentConditionLog: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [conditionLogs, setConditionLogs] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [sortBy, setSortBy] = useState<string>("damageDeviceId");
  const [sortDescending, setSortDescending] = useState<boolean>(true);
  const [filterParams, setFilterParams] = useState<EquipmentConditionFilterDto>(
    {
      pageNumber: 1,
      pageSize: 10,
      sortBy: "damageDeviceId",
      sortDescending: false,
    }
  );
  const [newCondition, setNewCondition] =
    useState<CreateEquipmentConditionRequest>({
      name: "",
      description: "",
      status: MaintenanceStatus.Pending,
    });
  const [formErrors, setFormErrors] = useState({
    name: false,
    equipmentId: false,
  });
  const [hotPotInventoryList, setHotPotInventoryList] = useState<
    HotPotInventoryDto[]
  >([]);
  const [loadingEquipment, setLoadingEquipment] = useState(false);
  const [selectedEquipmentType, setSelectedEquipmentType] =
    useState<string>("");

  // Định nghĩa các cột có thể sắp xếp
  const columns: ColumnConfig[] = [
    { field: "damageDeviceId", label: "ID", sortable: true },
    { field: "name", label: "Vấn đề", sortable: false },
    { field: "equipmentName", label: "Tên thiết bị", sortable: false },
    { field: "loggedDate", label: "Ngày ghi nhận", sortable: true },
    { field: "status", label: "Trạng thái", sortable: true },
    { field: "actions", label: "Hành động", sortable: false },
  ];

  const handleEquipmentTypeChange = (type: string) => {
    setSelectedEquipmentType(type);
    if (type === "hotpot") {
      setNewCondition({
        ...newCondition,
        hotPotInventoryId: undefined,
      });
    } else {
      setNewCondition({
        ...newCondition,
        hotPotInventoryId: undefined,
      });
    }
  };

  const fetchHotPotInventory = async () => {
    try {
      setLoadingEquipment(true);
      const response = await stockService.getAllHotPotInventory();
      if (response.success) {
        // Only set damaged hot pots
        const damagedHotPots = response.data.filter(
          (item) => item.status === "Damaged"
        );
        setHotPotInventoryList(damagedHotPots);
      } else {
        setError(response.message || "Failed to load hot pot inventory");
      }
    } catch (err) {
      setError("Error fetching hot pot inventory");
      console.error("Error fetching hot pot inventory:", err);
    } finally {
      setLoadingEquipment(false);
    }
  };

  useEffect(() => {
    fetchHotPotInventory();
  }, []);

  // Lấy danh sách nhật ký điều kiện
  const fetchConditionLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await equipmentConditionService.getFilteredConditionLogs(
        filterParams
      );
      if (response.success) {
        setConditionLogs(response.data.items);
        setTotalCount(response.data.totalCount);
        setPageNumber(response.data.pageNumber);
        setPageSize(response.data.pageSize);
      } else {
        setError(
          response.message || "Không thể lấy nhật ký điều kiện thiết bị"
        );
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi lấy nhật ký điều kiện thiết bị");
      console.error("Lỗi khi lấy nhật ký điều kiện:", err);
    } finally {
      setLoading(false);
    }
  };

  // Tải dữ liệu ban đầu
  useEffect(() => {
    fetchConditionLogs();
  }, [filterParams]);

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (name: string, value: any) => {
    setFilterParams((prev) => ({
      ...prev,
      [name]: value,
      pageNumber: 1, // Đặt lại về trang đầu tiên khi thay đổi bộ lọc
    }));
  };

  // Xử lý thay đổi sắp xếp
  const handleSortChange = (field: string) => {
    // Nếu nhấp vào cùng một trường, chuyển đổi hướng
    // Nếu nhấp vào trường mới, sắp xếp tăng dần theo trường đó
    const newSortDescending = field === sortBy ? !sortDescending : false;
    setSortBy(field);
    setSortDescending(newSortDescending);
    setFilterParams((prev) => ({
      ...prev,
      sortBy: field,
      sortDescending: newSortDescending,
    }));
  };

  // Xử lý thay đổi đầu vào biểu mẫu
  const handleInputChange = (name: string, value: any) => {
    setNewCondition((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Xóa lỗi xác thực khi trường được điền
    if (formErrors[name as keyof typeof formErrors] && value) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  // Xác thực biểu mẫu
  const validateForm = () => {
    const errors = {
      name: !newCondition.name,
      equipmentId:
        (selectedEquipmentType === "hotpot" &&
          !newCondition.hotPotInventoryId) ||
        !selectedEquipmentType,
    };
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  // Xử lý gửi biểu mẫu
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      setLoading(true);
      // Always set status to Pending
      const conditionToSubmit = {
        ...newCondition,
        status: MaintenanceStatus.Pending,
      };
      const response = await equipmentConditionService.createConditionLog(
        conditionToSubmit
      );
      if (response.success) {
        setOpenDialog(false);
        // Đặt lại biểu mẫu
        setNewCondition({
          name: "",
          description: "",
          status: MaintenanceStatus.Pending,
          updateEquipmentStatus: false,
        });
        // Hiển thị thông báo thành công
        setSuccessMessage("Nhật ký điều kiện đã được tạo thành công");
        // Xóa thông báo thành công sau 5 giây
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
        // Làm mới dữ liệu
        fetchConditionLogs();
      } else {
        setError(response.message || "Không thể tạo nhật ký điều kiện");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi tạo nhật ký điều kiện");
      console.error("Lỗi khi tạo nhật ký điều kiện:", err);
    } finally {
      setLoading(false);
    }
  };

  // Điều hướng đến trang chi tiết
  const navigateToDetails = (id: number) => {
    navigate(`/equipment-condition-log/${id}`);
  };

  // Hiển thị biểu tượng sắp xếp cho tiêu đề cột
  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortDescending ? (
      <ArrowDownwardIcon
        fontSize="small"
        sx={{ ml: 0.5, verticalAlign: "middle" }}
      />
    ) : (
      <ArrowUpwardIcon
        fontSize="small"
        sx={{ ml: 0.5, verticalAlign: "middle" }}
      />
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledBox>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 4,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Quản lý điều kiện thiết bị
        </Typography>
        {/* Điều khiển bộ lọc */}
        <StyledPaper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <StyledTextField
                fullWidth
                label="Tên thiết bị"
                value={filterParams.equipmentName || ""}
                onChange={(e: any) =>
                  handleFilterChange("equipmentName", e.target.value)
                }
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}></Grid>
            <Grid
              size={{ xs: 12, md: 6 }}
              container
              justifyContent="flex-end"
              alignItems="baseline"
            ></Grid>
          </Grid>
        </StyledPaper>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <StyledButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Thêm thiết bị bảo trì
          </StyledButton>
          <Typography variant="body2">
            Hiển thị {conditionLogs.length} trong số {totalCount} mục
          </Typography>
        </Box>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 3,
              "& .MuiAlert-icon": {
                alignItems: "center",
              },
            }}
          >
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 3,
              "& .MuiAlert-icon": {
                alignItems: "center",
              },
            }}
          >
            {successMessage}
          </Alert>
        )}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Nhật ký điều kiện thiết bị
        </Typography>
        <StyledPaper sx={{ mb: 4 }}>
          {loading && conditionLogs.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <StyledTable>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.field}
                        onClick={() =>
                          column.sortable && handleSortChange(column.field)
                        }
                        sx={
                          column.sortable
                            ? {
                                cursor: "pointer",
                                "&:hover": {
                                  backgroundColor: theme.palette.action.hover,
                                },
                                ...(sortBy === column.field && {
                                  color: theme.palette.primary.main,
                                  fontWeight: "bold",
                                }),
                              }
                            : {}
                        }
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {column.label}
                          {renderSortIcon(column.field)}
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {conditionLogs.length > 0 ? (
                    conditionLogs.map((log) => (
                      <TableRow key={log.damageDeviceId}>
                        <TableCell>{log.damageDeviceId}</TableCell>
                        <TableCell>{log.name}</TableCell>
                        <TableCell>{log.equipmentName}</TableCell>
                        <TableCell>
                          {new Date(log.loggedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <StatusChip status={log.status}>
                            {getStatusText(log.status)}
                          </StatusChip>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <StyledButton
                              size="small"
                              variant="outlined"
                              color="primary"
                              startIcon={<VisibilityIcon />}
                              onClick={() =>
                                navigateToDetails(log.damageDeviceId)
                              }
                            >
                              Xem chi tiết
                            </StyledButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Không tìm thấy nhật ký điều kiện nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </StyledTable>
            </TableContainer>
          )}
          {/* Điều khiển phân trang */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2">Số hàng mỗi trang:</Typography>
              <Select
                value={pageSize}
                size="small"
                onChange={(e) => {
                  const newPageSize = Number(e.target.value);
                  setPageSize(newPageSize);
                  setFilterParams((prev) => ({
                    ...prev,
                    pageSize: newPageSize,
                    pageNumber: 1,
                  }));
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
              <Box sx={{ display: "flex", gap: 1 }}>
                <StyledButton
                  size="small"
                  variant="outlined"
                  disabled={pageNumber <= 1}
                  onClick={() => {
                    const newPageNumber = pageNumber - 1;
                    setFilterParams((prev) => ({
                      ...prev,
                      pageNumber: newPageNumber,
                    }));
                  }}
                >
                  Trước
                </StyledButton>
                <Typography variant="body2" sx={{ alignSelf: "center" }}>
                  Trang {pageNumber} / {Math.ceil(totalCount / pageSize)}
                </Typography>
                <StyledButton
                  size="small"
                  variant="outlined"
                  disabled={pageNumber >= Math.ceil(totalCount / pageSize)}
                  onClick={() => {
                    const newPageNumber = pageNumber + 1;
                    setFilterParams((prev) => ({
                      ...prev,
                      pageNumber: newPageNumber,
                    }));
                  }}
                >
                  Tiếp
                </StyledButton>
              </Box>
            </Box>
          </Box>
        </StyledPaper>
        {/* Hộp thoại thêm nhật ký điều kiện */}
        <StyledDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            Nhật ký điều kiện thiết bị mới
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <StyledTextField
                  fullWidth
                  label="Tên vấn đề"
                  required
                  value={newCondition.name}
                  onChange={(e: any) =>
                    handleInputChange("name", e.target.value)
                  }
                  error={formErrors.name}
                  helperText={formErrors.name ? "Tên vấn đề là bắt buộc" : ""}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <StyledTextField
                  fullWidth
                  label="Mô tả"
                  multiline
                  rows={3}
                  value={newCondition.description || ""}
                  onChange={(e: any) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={formErrors.equipmentId}>
                  <InputLabel>Loại thiết bị</InputLabel>
                  <Select
                    value={selectedEquipmentType}
                    label="Loại thiết bị"
                    onChange={(e) => handleEquipmentTypeChange(e.target.value)}
                  >
                    <MenuItem value="hotpot">Nồi lẩu</MenuItem>
                  </Select>
                  {formErrors.equipmentId && (
                    <FormHelperText>
                      Lựa chọn thiết bị là bắt buộc
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {loadingEquipment ? (
                  <Box display="flex" justifyContent="center">
                    <CircularProgress size={24} />
                  </Box>
                ) : selectedEquipmentType === "hotpot" ? (
                  <FormControl fullWidth error={formErrors.equipmentId}>
                    <InputLabel>Nồi lẩu</InputLabel>
                    <Select
                      value={newCondition.hotPotInventoryId || ""}
                      label="Nồi lẩu"
                      onChange={(e) =>
                        handleInputChange(
                          "hotPotInventoryId",
                          Number(e.target.value)
                        )
                      }
                    >
                      <MenuItem value="">Chọn nồi lẩu</MenuItem>
                      {hotPotInventoryList.map((item) => (
                        <MenuItem
                          key={item.hotPotInventoryId}
                          value={item.hotPotInventoryId}
                        >
                          {item.hotpotName} (Số series: {item.seriesNumber})
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.equipmentId && (
                      <FormHelperText>Vui lòng chọn nồi lẩu</FormHelperText>
                    )}
                  </FormControl>
                ) : null}
              </Grid>
            </Grid>
          </DialogContent>
          <Box sx={{ px: 3, pb: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={newCondition.updateEquipmentStatus || false}
                  onChange={(e: any) =>
                    setNewCondition({
                      ...newCondition,
                      updateEquipmentStatus: e.target.checked,
                    })
                  }
                  name="updateEquipmentStatus"
                />
              }
              label="Tự động cập nhật trạng thái thiết bị"
            />
          </Box>
          <DialogActions sx={{ p: 3 }}>
            <StyledButton onClick={() => setOpenDialog(false)}>
              Hủy bỏ
            </StyledButton>
            <StyledButton
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Thêm thiết bị"}
            </StyledButton>
          </DialogActions>
        </StyledDialog>
      </StyledBox>
    </LocalizationProvider>
  );
};

export default EquipmentConditionLog;
