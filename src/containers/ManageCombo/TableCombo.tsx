/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import CTable from "../../components/table/CTable";
import adminComboAPI from "../../api/Services/adminComboAPI";
import config from "../../configs";
import { useNavigate } from "react-router";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MenuActionTableCombo from "../../components/menuAction/menuActionTableCombo/menuActionTableCombo";

const TableCombo = () => {
  // Declare state
  const [selectedData, setSelectedData] = useState<any>();
  const [size, setSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [dataCombo, setDataCombo] = useState<any[]>([]);
  const [isCustomizable, setIsCustomizable] = useState<boolean>(true); // Default: true

  const navigate = useNavigate();

  // Select row
  const selecteData = (row: any) => {
    setSelectedData(row);
  };

  // Fetch combos
  useEffect(() => {
    const getListCombo = async () => {
      try {
        const res: any = await adminComboAPI.getListCombo({
          pageNumber: page + 1,
          pageSize: size,
          isCustomizable,
        });
        setDataCombo(res?.items || []);
        setTotal(res?.totalCount || 0);
      } catch (error: any) {
        console.error("Error fetching combos:", error?.message);
      }
    };

    getListCombo();
  }, [page, size, isCustomizable]);

  // Table headers
  const tableHeader = [
    { id: "name", label: "Tên món lẩu", align: "center" },
    { id: "imageURLs", label: "Hình ảnh", align: "center" },
    { id: "isCustomizable", label: "Tự tạo mới", align: "center" },
    { id: "appliedDiscountPercentage", label: "Giảm giá", align: "center" },
    { id: "createdAt", label: "Ngày tạo", align: "center", format: "date" },
  ];

  // Pagination
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Action buttons
  const EventAction = () => {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Lọc theo tùy chỉnh</InputLabel>
          <Select
            value={isCustomizable ? "true" : "false"}
            label="Lọc theo tùy chỉnh"
            onChange={(e: SelectChangeEvent<string>) => {
              setIsCustomizable(e.target.value === "true");
              setPage(0); // Reset page
            }}
          >
            <MenuItem value="true">Tự tạo mới</MenuItem>
            <MenuItem value="false">Không tự tạo</MenuItem>
          </Select>
        </FormControl>

        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => navigate(config.adminRoutes.createHotPotCombo)}
        >
          Tạo combo mới
        </Button>
      </Box>
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
