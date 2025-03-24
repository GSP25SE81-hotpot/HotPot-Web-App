import { useEffect, useState } from "react";
import CTable from "../../components/table/CTable";
import MenuActionTableUser from "../../components/menuAction/menuActionTableUser/MenuActionTableUser";
import config from "../../configs";
import { useNavigate } from "react-router";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import adminHotpot from "../../api/Services/adminHotpot";

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
        const res: any = await adminHotpot.getListHotpot({
          pageNumber: page + 1, // API expects 1-based index
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
    { id: "id", label: "#", align: "left" },
    { id: "name", label: "Tên nồi", align: "center" },
    { id: "material", label: "Vật liệu", align: "center" },
    { id: "size", label: "Kích thước", align: "center" },
    { id: "imageURLs", label: "Hình ảnh", align: "center" },
    { id: "price", label: "Giá", align: "center" },
    { id: "quantity", label: "Số lượng", align: "center" },
    { id: "createdAt", label: "Ngày tạo", align: "center" },
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
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => navigate(config.adminRoutes.addHotpot)}
      >
        Tạo loại nồi mới
      </Button>
      <CTable
        data={dataCombo}
        tableHeaderTitle={tableHeader}
        title="Bảng Nổi  Lẩu"
        menuAction={
          <MenuActionTableUser
            userData={selectedData}
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

export default TableCombo;
