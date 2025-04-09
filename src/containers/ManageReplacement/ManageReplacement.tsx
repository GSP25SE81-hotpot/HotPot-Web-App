// src/components/replacement/ManageReplacement.tsx
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import replacementService from "../../api/Services/replacementService";
import staffService from "../../api/Services/staffService";
import { formatDate } from "../../utils/replacementUtils";
// Remove the direct import of equipmentHubService
// import { equipmentHubService } from "../../api/Services/hubServices";
import {
  FilterButton,
  StyledChip,
  StyledContainer,
  StyledFormControl,
  StyledPaper,
  StyledTable,
} from "../../components/StyledComponents";
import {
  DialogHeader,
  LoadingOverlay,
  NoActionsMessage,
  NoResultsMessage,
  PageTitle,
  SearchField,
} from "../../components/manager/styles/manageReplacementStyles";
import {
  AssignStaffDto,
  NotificationState,
  Order,
  OrderBy,
  ReplacementRequestDetailDto,
  ReplacementRequestStatus,
  ReplacementRequestSummaryDto,
  ReviewReplacementRequestDto,
} from "../../types/replacement";
import { StaffAvailabilityDto } from "../../types/staff";
import { getAvailableActions } from "../../utils/replacementUtils";
import AssignStaff from "./replacement/AssignStaff";
import CustomerInfo from "./replacement/CustomerInfo";
import EquipmentInfo from "./replacement/EquipmentInfo";
import MobileRequestCard from "./replacement/MobileRequestCard";
import NotesInfo from "./replacement/NotesInfo";
import ReviewRequest from "./replacement/ReviewRequest";
// Import the notification context
// import { useNotificationContext } from "../../context/NotificationContext";

// Improved getStatusText function with better type handling
const getStatusText = (
  status: string | ReplacementRequestStatus | null | undefined
): string => {
  // Handle null, undefined, or empty string
  if (status === null || status === undefined || status === "") {
    return "Tất cả trạng thái";
  }
  // Convert string to number if needed
  const statusValue =
    typeof status === "string" ? parseInt(status, 10) : status;
  // Use a switch statement instead of statusTextMap
  switch (statusValue) {
    case ReplacementRequestStatus.Pending:
      return "Đang chờ";
    case ReplacementRequestStatus.Approved:
      return "Đã phê duyệt";
    case ReplacementRequestStatus.Rejected:
      return "Đã từ chối";
    case ReplacementRequestStatus.InProgress:
      return "Đang xử lý";
    case ReplacementRequestStatus.Completed:
      return "Đã hoàn thành";
    case ReplacementRequestStatus.Cancelled:
      return "Đã hủy";
    default:
      return "Tất cả trạng thái";
  }
};

const ManageReplacement: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Use the notification context instead of direct hub connection
  // const { isConnected, equipmentAlerts, statusAlerts, equipmentUpdates } =
  //   useNotificationContext();

  // Trạng thái
  const [requests, setRequests] = useState<ReplacementRequestSummaryDto[]>([]);
  const [staff, setStaff] = useState<StaffAvailabilityDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [staffLoading, setStaffLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    ReplacementRequestStatus | ""
  >("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<OrderBy>("requestDate");
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: "",
    severity: "info",
  });
  const [selectedRequest, setSelectedRequest] =
    useState<ReplacementRequestDetailDto | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Trạng thái biểu mẫu
  const [reviewNotes, setReviewNotes] = useState("");
  const [isApproved, setIsApproved] = useState(true);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);

  // Tùy chọn trạng thái
  const statusOptions = Object.values(ReplacementRequestStatus).filter(
    (value) => typeof value === "number"
  ) as ReplacementRequestStatus[];

  // Listen for equipment updates from the notification context
  // useEffect(() => {
  //   // When we receive equipment updates, refresh the data
  //   if (equipmentUpdates.length > 0) {
  //     fetchData();
  //   }
  // }, [equipmentUpdates]);

  // // Listen for status alerts from the notification context
  // useEffect(() => {
  //   // When we receive status alerts, refresh the data
  //   if (statusAlerts.length > 0) {
  //     fetchData();
  //   }
  // }, [statusAlerts]);

  // // Listen for equipment alerts from the notification context
  // useEffect(() => {
  //   // When we receive equipment alerts, refresh the data
  //   if (equipmentAlerts.length > 0) {
  //     fetchData();
  //   }
  // }, [equipmentAlerts]);

  // Lấy dữ liệu
  const fetchData = async () => {
    try {
      setLoading(true);
      const replacementData = await replacementService.getAllReplacements();
      setRequests(replacementData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      setNotification({
        open: true,
        message: "Không thể tải yêu cầu thay thế",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Lấy dữ liệu nhân viên
  const fetchStaffData = async () => {
    try {
      setStaffLoading(true);
      const staffData = await staffService.getAvailableStaff();
      setStaff(staffData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu nhân viên:", error);
      setNotification({
        open: true,
        message: "Không thể tải dữ liệu nhân viên",
        severity: "error",
      });
    } finally {
      setStaffLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchStaffData();
    // Thiết lập làm mới định kỳ
    const refreshInterval = setInterval(() => {
      fetchData();
    }, 60000); // Làm mới mỗi phút
    return () => clearInterval(refreshInterval);
  }, []);

  // Xử lý xem chi tiết
  const handleViewDetails = async (request: ReplacementRequestSummaryDto) => {
    try {
      setDetailLoading(true);
      const response = await replacementService.getReplacementById(
        request.replacementRequestId
      );
      // Check if we got a valid response
      if (!response || !response.success || !response.data) {
        throw new Error("Invalid response from server");
      }
      // The data is now a single object, not an array
      const detailedRequest = response.data;
      setSelectedRequest(detailedRequest);
      setReviewNotes(detailedRequest.reviewNotes || "");
      setIsApproved(
        detailedRequest.status === ReplacementRequestStatus.Approved ||
          detailedRequest.status === ReplacementRequestStatus.InProgress
      );
      setSelectedStaffId(detailedRequest.assignedStaffId || null);
      setDetailDialogOpen(true);
    } catch (error) {
      console.error("Error fetching request details:", error);
      setNotification({
        open: true,
        message: "Could not load request details",
        severity: "error",
      });
    } finally {
      setDetailLoading(false);
    }
  };

  // Xử lý xem xét yêu cầu
  const handleReviewRequest = async () => {
    if (!selectedRequest) return;
    try {
      setActionLoading(true);
      setValidationError(null);
      const reviewData: ReviewReplacementRequestDto = {
        isApproved,
        reviewNotes,
      };
      const updatedRequestArray = await replacementService.reviewReplacement(
        selectedRequest.replacementRequestId,
        reviewData
      );
      // Extract the first item from the array
      const updatedRequest = updatedRequestArray;
      // Check if we have a valid updated request
      if (!updatedRequest) {
        throw new Error("No updated replacement request details found");
      }
      // Update the requests list
      setRequests(
        requests.map((req) =>
          req.replacementRequestId === updatedRequest.replacementRequestId
            ? {
                ...req,
                status: updatedRequest.status,
                reviewDate: updatedRequest.reviewDate,
              }
            : req
        )
      );
      setSelectedRequest(updatedRequest);
      setNotification({
        open: true,
        message: `Yêu cầu đã được ${
          isApproved ? "phê duyệt" : "từ chối"
        } thành công`,
        severity: "success",
      });
    } catch (error) {
      console.error("Lỗi khi xem xét yêu cầu:", error);
      setValidationError("Không thể xem xét yêu cầu. Vui lòng thử lại.");
      setNotification({
        open: true,
        message: "Không thể xem xét yêu cầu",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Xử lý phân công nhân viên
  const handleAssignStaff = async () => {
    if (!selectedRequest || selectedStaffId === null) return;
    try {
      setActionLoading(true);
      setValidationError(null);
      const assignData: AssignStaffDto = {
        staffId: selectedStaffId,
      };
      const updatedRequestArray = await replacementService.assignStaff(
        selectedRequest.replacementRequestId,
        assignData
      );
      // Extract the first item from the array
      const updatedRequest = updatedRequestArray[0];
      // Check if we have a valid updated request
      if (!updatedRequest) {
        throw new Error("No updated replacement request details found");
      }
      // Update the requests list
      setRequests(
        requests.map((req) =>
          req.replacementRequestId === updatedRequest.replacementRequestId
            ? {
                ...req,
                status: updatedRequest.status,
                assignedStaffName: updatedRequest.assignedStaffName,
              }
            : req
        )
      );
      setSelectedRequest(updatedRequest);
      setNotification({
        open: true,
        message: "Đã phân công nhân viên thành công",
        severity: "success",
      });
    } catch (error) {
      console.error("Lỗi khi phân công nhân viên:", error);
      setValidationError("Không thể phân công nhân viên. Vui lòng thử lại.");
      setNotification({
        open: true,
        message: "Không thể phân công nhân viên",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Xử lý lọc theo trạng thái
  const handleStatusFilterChange = async (
    status: ReplacementRequestStatus | ""
  ) => {
    try {
      setLoading(true);
      setStatusFilter(status);
      let filteredRequests;
      if (status === "") {
        filteredRequests = await replacementService.getAllReplacements();
      } else {
        filteredRequests = await replacementService.getReplacementsByStatus(
          status
        );
      }
      setRequests(filteredRequests || []);
    } catch (error) {
      console.error("Lỗi khi lọc yêu cầu:", error);
      setRequests([]);
      setNotification({
        open: true,
        message: "Không thể lọc yêu cầu",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Hàm sắp xếp
  const createSortHandler = (property: OrderBy) => () => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Lọc và sắp xếp yêu cầu
  const filteredRequests = (requests || [])
    .filter((request) => {
      const matchesSearch =
        request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.equipmentName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.requestReason.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      if (!aValue && !bValue) return 0;
      if (!aValue) return order === "asc" ? -1 : 1;
      if (!bValue) return order === "asc" ? 1 : -1;
      if (order === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const paginatedRequests = filteredRequests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Xử lý phân trang
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Đặt lại bộ lọc
  const handleResetFilters = () => {
    setSearchTerm("");
    handleStatusFilterChange("");
  };

  return (
    <StyledContainer maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Tiêu đề */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <PageTitle>Yêu cầu thay thế thiết bị</PageTitle>
        <Stack direction="row" spacing={2}>
          {/* {isConnected && (
            <Tooltip title="Cập nhật thời gian thực đang hoạt động">
              <LiveIndicator>
                <LiveDot />
                <Typography variant="body2">Trực tiếp</Typography>
              </LiveIndicator>
            </Tooltip>
          )} */}
          <Tooltip title="Làm mới">
            <FilterButton onClick={fetchData}>
              <RefreshIcon />
            </FilterButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Bộ lọc và Tìm kiếm */}
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={2}
        sx={{ mb: 3 }}
        alignItems={isMobile ? "stretch" : "center"}
      >
        <SearchField
          placeholder="Tìm kiếm yêu cầu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          fullWidth={isMobile}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            },
          }}
        />
        <StyledFormControl sx={{ minWidth: 150 }}>
          <Select
            value={statusFilter}
            onChange={(e) =>
              handleStatusFilterChange(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            displayEmpty
            renderValue={(value) => getStatusText(value)}
            startAdornment={<FilterListIcon color="primary" sx={{ mr: 1 }} />}
          >
            <MenuItem value="">Tất cả trạng thái</MenuItem>
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {getStatusText(status)}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
        <Tooltip title="Đặt lại bộ lọc">
          <FilterButton onClick={handleResetFilters}>
            <RefreshIcon />
          </FilterButton>
        </Tooltip>
      </Stack>

      {/* Thông báo lỗi */}
      {validationError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationError}
        </Alert>
      )}

      {/* Chỉ báo đang tải */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Nội dung chính */}
      {!loading &&
        (isMobile ? (
          <Box>
            {paginatedRequests.length > 0 ? (
              paginatedRequests.map((request) => (
                <MobileRequestCard
                  key={request.replacementRequestId}
                  request={{
                    ...request,
                    // Don't modify the status type, just pass it as is
                  }}
                  onViewDetails={() => handleViewDetails(request)}
                />
              ))
            ) : (
              <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
                <NoResultsMessage>
                  Không tìm thấy yêu cầu thay thế nào
                </NoResultsMessage>
              </Paper>
            )}
            <TablePagination
              component="div"
              count={filteredRequests.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Số hàng mỗi trang:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} của ${count}`
              }
            />
          </Box>
        ) : (
          <StyledPaper>
            <TableContainer>
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "replacementRequestId"}
                        direction={
                          orderBy === "replacementRequestId" ? order : "asc"
                        }
                        onClick={createSortHandler("replacementRequestId")}
                      >
                        ID
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Khách hàng</TableCell>
                    <TableCell>Thiết bị</TableCell>
                    <TableCell>Vấn đề</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "requestDate"}
                        direction={orderBy === "requestDate" ? order : "asc"}
                        onClick={createSortHandler("requestDate")}
                      >
                        Ngày yêu cầu
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "status"}
                        direction={orderBy === "status" ? order : "asc"}
                        onClick={createSortHandler("status")}
                      >
                        Trạng thái
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Nhân viên được phân công</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRequests.length > 0 ? (
                    paginatedRequests.map((request) => (
                      <TableRow key={request.replacementRequestId}>
                        <TableCell>#{request.replacementRequestId}</TableCell>
                        <TableCell>{request.customerName}</TableCell>
                        <TableCell>{request.equipmentName}</TableCell>
                        <TableCell>
                          <Typography noWrap sx={{ maxWidth: 200 }}>
                            {request.requestReason}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDate(request.requestDate)}</TableCell>
                        <TableCell>
                          <StyledChip
                            label={getStatusText(request.status)}
                            status={request.status}
                          />
                        </TableCell>
                        <TableCell>
                          {request.assignedStaffName || (
                            <Typography
                              color="text.secondary"
                              fontStyle="italic"
                            >
                              Chưa phân công
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Xem chi tiết">
                            <IconButton
                              color="primary"
                              onClick={() => handleViewDetails(request)}
                            >
                              <SearchIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <NoResultsMessage>
                          Không tìm thấy yêu cầu thay thế nào
                        </NoResultsMessage>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </StyledTable>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredRequests.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Số hàng mỗi trang:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} của ${count}`
              }
            />
          </StyledPaper>
        ))}

      {/* Hộp thoại chi tiết */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        {detailLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : selectedRequest ? (
          <>
            <DialogTitle>
              <DialogHeader>
                <Typography variant="h6">
                  Yêu cầu thay thế #{selectedRequest.replacementRequestId}
                </Typography>
                <StyledChip
                  label={getStatusText(selectedRequest.status)}
                  status={selectedRequest.status}
                />
              </DialogHeader>
            </DialogTitle>
            <DialogContent dividers>
              {actionLoading && (
                <LoadingOverlay>
                  <CircularProgress />
                </LoadingOverlay>
              )}
              <Stack spacing={3} sx={{ pt: 1 }}>
                {/* Thông tin khách hàng */}
                <CustomerInfo request={selectedRequest} />
                {/* Thông tin thiết bị */}
                <EquipmentInfo request={selectedRequest} />
                {/* Ghi chú */}
                <NotesInfo request={selectedRequest} />
                {/* Hành động dựa trên trạng thái */}
                {getAvailableActions(selectedRequest.status).canReview && (
                  <ReviewRequest
                    isApproved={isApproved}
                    setIsApproved={setIsApproved}
                    reviewNotes={reviewNotes}
                    setReviewNotes={setReviewNotes}
                    onReview={handleReviewRequest}
                  />
                )}
                {getAvailableActions(selectedRequest.status).canAssign && (
                  <AssignStaff
                    selectedStaffId={selectedStaffId}
                    setSelectedStaffId={setSelectedStaffId}
                    staff={staff}
                    loading={staffLoading}
                    onAssign={handleAssignStaff}
                  />
                )}
                {/* Nếu không có hành động nào khả dụng */}
                {!getAvailableActions(selectedRequest.status).canReview &&
                  !getAvailableActions(selectedRequest.status).canAssign &&
                  !getAvailableActions(selectedRequest.status).canComplete && (
                    <NoActionsMessage variant="outlined">
                      <Typography
                        variant="body1"
                        textAlign="center"
                        color="text.secondary"
                      >
                        Không có hành động nào khả dụng cho yêu cầu có trạng
                        thái "{getStatusText(selectedRequest.status)}"
                      </Typography>
                    </NoActionsMessage>
                  )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDetailDialogOpen(false)}
                sx={{ borderRadius: 2 }}
              >
                Đóng
              </Button>
            </DialogActions>
          </>
        ) : (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="error">
              Không thể tải chi tiết yêu cầu
            </Typography>
          </Box>
        )}
      </Dialog>

      {/* Thanh thông báo */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default ManageReplacement;
