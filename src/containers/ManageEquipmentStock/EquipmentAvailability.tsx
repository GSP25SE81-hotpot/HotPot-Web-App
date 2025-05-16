// src/components/EquipmentAvailability.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import BuildIcon from "@mui/icons-material/Build";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FilterListIcon from "@mui/icons-material/FilterList";
import InfoIcon from "@mui/icons-material/Info";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import SendIcon from "@mui/icons-material/Send";
import SortIcon from "@mui/icons-material/Sort";
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
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
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
  HoverInfoContainer,
  PageTitle,
  PaginationContainer,
  QuantityDisplay,
  SortButtonsContainer,
  SortingPaper,
  StatusChip,
  StyledCardContent,
} from "../../components/manager/styles/EquipmentAvailabilityStyles";
import {
  HotPotInventoryDto,
  HotpotStatus,
  NotifyAdminStockRequest,
  UtensilDto,
} from "../../types/stock";

// Combined equipment interface for both hotpots and utensils
interface Equipment {
  id: number;
  name: string;
  status: string | boolean;
  condition?: string;
  type: "HotPot" | "Utensil";
  quantity?: number;
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
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );
  const [reportMessage, setReportMessage] = useState("");
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [conditionDialogOpen, setConditionDialogOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState("");
  // const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState<keyof Equipment | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterType, setFilterType] = useState<"All" | "HotPot" | "Utensil">(
    "All"
  );
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

  const handleSort = (property: keyof Equipment) => {
    const isAsc = sortBy === property && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

  const handleFilterTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterType(event.target.value as "All" | "HotPot" | "Utensil");
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
    // First, filter the equipment list
    let filteredEquipment = equipmentList.filter((equipment) => {
      // Filter by type
      if (filterType !== "All" && equipment.type !== filterType) {
        return false;
      }
      // Filter by status
      if (filterStatus !== "All") {
        const isAvailable =
          (typeof equipment.status === "boolean" && equipment.status) ||
          (typeof equipment.status === "string" &&
            equipment.status === "Available");
        if (filterStatus === "Available" && !isAvailable) {
          return false;
        }
        if (filterStatus === "Unavailable" && isAvailable) {
          return false;
        }
      }
      return true;
    });

    // Then, sort the filtered list
    if (sortBy) {
      filteredEquipment = [...filteredEquipment].sort((a, b) => {
        let aValue: any =
          sortBy in a ? a[sortBy as keyof Equipment] : undefined;
        let bValue: any =
          sortBy in b ? b[sortBy as keyof Equipment] : undefined;

        // Handle special case for status which can be boolean or string
        if (sortBy === "status") {
          aValue =
            typeof aValue === "boolean"
              ? aValue
                ? "Available"
                : "Unavailable"
              : aValue || "Unknown";
          bValue =
            typeof bValue === "boolean"
              ? bValue
                ? "Available"
                : "Unavailable"
              : bValue || "Unknown";
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
        // Fetch hotpots and utensils
        const [hotpotsResponse, utensilsResponse] = await Promise.all([
          stockService.getAllHotPotInventory(),
          stockService.getAllUtensils(),
        ]);

        // Check if we have successful responses with data
        const hasHotpotData =
          hotpotsResponse &&
          hotpotsResponse.success &&
          Array.isArray(hotpotsResponse.data) &&
          hotpotsResponse.data.length > 0;
        const hasUtensilData =
          utensilsResponse &&
          utensilsResponse.success &&
          Array.isArray(utensilsResponse.data) &&
          utensilsResponse.data.length > 0;

        if (!hasHotpotData && !hasUtensilData) {
          console.error("No equipment data available from either source");
          setError("No equipment data available");
          return;
        }

        // Convert hotpots to our Equipment interface
        const hotpots: Equipment[] = hasHotpotData
          ? hotpotsResponse.data.map((hotpot: HotPotInventoryDto) => ({
              id: hotpot.hotPotInventoryId,
              name: hotpot.hotpotName || `HotPot #${hotpot.seriesNumber}`,
              status: hotpot.status,
              type: "HotPot" as const,
              condition:
                hotpot.status === "Available" ? "Good" : "Needs Maintenance",
            }))
          : [];

        // Convert utensils to our Equipment interface
        const utensils: Equipment[] = hasUtensilData
          ? utensilsResponse.data.map((utensil: UtensilDto) => ({
              id: utensil.utensilId,
              name: utensil.name,
              status: utensil.status,
              type: "Utensil" as const,
              quantity: utensil.quantity,
              condition: utensil.status ? "Good" : "Needs Maintenance",
            }))
          : [];

        // Combine both types of equipment
        const combinedEquipment = [...hotpots, ...utensils];
        setEquipmentList(combinedEquipment);
      } catch (error) {
        console.error("Error fetching equipment:", error);
        setError("An error occurred while fetching equipment data");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const getStatusIcon = (status: string | boolean) => {
    const statusStr =
      typeof status === "boolean"
        ? status
          ? "Available"
          : "Unavailable"
        : status;
    switch (statusStr) {
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
        if (selectedEquipment.type === "HotPot") {
          // Update hotpot status
          const newStatus =
            selectedCondition === "Good"
              ? HotpotStatus.Available
              : HotpotStatus.Damaged;
          await stockService.updateHotPotInventoryStatus(
            selectedEquipment.id,
            newStatus,
            `Condition changed to ${selectedCondition}`
          );
        } else {
          // Update utensil status
          await stockService.updateUtensilStatus(
            selectedEquipment.id,
            selectedCondition === "Good",
            `Condition changed to ${selectedCondition}`
          );
        }
        // Update local state
        setEquipmentList((prev) =>
          prev.map((item) =>
            item.id === selectedEquipment.id &&
            item.type === selectedEquipment.type
              ? { ...item, condition: selectedCondition }
              : item
          )
        );
        // Show notification
        setNotification({
          open: true,
          message: `${selectedEquipment.name} condition updated to ${selectedCondition}`,
          severity: "success",
        });
        setConditionDialogOpen(false);
      } catch (error) {
        console.error("Error updating equipment condition:", error);
        setNotification({
          open: true,
          message: "Failed to update equipment condition",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Function to report equipment status to admin
  const sendReportToAdmin = async () => {
    if (selectedEquipment) {
      try {
        setLoading(true);
        // Send notification via API
        const request: NotifyAdminStockRequest = {
          notificationType: "StatusChange",
          equipmentType: selectedEquipment.type,
          equipmentId: selectedEquipment.id,
          equipmentName: selectedEquipment.name,
          isAvailable:
            typeof selectedEquipment.status === "boolean"
              ? selectedEquipment.status
              : selectedEquipment.status === "Available",
          reason: reportMessage,
        };
        await stockService.notifyAdminDirectly(request);
        // Show success notification
        setNotification({
          open: true,
          message: "Equipment status report sent to admin successfully",
          severity: "success",
        });
        setReportDialogOpen(false);
      } catch (error) {
        console.error("Error sending report:", error);
        setNotification({
          open: true,
          message: "Failed to send report to admin",
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
  const isEquipmentAvailable = (status: string | boolean): boolean => {
    return (
      (typeof status === "boolean" && status) ||
      (typeof status === "string" && status === "Available")
    );
  };

  return (
    <EquipmentContainer>
      <ToastContainer position="top-right" autoClose={5000} />
      <Stack spacing={4}>
        <HeaderContainer>
          <PageTitle variant="h4" component="h1">
            Quản lý nồi
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
              of {getFilteredAndSortedEquipment().length} mặt hàng có sẵn để cho
              thuê
            </Typography>
            <Stack direction="row" spacing={2}>
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
          </Stack>
          {/* Sorting controls */}
          <SortingPaper>
            <Grid container spacing={2} alignItems="center">
              <Grid>
                <Typography variant="subtitle1">
                  <SortIcon
                    fontSize="small"
                    sx={{ verticalAlign: "middle", mr: 1 }}
                  />
                  Sắp xếp theo:
                </Typography>
              </Grid>
              <Grid>
                <SortButtonsContainer>
                  <Button
                    onClick={() => handleSort("name")}
                    color={sortBy === "name" ? "primary" : "inherit"}
                    endIcon={
                      sortBy === "name" ? (
                        sortDirection === "asc" ? (
                          <ArrowUpwardIcon />
                        ) : (
                          <ArrowDownwardIcon />
                        )
                      ) : null
                    }
                    sx={{
                      borderRadius: (theme) => theme.shape.borderRadius * 2,
                      ...(sortBy === "name" && {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.dark
                            : theme.palette.primary.light,
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.contrastText
                            : theme.palette.primary.main,
                      }),
                    }}
                  >
                    Tên
                  </Button>
                  <Button
                    onClick={() => handleSort("type")}
                    color={sortBy === "type" ? "primary" : "inherit"}
                    endIcon={
                      sortBy === "type" ? (
                        sortDirection === "asc" ? (
                          <ArrowUpwardIcon />
                        ) : (
                          <ArrowDownwardIcon />
                        )
                      ) : null
                    }
                    sx={{
                      borderRadius: (theme) => theme.shape.borderRadius * 2,
                      ...(sortBy === "type" && {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.dark
                            : theme.palette.primary.light,
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.contrastText
                            : theme.palette.primary.main,
                      }),
                    }}
                  >
                    Loại
                  </Button>
                  <Button
                    onClick={() => handleSort("status")}
                    color={sortBy === "status" ? "primary" : "inherit"}
                    endIcon={
                      sortBy === "status" ? (
                        sortDirection === "asc" ? (
                          <ArrowUpwardIcon />
                        ) : (
                          <ArrowDownwardIcon />
                        )
                      ) : null
                    }
                    sx={{
                      borderRadius: (theme) => theme.shape.borderRadius * 2,
                      ...(sortBy === "status" && {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.dark
                            : theme.palette.primary.light,
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.contrastText
                            : theme.palette.primary.main,
                      }),
                    }}
                  >
                    Trạng thái
                  </Button>
                  <Button
                    onClick={() => handleSort("condition")}
                    color={sortBy === "condition" ? "primary" : "inherit"}
                    endIcon={
                      sortBy === "condition" ? (
                        sortDirection === "asc" ? (
                          <ArrowUpwardIcon />
                        ) : (
                          <ArrowDownwardIcon />
                        )
                      ) : null
                    }
                    sx={{
                      borderRadius: (theme) => theme.shape.borderRadius * 2,
                      ...(sortBy === "condition" && {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.dark
                            : theme.palette.primary.light,
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.contrastText
                            : theme.palette.primary.main,
                      }),
                    }}
                  >
                    Tình trạng
                  </Button>
                </SortButtonsContainer>
              </Grid>
            </Grid>
          </SortingPaper>
          {/* Filter chips */}
          {(filterType !== "All" || filterStatus !== "All") && (
            <FilterChipsContainer>
              <Stack direction="row" spacing={1}>
                {filterType !== "All" && (
                  <FilterChip
                    label={`Loại: ${filterType}`}
                    onDelete={() => setFilterType("All")}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filterStatus !== "All" && (
                  <FilterChip
                    label={`Trạng thái: ${
                      filterStatus === "Available" ? "Có sẵn" : "Không có sẵn"
                    }`}
                    onDelete={() => setFilterStatus("All")}
                    color="primary"
                    variant="outlined"
                  />
                )}
                <Button
                  size="small"
                  onClick={() => {
                    setFilterType("All");
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
              Không tìm thấy thiết bị nào
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Thử thay đổi bộ lọc hoặc tìm kiếm để xem kết quả khác
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => {
                setFilterType("All");
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
                  key={`${equipment.type}-${equipment.id}`}
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
                              label={
                                typeof equipment.status === "boolean"
                                  ? equipment.status
                                    ? "Available"
                                    : "Unavailable"
                                  : equipment.status
                              }
                              size="small"
                              variant="outlined"
                              isAvailable={isEquipmentAvailable(
                                equipment.status
                              )}
                            />
                            {equipment.condition && (
                              <ConditionChip
                                icon={getConditionIcon(equipment.condition)}
                                label={equipment.condition}
                                size="small"
                                variant="outlined"
                                condition={equipment.condition}
                                onClick={() => openConditionDialog(equipment)}
                              />
                            )}
                            {equipment.type === "Utensil" &&
                              equipment.quantity !== undefined && (
                                <QuantityDisplay>
                                  <LocalDiningIcon
                                    color="primary"
                                    fontSize="small"
                                  />
                                  <Typography variant="body2" fontWeight={500}>
                                    Số lượng: {equipment.quantity}
                                  </Typography>
                                </QuantityDisplay>
                              )}
                          </EquipmentDetailsStack>
                        </Stack>
                      </Stack>
                      {hoveredId === equipment.id && (
                        <HoverInfoContainer>
                          <Stack spacing={1}>
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <Tooltip title="Equipment Type">
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >
                                  <AccessTimeIcon
                                    color="primary"
                                    fontSize="small"
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Loại:{" "}
                                    {equipment.type === "HotPot"
                                      ? "Nồi lẩu"
                                      : "Dụng cụ"}
                                  </Typography>
                                </Stack>
                              </Tooltip>
                            </Stack>
                          </Stack>
                        </HoverInfoContainer>
                      )}
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

      {/* Report Dialog */}
      <Dialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: (theme) => theme.shape.borderRadius * 2,
            p: 1,
          },
        }}
      >
        <DialogTitle>Báo cáo về trạng thái thiết bị</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1, minWidth: 400 }}>
            <Typography>
              Gửi báo cáo về {selectedEquipment?.name} tới quản trị viên:
            </Typography>
            <TextField
              label="Chi tiết báo cáo"
              multiline
              rows={4}
              fullWidth
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: (theme) => theme.shape.borderRadius,
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setReportDialogOpen(false)}
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
            startIcon={<SendIcon />}
            onClick={sendReportToAdmin}
            disabled={loading}
            sx={{
              borderRadius: (theme) => theme.shape.borderRadius * 2,
              textTransform: "none",
            }}
          >
            Gửi báo cáo
          </Button>
        </DialogActions>
      </Dialog>

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
        <DialogTitle>Cập nhật tình trạng thiết bị</DialogTitle>
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
        <DialogTitle>Lọc thiết bị</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1, minWidth: 300 }}>
            <FormControl component="fieldset">
              <Typography variant="subtitle1">Loại thiết bị</Typography>
              <RadioGroup value={filterType} onChange={handleFilterTypeChange}>
                <FormControlLabel
                  value="All"
                  control={<Radio />}
                  label="Tất cả loại"
                />
                <FormControlLabel
                  value="HotPot"
                  control={<Radio />}
                  label="Nồi lẩu"
                />
                <FormControlLabel
                  value="Utensil"
                  control={<Radio />}
                  label="Dụng cụ"
                />
              </RadioGroup>
            </FormControl>
            <FormControl component="fieldset">
              <Typography variant="subtitle1">Trạng thái</Typography>
              <RadioGroup
                value={filterStatus}
                onChange={handleFilterStatusChange}
              >
                <FormControlLabel
                  value="All"
                  control={<Radio />}
                  label="Tất cả trạng thái"
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
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setFilterDialogOpen(false)}
            sx={{
              borderRadius: (theme) => theme.shape.borderRadius * 2,
              textTransform: "none",
            }}
          >
            Đóng
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
