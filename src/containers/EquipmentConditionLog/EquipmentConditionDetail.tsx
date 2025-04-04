/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BuildIcon from "@mui/icons-material/Build";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HistoryIcon from "@mui/icons-material/History";
import InfoIcon from "@mui/icons-material/Info";
import PendingIcon from "@mui/icons-material/Pending";
import TimelineIcon from "@mui/icons-material/Timeline";
import {
  Alert,
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Link,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import equipmentConditionService, {
  EquipmentConditionDetailDto,
  MaintenanceStatus,
  PaginationParams,
} from "../../api/Services/equipmentConditionService";
import {
  StatusChip,
  StyledBox,
  StyledButton,
  StyledPaper,
  StyledTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  getStatusText,
} from "../../components/manager/styles/EquipmentConditionLogStyles";

// Giao diện cho thuộc tính của TabPanel
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Thành phần Tab Panel
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`equipment-condition-tabpanel-${index}`}
      aria-labelledby={`equipment-condition-tab-${index}`}
      {...other}
      style={{ paddingTop: 20 }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const EquipmentConditionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conditionDetail, setConditionDetail] =
    useState<EquipmentConditionDetailDto | null>(null);
  const [relatedLogs, setRelatedLogs] = useState<any[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Lấy chi tiết nhật ký điều kiện
  const fetchConditionDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await equipmentConditionService.getConditionLogById(
        parseInt(id)
      );
      if (response.success) {
        setConditionDetail(response.data);
        // Sau khi lấy chi tiết, lấy các nhật ký liên quan cho cùng thiết bị
        if (response.data.equipmentType && response.data.equipmentId) {
          fetchRelatedLogs(
            response.data.equipmentType,
            response.data.equipmentId
          );
        }
      } else {
        setError(
          response.message || "Không thể lấy chi tiết nhật ký điều kiện"
        );
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi lấy chi tiết nhật ký điều kiện");
      console.error("Lỗi khi lấy chi tiết nhật ký điều kiện:", err);
    } finally {
      setLoading(false);
    }
  };

  // Lấy các nhật ký liên quan cho cùng thiết bị
  const fetchRelatedLogs = async (type: string, equipmentId: number) => {
    try {
      const paginationParams: PaginationParams = {
        pageNumber: 1,
        pageSize: 5, // Giới hạn 5 nhật ký gần nhất
      };
      const response =
        await equipmentConditionService.getConditionLogsByEquipment(
          type,
          equipmentId,
          paginationParams
        );
      if (response.success) {
        // Lọc ra nhật ký hiện tại khỏi các nhật ký liên quan
        const filteredLogs = response.data.items.filter(
          (log) => log.damageDeviceId !== parseInt(id || "0")
        );
        setRelatedLogs(filteredLogs);
      }
    } catch (err) {
      console.error("Lỗi khi lấy các nhật ký liên quan:", err);
    }
  };

  // Xử lý cập nhật trạng thái
  const handleStatusUpdate = async (newStatus: MaintenanceStatus) => {
    if (!id) return;
    try {
      setStatusUpdateLoading(true);
      const response = await equipmentConditionService.updateConditionStatus(
        parseInt(id),
        newStatus
      );
      if (response.success) {
        // Cập nhật trạng thái cục bộ để phản ánh sự thay đổi
        setConditionDetail((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
      } else {
        setError(response.message || "Không thể cập nhật trạng thái");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi cập nhật trạng thái");
      console.error("Lỗi khi cập nhật trạng thái:", err);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Xử lý thay đổi tab
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Tải dữ liệu ban đầu
  useEffect(() => {
    fetchConditionDetail();
  }, [id]);

  // Định dạng ngày để hiển thị
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  // Lấy biểu tượng trạng thái dựa trên trạng thái bảo trì
  const getStatusIcon = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.Pending:
        return <PendingIcon />;
      case MaintenanceStatus.InProgress:
        return <BuildIcon />;
      case MaintenanceStatus.Completed:
        return <CheckCircleIcon />;
      case MaintenanceStatus.Cancelled:
        return <CancelIcon />;
      default:
        return <InfoIcon />;
    }
  };

  return (
    <StyledBox>
      {/* Điều hướng Breadcrumb */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component={RouterLink}
          to="/equipment-condition-log"
          color="inherit"
        >
          Điều kiện thiết bị
        </Link>
        <Typography color="text.primary">Chi tiết</Typography>
      </Breadcrumbs>
      {/* Nút quay lại */}
      <Box sx={{ mb: 3 }}>
        <StyledButton
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate("/equipment-condition-log")}
        >
          Quay lại danh sách
        </StyledButton>
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
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : conditionDetail ? (
        <>
          {/* Tiêu đề với thông tin cơ bản */}
          <StyledPaper sx={{ mb: 4, p: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography variant="h4" gutterBottom>
                  {conditionDetail.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {conditionDetail.description || "Không có mô tả"}
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                  <Chip
                    icon={<InfoIcon />}
                    label={`ID: ${conditionDetail.damageDeviceId}`}
                    variant="outlined"
                  />
                  <Chip
                    icon={getStatusIcon(conditionDetail.status)}
                    label={getStatusText(conditionDetail.status)}
                    color={
                      conditionDetail.status === MaintenanceStatus.Completed
                        ? "success"
                        : conditionDetail.status ===
                          MaintenanceStatus.InProgress
                        ? "info"
                        : conditionDetail.status === MaintenanceStatus.Pending
                        ? "warning"
                        : "error"
                    }
                  />
                  <Chip
                    icon={<TimelineIcon />}
                    label={`Đã ghi: ${formatDate(conditionDetail.loggedDate)}`}
                    variant="outlined"
                  />
                  {conditionDetail.updatedAt && (
                    <Chip
                      icon={<HistoryIcon />}
                      label={`Cập nhật: ${formatDate(
                        conditionDetail.updatedAt
                      )}`}
                      variant="outlined"
                    />
                  )}
                </Box>
              </Grid>
              <Grid
                size={{ xs: 12, md: 4 }}
                container
                justifyContent="flex-end"
                alignItems="flex-start"
              >
                {conditionDetail.status !== MaintenanceStatus.Completed && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: "column",
                      alignItems: "stretch",
                    }}
                  >
                    {conditionDetail.status === MaintenanceStatus.Pending && (
                      <StyledButton
                        variant="contained"
                        color="info"
                        startIcon={<BuildIcon />}
                        onClick={() =>
                          handleStatusUpdate(MaintenanceStatus.InProgress)
                        }
                        disabled={statusUpdateLoading}
                      >
                        {statusUpdateLoading ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Bắt đầu bảo trì"
                        )}
                      </StyledButton>
                    )}
                    {conditionDetail.status !== MaintenanceStatus.Cancelled && (
                      <StyledButton
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() =>
                          handleStatusUpdate(MaintenanceStatus.Completed)
                        }
                        disabled={statusUpdateLoading}
                      >
                        {statusUpdateLoading ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Đánh dấu hoàn thành"
                        )}
                      </StyledButton>
                    )}
                    {conditionDetail.status !== MaintenanceStatus.Cancelled && (
                      <StyledButton
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() =>
                          handleStatusUpdate(MaintenanceStatus.Cancelled)
                        }
                        disabled={statusUpdateLoading}
                      >
                        {statusUpdateLoading ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Hủy bảo trì"
                        )}
                      </StyledButton>
                    )}
                  </Box>
                )}
              </Grid>
            </Grid>
          </StyledPaper>
          {/* Tabs cho các phần khác nhau */}
          <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  py: 2,
                },
              }}
            >
              <Tab icon={<InfoIcon />} label="Chi tiết thiết bị" />
              <Tab icon={<HistoryIcon />} label="Lịch sử bảo trì" />
              <Tab icon={<BuildIcon />} label="Vấn đề liên quan" />
            </Tabs>
            {/* Tab Chi tiết thiết bị */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                      variant="outlined"
                      sx={{ borderRadius: 3, height: "100%" }}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Thông tin thiết bị
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Loại thiết bị
                            </Typography>
                            <Typography variant="body1">
                              {conditionDetail.equipmentTypeName ||
                                conditionDetail.equipmentType}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Tên thiết bị
                            </Typography>
                            <Typography variant="body1">
                              {conditionDetail.equipmentName}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              ID thiết bị
                            </Typography>
                            <Typography variant="body1">
                              {conditionDetail.equipmentId}
                            </Typography>
                          </Box>
                          {conditionDetail.equipmentSerialNumber && (
                            <Box>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Số serial
                              </Typography>
                              <Typography variant="body1">
                                {conditionDetail.equipmentSerialNumber}
                              </Typography>
                            </Box>
                          )}
                          {conditionDetail.equipmentMaterial && (
                            <Box>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Vật liệu
                              </Typography>
                              <Typography variant="body1">
                                {conditionDetail.equipmentMaterial}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                      variant="outlined"
                      sx={{ borderRadius: 3, height: "100%" }}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Ghi chú bảo trì
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1">
                          {conditionDetail.maintenanceNotes ||
                            "Không có ghi chú bảo trì nào."}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
            {/* Tab Lịch sử bảo trì */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Dòng thời gian bảo trì
                </Typography>
                <Box sx={{ position: "relative", my: 4, mx: 2 }}>
                  {/* Hình ảnh dòng thời gian */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: 16,
                      top: 0,
                      bottom: 0,
                      width: 2,
                      bgcolor: "divider",
                    }}
                  />
                  {/* Sự kiện dòng thời gian - sẽ được điền từ lịch sử bảo trì thực tế */}
                  <Box sx={{ position: "relative", mb: 4, pl: 5 }}>
                    <Box
                      sx={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        bgcolor: theme.palette.primary.main,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        zIndex: 1,
                      }}
                    >
                      <InfoIcon />
                    </Box>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Vấn đề được báo cáo
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(conditionDetail.loggedDate)}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {conditionDetail.name} đã được báo cáo cho{" "}
                          {conditionDetail.equipmentName}.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                  {conditionDetail.status !== MaintenanceStatus.Pending && (
                    <Box sx={{ position: "relative", mb: 4, pl: 5 }}>
                      <Box
                        sx={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          bgcolor: theme.palette.info.main,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          zIndex: 1,
                        }}
                      >
                        <BuildIcon />
                      </Box>
                      <Card variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Bắt đầu bảo trì
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {conditionDetail.updatedAt
                              ? formatDate(conditionDetail.updatedAt)
                              : "Ngày không được ghi lại"}
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 1 }}>
                            Công việc bảo trì đã bắt đầu trên thiết bị.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  )}
                  {(conditionDetail.status === MaintenanceStatus.Completed ||
                    conditionDetail.status === MaintenanceStatus.Cancelled) && (
                    <Box sx={{ position: "relative", mb: 4, pl: 5 }}>
                      <Box
                        sx={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          bgcolor:
                            conditionDetail.status ===
                            MaintenanceStatus.Completed
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          zIndex: 1,
                        }}
                      >
                        {conditionDetail.status ===
                        MaintenanceStatus.Completed ? (
                          <CheckCircleIcon />
                        ) : (
                          <CancelIcon />
                        )}
                      </Box>
                      <Card variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {conditionDetail.status ===
                            MaintenanceStatus.Completed
                              ? "Hoàn thành bảo trì"
                              : "Hủy bảo trì"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {conditionDetail.updatedAt
                              ? formatDate(conditionDetail.updatedAt)
                              : "Ngày                               không được ghi lại"}
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 1 }}>
                            {conditionDetail.status ===
                            MaintenanceStatus.Completed
                              ? "Thiết bị đã được sửa chữa và hiện có sẵn để sử dụng."
                              : "Bảo trì đã bị hủy bỏ."}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  )}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  Hành động bảo trì
                </Typography>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="body1">
                      {conditionDetail.maintenanceNotes ||
                        "Không có hành động bảo trì nào được ghi lại."}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </TabPanel>
            {/* Tab Vấn đề liên quan */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Các vấn đề khác cho thiết bị này
                </Typography>
                {relatedLogs.length > 0 ? (
                  <TableContainer
                    component={Paper}
                    sx={{ borderRadius: 2, overflow: "hidden" }}
                  >
                    <StyledTable>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Vấn đề</TableCell>
                          <TableCell>Ngày ghi</TableCell>
                          <TableCell>Trạng thái</TableCell>
                          <TableCell>Hành động</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {relatedLogs.map((log) => (
                          <TableRow key={log.damageDeviceId}>
                            <TableCell>{log.damageDeviceId}</TableCell>
                            <TableCell>{log.name}</TableCell>
                            <TableCell>{formatDate(log.loggedDate)}</TableCell>
                            <TableCell>
                              <StatusChip status={log.status}>
                                {getStatusText(log.status)}
                              </StatusChip>
                            </TableCell>
                            <TableCell>
                              <StyledButton
                                size="small"
                                variant="outlined"
                                onClick={() =>
                                  navigate(
                                    `/equipment-condition/${log.damageDeviceId}`
                                  )
                                }
                              >
                                Xem chi tiết
                              </StyledButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </StyledTable>
                  </TableContainer>
                ) : (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    Không có vấn đề nào khác được báo cáo cho thiết bị này.
                  </Alert>
                )}
                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  Thống kê sử dụng thiết bị
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary" gutterBottom>
                          {relatedLogs.length + 1}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tổng số vấn đề được báo cáo
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h4"
                          color="success.main"
                          gutterBottom
                        >
                          {relatedLogs.filter(
                            (log) => log.status === MaintenanceStatus.Completed
                          ).length +
                            (conditionDetail.status ===
                            MaintenanceStatus.Completed
                              ? 1
                              : 0)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Vấn đề đã giải quyết
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h4"
                          color="warning.main"
                          gutterBottom
                        >
                          {relatedLogs.filter(
                            (log) => log.status === MaintenanceStatus.Pending
                          ).length +
                            (conditionDetail.status ===
                            MaintenanceStatus.Pending
                              ? 1
                              : 0)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Vấn đề đang chờ xử lý
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="info.main" gutterBottom>
                          {relatedLogs.filter(
                            (log) => log.status === MaintenanceStatus.InProgress
                          ).length +
                            (conditionDetail.status ===
                            MaintenanceStatus.InProgress
                              ? 1
                              : 0)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Đang tiến hành
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </Paper>
        </>
      ) : (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          Không tìm thấy nhật ký điều kiện với ID: {id}
        </Alert>
      )}
    </StyledBox>
  );
};

export default EquipmentConditionDetails;
