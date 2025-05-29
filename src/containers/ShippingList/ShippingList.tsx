/* eslint-disable @typescript-eslint/no-explicit-any */
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import DoneIcon from "@mui/icons-material/Done";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { Table, TableBody, TableCell } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import staffGetOrderApi from "../../api/staffGetOrderAPI";
import { ShippingOrderType } from "../../types/shippingOrder";
import ConfirmationDialog from "./Popup/Confirm";
import Detail from "./Popup/Detail";
import {
  ActionsCell,
  AddressCell,
  AddressTooltip,
  ContentPaper,
  CustomerNameCell,
  DeliveredButton,
  DesktopOnlyBox,
  DirectionButton,
  EmptyStateContainer,
  EmptyStateText,
  HeaderCell,
  LoadingContainer,
  MobileOnlyBox,
  OrderCodeCell,
  PageContainer,
  PageTitle,
  ResponsiveTableContainer,
  StartDeliveryButton,
  StatusCell,
  StatusChip,
  StyledCircularProgress,
  StyledTableHead,
  StyledTableRow,
} from "./ShippingListStyles";

const ShippingList = () => {
  // Declare
  const [shippingList, setShippingList] = useState<ShippingOrderType[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToUpdateStatus, setItemToUpdateStatus] = useState<any>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number>();
  const [loading, setLoading] = useState(true);

  // Header array
  const headerArr = [
    "Mã đơn hàng",
    "Tên khách hàng",
    "Địa chỉ giao hàng",
    "Trạng thái",
    "",
  ];

  // Call API
  const getShippingList = async () => {
    setLoading(true);
    try {
      const res = await staffGetOrderApi.getAssignOrderByStaffId({
        taskType: "Shipping",
      });
      setShippingList(res?.data);
    } catch (error: any) {
      console.log(error?.message);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getShippingList();
  }, []);

  // Handle redirect to Google Maps
  const handleViewOnMap = (address: any) => {
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      window.open(googleMapsUrl, "_blank");
    } else {
      toast.warning("Không có địa chỉ được cung cấp.");
    }
  };

  // Handle confirm delivered
  const handleConfirmDelivered = async (orderId: any) => {
    try {
      const res = await staffGetOrderApi.updateStatus(orderId, {
        status: "Delivered",
      });
      console.log(res);
      getShippingList();
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái đơn hàng");
      console.log("error", error);
    }
  };

  // Handle start delivery
  const handleConfirmStartDelivery = async (orderId: any) => {
    try {
      const res = await staffGetOrderApi.updateStatus(orderId, {
        status: "Shipping",
      });
      console.log(res);
      getShippingList();
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
    } catch (error: any) {
      toast.error("Không thể cập nhật trạng thái đơn hàng");
      console.log(error?.message);
    }
  };

  // Handle format status
  const renderStatusChip = (status: string) => {
    switch (status) {
      case "Shipping":
        return (
          <StatusChip
            label="Đang giao hàng"
            variant="outlined"
            size="small"
            statusType="shipping"
          />
        );
      case "Processed":
        return (
          <StatusChip
            label="Chờ giao hàng"
            variant="outlined"
            size="small"
            statusType="processed"
          />
        );
      default:
        return status;
    }
  };

  // Handle open confirm
  const handleOpenConfirm = (itemId: any) => {
    setItemToUpdateStatus(itemId);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setItemToUpdateStatus(null);
  };

  // Handle event from popup
  const handleConfirmAction = () => {
    if (itemToUpdateStatus) {
      handleConfirmDelivered(itemToUpdateStatus);
      handleCloseConfirm();
    }
  };

  // Handle open detail
  const handleOpenDetail = (orderId: number) => {
    setSelectedOrderId(orderId);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  return (
    <PageContainer>
      <Detail
        onOpen={openDetail}
        onClose={handleCloseDetail}
        orderId={selectedOrderId}
      />
      <ConfirmationDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Xác nhận"
        description="Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng này không?"
        onConfirm={handleConfirmAction}
      />
      <ContentPaper>
        <PageTitle variant="h4" component="h1">
          Danh sách đơn hàng giao
        </PageTitle>
        <ResponsiveTableContainer>
          <Table
            sx={{ minWidth: { xs: "auto", md: 700 } }}
            aria-label="shipping orders table"
          >
            <StyledTableHead>
              <StyledTableRow>
                {headerArr.map((header, index) => (
                  <HeaderCell key={index} align="left">
                    {header}
                  </HeaderCell>
                ))}
              </StyledTableRow>
            </StyledTableHead>
            <TableBody>
              {loading ? (
                <StyledTableRow>
                  <TableCell colSpan={5} align="center">
                    <LoadingContainer>
                      <StyledCircularProgress />
                    </LoadingContainer>
                  </TableCell>
                </StyledTableRow>
              ) : shippingList.length === 0 ? (
                <StyledTableRow>
                  <TableCell colSpan={5} align="center">
                    <EmptyStateContainer>
                      <EmptyStateText>
                        Không có đơn hàng nào cần giao
                      </EmptyStateText>
                    </EmptyStateContainer>
                  </TableCell>
                </StyledTableRow>
              ) : (
                shippingList.map((row, index) => (
                  <StyledTableRow key={index}>
                    <OrderCodeCell
                      align="left"
                      onClick={() => handleOpenDetail(row?.orderId)}
                    >
                      {row?.orderCode}
                    </OrderCodeCell>
                    <CustomerNameCell align="left">
                      {row?.customerName}
                    </CustomerNameCell>
                    <AddressCell align="left">
                      <AddressTooltip
                        title={row?.shippingAddress || "Không có địa chỉ"}
                        arrow
                      >
                        <span>{row?.shippingAddress}</span>
                      </AddressTooltip>
                    </AddressCell>
                    <StatusCell align="left">
                      {renderStatusChip(row?.status)}
                    </StatusCell>
                    <ActionsCell align="center">
                      <DesktopOnlyBox>
                        {row?.status === "Shipping" ? (
                          <>
                            <DirectionButton
                              variant="contained"
                              startIcon={<DeliveryDiningIcon />}
                              onClick={() =>
                                handleViewOnMap(row?.shippingAddress)
                              }
                            >
                              Chỉ đường
                            </DirectionButton>
                            <DeliveredButton
                              startIcon={<DoneIcon />}
                              onClick={() => handleOpenConfirm(row?.orderId)}
                            >
                              Đã giao
                            </DeliveredButton>
                          </>
                        ) : (
                          <StartDeliveryButton
                            startIcon={<HourglassEmptyIcon />}
                            onClick={() =>
                              handleConfirmStartDelivery(row?.orderId)
                            }
                          >
                            Bắt đầu giao
                          </StartDeliveryButton>
                        )}
                      </DesktopOnlyBox>
                      <MobileOnlyBox>
                        {row?.status === "Shipping" ? (
                          <>
                            <DirectionButton
                              variant="contained"
                              startIcon={<DeliveryDiningIcon />}
                              onClick={() =>
                                handleViewOnMap(row?.shippingAddress)
                              }
                              fullWidth
                            >
                              Chỉ đường
                            </DirectionButton>
                            <DeliveredButton
                              startIcon={<DoneIcon />}
                              onClick={() => handleOpenConfirm(row?.orderId)}
                              fullWidth
                            >
                              Đã giao
                            </DeliveredButton>
                          </>
                        ) : (
                          <StartDeliveryButton
                            startIcon={<HourglassEmptyIcon />}
                            onClick={() =>
                              handleConfirmStartDelivery(row?.orderId)
                            }
                            fullWidth
                          >
                            Bắt đầu giao
                          </StartDeliveryButton>
                        )}
                      </MobileOnlyBox>
                    </ActionsCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ResponsiveTableContainer>
      </ContentPaper>
    </PageContainer>
  );
};

export default ShippingList;
