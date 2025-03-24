import { useEffect, useState } from "react";
import CTable from "../../components/table/CTable";
import MenuActionTableUser from "../../components/menuAction/menuActionTableUser/MenuActionTableUser";
import { Box, Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { UserInterface } from "../../types/user";
import adminUserManagementAPI from "../../api/adminUserManagementAPI";
import useDebounce from "../../hooks/useDebounce";
import AddIcon from "@mui/icons-material/Add";
import AddNewUser from "./Popup/AddNewUser";

interface searchToolInterface {
  filter: any;
  setFilter: any;
}

const SearchTool: React.FC<searchToolInterface> = ({ setFilter, filter }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid size={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm kiếm"
            label="Khách hàng"
            onChange={(e) =>
              setFilter({ ...filter, searchTerm: e.target.value })
            }
          />
        </Grid>
        <Grid size={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="VD: 0378817281"
            label="Điện thoại"
          />
        </Grid>
        <Grid size={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="12D/23 PVH, Q12"
            label="Địa chỉ"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

const TableUsers = () => {
  // declare
  const [usersData, setUsersData] = useState<UserInterface[]>([]);
  const [selectUserdata, setSelectedUserData] = useState<any>();
  const [openAddUser, setOpenAddUser] = useState<boolean>(false);
  // const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFilter] = useState({ searchTerm: "" });

  const deBouceValue = useDebounce(filter, 1000);
  const [size, setSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(10);
  const [page, setPage] = useState<number>(0);

  //select data
  const selecteData = (row: any) => {
    setSelectedUserData(row);
  };

  //Handle pagination
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
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
  const getUserList = async () => {
    try {
      const res: any = await adminUserManagementAPI.getListUser({
        ...filter,
      });
      setUsersData(res?.data?.items);
      console.log("data users: ", res?.data?.items);
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  useEffect(() => {
    getUserList();
  }, [deBouceValue]);

  //Handle open add model
  const handleOpenAddModel = () => {
    setOpenAddUser(true);
  };
  const handleCloseAddModel = () => {
    setOpenAddUser(false);
  };

  const tableHeader = [
    { id: "name", label: "Tên", align: "center" },
    { id: "email", label: "Email", align: "center" },
    { id: "address", label: "Địa chỉ", align: "center" },
    { id: "phoneNumber", label: "Điện thoại", align: "center" },
    { id: "roleName", label: "Chức vụ", align: "center", format: "role" },
  ];

  const EventAction = () => {
    return (
      <Box>
        <Button
          color="primary"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenAddModel()}
        >
          Tạo
        </Button>
      </Box>
    );
  };

  return (
    <>
      <AddNewUser onOpen={openAddUser} onClose={handleCloseAddModel} />
      <CTable
        data={usersData}
        tableHeaderTitle={tableHeader}
        title="Quản lý người dùng"
        eventAction={<EventAction />}
        searchTool={<SearchTool setFilter={setFilter} filter={filter} />}
        menuAction={
          <MenuActionTableUser
            userData={selectUserdata}
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

export default TableUsers;
