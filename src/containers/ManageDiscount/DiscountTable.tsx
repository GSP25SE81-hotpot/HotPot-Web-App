import React from "react";
import { DiscountType } from "../../types/discountType";
import CTable from "../../components/table/CTable";
import adminDiscountApi from "../../api/Services/adminDiscountAPI";
import MenuActionTableDiscount from "../../components/menuAction/menuDiscountActionTable/menuDiscountActionTable";
import { Box, Button, Grid2, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import useDebounce from "../../hooks/useDebounce";
import CreateNewDiscount from "./Popup/CreateNewDiscount";

interface searchToolInterface {
  filter: any;
  setFilter: any;
}

const SearchTool: React.FC<searchToolInterface> = ({ setFilter, filter }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Grid2 container spacing={2}>
        <Grid2 size={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm kiếm"
            label="Tìm kiếm"
            onChange={(e) =>
              setFilter({ ...filter, searchTerm: e.target.value })
            }
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};

const DiscountTable = () => {
  //define useState
  const [discounts, setDiscounts] = React.useState<DiscountType[]>([]);
  const [selectedData, setSelectedData] = React.useState<DiscountType[]>([]);
  const [openAddDiscount, setOpenAddDiscount] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [size, setSize] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [filter, setFilter] = React.useState({
    searchTerm: "",
  });
  const deBouceValue = useDebounce(filter, 500);

  //select data
  const selecteData = (row: any) => {
    setSelectedData(row);
  };

  //Table header
  const tableHeader = [
    { id: "title", label: "Tên" },
    { id: "pointCost", label: "Điểm mua ưu đãi" },
    { id: "discountPercentage", label: "Tỷ lệ giảm(%)" },
    { id: "date", label: "Hiệu lực", format: "date" },
    { id: "duration", label: "kết thúc", format: "date" },
    { id: "isActive", label: "Trạng thái", format: "statusDiscount" },
  ];

  //Handle open add model
  const handleOpenAddModel = () => {
    setOpenAddDiscount(true);
  };
  const handleCloseAddModel = () => {
    setOpenAddDiscount(false);
  };

  //Event action
  const EventAction = () => {
    return (
      <Box>
        <Button
          color="primary"
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenAddModel()}
        >
          Tạo
        </Button>
      </Box>
    );
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

  const fetchDiscounts = async () => {
    try {
      const res = await adminDiscountApi.getDiscounts({
        ...filter,
        pageNumber: page + 1,
        pageSize: size,
      });
      setDiscounts(res?.data?.items);
      setTotal(res?.data?.totalCount);
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  React.useEffect(() => {
    fetchDiscounts();
  }, [deBouceValue, page, size]);

  return (
    <div>
      <CreateNewDiscount
        onOpen={openAddDiscount}
        onClose={handleCloseAddModel}
        fetchDiscounts={fetchDiscounts}
      />
      <CTable
        data={discounts}
        tableHeaderTitle={tableHeader}
        title="Quản lý khuyến mãi cho khách hàng"
        eventAction={<EventAction />}
        searchTool={<SearchTool setFilter={setFilter} filter={filter} />}
        menuAction={
          <MenuActionTableDiscount
            discountData={selectedData}
            fetchData={fetchDiscounts}
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
    </div>
  );
};

export default DiscountTable;
