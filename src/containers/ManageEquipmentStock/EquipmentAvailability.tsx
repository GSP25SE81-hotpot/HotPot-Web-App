/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/EquipmentAvailability.tsx
import BuildIcon from "@mui/icons-material/Build";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FilterListIcon from "@mui/icons-material/FilterList";
import InfoIcon from "@mui/icons-material/Info";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  Stack,
  TablePagination,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import stockService from "../../api/Services/stockService";
import {
  ConditionChip,
  EmptyStateContainer,
  EquipmentCard,
  EquipmentContainer,
  EquipmentDetailsStack,
  EquipmentName,
  FilterChip,
  FilterChipsContainer,
  HeaderContainer,
  PageTitle,
  PaginationContainer,
  StatusChip,
  StyledCardContent,
} from "../../components/manager/styles/EquipmentAvailabilityStyles";
import { HotPotInventoryDto, HotpotStatus } from "../../types/stock";

// Updated Equipment interface for hotpots only
interface Equipment {
  id: number;
  name: string;
  status: string;
  condition?: string;
  seriesNumber: string;
}

const EquipmentAvailability: React.FC = () => {
  const theme = useTheme();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [conditionDialogOpen, setConditionDialogOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortBy, _setSortBy] = useState<keyof Equipment | "">("");
  const [sortDirection, _setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Available" | "Unavailable"
  >("All");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // Handler functions
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterStatusChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterStatus(event.target.value as "All" | "Available" | "Unavailable");
    setPage(0);
  };

  // Function to get filtered and sorted equipment
  const getFilteredAndSortedEquipment = () => {
    // Filter the equipment list
    let filteredEquipment = equipmentList.filter((equipment) => {
      // Filter by status
      if (filterStatus !== "All") {
        const isAvailable = equipment.status === "Available";
        if (filterStatus === "Available" && !isAvailable) {
          return false;
        }
        if (filterStatus === "Unavailable" && isAvailable) {
          return false;
        }
      }
      return true;
    });

    // Sort the filtered list
    if (sortBy) {
      filteredEquipment = [...filteredEquipment].sort((a, b) => {
        let aValue: any =
          sortBy in a ? a[sortBy as keyof Equipment] : undefined;
        let bValue: any =
          sortBy in b ? b[sortBy as keyof Equipment] : undefined;

        // Handle special case for status
        if (sortBy === "status") {
          aValue = aValue || "Unknown";
          bValue = bValue || "Unknown";
        }

        // Handle undefined values
        if (aValue === undefined && bValue === undefined) {
          return 0;
        }
        if (aValue === undefined) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (bValue === undefined) {
          return sortDirection === "asc" ? 1 : -1;
        }
        if (aValue < bValue) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredEquipment;
  };

  // Get the current page of equipment
  const getCurrentPageEquipment = () => {
    const filteredAndSortedEquipment = getFilteredAndSortedEquipment();
    return filteredAndSortedEquipment.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  };

  // Fetch equipment data
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch only hotpots
        const hotpotsResponse = await stockService.getAllHotPotInventory();

        // Check if we have successful response with data
        const hasHotpotData =
          hotpotsResponse &&
          hotpotsResponse.success &&
          Array.isArray(hotpotsResponse.data) &&
          hotpotsResponse.data.length > 0;

        if (!hasHotpotData) {
          console.error("No hotpot data available");
          setError("Không có dữ liệu nồi lẩu");
          return;
        }

        // Convert hotpots to our Equipment interface
        const hotpots: Equipment[] = hotpotsResponse.data.map(
          (hotpot: HotPotInventoryDto) => ({
            id: hotpot.hotPotInventoryId,
            name: hotpot.hotpotName || `Nồi #${hotpot.seriesNumber}`,
            status: hotpot.status,
            seriesNumber: hotpot.seriesNumber || "N/A",
          })
        );

        setEquipmentList(hotpots);
      } catch (error) {
        console.error("Error fetching equipment:", error);
        setError("Đã xảy ra lỗi khi tải dữ liệu nồi lẩu");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Available":
        return <CheckCircleIcon color="success" />;
      case "Rented":
        return <BuildIcon color="warning" />;
      case "Damaged":
        return <BuildIcon color="error" />;
      case "Unavailable":
        return <BuildIcon color="error" />;
      default:
        return <BuildIcon />;
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case "Good":
        return <CheckCircleIcon color="success" />;
      case "Needs Maintenance":
        return <BuildIcon color="warning" />;
      case "Damaged":
        return <BuildIcon color="error" />;
      default:
        return <BuildIcon />;
    }
  };

  // Function to open condition update dialog
  const openConditionDialog = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setSelectedCondition(equipment.condition || "Good");
    setConditionDialogOpen(true);
  };

  // Function to update equipment condition
  const updateEquipmentCondition = async () => {
    if (selectedEquipment && selectedCondition) {
      try {
        setLoading(true);

        // Update hotpot status
        const newStatus =
          selectedCondition === "Good"
            ? HotpotStatus.Available
            : HotpotStatus.Damaged;

        await stockService.updateHotPotInventoryStatus(
          selectedEquipment.id,
          newStatus,
          `Tình trạng đã thay đổi thành ${selectedCondition}`
        );

        // Update local state
        setEquipmentList((prev) =>
          prev.map((item) =>
            item.id === selectedEquipment.id
              ? { ...item, condition: selectedCondition }
              : item
          )
        );

        // Show notification
        setNotification({
          open: true,
          message: `Tình trạng của ${selectedEquipment.name} đã cập nhật thành ${selectedCondition}`,
          severity: "success",
        });

        setConditionDialogOpen(false);
      } catch (error) {
        console.error("Error updating equipment condition:", error);
        setNotification({
          open: true,
          message: "Không thể cập nhật tình trạng thiết bị",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Function to handle notification close
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  // Check if equipment is available
  const isEquipmentAvailable = (status: string): boolean => {
    return status === "Available";
  };

  // Translate status to Vietnamese
  const translateStatus = (status: string): string => {
    switch (status) {
      case "Available":
        return "Có sẵn";
      case "Rented":
        return "Đang cho thuê";
      case "Damaged":
        return "Hư hỏng";
      case "Reserved":
        return "Được đặt trước";
      case "Preparing":
        return "Đang chuẩn bị";
      default:
        return status;
    }
  };

  // Translate condition to Vietnamese
  const translateCondition = (condition: string): string => {
    switch (condition) {
      case "Good":
        return "Tốt";
      case "Needs Maintenance":
        return "Cần bảo trì";
      case "Damaged":
        return "Hư hỏng";
      default:
        return condition;
    }
  };

  return (
    <EquipmentContainer>
      <ToastContainer position="top-right" autoClose={5000} />
      <Stack spacing={4}>
        <HeaderContainer>
          <PageTitle variant="h4" component="h1">
            Quản lý nồi lẩu
          </PageTitle>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Typography variant="body1" color="text.secondary">
              {
                getFilteredAndSortedEquipment().filter((e) =>
                  isEquipmentAvailable(e.status)
                ).length
              }{" "}
              trong số {getFilteredAndSortedEquipment().length} nồi lẩu có sẵn
              để cho thuê
            </Typography>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setFilterDialogOpen(true)}
              sx={{
                borderRadius: (theme) => theme.shape.borderRadius * 2,
                px: 2,
              }}
            >
              Lọc
            </Button>
          </Stack>
          {/* Filter chips */}
          {filterStatus !== "All" && (
            <FilterChipsContainer>
              <Stack direction="row" spacing={1}>
                <FilterChip
                  label={`Trạng thái: ${
                    filterStatus === "Available" ? "Có sẵn" : "Không có sẵn"
                  }`}
                  onDelete={() => setFilterStatus("All")}
                  color="primary"
                  variant="outlined"
                />
                <Button
                  size="small"
                  onClick={() => {
                    setFilterStatus("All");
                  }}
                  sx={{
                    textTransform: "none",
                    color: theme.palette.primary.main,
                  }}
                >
                  Xóa tất cả
                </Button>
              </Stack>
            </FilterChipsContainer>
          )}
        </HeaderContainer>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && getCurrentPageEquipment().length === 0 && (
          <EmptyStateContainer>
            <InfoIcon
              color="disabled"
              sx={{ fontSize: 60, mb: 2, opacity: 0.5 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Không tìm thấy nồi lẩu nào
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Thử thay đổi bộ lọc hoặc tìm kiếm để xem kết quả khác
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => {
                setFilterStatus("All");
              }}
            >
              Xóa bộ lọc
            </Button>
          </EmptyStateContainer>
        )}

        {!loading && !error && getCurrentPageEquipment().length > 0 && (
          <>
            <Stack spacing={2}>
              {getCurrentPageEquipment().map((equipment) => (
                <EquipmentCard
                  key={equipment.id}
                  onMouseEnter={() => setHoveredId(equipment.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  elevation={hoveredId === equipment.id ? 4 : 1}
                >
                  <StyledCardContent>
                    <Stack spacing={2}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Stack spacing={1}>
                          <EquipmentName variant="h6">
                            {equipment.name}
                          </EquipmentName>
                          <EquipmentDetailsStack>
                            <StatusChip
                              icon={getStatusIcon(equipment.status)}
                              label={translateStatus(equipment.status)}
                              size="small"
                              variant="outlined"
                              isAvailable={isEquipmentAvailable(
                                equipment.status
                              )}
                            />
                            {equipment.condition && (
                              <ConditionChip
                                icon={getConditionIcon(equipment.condition)}
                                label={translateCondition(equipment.condition)}
                                size="small"
                                variant="outlined"
                                condition={equipment.condition}
                                onClick={() => openConditionDialog(equipment)}
                              />
                            )}
                          </EquipmentDetailsStack>
                        </Stack>
                      </Stack>

                      {/* Display Series Number */}
                      <Typography variant="body2" color="text.secondary">
                        Số sê-ri: {equipment.seriesNumber}
                      </Typography>
                    </Stack>
                  </StyledCardContent>
                </EquipmentCard>
              ))}
            </Stack>

            {/* Pagination controls */}
            <PaginationContainer>
              <TablePagination
                component="div"
                count={getFilteredAndSortedEquipment().length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Số mục mỗi trang:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
                }
              />
            </PaginationContainer>
          </>
        )}
      </Stack>

      {/* Condition Update Dialog */}
      <Dialog
        open={conditionDialogOpen}
        onClose={() => setConditionDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: (theme) => theme.shape.borderRadius * 2,
            p: 1,
          },
        }}
      >
        <DialogTitle>Cập nhật tình trạng nồi lẩu</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1, minWidth: 300 }}>
            <Typography>
              Cập nhật tình trạng của {selectedEquipment?.name}:
            </Typography>
            <FormControl fullWidth>
              <Select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                sx={{
                  borderRadius: (theme) => theme.shape.borderRadius,
                }}
              >
                <MenuItem value="Good">Tốt</MenuItem>
                <MenuItem value="Needs Maintenance">Cần bảo trì</MenuItem>
                <MenuItem value="Damaged">Hư hỏng</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setConditionDialogOpen(false)}
            sx={{
              borderRadius: (theme) => theme.shape.borderRadius * 2,
              textTransform: "none",
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={updateEquipmentCondition}
            disabled={loading}
            sx={{
              borderRadius: (theme) => theme.shape.borderRadius * 2,
              textTransform: "none",
            }}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: (theme) => theme.shape.borderRadius * 2,
            p: 1,
          },
        }}
      >
        <DialogTitle>Lọc nồi lẩu</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1, minWidth: 300 }}>
            {/* Status Filter */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Trạng thái
              </Typography>
              <RadioGroup
                value={filterStatus}
                onChange={handleFilterStatusChange}
                row
              >
                <FormControlLabel
                  value="All"
                  control={<Radio />}
                  label="Tất cả"
                />
                <FormControlLabel
                  value="Available"
                  control={<Radio />}
                  label="Có sẵn"
                />
                <FormControlLabel
                  value="Unavailable"
                  control={<Radio />}
                  label="Không có sẵn"
                />
              </RadioGroup>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setFilterStatus("All");
              setFilterDialogOpen(false);
            }}
            sx={{
              borderRadius: (theme) => theme.shape.borderRadius * 2,
              textTransform: "none",
            }}
          >
            Đặt lại
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setFilterDialogOpen(false)}
            sx={{
              borderRadius: (theme) => theme.shape.borderRadius * 2,
              textTransform: "none",
            }}
          >
            Áp dụng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          sx={{
            width: "100%",
            borderRadius: (theme) => theme.shape.borderRadius * 2,
            boxShadow: (theme) => theme.shadows[3],
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </EquipmentContainer>
  );
};

export default EquipmentAvailability;
