import { useState } from "react";
import CTable from "../../components/table/CTable";
import MenuActionTableUser from "../../components/menuAction/menuActionTableUser/MenuActionTableUser";
import { Box, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";

const TableUsers = () => {
  // declare
  const [selectUserdata, setSelectedUserData] = useState<any>();

  //select data
  const selecteData = (row: any) => {
    setSelectedUserData(row);
  };

  const fieldData = [
    {
      id: 1,
      name: "andre",
      age: 8,
      address: "abc",
      phone: "0398297211",
      gender: "F",
    },
    {
      id: 2,
      name: "Dunx",
      age: 8,
      address: "abc",
      phone: "0398297211",
      gender: "F",
    },
    {
      id: 3,
      name: "Thann",
      age: 8,
      address: "abc",
      phone: "0398297211",
      gender: "F",
    },
  ];

  const tableHeader = [
    { id: "id", label: "#", align: "left" },
    { id: "name", label: "Tên", align: "center" },
    { id: "age", label: "Tuổi", align: "center" },
    { id: "address", label: "Địa chỉ", align: "center" },
    { id: "phone", label: "Điện thoại", align: "center" },
    { id: "gender", label: "Giới tính", align: "center" },
  ];

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid size={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm kiếm"
              label="Khách hàng"
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

      <CTable
        data={fieldData}
        tableHeaderTitle={tableHeader}
        title="Quản lý người dùng"
        menuAction={
          <MenuActionTableUser
            userData={selectUserdata}
            onOpenDetail={selecteData}
          />
        }
        selectedData={selecteData}
      />
    </>
  );
};

export default TableUsers;
