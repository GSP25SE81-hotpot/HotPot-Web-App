/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Thêm import này
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
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Thêm import này
import equipmentConditionService, {
  CreateEquipmentConditionRequest,
  EquipmentConditionFilterDto,
  MaintenanceScheduleType,
  MaintenanceStatus,
  NotifyAdminRequest,
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
import NotificationDescriptionDialog from "./NotificationDescriptionDialog";

// Định nghĩa cấu hình cột cho việc sắp xếp
interface ColumnConfig {
  field: string;
  label: string;
  sortable: boolean;
}

const EquipmentConditionLog: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate(); // Thêm hook này
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Thêm trạng thái thông báo thành công
  const [conditionLogs, setConditionLogs] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [sortBy, setSortBy] = useState<string>("damageDeviceId");
  const [sortDescending, setSortDescending] = useState<boolean>(false);
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
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [currentNotificationLog, setCurrentNotificationLog] =
    useState<any>(null);
  const [notificationScheduleType, setNotificationScheduleType] =
    useState<MaintenanceScheduleType>(MaintenanceScheduleType.Regular);

  // Định nghĩa các cột có thể sắp xếp
  const columns: ColumnConfig[] = [
    { field: "damageDeviceId", label: "ID", sortable: true },
    { field: "name", label: "Tên", sortable: false },
    { field: "equipmentType", label: "Loại thiết bị", sortable: false },
    { field: "equipmentName", label: "Tên thiết bị", sortable: false },
    { field: "loggedDate", label: "Ngày ghi nhận", sortable: true },
    { field: "status", label: "Trạng thái", sortable: true },
    { field: "actions", label: "Hành động", sortable: false },
  ];

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
      equipmentId: !newCondition.hotPotInventoryId && !newCondition.utensilId,
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
      const response = await equipmentConditionService.createConditionLog(
        newCondition
      );
      if (response.success) {
        setOpenDialog(false);
        // Đặt lại biểu mẫu
        setNewCondition({
          name: "",
          description: "",
          status: MaintenanceStatus.Pending,
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

  // Xử lý cập nhật trạng thái
  const handleStatusUpdate = async (
    id: number,
    newStatus: MaintenanceStatus
  ) => {
    try {
      setLoading(true);
      const response = await equipmentConditionService.updateConditionStatus(
        id,
        newStatus
      );
      if (response.success) {
        // Cập nhật trạng thái cục bộ để phản ánh sự thay đổi
        setConditionLogs((prev) =>
          prev.map((log) =>
            log.damageDeviceId === id ? { ...log, status: newStatus } : log
          )
        );
        // Hiển thị thông báo thành công
        setSuccessMessage(
          `Trạng thái đã được cập nhật thành công thành ${getStatusText(
            newStatus
          )}`
        );
        // Xóa thông báo thành công sau 5 giây
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } else {
        setError(response.message || "Không thể cập nhật trạng thái");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi cập nhật trạng thái");
      console.error("Lỗi khi cập nhật trạng thái:", err);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thông báo cho quản trị viên
  const handleNotifyAdmin = (conditionLog: any) => {
    setCurrentNotificationLog(conditionLog);
    setNotificationScheduleType(MaintenanceScheduleType.Regular);
    setNotificationDialogOpen(true);
  };

  const handleEmergencyNotify = (conditionLog: any) => {
    setCurrentNotificationLog(conditionLog);
    setNotificationScheduleType(MaintenanceScheduleType.Emergency);
    setNotificationDialogOpen(true);
  };

  const handleNotificationSubmit = async (description: string) => {
    if (!currentNotificationLog) return;
    try {
      setLoading(true);
      // Tạo yêu cầu thông báo với mô tả được cung cấp
      const notifyRequest: NotifyAdminRequest = {
        conditionLogId: currentNotificationLog.damageDeviceId,
        equipmentType: currentNotificationLog.equipmentType,
        equipmentName: currentNotificationLog.equipmentName,
        issueName: currentNotificationLog.name,
        description: description, // Sử dụng mô tả từ hộp thoại
        scheduleType: notificationScheduleType,
      };
      // Gửi thông báo qua API
      const response = await equipmentConditionService.notifyAdministrators(
        notifyRequest
      );
      if (response.success) {
        // Hiển thị thông báo thành công
        setSuccessMessage(
          notificationScheduleType === MaintenanceScheduleType.Emergency
            ? "Thông báo khẩn cấp đã được gửi đến quản trị viên"
            : "Quản trị viên đã được thông báo"
        );
        // Xóa thông báo thành công sau 5 giây
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
        // Đóng hộp thoại
        setNotificationDialogOpen(false);
      } else {
        setError(response.message || "Không thể thông báo cho quản trị viên");
      }
    } catch (err: any) {
      // Xử lý lỗi xác thực cụ thể
      if (err.response && err.response.status === 400) {
        const errorData = err.response.data;
        if (errorData.errors && errorData.errors.Description) {
          setError(`Lỗi xác thực: ${errorData.errors.Description[0]}`);
        } else {
          setError(
            "Yêu cầu không hợp lệ: Vui lòng kiểm tra tất cả các trường bắt buộc"
          );
        }
      } else {
        setError("Đã xảy ra lỗi khi thông báo cho quản trị viên");
      }
      console.error("Lỗi khi thông báo cho quản trị viên:", err);
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
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StyledTextField
                fullWidth
                label="Loại thiết bị"
                value={filterParams.equipmentType || ""}
                onChange={(e) =>
                  handleFilterChange("equipmentType", e.target.value)
                }
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={filterParams.status || ""}
                  label="Trạng thái"
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value={MaintenanceStatus.Pending}>
                    Đang chờ
                  </MenuItem>
                  <MenuItem value={MaintenanceStatus.InProgress}>
                    Đang tiến hành
                  </MenuItem>
                  <MenuItem value={MaintenanceStatus.Completed}>
                    Hoàn thành
                  </MenuItem>
                  <MenuItem value={MaintenanceStatus.Cancelled}>
                    Đã hủy
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <DatePicker
                label="Ngày bắt đầu"
                value={
                  filterParams.startDate
                    ? new Date(filterParams.startDate)
                    : null
                }
                onChange={(date) =>
                  handleFilterChange(
                    "startDate",
                    date ? date.toISOString().split("T")[0] : null
                  )
                }
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <DatePicker
                label="Ngày kết thúc"
                value={
                  filterParams.endDate ? new Date(filterParams.endDate) : null
                }
                onChange={(date) =>
                  handleFilterChange(
                    "endDate",
                    date ? date.toISOString().split("T")[0] : null
                  )
                }
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            <Grid
              size={{ xs: 12, md: 6 }}
              container
              justifyContent="flex-end"
              alignItems="baseline"
            >
              <StyledButton
                variant="outlined"
                onClick={() =>
                  setFilterParams({
                    pageNumber: 1,
                    pageSize: 10,
                    sortBy: "damageDeviceId",
                    sortDescending: false,
                  })
                }
                sx={{ mr: 2 }}
              >
                Đặt lại
              </StyledButton>
              <StyledButton
                variant="contained"
                onClick={() => fetchConditionLogs()}
              >
                Áp dụng bộ lọc
              </StyledButton>
            </Grid>
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
            Thêm nhật ký điều kiện mới
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
                        <TableCell>{log.equipmentType}</TableCell>
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
                            <StyledButton
                              size="small"
                              variant="outlined"
                              onClick={() => handleNotifyAdmin(log)}
                            >
                              Thông báo quản trị viên
                            </StyledButton>
                            {log.status === MaintenanceStatus.Pending && (
                              <StyledButton
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => handleEmergencyNotify(log)}
                              >
                                Khẩn cấp
                              </StyledButton>
                            )}
                            {log.status !== MaintenanceStatus.Completed && (
                              <StyledButton
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() =>
                                  handleStatusUpdate(
                                    log.damageDeviceId,
                                    MaintenanceStatus.Completed
                                  )
                                }
                              >
                                Đánh dấu hoàn thành
                              </StyledButton>
                            )}
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
                  onChange={(e) => handleInputChange("name", e.target.value)}
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
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={formErrors.equipmentId}>
                  <InputLabel>Loại thiết bị</InputLabel>
                  <Select
                    value={
                      newCondition.hotPotInventoryId !== undefined
                        ? "hotpot"
                        : newCondition.utensilId !== undefined
                        ? "utensil"
                        : ""
                    }
                    label="Loại thiết bị"
                    onChange={(e) => {
                      const equipmentType = e.target.value;
                      // Đặt lại cả hai ID thiết bị và đặt loại đã chọn
                      if (equipmentType === "hotpot") {
                        setNewCondition((prev) => ({
                          ...prev,
                          hotPotInventoryId: 0, // Khởi tạo với 0
                          utensilId: undefined, // Xóa loại khác
                        }));
                      } else if (equipmentType === "utensil") {
                        setNewCondition((prev) => ({
                          ...prev,
                          utensilId: 0, // Khởi tạo với 0
                          hotPotInventoryId: undefined, // Xóa loại khác
                        }));
                      } else {
                        // Nếu không có loại nào được chọn, xóa cả hai
                        setNewCondition((prev) => ({
                          ...prev,
                          hotPotInventoryId: undefined,
                          utensilId: undefined,
                        }));
                      }
                    }}
                  >
                    <MenuItem value="">Chọn loại</MenuItem>
                    <MenuItem value="hotpot">Nồi lẩu</MenuItem>
                    <MenuItem value="utensil">Dụng cụ</MenuItem>
                  </Select>
                  {formErrors.equipmentId && (
                    <FormHelperText>
                      Lựa chọn thiết bị là bắt buộc
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {/* Chỉ hiển thị trường ID nếu loại thiết bị được chọn */}
                {(newCondition.hotPotInventoryId !== undefined ||
                  newCondition.utensilId !== undefined) && (
                  <StyledTextField
                    fullWidth
                    type="number"
                    label={
                      newCondition.hotPotInventoryId !== undefined
                        ? "ID nồi lẩu"
                        : "ID dụng cụ"
                    }
                    required
                    value={
                      newCondition.hotPotInventoryId !== undefined
                        ? newCondition.hotPotInventoryId === 0
                          ? ""
                          : newCondition.hotPotInventoryId
                        : newCondition.utensilId === 0
                        ? ""
                        : newCondition.utensilId
                    }
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : parseInt(e.target.value);
                      if (newCondition.hotPotInventoryId !== undefined) {
                        handleInputChange("hotPotInventoryId", value);
                      } else if (newCondition.utensilId !== undefined) {
                        handleInputChange("utensilId", value);
                      }
                    }}
                    error={formErrors.equipmentId}
                    helperText={
                      formErrors.equipmentId ? "ID thiết bị là bắt buộc" : ""
                    }
                  />
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={newCondition.status}
                    label="Trạng thái"
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                  >
                    <MenuItem value={MaintenanceStatus.Pending}>
                      Đang chờ
                    </MenuItem>
                    <MenuItem value={MaintenanceStatus.InProgress}>
                      Đang tiến hành
                    </MenuItem>
                    <MenuItem value={MaintenanceStatus.Completed}>
                      Hoàn thành
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <StyledButton onClick={() => setOpenDialog(false)}>
              Hủy bỏ
            </StyledButton>
            <StyledButton
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                "Thêm nhật ký điều kiện"
              )}
            </StyledButton>
          </DialogActions>
        </StyledDialog>
        <NotificationDescriptionDialog
          open={notificationDialogOpen}
          onClose={() => setNotificationDialogOpen(false)}
          onSubmit={handleNotificationSubmit}
          issueName={currentNotificationLog?.name || ""}
          equipmentName={currentNotificationLog?.equipmentName || ""}
          scheduleType={notificationScheduleType}
        />
      </StyledBox>
    </LocalizationProvider>
  );
};

export default EquipmentConditionLog;
