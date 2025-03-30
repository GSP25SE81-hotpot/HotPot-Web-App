/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import { IOrder } from "../../../types/order";
import moment from "moment";
import { colors } from "../../../styles/Color/color";

interface UserInfProps {
  data?: IOrder;
}

const CustomerInf: React.FC<UserInfProps> = ({ data }) => {
  const funcFormat = (values: any) => {
    //status
    switch (values) {
      case "Pending":
        return "Đang chờ";
      case "Processing":
        return "Đang làm";
      case "Shipping":
        return "Đang giao";
      case "Delivered":
        return "Đã giao";
      case "Cancelled":
        return "Hủy";
      case "Returning":
        return "Đang trả";
      case "Completed":
        return "Hoàn thành";
        break;
    }
  };

  const funcFormatBGColor = (values: any) => {
    //BGcolors
    switch (values) {
      case "Pending":
        return "rgba(189, 189, 3, 0.103)";
      case "Processing":
        return "#FFAB5B";
      case "Shipping":
        return "#FFF085";
      case "Delivered":
        return "#E9A5F1";
      case "Cancelled":
        return "rgb(253, 183, 183)";
      case "Returning":
        return "#A1E3F9";
      case "Completed":
        return "rgba(0, 128, 0, 0.151)";
    }
  };

  const funcFormatColor = (values: any) => {
    //BGcolors
    switch (values) {
      case "Pending":
        return "goldenrod";
      case "Processing":
        return "#D98324";
      case "Shipping":
        return "#D98324";
      case "Delivered":
        return "#8F87F1";
      case "Cancelled":
        return "red";
      case "Returning":
        return "#80CBC4";
      case "Completed":
        return "green";
    }
  };

  const funcFormatpaymentStatus = (values: any) => {
    //BGcolors
    switch (values) {
      case "Pending":
        return "Chờ thanh toán";
      case "Success":
        return "Hoàn thành giao dịch";
      case "Cancelled":
        return "Hủy bỏ giao dịch";
      case "Refunded":
        return "Hoàn tiền";
    }
  };

  return (
    <Box>
      <Grid container spacing={5}>
        <Grid size={6}>
          <Paper sx={{ p: 4, minHeight: "35vh" }}>
            <Stack spacing={4}>
              <Typography variant="h5">Thông tin khách hàng</Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Khách hàng:</Typography>
                <Typography sx={{ color: colors.gray_600 }}>
                  {data?.user?.name}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Email:</Typography>
                <Typography sx={{ color: colors.gray_600 }}>
                  {data?.user?.email}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Điện thoại:</Typography>
                <Typography sx={{ color: colors.gray_600 }}>
                  {data?.user?.phoneNumber}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={6}>
          <Paper sx={{ p: 4, minHeight: "35vh" }}>
            <Stack spacing={4}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5">Đơn hàng</Typography>
                <Typography
                  textAlign={"center"}
                  sx={{
                    p: "4px",
                    borderRadius: "10px",
                    width: "100px",
                    bgcolor: funcFormatBGColor(data?.status),
                    color: funcFormatColor(data?.status),
                  }}
                >
                  {funcFormat(data?.status)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Mã đơn:</Typography>
                <Typography sx={{ color: colors.gray_600 }}>
                  {data?.orderId}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Địa chỉ giao:</Typography>
                <Typography sx={{ color: colors.gray_600 }}>
                  {data?.address}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Thời gian đặt:</Typography>
                <Typography sx={{ color: colors.gray_600 }}>
                  {moment(data?.createdAt).format("DD-mm-YYYY")}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Tổng tiền:</Typography>
                <Typography sx={{ color: colors.gray_600 }}>
                  {data?.totalPrice}
                </Typography>
              </Box>
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Trạng thái thanh toán:</Typography>
                <Typography sx={{ color: colors.gray_600 }}>
                  {funcFormatpaymentStatus(data?.payment?.status)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Thời gian thanh toán:</Typography>
                <Typography sx={{ color: colors.gray_600 }}>
                  {moment(data?.payment?.createdAt).format(
                    "DD/mm/YYYY | hh:mm a"
                  )}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerInf;
