/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import DoneIcon from "@mui/icons-material/Done";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { toast } from "react-toastify";
import staffGetOrderApi from "../../api/staffGetOrderAPI";
import useAuth from "../../hooks/useAuth";
import { ShippingOrderType } from "../../types/shippingOrder";
import ConfirmationDialog from "./Popup/Confirm";

const ShippingList = () => {
  //Declare
  const [shippingList, setShippingList] = React.useState<ShippingOrderType[]>(
    []
  );
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [itemToUpdateStatus, setItemToUpdateStatus] = React.useState<any>(null);
  const theme = useTheme();
  const { auth } = useAuth();
  const id = auth?.user?.id;

  //Call api
  const getShippingList = async () => {
    try {
      const res = await staffGetOrderApi.getAssignOrderByStaffId({
        taskType: "Shipping",
      });
      setShippingList(res?.data);
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  React.useEffect(() => {
    getShippingList();
  }, []);

  //handle redirect to gg map
  const handleViewOnMap = (address: any) => {
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      window.open(googleMapsUrl, "_blank");
    } else {
      alert("Không có địa chỉ được cung cấp.");
    }
  };

  //handle confirm delivered
  const handleConfirmDelivered = async (orderId: any) => {
    try {
      const res = await staffGetOrderApi.updateStatus(orderId, {
        status: "Delivered",
      });
      getShippingList();
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      console.log(res);
    } catch (error) {
      console.log("error", error);
    }
  };

  //handle start delivery
  const handleConfirmStartDelivery = async (orderId: any) => {
    try {
      const res = await staffGetOrderApi.updateStatus(orderId, {
        status: "Shipping",
      });
      getShippingList();
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      console.log(res);
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  //Header arr
  const headerArr = [
    "Mã đơn hàng",
    "Tên khách hàng",
    "Địa chỉ giao hàng",
    "Trạng thái",
    "",
  ];

  //handle format status
  const handleFormatStatus = (status: any) => {
    switch (status) {
      case "Shipping":
        return (
          <Chip
            label="Đang giao hàng"
            color="warning"
            variant="outlined"
            size="small"
            sx={{ minWidth: "90px" }}
          />
        );
      case "Processed":
        return (
          <Chip
            label="Chờ giao hàng"
            color="primary"
            variant="outlined"
            size="small"
            sx={{ minWidth: "90px" }}
          />
        );
      default:
        return status;
    }
  };

  //handle open confirm
  const handleOpenConfirm = (itemId: any) => {
    setItemToUpdateStatus(itemId);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setItemToUpdateStatus(null);
  };

  //handle event from popup

  const handleConfirmAction = () => {
    if (itemToUpdateStatus) {
      handleConfirmDelivered(itemToUpdateStatus);
      handleCloseConfirm();
    }
  };

  return (
    <Box>
      <ConfirmationDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Xác nhận"
        description="Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng này không?"
        onConfirm={handleConfirmAction}
      />
      <Paper sx={{ p: 5 }}>
        <Box>
          <Typography variant="h4" component="h1" mb={3} color="primary">
            Danh sách đơn hàng giao
          </Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.grey[200] }}>
                {headerArr.map((header, _index) => (
                  <TableCell sx={{ fontWeight: 600 }} align="left">
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {shippingList.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="left">{row?.orderCode}</TableCell>
                  <TableCell align="left">{row?.customerName}</TableCell>
                  <TableCell align="left">{row?.shippingAddress}</TableCell>
                  <TableCell align="left">
                    {handleFormatStatus(row?.status)}
                  </TableCell>
                  <TableCell align="center">
                    {row?.status == "Shipping" ? (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<DeliveryDiningIcon />}
                        onClick={() => handleViewOnMap(row?.shippingAddress)}
                      >
                        Chỉ đường
                      </Button>
                    ) : null}
                    {row?.status == "Shipping" ? (
                      <Button
                        sx={{
                          border: "1px solid #4caf50",
                          color: "#4caf50",
                          ml: 2,
                        }}
                        startIcon={<DoneIcon />}
                        onClick={() => handleOpenConfirm(row?.orderId)}
                      >
                        Đã giao
                      </Button>
                    ) : (
                      <Button
                        sx={{
                          border: "1px solid #3f51b5",
                          color: "#3f51b5",
                          ml: 2,
                        }}
                        startIcon={<HourglassEmptyIcon />}
                        onClick={() => handleConfirmStartDelivery(row?.orderId)}
                      >
                        Bắt đầu giao
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ShippingList;
