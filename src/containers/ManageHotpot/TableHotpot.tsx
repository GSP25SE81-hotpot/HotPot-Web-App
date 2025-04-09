/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import CTable from "../../components/table/CTable";
import config from "../../configs";
import { useNavigate } from "react-router";
import { Box, Button, Stack, styled } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ConstructionIcon from "@mui/icons-material/Construction";
import adminHotpot from "../../api/Services/adminHotpot";
import MenuActionTableHotpot from "../../components/menuAction/menuActionTableHotpot/menuActionTableHotpot";
import Badge, { badgeClasses } from "@mui/material/Badge";

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -4px;
    right: -6px;
  }
`;

const TableHotpot = () => {
  // declare
  const [selectedData, setSelectedData] = useState<any>();
  const [size, setSize] = useState<number>(10); // Set a default value
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [dataCombo, setDataCombo] = useState<any[]>([]);
  const [damageDevice, setDamagedevice] = useState<any>();

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

        setDamagedevice(res?.damageDeviceCount);

        setTotal(res?.totalCount || 0);
      } catch (error: any) {
        console.error("Error fetching ingredients:", error?.message);
      }
    };

    getListCombo();
  }, [page, size]);

  const tableHeader = [
    { id: "name", label: "Tên nồi", align: "center" },
    { id: "material", label: "Vật liệu", align: "center" },
    { id: "size", label: "Kích thước", align: "center" },
    { id: "imageURLs", label: "Hình ảnh", align: "center" },
    { id: "price", label: "Giá", align: "center", format: "price" },
    { id: "quantity", label: "Số lượng", align: "center" },
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
      <Box>
        <Stack display="flex" flexDirection="row">
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => navigate(config.adminRoutes.addHotpot)}
            sx={{ mr: 2 }}
          >
            Tạo loại nồi mới
          </Button>
          <Button
            startIcon={<ConstructionIcon />}
            variant="contained"
            onClick={() => navigate(config.adminRoutes.MaintenanceHotpot)}
            sx={{
              background: "linear-gradient(135deg, #007bff 30%, #0056b3 90%)",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                background: "linear-gradient(135deg, #0056b3 30%, #003f7f 90%)",
                transform: "scale(1.05)",
                boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            Nồi cần bảo trì
          </Button>
          <CartBadge
            badgeContent={damageDevice ?? 0}
            color="error"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "14px",
                fontWeight: "bold",
                animation: "bounce 1.2s infinite",
              },
              "@keyframes bounce": {
                "0%, 100%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.2)" },
              },
            }}
          />
        </Stack>
      </Box>
    );
  };

  return (
    <>
      <CTable
        data={dataCombo}
        tableHeaderTitle={tableHeader}
        title="Bảng Nổi  Lẩu"
        menuAction={
          <MenuActionTableHotpot
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

export default TableHotpot;
