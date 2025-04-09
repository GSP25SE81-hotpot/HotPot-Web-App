/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import CTable from "../../components/table/CTable";
import MenuActionManageAssignmentStaff from "../../components/menuAction/menuActionTableAssignmentStaff/MenuActionManageAssignmentStaff";
import StaffAssignemtAPI from "../../api/Services/staffAssignmentAPI";

const ManageAssignmentStaff = () => {
  // declare
  const [selectedData, setSelectedData] = useState<any>();
  const [size, setSize] = useState<number>(10); // Set a default value
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [assignment, setAssignment] = useState<any[]>([]);

  //select data
  const selecteData = (row: any) => {
    setSelectedData(row);
  };

  //   Fetch ingredients data with pagination
  useEffect(() => {
    const getAssignment = async () => {
      try {
        const res: any = await StaffAssignemtAPI.getListAssignment({
          pageNumber: page + 1,
          pageSize: size,
        });

        setAssignment(res?.data?.items || []);
        setTotal(res?.data?.totalCount || 0);
      } catch (error: any) {
        console.error("Error fetching ingredients:", error?.message);
      }
    };

    getAssignment();
  }, [page, size]);

  const tableHeader = [
    { id: "orderCode", label: "Mã hoá đơn", align: "center" },
    { id: "staffName", label: "Nhân viên", align: "center" },
    {
      id: "assignedDate",
      label: "Thời gian giao",
      align: "center",
      format: "date",
    },
    {
      id: "completedDate",
      label: "Hoàn thành",
      align: "center",
      format: "date",
    },
    { id: "customerName", label: "Tên khách hàng", align: "center" },
    { id: "customerAddress", label: "Địa chỉ", align: "center" },
    { id: "customerPhone", label: "Số điện thoại", align: "center" },
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
        data={assignment}
        tableHeaderTitle={tableHeader}
        title="Bảng Công Việc"
        menuAction={
          <MenuActionManageAssignmentStaff
            hotpotData={selectedData}
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

export default ManageAssignmentStaff;
