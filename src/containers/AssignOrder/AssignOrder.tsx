/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, useTheme } from "@mui/material";
import { toast } from "react-toastify";
import staffGetOrderApi from "../../api/staffGetOrderAPI";
import { AssignOrderType } from "../../types/assignOrder";
import ViewDetail from "./Popup/ViewDetail";
import {
  PageContainer,
  PageTitle,
  StyledTableContainer,
  StyledTableHead,
  HeaderCell,
  StyledTableRow,
  OrderCodeCell,
  CustomerNameCell,
  NotesCell,
  StatusCell,
  ActionsCell,
  NotesTextField,
  StyledStatusChip,
  ActionButton,
  EmptyStateContainer,
  EmptyStateText,
} from "./AssignOrderStyles";

// Status translation function
const translateOrderStatus = (status: string): string => {
  const statusTranslations: Record<string, string> = {
    Processing: "Đang xử lý",
  };

  return statusTranslations[status] || status;
};

const StatusChip = ({ status }: { status: string }) => {
  const theme = useTheme();

  // Translate the status to Vietnamese
  const translatedStatus = translateOrderStatus(status);

  // Map for status colors (using translated status values)
  const statusColors: Record<string, string> = {
    "Đang xử lý": theme.palette.info.main,
  };

  return (
    <StyledStatusChip
      label={status}
      size="small"
      statuscolor={statusColors[translatedStatus] || theme.palette.grey[500]}
    />
  );
};

const AssignOrder: React.FC = () => {
  // Declare
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number>();
  const [orders, setOrders] = useState<AssignOrderType[]>([]);
  const [loading, setLoading] = useState(true);

  // Header array
  const headerArr = [
    "Mã đơn hàng",
    "Tên khách hàng",
    "Ghi chú đặc biệt",
    "Trạng thái",
    "Thao tác",
  ];

  // API call
  const getAssignOrderByStaffId = async () => {
    setLoading(true);
    try {
      const res = await staffGetOrderApi.getAssignOrderByStaffId();
      setOrders(res?.data);
    } catch (error: any) {
      console.log(error?.message);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAssignOrderByStaffId();
  }, []);

  const body = {
    status: "Processed",
  };

  // Handle status change
  const handleChangeStatus = async (orderId: any) => {
    try {
      const res = await staffGetOrderApi.updateStatus(orderId, body);
      console.log(res);
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      getAssignOrderByStaffId();
    } catch (error: any) {
      toast.error("Không thể cập nhật trạng thái đơn hàng");
      console.log(error?.message);
    }
  };

  // Handle detail view
  const handleOpenDetail = (orderId: number) => {
    setSelectedOrderId(orderId);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  return (
    <>
      <ViewDetail
        onOpen={openDetail}
        onClose={handleCloseDetail}
        orderId={selectedOrderId}
      />
      <PageContainer>
        <PageTitle variant="h4" component="h1">
          Danh sách đơn hàng cần xử lý
        </PageTitle>

        <StyledTableContainer>
          <Table>
            <StyledTableHead>
              <StyledTableRow>
                {headerArr.map((header, index) => (
                  <HeaderCell key={index}>{header}</HeaderCell>
                ))}
              </StyledTableRow>
            </StyledTableHead>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <StyledTableRow key={order.orderId}>
                    <OrderCodeCell
                      onClick={() => handleOpenDetail(order.orderId)}
                    >
                      {order.orderCode}
                    </OrderCodeCell>
                    <CustomerNameCell>{order.customerName}</CustomerNameCell>
                    <NotesCell>
                      <NotesTextField
                        multiline
                        rows={2}
                        placeholder="Nhập ghi chú đặc biệt..."
                      />
                    </NotesCell>
                    <StatusCell>
                      <StatusChip status={order.status} />
                    </StatusCell>
                    <ActionsCell>
                      <ActionButton
                        variant="contained"
                        onClick={() => handleChangeStatus(order.orderId)}
                      >
                        Đơn hàng sẵn sàng
                      </ActionButton>
                    </ActionsCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <TableCell colSpan={5}>
                    <EmptyStateContainer>
                      {loading ? (
                        <EmptyStateText>Đang tải dữ liệu...</EmptyStateText>
                      ) : (
                        <EmptyStateText>
                          Không có đơn hàng nào cần xử lý
                        </EmptyStateText>
                      )}
                    </EmptyStateContainer>
                  </TableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </PageContainer>
    </>
  );
};

export default AssignOrder;
