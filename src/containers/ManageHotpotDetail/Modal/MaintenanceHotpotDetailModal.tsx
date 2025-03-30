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
  Grid2,
  Paper,
} from "@mui/material";
import adminMaintenanceAPI from "../../../api/Services/adminMaintenance";

interface MaintenanceProps {
  open: boolean;
  handleCloseModal: VoidFunction;
  hotpotData: any;
}

const MaintenanceHotpotDetailModal: React.FC<MaintenanceProps> = ({
  open,
  handleCloseModal,
  hotpotData,
}) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        if (!hotpotData) return;

        const resData: any = await adminMaintenanceAPI.getMaintenanceDetails(
          hotpotData.damageDeviceId
        );

        setData(resData?.data);
      } catch (e) {
        console.error("Error fetching maintenance details:", e);
      }
    };

    fetchMaintenance();
  }, [hotpotData]);

  const statusNameData = (statusName: string) => {
    switch (statusName) {
      case "In Progress":
        return "Đang tiến hành";
      case "Pending":
        return "Đang chờ";
      case "Completed":
        return "Hoàn thành";
      case "Cancelled":
        return "Huỷ";
      default:
        return "---";
    }
  };
  return (
    <Box>
      <Dialog
        open={open}
        onClose={(_event, reason) => {
          if (reason === "backdropClick") return;
          handleCloseModal();
        }}
        aria-hidden={false}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi Tiết Bảo Trì</DialogTitle>
        <DialogContent>
          {data ? (
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Grid2 container spacing={2}>
                <Grid2 size={{ mobile: 12 }}>
                  <Typography variant="h6" color="primary">
                    Nội dung: {data.name}
                  </Typography>
                </Grid2>
                <Grid2 size={{ mobile: 6 }}>
                  <Typography variant="subtitle1">
                    <b>Mã Series:</b> {data.hotPotInventorySeriesNumber}
                  </Typography>
                  <Typography variant="subtitle1">
                    <b>Ngày Ghi Nhận:</b>{" "}
                    {new Date(data.loggedDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="subtitle1">
                    <b>Trạng Thái:</b>
                    {statusNameData(data.statusName)}
                  </Typography>
                </Grid2>
                <Grid2 size={{ mobile: 6 }}>
                  <Typography variant="subtitle1">
                    <b>Mô Tả:</b> {data.description}
                  </Typography>
                </Grid2>
              </Grid2>
            </Paper>
          ) : (
            <Typography>Đang tải dữ liệu...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            variant="contained"
            color="primary"
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaintenanceHotpotDetailModal;
