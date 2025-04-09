/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import BuildIcon from "@mui/icons-material/Build";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SerialNumberIcon from "@mui/icons-material/QrCode";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DoneIcon from "@mui/icons-material/Done";
import adminMaintenanceAPI from "../../../api/Services/adminMaintenance";
import { toast } from "react-toastify";

interface MaintenanceProps {
  open: boolean;
  handleCloseModal: VoidFunction;
  hotpotData: any;
  onStatusUpdate?: () => void;
}

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2, 3),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const ContentSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const StatusButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  fontWeight: "bold",
}));

const MaintenanceHotpotDetailModal: React.FC<MaintenanceProps> = ({
  open,
  handleCloseModal,
  hotpotData,
  onStatusUpdate,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);

  // Status update confirmation modal
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [nextStatus, setNextStatus] = useState<string>("");

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        if (!hotpotData) return;

        setLoading(true);
        const resData: any = await adminMaintenanceAPI.getMaintenanceDetails(
          hotpotData.damageDeviceId
        );

        setData(resData?.data);
        setLoading(false);
      } catch (e) {
        console.error("Error fetching maintenance details:", e);
        setLoading(false);
      }
    };

    if (open) {
      fetchMaintenance();
    }
  }, [hotpotData, open]);

  const getStatusChip = (statusName: string) => {
    let color:
      | "default"
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning" = "default";
    let icon = <PendingIcon />;
    let label = "---";

    switch (statusName) {
      case "In Progress":
        color = "info";
        icon = <EngineeringIcon />;
        label = "Đang tiến hành";
        break;
      case "Pending":
        color = "warning";
        icon = <ScheduleIcon />;
        label = "Đang chờ";
        break;
      case "Completed":
        color = "success";
        icon = <CheckCircleIcon />;
        label = "Hoàn thành";
        break;
      case "Cancelled":
        color = "error";
        icon = <CancelIcon />;
        label = "Huỷ";
        break;
      default:
        label = "---";
    }

    return (
      <Chip
        icon={icon}
        label={label}
        color={color}
        variant="filled"
        size="medium"
      />
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleUpdateStatus = (status: string) => {
    setNextStatus(status);
    setConfirmModalOpen(true);
  };

  const confirmUpdateStatus = async () => {
    try {
      setUpdateLoading(true);

      // Sample API call - replace with actual implementation
      await adminMaintenanceAPI.updateMaintenanceStatus(data.damageDeviceId, {
        status: nextStatus,
      });

      if (onStatusUpdate) {
        onStatusUpdate();
        toast.success("Cập nhật bảo trì thành công");
      }

      setUpdateLoading(false);
      setConfirmModalOpen(false);
    } catch (error) {
      console.error("Failed to update status:", error);
      setUpdateLoading(false);
    }
  };

  const getStatusUpdateButton = (currentStatus: string) => {
    switch (currentStatus) {
      case "Pending":
        return (
          <>
            <StatusButton
              variant="contained"
              color="info"
              startIcon={<PlayArrowIcon />}
              onClick={() => handleUpdateStatus("InProgress")}
              fullWidth
            >
              Bắt đầu bảo trì
            </StatusButton>
            <StatusButton
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => handleUpdateStatus("Cancelled")}
              fullWidth
            >
              Huỷ bảo trì
            </StatusButton>
          </>
        );
      case "In Progress":
        return (
          <>
            <StatusButton
              variant="contained"
              color="success"
              startIcon={<DoneIcon />}
              onClick={() => handleUpdateStatus("Completed")}
              fullWidth
            >
              Hoàn thành bảo trì
            </StatusButton>
            <StatusButton
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => handleUpdateStatus("Cancelled")}
              fullWidth
            >
              Huỷ bảo trì
            </StatusButton>
          </>
        );
      case "Completed":
        return null;
      case "Cancelled":
        return null;
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={(_event, reason) => {
          if (reason === "backdropClick") return;
          handleCloseModal();
        }}
        aria-hidden={false}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        <StyledDialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <BuildIcon />
            <Typography variant="h6">Chi Tiết Bảo Trì</Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseModal}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>

        <DialogContent sx={{ padding: 3, pt: 3 }}>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="300px"
            >
              <CircularProgress />
              <Typography variant="body1" ml={2}>
                Đang tải dữ liệu...
              </Typography>
            </Box>
          ) : data ? (
            <Box>
              <ContentSection>
                <Typography
                  variant="h5"
                  color="primary"
                  gutterBottom
                  fontWeight="bold"
                >
                  {data.name}
                </Typography>
                <Divider sx={{ my: 2 }} />
              </ContentSection>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.01)",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6" color="primary" gutterBottom>
                      Thông tin thiết bị
                    </Typography>

                    <Stack spacing={2} mt={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <SerialNumberIcon color="primary" />
                        <Typography variant="body1">
                          <strong>Mã Series:</strong>{" "}
                          {data.hotPotInventorySeriesNumber ||
                            "Không có thông tin"}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1}>
                        <ScheduleIcon color="primary" />
                        <Typography variant="body1">
                          <strong>Ngày Ghi Nhận:</strong>{" "}
                          {data.loggedDate
                            ? formatDate(data.loggedDate)
                            : "Không có thông tin"}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body1" mr={1}>
                          <strong>Trạng Thái:</strong>
                        </Typography>
                        {getStatusChip(data.statusName)}
                      </Box>

                      <Stack spacing={1}>
                        {getStatusUpdateButton(data.statusName)}
                      </Stack>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.01)",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6" color="primary" gutterBottom>
                      Mô tả chi tiết
                    </Typography>

                    <Box display="flex" gap={1} mt={2}>
                      <DescriptionIcon
                        color="primary"
                        sx={{ marginTop: 0.5 }}
                      />
                      <Typography
                        variant="body1"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {data.description || "Không có mô tả"}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                {data.notes && (
                  <Grid item xs={12}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        mt: 2,
                        backgroundColor: "rgba(0, 0, 0, 0.01)",
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="h6" color="primary" gutterBottom>
                        Ghi chú bổ sung
                      </Typography>
                      <Typography
                        variant="body1"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {data.notes}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          ) : (
            <Box display="flex" justifyContent="center" p={4}>
              <Typography>Không tìm thấy dữ liệu</Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ padding: 2, justifyContent: "center" }}>
          <Button
            onClick={handleCloseModal}
            variant="contained"
            color="primary"
            size="large"
            startIcon={<CloseIcon />}
            sx={{ borderRadius: 2, px: 4 }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Confirmation Modal */}
      <Dialog
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          Cập nhật trạng thái bảo trì
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography variant="body1" gutterBottom>
            Bạn có chắc chắn muốn cập nhật trạng thái bảo trì sang{" "}
            <strong>
              {nextStatus === "InProgress"
                ? "Đang tiến hành"
                : nextStatus === "Completed"
                ? "Hoàn thành"
                : nextStatus === "Cancelled"
                ? "Huỷ"
                : nextStatus}
            </strong>
            ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Button onClick={() => setConfirmModalOpen(false)} variant="outlined">
            Huỷ
          </Button>
          <Button
            onClick={confirmUpdateStatus}
            variant="contained"
            color={
              nextStatus === "InProgress"
                ? "info"
                : nextStatus === "Completed"
                ? "success"
                : nextStatus === "Cancelled"
                ? "error"
                : "primary"
            }
            disabled={updateLoading}
            startIcon={updateLoading ? <CircularProgress size={20} /> : null}
          >
            {updateLoading ? "Đang cập nhật..." : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MaintenanceHotpotDetailModal;
