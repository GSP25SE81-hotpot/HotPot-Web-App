/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from "@mui/material";
import adminMaintenanceAPI from "../../../api/Services/adminMaintenance";
import CTable from "../../../components/table/CTable";
import MenuActionTableMaintenanceDetail from "../../../components/menuAction/menuActionTableMaintenance/menuActionTableMaintenanceDetail";

interface MaintenanceProps {
  open: boolean;
  handleCloseModal: VoidFunction;
  hotpotData: any;
  onFetch?: () => void;
}

const MaintenanceHotpotTableModal: React.FC<MaintenanceProps> = ({
  open,
  handleCloseModal,
  hotpotData,
  onFetch,
}) => {
  const [data, setData] = useState<any>();
  const [dataLog, setDataLog] = useState<any[]>([]);
  const [selectedData, setSelectedData] = useState<any>();
  const [size, setSize] = useState<number>(10); // Set a default value
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);

  //select data
  const selecteData = (row: any) => {
    setSelectedData(row);
  };

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        if (!hotpotData) return;

        const resData: any =
          await adminMaintenanceAPI.getListMaintenanceOfHotpot(
            hotpotData.hotPotInventoryId
          );

        setDataLog(resData?.data?.conditionLogs || []);
        setTotal(resData?.data?.conditionLogs?.length || 0);
        setData(resData?.data);
      } catch (e) {
        console.error("Error fetching ingredients:", e);
      }
    };

    fetchMaintenance();
  }, []);

  const lastIndex = page * size + size;
  const firstIndex = lastIndex - size;
  const dataValue = dataLog?.slice(firstIndex, lastIndex);
  // Handle pagination change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const tableHeader = [
    { id: "name", label: "Tiêu đề", align: "center" },
    {
      id: "description",
      label: "Mô tả",
      align: "center",
    },
    { id: "createdAt", label: "Ngày tạo", align: "center", format: "date" },

    {
      id: "statusName",
      label: "Trạng Thái",
      align: "center",
      format: "statusHotpot",
    },
  ];
  return (
    <Box>
      <Dialog
        open={open}
        onClose={(_event, reason) => {
          if (reason === "backdropClick") return;
          handleCloseModal();
        }}
        aria-hidden={false}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Bảng bảo trì chi tiết của nồi {data?.seriesNumber}
        </DialogTitle>
        <DialogContent>
          <CTable
            data={dataValue}
            tableHeaderTitle={tableHeader}
            title="Bảng Thông Tin Bảo Trì"
            selectedData={selecteData}
            menuAction={
              <MenuActionTableMaintenanceDetail
                hotpotData={selectedData}
                onOpenDetail={selecteData}
                onFetch={onFetch}
              />
            }
            size={size}
            page={page}
            total={total}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaintenanceHotpotTableModal;
