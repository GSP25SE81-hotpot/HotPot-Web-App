import { useEffect, useState } from "react";
import CTable from "../../components/table/CTable";
import MenuActionTableUser from "../../components/menuAction/menuActionTableUser/MenuActionTableUser";
import adminIngredientsAPI from "../../api/Services/adminIngredientsAPI";
import { Ingredient } from "../../types/ingredients";
import { useNavigate } from "react-router";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import config from "../../configs";

const TableIngredients = () => {
  // State variables
  const [selectedData, setSelectedData] = useState<Ingredient | null>(null);
  const [size, setSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [dataIngredients, setDataIngredients] = useState<Ingredient[]>([]);

  const navigate = useNavigate();

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

  // Select data row
  const selectData = (row: Ingredient) => {
    setSelectedData(row);
  };

  // Table headers
  const tableHeader = [
    { id: "ingredientId", label: "#", align: "left" },
    { id: "name", label: "Tên nguyên liệu", align: "center" },
    { id: "imageURL", label: "Hình ảnh", align: "center" },
    { id: "ingredientTypeName", label: "Loại nguyên liệu", align: "center" },
    { id: "price", label: "Giá tiền", align: "center" },
    { id: "createdAt", label: "Ngày tạo", align: "center" },
  ];

  // Fetch ingredients data with pagination
  useEffect(() => {
    const getListIngredients = async () => {
      try {
        const res: any = await adminIngredientsAPI.getListIngredients({
          pageNumber: page + 1,
          size: size,
        });
        setDataIngredients(res?.data?.items || []);
        setTotal(res?.data?.totalCount || 0);
      } catch (error: any) {
        console.error("Error fetching ingredients:", error?.message);
      }
    };

    getListIngredients();
  }, [page, size]);

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => navigate(config.adminRoutes.createIngredients)}
      >
        Thêm Nguyên Liệu
      </Button>
      <CTable
        data={dataIngredients}
        tableHeaderTitle={tableHeader}
        title="Bảng nguyên liệu"
        menuAction={
          <MenuActionTableUser
            userData={selectedData}
            onOpenDetail={selectData}
          />
        }
        selectedData={selectData}
        size={size}
        page={page}
        total={total}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
};

export default TableIngredients;
