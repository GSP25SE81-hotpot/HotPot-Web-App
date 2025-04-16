/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { IOrder } from "../../types/order";
import orderManagementAPI from "../../api/orderManagementAPI";
import CTable from "../../components/table/CTable";
import MenuActionTableOrder from "../../components/menuAction/menuActionTableOrder/MenuActionTableOrder";

const OrderTable = () => {
  //Declare
  const [orderData, setOrderData] = useState<IOrder[]>([]);
  const [selectOrderdata, setSelectedOrderData] = useState<any>();
  const [size, setSize] = useState<number>(10);
  const [total, _setTotal] = useState<number>(10);
  const [page, setPage] = useState<number>(0);

  //select data
  const selecteData = (row: any) => {
    setSelectedOrderData(row);
  };

  //Handle pagination
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  //Call API
  const getOrderListData = async () => {
    try {
      const res: any = await orderManagementAPI.getOrder();
      setOrderData(res?.items);
      console.log("dtaa: ", res);
    } catch (error: any) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    getOrderListData();
  }, []);

  const tableOrderHeader = [
    { id: "orderId", label: "Mã đơn hàng", align: "center" },
    { id: "user.name", label: "khách hàng", align: "center" },
    { id: "user.phoneNumber", label: "Điện thoại", align: "center" },
    { id: "address", label: "Địa chỉ giao", align: "center" },
    { id: "notes", label: "Ghi chú", align: "center" },
    { id: "createdAt", label: "Đặt lúc", align: "center", format: "date" },
    { id: "totalPrice", label: "Tổng tiền", align: "center" },
    { id: "status", label: "Trạng thái", align: "center", format: "status" },
  ];

  return (
    <div>
      <CTable
        data={orderData}
        tableHeaderTitle={tableOrderHeader}
        title="Quản lý đơn hàng"
        menuAction={<MenuActionTableOrder orderData={selectOrderdata} />}
        selectedData={selecteData}
        size={size}
        page={page}
        total={total}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default OrderTable;
