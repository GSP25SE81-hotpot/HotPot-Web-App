/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import CTable from "../../components/table/CTable";
import MenuActionTableBatch from "../../components/menuAction/menuActionTableBatch/menuActionTableBatch";
import adminBatchAPI from "../../api/Services/adminBatch";

// Define the Batch model interface
interface BatchModel {
  batchNumber: string;
  receivedDate: string;
  provideCompanies: string[];
}

// API returns all data without server-side pagination

const TableBatch = () => {
  // State declarations with proper typing
  const [selectedData, setSelectedData] = useState<BatchModel | null>(null);
  const [size, setSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [dataBatch, setDataBatch] = useState<BatchModel[]>([]);

  // Select data handler
  const selectData = (row: BatchModel) => {
    setSelectedData(row);
  };

  // Fetch batch data
  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        const response: any = await adminBatchAPI.GetAllBatch({});

        const items = Array.isArray(response) ? response : response?.data || [];

        setDataBatch(items);
        setTotal(items.length);
      } catch (error: any) {
        console.error("Error fetching batch data:", error?.message);
        setDataBatch([]);
        setTotal(0);
      }
    };

    fetchBatchData();
  }, []); // Remove page and size dependencies since API doesn't support pagination

  // Table headers configuration
  const tableHeader = [
    {
      id: "batchNumber",
      label: "Số lô",
      align: "left" as const,
    },
    {
      id: "receivedDate",
      label: "Ngày nhận",
      align: "center" as const,
      format: "date" as const,
    },
    {
      id: "provideCompanies",
      label: "Công ty cung cấp",
      align: "left" as const,
      format: "array" as const,
    },
  ];

  // Handle pagination change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newSize = parseInt(event.target.value, 10);
    setSize(newSize);
    setPage(0); // Reset to first page when changing page size
  };

  return (
    <>
      <CTable
        data={dataBatch}
        tableHeaderTitle={tableHeader}
        title="Bảng quản lý lô hàng"
        menuAction={
          <MenuActionTableBatch
            batchData={selectedData}
            onOpenDetail={selectData}
          />
        }
        selectedData={selectData}
        size={size}
        page={page}
        total={total}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
};

export default TableBatch;
