/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/EquipmentAvailability.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BuildIcon from "@mui/icons-material/Build";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FilterListIcon from "@mui/icons-material/FilterList";
import InfoIcon from "@mui/icons-material/Info";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import SendIcon from "@mui/icons-material/Send";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortBy, _setSortBy] = useState<keyof Equipment | "">("");
  const [sortDirection, _setSortDirection] = useState<"asc" | "desc">("asc");
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
          setError("Không có dữ liệu thiết bị");
          return;
        }

        // Convert hotpots to our Equipment interface
        const hotpots: Equipment[] = hasHotpotData
          ? hotpotsResponse.data.map((hotpot: HotPotInventoryDto) => ({
              id: hotpot.hotPotInventoryId,
              name: hotpot.hotpotName || `Nồi #${hotpot.seriesNumber}`,
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
        setError("Đã xảy ra lỗi khi tải dữ liệu thiết bị");
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
            `Tình trạng đã thay đổi thành ${selectedCondition}`
          );
        } else {
          // Update utensil status
          await stockService.updateUtensilStatus(
            selectedEquipment.id,
            selectedCondition === "Good",
            `Tình trạng đã thay đổi thành ${selectedCondition}`
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
          message: "Báo cáo trạng thái thiết bị đã được gửi thành công",
          severity: "success",
        });
        setReportDialogOpen(false);
      } catch (error) {
        console.error("Error sending report:", error);
        setNotification({
          open: true,
          message: "Không thể gửi báo cáo đến quản trị viên",
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

  // Translate status to Vietnamese
  const translateStatus = (status: string | boolean): string => {
    const statusStr =
      typeof status === "boolean"
        ? status
          ? "Available"
          : "Unavailable"
        : status;

    switch (statusStr) {
      case "Available":
        return "Có sẵn";
      case "Rented":
        return "Đang cho thuê";
      case "Damaged":
        return "Hư hỏng";
      case "Unavailable":
        return "Không có sẵn";
      default:
        return statusStr;
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
            Quản lý thiết bị
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
              trong số {getFilteredAndSortedEquipment().length} mặt hàng có sẵn
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
          {(filterType !== "All" || filterStatus !== "All") && (
            <FilterChipsContainer>
              <Stack direction="row" spacing={1}>
                {filterType !== "All" && (
                  <FilterChip
                    label={`Loại: ${
                      filterType === "HotPot" ? "Nồi lẩu" : "Dụng cụ"
                    }`}
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
                              <Tooltip title="Loại thiết bị">
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

      {/* Simplified Report Dialog */}
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

      {/* Simplified Condition Update Dialog */}
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

      {/* Simplified Filter Dialog */}
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
            {/* Simplified Type Filter */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Loại thiết bị
              </Typography>
              <RadioGroup
                value={filterType}
                onChange={handleFilterTypeChange}
                row
              >
                <FormControlLabel
                  value="All"
                  control={<Radio />}
                  label="Tất cả"
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
            </Box>

            {/* Simplified Status Filter */}
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
              setFilterType("All");
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
