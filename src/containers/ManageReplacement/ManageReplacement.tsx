import AddIcon from "@mui/icons-material/Add";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Snackbar,
  Stack,
  Table,
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
import { alpha, styled } from "@mui/material/styles";
import { useState } from "react";

// Type definitions
type ReplacementStatus = "Pending" | "In Progress" | "Completed";

interface ReplacementRequest {
  id: string;
  customerName: string;
  deviceId: string;
  issue: string;
  requestDate: string;
  status: ReplacementStatus;
  assignedStaff?: string;
  notes?: string;
}

interface Staff {
  id: string;
  name: string;
  avatar: string;
  available: boolean;
}

// Sort direction
type Order = "asc" | "desc";
type OrderBy = keyof Omit<ReplacementRequest, "notes">;

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  "& .MuiTypography-h4": {
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
    marginBottom: theme.spacing(3),
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  borderRadius: 16,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
  overflow: "hidden",
}));

const StyledTable = styled(Table)(({ theme }) => ({
  "& .MuiTableCell-head": {
    fontWeight: 600,
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
  "& .MuiTableCell-root": {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  },
}));

const StyledFormControl = styled(FormControl)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
  },
  "& .MuiSelect-select": {
    padding: "8px 14px",
  },
}));

const StyledChip = styled(Chip)<{ status: ReplacementStatus }>(
  ({ theme, status }) => ({
    borderRadius: 12,
    fontWeight: 500,
    backgroundColor: alpha(
      status === "Pending"
        ? theme.palette.warning.main
        : status === "In Progress"
        ? theme.palette.primary.main
        : theme.palette.success.main,
      0.1
    ),
    color:
      status === "Pending"
        ? theme.palette.warning.main
        : status === "In Progress"
        ? theme.palette.primary.main
        : theme.palette.success.main,
  })
);

const AnimatedButton = styled(Button)(() => ({
  borderRadius: 12,
  padding: "10px 24px",
}));

const FilterButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 10,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
}));

// Mock data
const fakeRequests: ReplacementRequest[] = [
  {
    id: "1",
    customerName: "John Doe",
    deviceId: "HP-1234",
    issue: "Heating element not working",
    requestDate: "2023-09-20",
    status: "Pending",
    notes: "Customer reported device stopped heating after 2 months.",
  },
  {
    id: "2",
    customerName: "Jane Smith",
    deviceId: "HP-5678",
    issue: "Temperature control malfunction",
    requestDate: "2023-09-21",
    status: "In Progress",
    assignedStaff: "staff-2",
    notes: "Awaiting replacement part.",
  },
];

const fakeStaff: Staff[] = [
  { id: "staff-1", name: "Mike Chen", avatar: "M", available: true },
  { id: "staff-2", name: "Sarah Johnson", avatar: "S", available: true },
  { id: "staff-3", name: "Alex Thompson", avatar: "A", available: false },
];

const statusOptions: ReplacementStatus[] = [
  "Pending",
  "In Progress",
  "Completed",
];

// MobileRequestCard Component (assumed, based on context)
const MobileRequestCard = ({
  request,
  staffList,
  onViewDetails,
}: {
  request: ReplacementRequest;
  onStatusChange: (id: string, status: ReplacementStatus) => void;
  onStaffAssign: (id: string, staffId: string) => void;
  staffList: Staff[];
  onViewDetails: (request: ReplacementRequest) => void;
}) => {
  const theme = useTheme();
  const assignedStaff = staffList.find((s) => s.id === request.assignedStaff);

  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 3,
        borderLeft: `4px solid ${
          request.status === "Pending"
            ? theme.palette.warning.main
            : request.status === "In Progress"
            ? theme.palette.primary.main
            : theme.palette.success.main
        }`,
      }}
      onClick={() => onViewDetails(request)}
    >
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1" fontWeight={600}>
            {request.customerName}
          </Typography>
          <StyledChip label={request.status} status={request.status} />
        </Stack>
        <Typography variant="body2">Device: {request.deviceId}</Typography>
        <Typography variant="body2">
          Requested: {new Date(request.requestDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body2">Issue: {request.issue}</Typography>
        {assignedStaff ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar>{assignedStaff.avatar}</Avatar>
            <Typography>{assignedStaff.name}</Typography>
          </Stack>
        ) : (
          <Typography color="text.secondary" fontStyle="italic">
            No staff assigned
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

// Main Component
const ManageReplacement: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [requests, setRequests] = useState<ReplacementRequest[]>(fakeRequests);
  const [staff] = useState<Staff[]>(fakeStaff);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReplacementStatus | "">("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<OrderBy>("requestDate");
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });
  const [selectedRequest, setSelectedRequest] =
    useState<ReplacementRequest | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Handle status change
  const handleStatusChange = (
    requestId: string,
    newStatus: ReplacementStatus
  ) => {
    const currentRequest = requests.find((r) => r.id === requestId);
    if (!currentRequest) return;

    if (newStatus === "In Progress" && !currentRequest.assignedStaff) {
      setValidationError(
        "Please assign a staff member before changing status to In Progress"
      );
      return;
    }

    setValidationError(null);
    setRequests(
      requests.map((request) =>
        request.id === requestId ? { ...request, status: newStatus } : request
      )
    );
    setNotification({
      open: true,
      message: `Request ${requestId} status updated to ${newStatus}`,
      severity: "success",
    });
  };

  // Handle staff assignment
  const handleStaffAssignment = (requestId: string, staffId: string) => {
    setRequests(
      requests.map((request) =>
        request.id === requestId
          ? { ...request, assignedStaff: staffId || undefined }
          : request
      )
    );
    if (staffId) {
      const staffName = staff.find((s) => s.id === staffId)?.name || "Unknown";
      setNotification({
        open: true,
        message: `${staffName} assigned to request ${requestId}`,
        severity: "success",
      });
    }
  };

  // Add new request
  const addNewRequest = () => {
    const newRequest: ReplacementRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      customerName: "New Customer",
      deviceId: `HP-${Math.floor(1000 + Math.random() * 9000)}`,
      issue: "New issue reported",
      requestDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      notes: "Waiting for initial assessment",
    };
    setRequests([...requests, newRequest]);
    setNotification({
      open: true,
      message: `New request ${newRequest.id} created`,
      severity: "success",
    });
  };

  // Handle view details
  const handleViewDetails = (request: ReplacementRequest) => {
    setSelectedRequest(request);
    setDetailDialogOpen(true);
  };

  // Update request notes
  const updateRequestNotes = (id: string, notes: string) => {
    setRequests(
      requests.map((request) =>
        request.id === id ? { ...request, notes } : request
      )
    );
  };

  // Sort function
  const createSortHandler = (property: OrderBy) => () => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Filter and sort requests
  const filteredRequests = requests
    .filter((request) => {
      const matchesSearch =
        request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.issue.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter
        ? request.status === statusFilter
        : true;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return order === "asc" ? -1 : 1;
      if (bValue === undefined) return order === "asc" ? 1 : -1;

      if (order === "asc") {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
        return 0;
      }
    });

  const paginatedRequests = filteredRequests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
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
          <AnimatedButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addNewRequest}
          >
            New Request
          </AnimatedButton>
          <Tooltip title="Refresh">
            <FilterButton
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
              }}
            >
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
              setStatusFilter(e.target.value as ReplacementStatus | "")
            }
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
      </Stack>

      {/* Error alert */}
      {validationError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationError}
        </Alert>
      )}

      {/* Main content */}
      {isMobile ? (
        <Box>
          {paginatedRequests.length > 0 ? (
            paginatedRequests.map((request) => (
              <MobileRequestCard
                key={request.id}
                request={request}
                onStatusChange={handleStatusChange}
                onStaffAssign={handleStaffAssignment}
                staffList={staff}
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
                      active={orderBy === "customerName"}
                      direction={orderBy === "customerName" ? order : "asc"}
                      onClick={createSortHandler("customerName")}
                    >
                      Customer
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "deviceId"}
                      direction={orderBy === "deviceId" ? order : "asc"}
                      onClick={createSortHandler("deviceId")}
                    >
                      Device ID
                    </TableSortLabel>
                  </TableCell>
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
                    <TableRow key={request.id}>
                      <TableCell>{request.customerName}</TableCell>
                      <TableCell>{request.deviceId}</TableCell>
                      <TableCell>
                        <Tooltip title={request.issue}>
                          <Typography noWrap sx={{ maxWidth: 200 }}>
                            {request.issue}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {new Date(request.requestDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <StyledChip
                          label={request.status}
                          status={request.status}
                        />
                      </TableCell>
                      <TableCell>
                        <StyledFormControl
                          fullWidth
                          error={
                            request.status === "In Progress" &&
                            !request.assignedStaff
                          }
                        >
                          <Select
                            value={request.assignedStaff || ""}
                            onChange={(e: SelectChangeEvent<string>) =>
                              handleStaffAssignment(request.id, e.target.value)
                            }
                            disabled={request.status === "Completed"}
                            sx={{ minWidth: 150 }}
                            displayEmpty
                            renderValue={(value) => {
                              if (!value)
                                return (
                                  <Typography
                                    color="text.secondary"
                                    fontStyle="italic"
                                  >
                                    Assign Staff
                                  </Typography>
                                );
                              const selectedStaff = staff.find(
                                (s) => s.id === value
                              );
                              return (
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >
                                  <Avatar
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      bgcolor: alpha(
                                        theme.palette.primary.main,
                                        0.1
                                      ),
                                      color: "primary.main",
                                    }}
                                  >
                                    {selectedStaff?.avatar}
                                  </Avatar>
                                  <Typography>{selectedStaff?.name}</Typography>
                                </Stack>
                              );
                            }}
                            startAdornment={
                              <AssignmentIndIcon
                                color="primary"
                                sx={{ mr: 1 }}
                              />
                            }
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {staff.map((s) => (
                              <MenuItem
                                key={s.id}
                                value={s.id}
                                disabled={!s.available}
                              >
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >
                                  <Avatar
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      bgcolor: alpha(
                                        theme.palette.primary.main,
                                        0.1
                                      ),
                                      color: "primary.main",
                                    }}
                                  >
                                    {s.avatar}
                                  </Avatar>
                                  <Typography>{s.name}</Typography>
                                </Stack>
                              </MenuItem>
                            ))}
                          </Select>
                          {request.status === "In Progress" &&
                            !request.assignedStaff && (
                              <FormHelperText>Staff required</FormHelperText>
                            )}
                        </StyledFormControl>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <StyledFormControl>
                            <Select
                              value={request.status}
                              onChange={(e: SelectChangeEvent) =>
                                handleStatusChange(
                                  request.id,
                                  e.target.value as ReplacementStatus
                                )
                              }
                              sx={{ minWidth: 150 }}
                            >
                              {statusOptions.map((status) => (
                                <MenuItem key={status} value={status}>
                                  {status}
                                </MenuItem>
                              ))}
                            </Select>
                          </StyledFormControl>
                          <Tooltip title="View Details">
                            <IconButton
                              color="primary"
                              onClick={() => handleViewDetails(request)}
                            >
                              <SearchIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
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
      )}

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        {selectedRequest && (
          <>
            <DialogTitle>
              <Typography variant="h6">Request Details</Typography>
              <Chip
                label={selectedRequest.id}
                color="primary"
                size="small"
                sx={{ ml: 1 }}
              />
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3} sx={{ pt: 1 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle1">
                    {selectedRequest.customerName}
                  </Typography>
                  <StyledChip
                    label={selectedRequest.status}
                    status={selectedRequest.status}
                  />
                </Stack>
                <Stack spacing={2}>
                  <Typography variant="body2">
                    <strong>Device ID:</strong> {selectedRequest.deviceId}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Requested:</strong>{" "}
                    {new Date(selectedRequest.requestDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Issue:</strong> {selectedRequest.issue}
                  </Typography>
                  {selectedRequest.assignedStaff && (
                    <Typography variant="body2">
                      <strong>Assigned to:</strong>{" "}
                      {
                        staff.find(
                          (s) => s.id === selectedRequest.assignedStaff
                        )?.name
                      }
                    </Typography>
                  )}
                </Stack>
                <TextField
                  label="Notes"
                  multiline
                  rows={4}
                  fullWidth
                  value={selectedRequest.notes || ""}
                  onChange={(e) =>
                    updateRequestNotes(selectedRequest.id, e.target.value)
                  }
                  variant="outlined"
                />
                <StyledFormControl>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Update Status</strong>
                  </Typography>
                  <Select
                    value={selectedRequest.status}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedRequest.id,
                        e.target.value as ReplacementStatus
                      )
                    }
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
                <StyledFormControl>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Assign Staff</strong>
                  </Typography>
                  <Select
                    value={selectedRequest.assignedStaff || ""}
                    onChange={(e) =>
                      handleStaffAssignment(selectedRequest.id, e.target.value)
                    }
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {staff.map((s) => (
                      <MenuItem key={s.id} value={s.id} disabled={!s.available}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: "primary.main",
                            }}
                          >
                            {s.avatar}
                          </Avatar>
                          <Typography>{s.name}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
                {validationError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {validationError}
                  </Alert>
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
              <Button
                variant="contained"
                onClick={() => setDetailDialogOpen(false)}
                sx={{ borderRadius: 2 }}
              >
                Save Changes
              </Button>
            </DialogActions>
          </>
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
