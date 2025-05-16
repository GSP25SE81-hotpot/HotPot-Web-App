/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import CTable from "../../components/table/CTable";
import adminIngredientsAPI from "../../api/Services/adminIngredientsAPI";
import { Ingredient } from "../../types/ingredients";
import { useNavigate } from "react-router";
import { Box, Button, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import config from "../../configs";
import MenuActionTableIngredient from "../../components/menuAction/menuActionTableIngredient/menuActionTableIngredient";
import useDebounce from "../../hooks/useDebounce";
import UpdateQuantityModal from "./Modal/ModalUpdateQuantityIngredient";
import useAuth from "../../hooks/useAuth"; // Import the useAuth hook

interface SearchToolProps {
  filter: { searchTerm: string };
  setFilter: React.Dispatch<React.SetStateAction<{ searchTerm: string }>>;
}

const SearchTool: React.FC<SearchToolProps> = ({ filter, setFilter }) => {
  return (
    <Box sx={{ p: 2 }}>
      <TextField
        fullWidth
        size="small"
        label="Tìm kiếm nguyên liệu"
        placeholder="Nhập tên nguyên liệu"
        value={filter.searchTerm}
        onChange={(e) =>
          setFilter((prev) => ({ ...prev, searchTerm: e.target.value }))
        }
      />
    </Box>
  );
};

const TableIngredients = () => {
  const { auth } = useAuth(); // Get auth context
  const userRole = auth.user?.role?.toLowerCase() || "";
  const isAdmin = userRole === "admin";
  const isManager = userRole === "manager";

  const [selectedData, setSelectedData] = useState<Ingredient | null>(null);
  const [size, setSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [dataIngredients, setDataIngredients] = useState<Ingredient[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const [filter, setFilter] = useState({ searchTerm: "" });
  const debouncedFilter = useDebounce(filter, 1000);
  const navigate = useNavigate();

  // Pagination handlers
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const selectData = (row: Ingredient) => {
    setSelectedData(row);
  };

  // Define table headers based on user role
  const getTableHeaders = () => {
    // Base headers that both admin and manager can see
    const baseHeaders = [
      { id: "name", label: "Tên nguyên liệu", align: "center" },
      { id: "imageURL", label: "Hình ảnh", align: "center" },
      { id: "ingredientTypeName", label: "Loại nguyên liệu", align: "center" },
    ];

    // Additional headers only for admin
    const adminOnlyHeaders = [
      { id: "price", label: "Giá tiền", align: "center", format: "price" },
      { id: "createdAt", label: "Ngày tạo", align: "center", format: "date" },
    ];

    return isAdmin ? [...baseHeaders, ...adminOnlyHeaders] : baseHeaders;
  };

  const tableHeader = getTableHeaders();

  // Fetch ingredient data
  const getListIngredients = async () => {
    try {
      const res: any = await adminIngredientsAPI.getListIngredients({
        pageNumber: page + 1,
        pageSize: size,
        searchTerm: debouncedFilter.searchTerm || "",
      });
      setDataIngredients(res?.data?.items || []);
      setTotal(res?.data?.totalCount || 0);
    } catch (error: any) {
      console.error("Error fetching ingredients:", error?.message);
      setDataIngredients([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    // Both admin and manager can view the ingredients list
    if (isAdmin || isManager) {
      getListIngredients();
    } else {
      // If neither admin nor manager, show empty list
      setDataIngredients([]);
      setTotal(0);
    }
  }, [page, size, debouncedFilter, isAdmin, isManager]);

  const onSave = () => {
    getListIngredients();
  };

  const EventAction = () => {
    return (
      <>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => navigate(config.adminRoutes.createIngredients)}
          sx={{ mr: 1 }}
        >
          Thêm Nguyên Liệu
        </Button>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => {
            setOpen(!open);
          }}
        >
          Cập nhật số lượng nguyên liệu
        </Button>
      </>
    );
  };

  // If user is neither admin nor manager, show access restricted message
  if (!isAdmin && !isManager) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Truy cập bị hạn chế
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bạn không có quyền xem danh sách nguyên liệu. Chỉ người dùng có vai
          trò "Quản lý" hoặc "Admin" mới có thể truy cập mục này.
        </Typography>
      </Box>
    );
  }

  const tableTitle = "Bảng nguyên liệu";

  return (
    <>
      <CTable
        data={dataIngredients}
        tableHeaderTitle={tableHeader}
        title={tableTitle}
        // Only show menu actions for admin
        menuAction={
          isAdmin ? (
            <MenuActionTableIngredient
              IngredientData={selectedData}
              onOpenDetail={selectData}
              onOpenDelete={selectData}
              onOpenUpdate={selectData}
              onFetch={onSave}
            />
          ) : null
        }
        // Only show add button for admin
        eventAction={isAdmin ? <EventAction /> : null}
        searchTool={<SearchTool filter={filter} setFilter={setFilter} />}
        selectedData={selectData}
        size={size}
        page={page}
        total={total}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />

      {open && (
        <>
          <UpdateQuantityModal
            handleClose={() => setOpen(!open)}
            open={open}
            onSave={onSave}
          />
        </>
      )}
    </>
  );
};

export default TableIngredients;
