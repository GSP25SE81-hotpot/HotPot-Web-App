/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import CTable from "../../components/table/CTable";
import { useParams } from "react-router";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid2,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import adminHotpot from "../../api/Services/adminHotpot";
import MenuActionTableHotpotDetail from "../../components/menuAction/menuActionTableHotpotDetail/menuActionTableHotpotDetail";
import ProductEditPopup from "./Modal/ModalAddNewHotpot";

const TableHotpotDetail = () => {
  // declare
  const { hotpotId } = useParams<{ hotpotId: string }>();
  const [selectedData, setSelectedData] = useState<any>();
  const [size, setSize] = useState<number>(10); // Set a default value
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [dataHotpotDetailType, SetDataHotpotDetailType] = useState<any[]>([]);
  const [dataHotpot, SetDataHotpot] = useState<any>();
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);

  //select data
  const selecteData = (row: any) => {
    setSelectedData(row);
  };

  const getListHotpotDetailType = async () => {
    try {
      const res: any = await adminHotpot.getListHotpotDetail(hotpotId);

      SetDataHotpotDetailType(res?.data?.inventoryItems || []);
      SetDataHotpot(res.data);
      setTotal(res?.data?.inventoryItems?.length || 0);
      // setTotal(res?.totalCount || 0);
    } catch (error: any) {
      console.error("Error fetching ingredients:", error);
    }
  };

  const handleFetch = () => {
    getListHotpotDetailType();
  };
  // Fetch ingredients data with pagination
  useEffect(() => {
    getListHotpotDetailType();
  }, []);

  const tableHeader = [
    { id: "seriesNumber", label: "Vật liệu", align: "center" },
    {
      id: "status",
      label: "Tình trạng",
      align: "center",
      format: "statusDetailHopot",
    },
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

  const lastIndexValue = page * size + size;
  const indexFirstValue = lastIndexValue - size;
  const currentData = dataHotpotDetailType?.slice(
    indexFirstValue,
    lastIndexValue
  );

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => {
          setOpenUpdate(true);
        }}
      >
        Tạo loại nồi mới
      </Button>
      <Grid2 container justifyContent="center" sx={{ mt: 4 }}>
        <Card
          sx={{
            width: "80%",
            maxWidth: 900,
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Grid2 container spacing={2}>
            <Grid2 size={{ mobile: 12, desktop: 5 }}>
              <CardMedia
                component="img"
                height="100%"
                image={
                  dataHotpot?.imageURLs?.length > 0
                    ? dataHotpot?.imageURLs[0]
                    : ""
                }
                alt={dataHotpot?.name}
                sx={{ objectFit: "cover", borderRadius: 2 }}
              />
            </Grid2>
            <Grid2
              size={{ mobile: 12, desktop: 7 }}
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <CardContent>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {dataHotpot?.name}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {dataHotpot?.description}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 18, mb: 2 }}>
                  <strong>Chất liệu:</strong> {dataHotpot?.material} |{" "}
                  <strong>Kích thước:</strong> {dataHotpot?.size}
                </Typography>
                <Typography
                  variant="h5"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                >
                  Giá: {dataHotpot?.price?.toLocaleString()} VND
                </Typography>
                <Typography
                  variant="h5"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                >
                  Giá nhập: {dataHotpot?.basePrice?.toLocaleString()} VND
                </Typography>
              </CardContent>
            </Grid2>
          </Grid2>
        </Card>
      </Grid2>
      <CTable
        data={currentData}
        tableHeaderTitle={tableHeader}
        title="Bảng Chi Tiết Nổi Lẩu"
        menuAction={
          <MenuActionTableHotpotDetail
            hotpotData={selectedData}
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

      {openUpdate && (
        <ProductEditPopup
          handleClose={() => setOpenUpdate(false)}
          handleOpen={openUpdate}
          productData={dataHotpot}
          onSave={handleFetch}
        />
      )}
    </>
  );
};

export default TableHotpotDetail;
