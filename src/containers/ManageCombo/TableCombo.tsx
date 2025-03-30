/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import CTable from "../../components/table/CTable";
import adminComboAPI from "../../api/Services/adminComboAPI";
import config from "../../configs";
import { useNavigate } from "react-router";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MenuActionTableCombo from "../../components/menuAction/menuActionTableCombo/menuActionTableCombo";

const TableCombo = () => {
  // declare
  const [selectedData, setSelectedData] = useState<any>();
  const [size, setSize] = useState<number>(10); // Set a default value
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [dataCombo, setDataCombo] = useState<any[]>([]);

  const navigate = useNavigate();
  //select data
  const selecteData = (row: any) => {
    setSelectedData(row);
  };

  // Fetch ingredients data with pagination
  useEffect(() => {
    const getListCombo = async () => {
      try {
        const res: any = await adminComboAPI.getListCombo({
          pageNumber: page + 1,
          pageSize: size,
        });
        setDataCombo(res?.items || []);
        setTotal(res?.totalCount || 0);
      } catch (error: any) {
        console.error("Error fetching ingredients:", error?.message);
      }
    };

    getListCombo();
  }, [page, size]);

  const tableHeader = [
    { id: "name", label: "Tên món lẩu", align: "center" },
    { id: "imageURLs", label: "Hình ảnh", align: "center" },
    { id: "isCustomizable", label: "Tự tạo mới", align: "center" },
    { id: "appliedDiscountPercentage", label: "Giảm giá", align: "center" },
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

  const EventAction = () => {
    return (
      <>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => navigate(config.adminRoutes.createHotPotCombo)}
        >
          Tạo bombo mới
        </Button>
      </>
    );
  };

  return (
    <>
      <CTable
        data={dataCombo}
        tableHeaderTitle={tableHeader}
        title="Bảng Combo Lẩu"
        menuAction={
          <MenuActionTableCombo
            hotpotData={selectedData}
            onOpenDetail={selecteData}
          />
        }
        eventAction={<EventAction />}
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

export default TableCombo;
