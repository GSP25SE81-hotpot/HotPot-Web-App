/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { DiscountType } from "../../types/discountType";
import CTable from "../../components/table/CTable";
import adminDiscountApi from "../../api/Services/adminDiscountAPI";
import MenuActionTableDiscount from "../../components/menuAction/menuDiscountActionTable/menuDiscountActionTable";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2,
  TextField,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import useDebounce from "../../hooks/useDebounce";
import CreateNewDiscount from "./Popup/CreateNewDiscount";
import DiscountDetail from "./Popup/DiscountDetail";
import UpdateDiscount from "./Popup/UpdateDiscount";
import { toast } from "react-toastify";

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
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedDiscount, setSelectedDiscount] =
    React.useState<DiscountType | null>(null);

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
    { id: "duration", label: "kết thúc", format: "dateTimeDiscount" },
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

  // Handle discount actions
  // const handleOpenDetail = (discount: DiscountType) => {
  //   setSelectedDiscount(discount);
  //   setOpenDetail(true);
  // };

  const handleOpenUpdate = (discount: DiscountType) => {
    setSelectedDiscount(discount);
    setOpenUpdate(true);
  };

  const handleOpenDelete = (discount: DiscountType) => {
    setSelectedDiscount(discount);
    setOpenDelete(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedDiscount(null);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setSelectedDiscount(null);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedDiscount(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedDiscount) {
      try {
        await adminDiscountApi.deleteDiscount(selectedDiscount.discountId);
        fetchDiscounts();
        handleCloseDelete();
        toast.success("Xóa ưu đãi thành công!");
      } catch (error: any) {
        console.error("Error deleting discount:", error);

        // Show error toast with custom message
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Có lỗi xảy ra khi xóa ưu đãi");
        }
      }
    }
  };

  return (
    <div>
      <CreateNewDiscount
        onOpen={openAddDiscount}
        onClose={handleCloseAddModel}
        fetchDiscounts={fetchDiscounts}
      />

      <DiscountDetail
        open={openDetail}
        onClose={handleCloseDetail}
        discount={selectedDiscount}
      />

      <UpdateDiscount
        open={openUpdate}
        onClose={handleCloseUpdate}
        discount={selectedDiscount}
        fetchDiscounts={fetchDiscounts}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác nhận xóa ưu đãi</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa ưu đãi "{selectedDiscount?.title}"? Hành
            động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Xác nhận xóa
          </Button>
        </DialogActions>
      </Dialog>

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
            // onOpenDetail={handleOpenDetail}
            onOpenUpdate={handleOpenUpdate}
            onOpenDelete={handleOpenDelete}
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
