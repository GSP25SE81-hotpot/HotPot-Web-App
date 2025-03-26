/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/OrderManagement/components/PendingDeliveriesList.tsx
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearIcon from "@mui/icons-material/Clear";
import InfoIcon from "@mui/icons-material/Info";
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
  Snackbar,
  Table,
  TableBody,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  alpha,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  DeliveryStatusUpdateRequest,
  PendingDeliveryDTO,
  ShippingOrderQueryParams,
  orderManagementService,
} from "../../../api/Services/orderManagementService";
import {
  ActionsContainer,
  CountBadge,
  CustomerName,
  CustomerPhone,
  DialogActionButton,
  EmptyStateContainer,
  EmptyStateSubtitle,
  EmptyStateTitle,
  IdCell,
  ListTitle,
  LoadingContainer,
  OrderTypeChip,
  OrdersListContainer,
  StyledHeaderCell,
  StyledPaper,
  StyledTableCell,
  StyledTableContainer,
  StyledTableRow,
} from "../../../components/manager/styles/PendingDeliveriesListStyles"; // You'll need to create this
import { formatDate } from "../../../utils/formatters";

const PendingDeliveriesList: React.FC = () => {
  const [deliveries, setDeliveries] = useState<PendingDeliveryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] =
    useState<PendingDeliveryDTO | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Sorting state
  const [sortBy, setSortBy] = useState<string>("deliverytime");
  const [sortDescending, setSortDescending] = useState(true);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDeliveries();
  }, [pageNumber, pageSize, sortBy, sortDescending]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      // Create query params
      const queryParams: ShippingOrderQueryParams = {
        pageNumber,
        pageSize,
        sortBy,
        sortDescending,
        searchTerm: searchTerm || undefined,
        isDelivered: false, // Only get pending deliveries
      };

      const response = await orderManagementService.getPendingDeliveries(
        queryParams
      );

      // Update state with paginated data
      setDeliveries(response.items);
      setTotalCount(response.totalCount);
      setError(null);
    } catch (err) {
      console.error("Error fetching pending deliveries:", err);
      setError("Failed to load pending deliveries. Please try again later.");
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Apply search
  const applySearch = () => {
    setPageNumber(1); // Reset to first page when searching
    fetchDeliveries();
  };

  // Handle page change
  const handlePageChange = (_event: unknown, newPage: number) => {
    setPageNumber(newPage + 1); // MUI pagination is 0-based, our API is 1-based
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(1);
  };

  // Handle sort change
  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      // Toggle sort direction if clicking the same column
      setSortDescending(!sortDescending);
    } else {
      // Set new sort column and default to descending
      setSortBy(column);
      setSortDescending(true);
    }
  };

  // Handle mark as delivered click
  const handleMarkAsDeliveredClick = (delivery: PendingDeliveryDTO) => {
    setSelectedDelivery(delivery);
    setDeliveryNotes("");
    setOpenDialog(true);
  };

  // Handle confirm delivery
  const handleConfirmDelivery = async () => {
    if (!selectedDelivery) return;

    try {
      const request: DeliveryStatusUpdateRequest = {
        isDelivered: true,
        notes: deliveryNotes || undefined,
      };

      await orderManagementService.updateDeliveryStatus(
        selectedDelivery.shippingOrderId,
        request
      );

      // Show success message
      setSnackbar({
        open: true,
        message: `Order #${selectedDelivery.orderId} marked as delivered successfully`,
        severity: "success",
      });

      // Close dialog and refresh list
      setOpenDialog(false);
      fetchDeliveries();
    } catch (err) {
      console.error("Error updating delivery status:", err);
      setSnackbar({
        open: true,
        message: "Failed to update delivery status. Please try again.",
        severity: "error",
      });
    }
  };

  // Handle close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDelivery(null);
  };

  // Handle delivery notes change
  const handleDeliveryNotesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDeliveryNotes(event.target.value);
  };

  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && deliveries.length === 0) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <OrdersListContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <ListTitle variant="h6">
          Pending Deliveries <CountBadge>{totalCount}</CountBadge>
        </ListTitle>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            placeholder="Search deliveries..."
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSearchTerm("");
                        applySearch();
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              },
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                applySearch();
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={fetchDeliveries}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <StyledPaper>
        {deliveries.length === 0 ? (
          <EmptyStateContainer>
            <EmptyStateTitle variant="h6">
              No pending deliveries found
            </EmptyStateTitle>
            <EmptyStateSubtitle variant="body2">
              All orders have been delivered or no orders have been allocated
              for delivery
            </EmptyStateSubtitle>
          </EmptyStateContainer>
        ) : (
          <>
            <StyledTableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <StyledHeaderCell>Order ID</StyledHeaderCell>
                    <StyledHeaderCell>
                      <TableSortLabel
                        active={sortBy === "customer"}
                        direction={sortDescending ? "desc" : "asc"}
                        onClick={() => handleSortChange("customer")}
                      >
                        Customer
                      </TableSortLabel>
                    </StyledHeaderCell>
                    <StyledHeaderCell>
                      <TableSortLabel
                        active={sortBy === "deliverytime"}
                        direction={sortDescending ? "desc" : "asc"}
                        onClick={() => handleSortChange("deliverytime")}
                      >
                        Delivery Time
                      </TableSortLabel>
                    </StyledHeaderCell>
                    <StyledHeaderCell>Address</StyledHeaderCell>
                    <StyledHeaderCell>Status</StyledHeaderCell>
                    <StyledHeaderCell>Actions</StyledHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deliveries.map((delivery) => (
                    <StyledTableRow key={delivery.shippingOrderId}>
                      <IdCell>#{delivery.orderId}</IdCell>
                      <StyledTableCell>
                        <CustomerName>
                          {delivery.userName || "Unknown"}
                        </CustomerName>
                        <CustomerPhone>ID: {delivery.userId}</CustomerPhone>
                      </StyledTableCell>
                      <StyledTableCell>
                        {delivery.deliveryTime
                          ? formatDate(delivery.deliveryTime)
                          : "Not scheduled"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ maxWidth: 200 }}>
                        <Tooltip title={delivery.address || ""}>
                          <Box
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {delivery.address || "No address"}
                          </Box>
                        </Tooltip>
                      </StyledTableCell>
                      <StyledTableCell>
                        <OrderTypeChip
                          label={delivery.status.toString()}
                          size="small"
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <ActionsContainer>
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleMarkAsDeliveredClick(delivery)}
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            Delivered
                          </Button>
                          <Tooltip title="View order details">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => {
                                // Navigate to order details
                                window.location.href = `/orders/${delivery.orderId}`;
                              }}
                              sx={{
                                backgroundColor: (theme) =>
                                  alpha(theme.palette.primary.main, 0.1),
                                "&:hover": {
                                  backgroundColor: (theme) =>
                                    alpha(theme.palette.primary.main, 0.2),
                                },
                              }}
                            >
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </ActionsContainer>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
            {/* Pagination */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
              <TablePagination
                component="div"
                count={totalCount}
                page={pageNumber - 1} // Convert 1-based to 0-based for MUI
                onPageChange={handlePageChange}
                rowsPerPage={pageSize}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Rows:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
                }
                sx={{
                  ".MuiTablePagination-select": {
                    borderRadius: 1,
                  },
                  ".MuiTablePagination-selectIcon": {
                    color: "primary.main",
                  },
                }}
              />
            </Box>
          </>
        )}
      </StyledPaper>

      {/* Mark as Delivered Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)",
              padding: 1,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.25rem",
            fontWeight: 600,
            pb: 1,
          }}
        >
          Mark Order #{selectedDelivery?.orderId} as Delivered
        </DialogTitle>
        <DialogContent sx={{ pt: 2, px: 3, pb: 2 }}>
          <Box sx={{ mt: 1, minWidth: 300 }}>
            <TextField
              label="Delivery Notes (Optional)"
              multiline
              rows={4}
              fullWidth
              value={deliveryNotes}
              onChange={handleDeliveryNotesChange}
              placeholder="Enter any notes about the delivery..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <DialogActionButton
            onClick={handleCloseDialog}
            sx={{
              color: (theme) => theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: (theme) =>
                  alpha(theme.palette.text.secondary, 0.08),
              },
            }}
          >
            Cancel
          </DialogActionButton>
          <DialogActionButton
            onClick={handleConfirmDelivery}
            variant="contained"
            color="success"
            sx={{
              fontWeight: 600,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.success.dark,
              },
            }}
          >
            Confirm Delivery
          </DialogActionButton>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            fontWeight: 500,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </OrdersListContainer>
  );
};

export default PendingDeliveriesList;
