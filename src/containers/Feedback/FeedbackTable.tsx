/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import CTable from "../../components/table/CTable";
import adminFeedbackAPI from "../../api/Services/adminFeedbackAPI";
import MenuActionTableFeedback from "../../components/menuAction/menuActionTableFeedback/menuActionTableFeedback";

const TableFeedback = () => {
  // declare
  const [selectedData, setSelectedData] = useState<any>();
  const [size, setSize] = useState<number>(10); // Set a default value
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [dataFeedback, setDataFeedback] = useState<any[]>([]);

  //select data
  const selecteData = (row: any) => {
    setSelectedData(row);
  };

  // Fetch ingredients data with pagination
  useEffect(() => {
    const getListFeedback = async () => {
      try {
        const res: any = await adminFeedbackAPI.getListFeedback({
          pageNumber: page + 1,
          pageSize: size,
        });

        console.log(res);

        setDataFeedback(res?.data?.items || []);
        setTotal(res?.data?.totalCount || 0);
      } catch (error: any) {
        console.error("Error fetching ingredients:", error?.message);
      }
    };

    getListFeedback();
  }, [page, size]);

  const tableHeader = [
    { id: "userName", label: "Tên người gửi", align: "center" },
    { id: "orderId", label: "Mã hoá đơn", align: "center" },
    { id: "createdAt", label: "Ngày tạo", align: "center", format: "date" },
  ];

  // Handle pagination
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <CTable
        data={dataFeedback}
        tableHeaderTitle={tableHeader}
        title="Bảng tổng hợp đánh giá"
        menuAction={
          <MenuActionTableFeedback
            feedbackData={selectedData}
            onOpenDetail={selecteData}
          />
        }
        selectedData={selecteData}
        size={size}
        page={page}
        total={total}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
};

export default TableFeedback;
