/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Alert,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Button,
  Tooltip,
  Divider,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useState } from "react";
import staffAssignmentService from "../../api/Services/staffAssignmentService";
import { StaffTaskType } from "../../types/orderManagement";
import {
  PagedResult,
  StaffAssignmentHistoryDto,
  StaffAssignmentHistoryFilterRequest,
} from "../../types/staffAssignment";
import {
  PageContainer,
  PageTitle,
  FilterContainer,
  LoadingContainer,
  ResultsContainer,
  StaffInfoContainer,
  AdditionalStaffContainer,
  EmptyResultCard,
  FilterTitle,
  FilterActions,
  StyledTableHead,
  StyledTableRow,
  StaffName,
  AdditionalStaffChip,
  DateCell,
  StatusChip,
  TaskTypeChip,
  SearchButton,
  ResetButton,
  TableTitle,
  TableSummary,
} from "./StaffAssignmentHistoryStyles";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const StaffAssignmentHistory: React.FC = () => {
  const [assignments, setAssignments] =
    useState<PagedResult<StaffAssignmentHistoryDto> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<StaffAssignmentHistoryFilterRequest>({
    pageNumber: 1,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const result = await staffAssignmentService.getStaffAssignmentHistory(
          filter
        );
        setAssignments(result);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải lịch sử phân công:", err);
        setError("Không thể tải lịch sử phân công. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [filter]);

  const handleFilterChange = (
    newFilter: Partial<StaffAssignmentHistoryFilterRequest>
  ) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  const handleSearch = () => {
    setFilter((prev) => ({ ...prev, pageNumber: 1 }));
  };

  const handleReset = () => {
    setFilter({
      pageNumber: 1,
      pageSize: 10,
    });
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    setFilter((prev) => ({ ...prev, pageNumber: newPage + 1 }));
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilter((prev) => ({
      ...prev,
      pageSize: parseInt(event.target.value, 10),
      pageNumber: 1,
    }));
  };

  const getTaskTypeLabel = (taskType: StaffTaskType) => {
    switch (taskType) {
      case StaffTaskType.Preparation:
        return "Chuẩn bị";
      case StaffTaskType.Shipping:
        return "Vận chuyển";
      case StaffTaskType.Pickup:
        return "Lấy hàng";
      default:
        return "Không xác định";
    }
  };

  const getTaskTypeColor = (taskType: StaffTaskType) => {
    switch (taskType) {
      case StaffTaskType.Preparation:
        return "primary";
      case StaffTaskType.Shipping:
        return "secondary";
      case StaffTaskType.Pickup:
        return "success";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
    } catch (error) {
      return "Không xác định";
    }
  };

  return (
    <PageContainer>
      <PageTitle variant="h4">
        <AssignmentIndIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Lịch sử Phân công Nhân viên
      </PageTitle>

      {/* Phần Bộ lọc */}
      <FilterContainer>
        <FilterTitle variant="h6">Bộ lọc tìm kiếm</FilterTitle>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Tên nhân viên"
              variant="outlined"
              value={filter.staffName || ""}
              onChange={(e) =>
                handleFilterChange({ staffName: e.target.value })
              }
              placeholder="Nhập tên nhân viên..."
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Mã đơn hàng"
              variant="outlined"
              value={filter.orderCode || ""}
              onChange={(e) =>
                handleFilterChange({ orderCode: e.target.value })
              }
              placeholder="Nhập mã đơn hàng..."
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Loại nhiệm vụ</InputLabel>
              <Select
                value={filter.taskType || ""}
                label="Loại nhiệm vụ"
                onChange={(e) =>
                  handleFilterChange({
                    taskType: e.target.value as StaffTaskType,
                  })
                }
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value={StaffTaskType.Preparation}>Chuẩn bị</MenuItem>
                <MenuItem value={StaffTaskType.Shipping}>Vận chuyển</MenuItem>
                <MenuItem value={StaffTaskType.Pickup}>Lấy hàng</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={
                  filter.isActive === undefined
                    ? ""
                    : filter.isActive
                    ? "active"
                    : "completed"
                }
                label="Trạng thái"
                onChange={(e) => {
                  if (e.target.value === "") {
                    handleFilterChange({ isActive: undefined });
                  } else {
                    handleFilterChange({
                      isActive: e.target.value === "active",
                    });
                  }
                }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="active">Đang hoạt động</MenuItem>
                <MenuItem value="completed">Đã hoàn thành</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Ngày bắt đầu"
                value={filter.startDate ? new Date(filter.startDate) : null}
                onChange={(date) =>
                  handleFilterChange({
                    startDate: date ? date.toISOString() : undefined,
                  })
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    placeholder: "Chọn ngày bắt đầu",
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Ngày kết thúc"
                value={filter.endDate ? new Date(filter.endDate) : null}
                onChange={(date) =>
                  handleFilterChange({
                    endDate: date ? date.toISOString() : undefined,
                  })
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    placeholder: "Chọn ngày kết thúc",
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>

        <FilterActions>
          <SearchButton
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
          >
            Tìm kiếm
          </SearchButton>
          <ResetButton
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
          >
            Đặt lại
          </ResetButton>
        </FilterActions>
      </FilterContainer>

      {/* Phần Kết quả */}
      {loading ? (
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : assignments && assignments.items.length > 0 ? (
        <ResultsContainer>
          <TableTitle>
            <Typography variant="h6">Danh sách phân công</Typography>
            <TableSummary>
              Hiển thị{" "}
              {(filter.pageNumber || 1) > 1
                ? ((filter.pageNumber || 1) - 1) * (filter.pageSize || 10) + 1
                : 1}{" "}
              -{" "}
              {Math.min(
                (filter.pageNumber || 1) * (filter.pageSize || 10),
                assignments.totalCount
              )}{" "}
              trên tổng số {assignments.totalCount} phân công
            </TableSummary>
          </TableTitle>
          <Divider />

          <TableContainer>
            <Table>
              <StyledTableHead>
                <TableRow>
                  <TableCell>Mã đơn hàng</TableCell>
                  <TableCell>Khách hàng</TableCell>
                  <TableCell>Loại nhiệm vụ</TableCell>
                  <TableCell>Nhân viên</TableCell>
                  <TableCell>Ngày phân công</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {assignments.items.map((assignment, index) => (
                  <StyledTableRow
                    key={assignment.staffAssignmentId}
                    $isEven={index % 2 === 0}
                  >
                    <TableCell>
                      <Tooltip title="Xem chi tiết đơn hàng" arrow>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "medium", cursor: "pointer" }}
                        >
                          {assignment.orderCode || "N/A"}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{assignment.customerName || "N/A"}</TableCell>
                    <TableCell>
                      <TaskTypeChip
                        label={getTaskTypeLabel(assignment.taskType)}
                        color={getTaskTypeColor(assignment.taskType) as any}
                        size="small"
                        $taskType={assignment.taskType}
                      />
                    </TableCell>
                    <TableCell>
                      <StaffInfoContainer>
                        <StaffName>{assignment.staffName || "N/A"}</StaffName>
                        {assignment.additionalPreparationStaff &&
                          assignment.additionalPreparationStaff.length > 0 && (
                            <AdditionalStaffContainer>
                              {assignment.additionalPreparationStaff.map(
                                (staff) => (
                                  <StaffName>
                                    {staff.staffName || "N/A"}
                                  </StaffName>
                                )
                              )}
                            </AdditionalStaffContainer>
                          )}
                      </StaffInfoContainer>
                    </TableCell>
                    <DateCell>
                      <Tooltip
                        title={formatDate(assignment.assignedDate)}
                        arrow
                      >
                        <span>{formatDate(assignment.assignedDate)}</span>
                      </Tooltip>
                    </DateCell>
                    <TableCell>
                      <StatusChip
                        label={
                          assignment.isActive
                            ? "Đang hoạt động"
                            : "Đã hoàn thành"
                        }
                        $isActive={assignment.isActive}
                        size="small"
                      />
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={assignments.totalCount}
            rowsPerPage={filter.pageSize || 10}
            page={(filter.pageNumber || 1) - 1}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} của ${count}`
            }
          />
        </ResultsContainer>
      ) : (
        <EmptyResultCard>
          <CardContent>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Không tìm thấy kết quả
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary">
              Không tìm thấy phân công nào phù hợp với tiêu chí tìm kiếm của
              bạn. Vui lòng thử lại với các bộ lọc khác.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={handleReset}
              >
                Đặt lại bộ lọc
              </Button>
            </Box>
          </CardContent>
        </EmptyResultCard>
      )}
    </PageContainer>
  );
};

export default StaffAssignmentHistory;
