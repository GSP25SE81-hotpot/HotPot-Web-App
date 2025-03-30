/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import CTable from "../../components/table/CTable";
import adminMaintenanceAPI from "../../api/Services/adminMaintenance";
import MenuActionTableHotpotDetail from "../../components/menuAction/menuActionTableHotpotDetail/menuActionTableHotpotDetail";

const TableMaintenanceHotpot = () => {
  // declare
  const [selectedData, setSelectedData] = useState<any>();
  const [size, setSize] = useState<number>(10); // Set a default value
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [dataCombo, setDataCombo] = useState<any[]>([]);

  //select data
  const selecteData = (row: any) => {
    setSelectedData(row);
  };

  // Fetch ingredients data with pagination
  useEffect(() => {
    const getListCombo = async () => {
      try {
        const res: any = await adminMaintenanceAPI.getListMaintenance({
          pageNumber: page + 1, // API expects 1-based index
          pageSize: size,
        });

        setDataCombo(res?.data?.items || []);
        setTotal(res?.data?.totalCount);
      } catch (error: any) {
        console.error("Error fetching ingredients:", error?.message);
      }
    };

    getListCombo();
  }, [page, size]);

  const tableHeader = [
    {
      id: "hotPotInventorySeriesNumber",
      label: "Số hiệu nồi",
      align: "center",
    },
    { id: "loggedDate", label: "Ngày tạo", align: "center" },
    { id: "name", label: "Tiêu đề", align: "center" },
    {
      id: "statusName",
      label: "Trạng Thái",
      align: "center",
      format: "statusHotpot",
    },
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
        data={dataCombo}
        tableHeaderTitle={tableHeader}
        title="Bảng Nổi  Lẩu"
        selectedData={selecteData}
        menuAction={
          <MenuActionTableHotpotDetail
            hotpotData={selectedData}
            onOpenDetail={selecteData}
          />
        }
        size={size}
        page={page}
        total={total}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
};

export default TableMaintenanceHotpot;
