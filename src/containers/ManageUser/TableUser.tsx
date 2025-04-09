import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import adminUserManagementAPI from "../../api/adminUserManagementAPI";
import MenuActionTableUser from "../../components/menuAction/menuActionTableUser/MenuActionTableUser";
import CTable from "../../components/table/CTable";
import useDebounce from "../../hooks/useDebounce";
import { Role } from "../../routes/Roles";
import { UserInterface } from "../../types/user";
import AddNewUser from "./Popup/AddNewUser";

interface searchToolInterface {
  filter: any;
  setFilter: any;
  roleArray?: any;
}

const SearchTool: React.FC<searchToolInterface> = ({
  setFilter,
  filter,
  roleArray,
}) => {
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
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label" size="small">
              Chức vụ
            </InputLabel>
            <Select
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Chức vụ"
              onChange={(e) =>
                setFilter({ ...filter, roleName: e.target.value })
              }
            >
              {roleArray?.map((item: any) => (
                <MenuItem key={item.id} value={item.role}>
                  {item.subName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
  const [filter, setFilter] = useState({ searchTerm: "", roleName: "" });

  const deBouceValue = useDebounce(filter, 1000);
  const [size, setSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(10);
  const [page, setPage] = useState<number>(0);

  const roleList = [
    { id: 1, role: Role.Customer, subName: "Khách hàng" },
    { id: 2, role: Role.Admin, subName: "Quản trị viên" },
    { id: 3, role: Role.Manager, subName: "Quản lý" },
    { id: 4, role: Role.Staff, subName: "Nhân viên" },
  ];

  //select data
  const selecteData = (row: any) => {
    setSelectedUserData(row);
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
        searchTool={
          <SearchTool
            setFilter={setFilter}
            filter={filter}
            roleArray={roleList}
          />
        }
        menuAction={
          <MenuActionTableUser
            userData={selectUserdata}
            fetchData={getUserList}
            onOpenDetail={selecteData}
            onOpenUpdate={selecteData}
            onOpenDelete={selecteData}
            onOpenAssign={selecteData}
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
