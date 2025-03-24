import BuildIcon from "@mui/icons-material/Build";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import KitchenIcon from "@mui/icons-material/Kitchen";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useMemo, useState } from "react";

// Define interfaces for our data
interface EquipmentItem {
  id: number;
  name: string;
  status: string;
  issues: string;
}

// Enhanced Styled Components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  backdropFilter: "blur(10px)",
  borderRadius: 16,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
  overflow: "hidden",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    boxShadow: `0 12px 40px 0 ${alpha(theme.palette.common.black, 0.12)}`,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  padding: theme.spacing(2),
  fontSize: "0.95rem",
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  padding: theme.spacing(2),
  fontWeight: 700,
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  color: theme.palette.primary.main,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transform: "translateY(-2px)",
  },
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  transition: "all 0.2s ease-in-out",
  textTransform: "none",
  padding: "8px 16px",
  fontWeight: 600,
  boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: alpha(theme.palette.background.paper, 0.95),
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
  },
}));

// Equipment icons mapping
const getEquipmentIcon = (name: string): React.ReactNode => {
  if (name.toLowerCase().includes("cooker"))
    return <KitchenIcon fontSize="large" />;
  if (name.toLowerCase().includes("pot"))
    return <LocalDiningIcon fontSize="large" />;
  if (name.toLowerCase().includes("utensil"))
    return <RestaurantIcon fontSize="large" />;
  return <LocalDiningIcon fontSize="large" />;
};

const CheckDeviceAfterReturn: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [equipment, setEquipment] = useState<EquipmentItem[]>([
    {
      id: 1,
      name: "Electric Cooker",
      status: "Pending Inspection",
      issues: "",
    },
    {
      id: 2,
      name: "Pot Lid",
      status: "Pending Inspection",
      issues: "",
    },
    {
      id: 3,
      name: "Serving Utensils",
      status: "Pending Inspection",
      issues: "",
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<EquipmentItem | null>(null);
  const [action, setAction] = useState("");

  // Calculate progress statistics
  const stats = useMemo(() => {
    const total = equipment.length;
    const cleaned = equipment.filter(
      (item) => item.status === "Cleaned"
    ).length;
    const needsCleaning = equipment.filter(
      (item) => item.status === "Needs Cleaning"
    ).length;
    const pending = total - cleaned - needsCleaning;

    return {
      total,
      cleaned,
      needsCleaning,
      pending,
      progress: total > 0 ? ((cleaned + needsCleaning) / total) * 100 : 0,
    };
  }, [equipment]);

  const handleStatusUpdate = (id: number, newStatus: string): void => {
    setCurrentItem(equipment.find((item) => item.id === id) || null);
    setAction(newStatus);
    setDialogOpen(true);
  };

  const confirmStatusUpdate = (): void => {
    if (currentItem && action) {
      setEquipment((prev) =>
        prev.map((item) =>
          item.id === currentItem.id ? { ...item, status: action } : item
        )
      );
      setDialogOpen(false);
    }
  };

  const handleLogIssues = (id: number, issues: string): void => {
    setEquipment((prev) =>
      prev.map((item) => (item.id === id ? { ...item, issues } : item))
    );
  };

  const getStatusIcon = (status: string): React.ReactElement => {
    switch (status) {
      case "Cleaned":
        return <CheckCircleIcon color="success" fontSize="small" />;
      case "Needs Cleaning":
        return <BuildIcon color="error" fontSize="small" />;
      default:
        return <ErrorOutlineIcon color="action" fontSize="small" />;
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.background.default,
          0.95
        )}, ${alpha(theme.palette.background.paper, 0.95)})`,
      }}
    >
      <Fade in={true} timeout={800}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Kiểm tra thiết bị lẩu sau khi trả lại
          </Typography>

          {/* Progress Bar */}
          <Box sx={{ mb: 4 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography variant="body2" fontWeight="medium">
                Tiến độ kiểm tra
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(stats.progress)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={stats.progress}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: alpha(theme.palette.grey[300], 0.5),
                "& .MuiLinearProgress-bar": {
                  borderRadius: 5,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                },
              }}
            />
          </Box>

          {stats.total === stats.cleaned + stats.needsCleaning &&
            stats.total > 0 && (
              <Fade in={true} timeout={1000}>
                <Alert
                  severity="success"
                  sx={{
                    mb: 4,
                    borderRadius: 2,
                    boxShadow: `0 4px 12px ${alpha(
                      theme.palette.success.main,
                      0.2
                    )}`,
                  }}
                >
                  Tất cả thiết bị đã được kiểm tra xong!
                </Alert>
              </Fade>
            )}

          <StyledTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell>Tên thiết bị</StyledTableHeadCell>
                  <StyledTableHeadCell>Trạng thái</StyledTableHeadCell>
                  <StyledTableHeadCell>Vấn đề</StyledTableHeadCell>
                  <StyledTableHeadCell>Hành động</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {equipment.map((item) => (
                  <StyledTableRow key={item.id}>
                    <StyledTableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                          }}
                        >
                          {getEquipmentIcon(item.name)}
                        </Avatar>
                        <Typography fontWeight="medium">{item.name}</Typography>
                      </Stack>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Chip
                        icon={getStatusIcon(item.status)}
                        label={item.status}
                        variant="filled"
                        color={
                          item.status === "Cleaned"
                            ? "success"
                            : item.status === "Needs Cleaning"
                            ? "error"
                            : "default"
                        }
                        sx={{
                          borderRadius: "12px",
                          fontWeight: "medium",
                          boxShadow: `0 2px 8px ${alpha(
                            theme.palette.common.black,
                            0.1
                          )}`,
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <StyledTextField
                        fullWidth
                        size="small"
                        placeholder="Ghi chú vấn đề"
                        value={item.issues}
                        onChange={(e) =>
                          handleLogIssues(item.id, e.target.value)
                        }
                        multiline
                        rows={2}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            transition: "all 0.2s",
                            ...(item.status === "Needs Cleaning" && {
                              borderColor: theme.palette.error.main,
                              bgcolor: alpha(theme.palette.error.light, 0.05),
                            }),
                          },
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={1}
                      >
                        <Tooltip title="Đánh dấu đã làm sạch">
                          <AnimatedButton
                            variant="contained"
                            color="success"
                            startIcon={<CleaningServicesIcon />}
                            onClick={() =>
                              handleStatusUpdate(item.id, "Cleaned")
                            }
                            fullWidth={isMobile}
                            disabled={item.status === "Cleaned"}
                            sx={{
                              boxShadow: `0 4px 12px ${alpha(
                                theme.palette.success.main,
                                0.2
                              )}`,
                            }}
                          >
                            Đã làm sạch
                          </AnimatedButton>
                        </Tooltip>
                        <Tooltip title="Đánh dấu cần vệ sinh">
                          <AnimatedButton
                            variant="contained"
                            color="error"
                            startIcon={<BuildIcon />}
                            onClick={() =>
                              handleStatusUpdate(item.id, "Needs Cleaning")
                            }
                            fullWidth={isMobile}
                            disabled={item.status === "Needs Cleaning"}
                            sx={{
                              boxShadow: `0 4px 12px ${alpha(
                                theme.palette.error.main,
                                0.2
                              )}`,
                            }}
                          >
                            Cần vệ sinh
                          </AnimatedButton>
                        </Tooltip>
                      </Stack>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>

          {/* Confirmation Dialog */}
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: `0 8px 32px 0 ${alpha(
                  theme.palette.common.black,
                  0.1
                )}`,
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: "bold" }}>
              {action === "Cleaned"
                ? "Xác nhận đã làm sạch"
                : "Xác nhận cần vệ sinh"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {action === "Cleaned"
                  ? `Bạn có chắc chắn thiết bị "${currentItem?.name}" đã được làm sạch?`
                  : `Bạn có chắc chắn thiết bị "${currentItem?.name}" cần được vệ sinh?`}
              </DialogContentText>
              {action === "Needs Cleaning" && (
                <StyledTextField
                  autoFocus
                  margin="dense"
                  label="Mô tả vấn đề"
                  fullWidth
                  multiline
                  rows={3}
                  value={currentItem?.issues || ""}
                  onChange={(e) => {
                    if (currentItem) {
                      setCurrentItem({
                        ...currentItem,
                        issues: e.target.value,
                      });
                    }
                  }}
                  sx={{ mt: 2 }}
                />
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => setDialogOpen(false)}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Hủy
              </Button>
              <Button
                onClick={confirmStatusUpdate}
                variant="contained"
                color={action === "Cleaned" ? "success" : "error"}
                sx={{
                  borderRadius: 2,
                  boxShadow: `0 4px 12px ${alpha(
                    action === "Cleaned"
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                    0.2
                  )}`,
                }}
              >
                Xác nhận
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Fade>
    </Box>
  );
};

export default CheckDeviceAfterReturn;
