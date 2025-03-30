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
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { IconButton } from "@mui/material";
import { formatDate } from "../../utils/replacementUtils";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import replacementService from "../../api/Services/replacementService";
import staffService from "../../api/Services/staffService";
import { equipmentHubService } from "../../api/Services/hubServices";
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
import {
  FilterButton,
  StyledChip,
  StyledContainer,
  StyledFormControl,
  StyledPaper,
  StyledTable,
} from "../../components/StyledComponents";
import useAuth from "../../hooks/useAuth";

const ManageReplacement: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { auth } = useAuth(); // Get current user info

  // State
  const [requests, setRequests] = useState<ReplacementRequestSummaryDto[]>([]);
  const [staff, setStaff] = useState<StaffAvailabilityDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [staffLoading, setStaffLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
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
  const [hubConnected, setHubConnected] = useState(false);

  // Form states
  const [reviewNotes, setReviewNotes] = useState("");
  const [isApproved, setIsApproved] = useState(true);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);

  // Status options
  const statusOptions = Object.values(ReplacementRequestStatus);

  // Connect to SignalR hub
  useEffect(() => {
    const connectToHub = async () => {
      if (!auth?.user?.userId) return;

      try {
        await equipmentHubService.connect(auth.user?.id, auth.user?.role);
        setHubConnected(true);

        // Register event handlers for real-time updates
        equipmentHubService.onReceiveReplacementReview((id, isApproved) => {
          const status = isApproved ? "approved" : "rejected";
          setNotification({
            open: true,
            message: `Replacement request #${id} was ${status}`,
            severity: "info",
          });
          fetchData(); // Refresh data
        });

        equipmentHubService.onReceiveAssignmentUpdate((id, equipmentName) => {
          setNotification({
            open: true,
            message: `Staff assigned to replacement request #${id} for ${equipmentName}`,
            severity: "info",
          });
          fetchData(); // Refresh data
        });

        equipmentHubService.onReceiveReplacementUpdate(
          (id, equipmentName, status) => {
            setNotification({
              open: true,
              message: `Replacement request #${id} for ${equipmentName} is now ${status}`,
              severity: "info",
            });
            fetchData(); // Refresh data
          }
        );
      } catch (error) {
        console.error("Error connecting to SignalR hub:", error);
      }
    };

    connectToHub();

    return () => {
      equipmentHubService.disconnect();
    };
  }, [auth]);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const replacementData = await replacementService.getAllReplacements();
      setRequests(replacementData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setNotification({
        open: true,
        message: "Failed to load replacement requests",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch staff data
  const fetchStaffData = async () => {
    try {
      setStaffLoading(true);
      const staffData = await staffService.getAvailableStaff();
      setStaff(staffData);
    } catch (error) {
      console.error("Error fetching staff data:", error);
      setNotification({
        open: true,
        message: "Failed to load staff data",
        severity: "error",
      });
    } finally {
      setStaffLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchStaffData();

    // Set up periodic refresh
    const refreshInterval = setInterval(() => {
      fetchData();
    }, 60000); // Refresh every minute

    return () => clearInterval(refreshInterval);
  }, []);

  // Handle view details
  const handleViewDetails = async (request: ReplacementRequestSummaryDto) => {
    try {
      setDetailLoading(true);
      const detailedRequest = await replacementService.getReplacementById(
        request.replacementRequestId
      );
      setSelectedRequest(detailedRequest);
      // Reset form states
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
        message: "Failed to load request details",
        severity: "error",
      });
    } finally {
      setDetailLoading(false);
    }
  };

  // Handle review request
  const handleReviewRequest = async () => {
    if (!selectedRequest) return;
    try {
      setActionLoading(true);
      setValidationError(null);
      const reviewData: ReviewReplacementRequestDto = {
        isApproved,
        reviewNotes,
      };
      const updatedRequest = await replacementService.reviewReplacement(
        selectedRequest.replacementRequestId,
        reviewData
      );
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
        message: `Request ${isApproved ? "approved" : "rejected"} successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error reviewing request:", error);
      setValidationError("Failed to review request. Please try again.");
      setNotification({
        open: true,
        message: "Failed to review request",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle assign staff
  const handleAssignStaff = async () => {
    if (!selectedRequest || selectedStaffId === null) return;
    try {
      setActionLoading(true);
      setValidationError(null);
      const assignData: AssignStaffDto = {
        staffId: selectedStaffId,
      };
      const updatedRequest = await replacementService.assignStaff(
        selectedRequest.replacementRequestId,
        assignData
      );
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
        message: "Staff assigned successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error assigning staff:", error);
      setValidationError("Failed to assign staff. Please try again.");
      setNotification({
        open: true,
        message: "Failed to assign staff",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle filter by status
  const handleStatusFilterChange = async (status: string) => {
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
      setRequests(filteredRequests || []); // Ensure we always set an array
    } catch (error) {
      console.error("Error filtering requests:", error);
      setRequests([]); // Reset to empty array on error
      setNotification({
        open: true,
        message: "Failed to filter requests",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sort function
  const createSortHandler = (property: OrderBy) => () => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Filter and sort requests
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

  // Pagination handlers
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

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    handleStatusFilterChange("");
  };

  return (
    <StyledContainer maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
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
        <Typography variant="h4">Equipment Replacement Requests</Typography>
        <Stack direction="row" spacing={2}>
          {hubConnected && (
            <Tooltip title="Real-time updates active">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "success.main",
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "success.main",
                    mr: 1,
                  }}
                />
                <Typography variant="body2">Live</Typography>
              </Box>
            </Tooltip>
          )}
          <Tooltip title="Refresh">
            <FilterButton onClick={fetchData}>
              <RefreshIcon />
            </FilterButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Filters and Search */}
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={2}
        sx={{ mb: 3 }}
        alignItems={isMobile ? "stretch" : "center"}
      >
        <TextField
          placeholder="Search requests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          fullWidth={isMobile}
          sx={{
            flexGrow: 1,
            "& .MuiOutlinedInput-root": { borderRadius: 3 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
        <StyledFormControl sx={{ minWidth: 150 }}>
          <Select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            displayEmpty
            renderValue={(value) => value || "All Statuses"}
            startAdornment={<FilterListIcon color="primary" sx={{ mr: 1 }} />}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
        <Tooltip title="Reset Filters">
          <FilterButton onClick={handleResetFilters}>
            <RefreshIcon />
          </FilterButton>
        </Tooltip>
      </Stack>

      {/* Error alert */}
      {validationError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationError}
        </Alert>
      )}

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Main content */}
      {!loading &&
        (isMobile ? (
          <Box>
            {paginatedRequests.length > 0 ? (
              paginatedRequests.map((request) => (
                <MobileRequestCard
                  key={request.replacementRequestId}
                  request={request}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
                <Typography color="text.secondary">
                  No replacement requests found
                </Typography>
              </Paper>
            )}
            <TablePagination
              component="div"
              count={filteredRequests.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
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
                    <TableCell>Customer</TableCell>
                    <TableCell>Equipment</TableCell>
                    <TableCell>Issue</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "requestDate"}
                        direction={orderBy === "requestDate" ? order : "asc"}
                        onClick={createSortHandler("requestDate")}
                      >
                        Request Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "status"}
                        direction={orderBy === "status" ? order : "asc"}
                        onClick={createSortHandler("status")}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Assigned Staff</TableCell>
                    <TableCell>Actions</TableCell>
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
                          <Tooltip title={request.requestReason}>
                            <Typography noWrap sx={{ maxWidth: 200 }}>
                              {request.requestReason}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{formatDate(request.requestDate)}</TableCell>
                        <TableCell>
                          <StyledChip
                            label={request.status}
                            status={request.status}
                          />
                        </TableCell>
                        <TableCell>
                          {request.assignedStaffName || (
                            <Typography
                              color="text.secondary"
                              fontStyle="italic"
                            >
                              Not assigned
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
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
                        <Typography color="text.secondary" py={2}>
                          No replacement requests found
                        </Typography>
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
            />
          </StyledPaper>
        ))}

      {/* Detail Dialog */}
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
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">
                  Replacement Request #{selectedRequest.replacementRequestId}
                </Typography>
                <StyledChip
                  label={selectedRequest.status}
                  status={selectedRequest.status}
                />
              </Stack>
            </DialogTitle>
            <DialogContent dividers>
              {actionLoading && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: alpha("#fff", 0.7),
                    zIndex: 1,
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
              <Stack spacing={3} sx={{ pt: 1 }}>
                {/* Customer Information */}
                <CustomerInfo request={selectedRequest} />

                {/* Equipment Information */}
                <EquipmentInfo request={selectedRequest} />

                {/* Notes */}
                <NotesInfo request={selectedRequest} />

                {/* Actions based on status */}
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

                {/* If no actions are available */}
                {!getAvailableActions(selectedRequest.status).canReview &&
                  !getAvailableActions(selectedRequest.status).canAssign &&
                  !getAvailableActions(selectedRequest.status).canComplete && (
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.info.light, 0.1),
                      }}
                    >
                      <Typography
                        variant="body1"
                        textAlign="center"
                        color="text.secondary"
                      >
                        No actions available for requests with status "
                        {selectedRequest.status}"
                      </Typography>
                    </Paper>
                  )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDetailDialogOpen(false)}
                sx={{ borderRadius: 2 }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        ) : (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="error">
              Failed to load request details
            </Typography>
          </Box>
        )}
      </Dialog>

      {/* Notification Snackbar */}
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
