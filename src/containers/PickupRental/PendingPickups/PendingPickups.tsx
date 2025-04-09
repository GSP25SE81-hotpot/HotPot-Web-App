// src/pages/PendingPickups/PendingPickups.tsx
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { rentalService } from "../../../api/Services/pickupService";
import ErrorAlert from "../../../components/errorAlert/ErrorAlert";
import LoadingSpinner from "../../../components/loadingSpinner/LoadingSpinner";
import {
  ActionButtonsContainer,
  AnimatedButton,
  CardDescription,
  CustomerCell,
  CustomerName,
  CustomerPhone,
  DateCell,
  EmptyStateContainer,
  EquipmentCell,
  EquipmentName,
  EquipmentType,
  PriceCell,
  StyledTable,
  StyledTableContainer,
  StyledTablePagination,
} from "../../../components/StyledComponents";
import { useApi } from "../../../hooks/useApi";
import { RentalListing } from "../../../types/rentalPickup";
import { formatCurrency, formatDate } from "../../../utils/formatters";

const PendingPickups: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data, loading, error, execute } = useApi(
    rentalService.getPendingPickups
  );

  useEffect(() => {
    execute(page + 1, rowsPerPage);
  }, [execute, page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetail = (id: number) => {
    navigate(`/rentals/${id}`);
  };

  const handleRecordReturn = (rental: RentalListing) => {
    navigate("/rentals/record-return", {
      state: {
        rentOrderDetailId: rental.rentOrderDetailId,
        customerName: rental.customerName,
        equipmentName: rental.equipmentName,
        expectedReturnDate: rental.expectedReturnDate,
      },
    });
  };

  return (
    <Box>
      {loading && <LoadingSpinner />}
      {error && <ErrorAlert message={error} />}
      {data && data.items.length === 0 ? (
        <EmptyStateContainer>
          <Typography variant="h6" fontWeight={600}>
            Không tìm thấy lấy hàng đang chờ xử lý
          </Typography>
          <CardDescription>
            Không có đơn thuê nào cần lấy hàng hôm nay. Kiểm tra lại sau để xem
            các lần trả sắp tới.
          </CardDescription>
        </EmptyStateContainer>
      ) : (
        <>
          <StyledTableContainer>
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell>Mã đơn hàng</TableCell>
                  <TableCell>Khách hàng</TableCell>
                  <TableCell>Thiết bị</TableCell>
                  <TableCell>Ngày trả dự kiến</TableCell>
                  <TableCell>Giá thuê</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.items.map((rental) => (
                  <TableRow key={rental.rentOrderDetailId}>
                    <TableCell>#{rental.orderId}</TableCell>
                    <TableCell>
                      <CustomerCell>
                        <CustomerName>{rental.customerName}</CustomerName>
                        <CustomerPhone>{rental.customerPhone}</CustomerPhone>
                      </CustomerCell>
                    </TableCell>
                    <TableCell>
                      <EquipmentCell>
                        <EquipmentName>{rental.equipmentName}</EquipmentName>
                        <EquipmentType>
                          {rental.equipmentType} • SL: {rental.quantity}
                        </EquipmentType>
                      </EquipmentCell>
                    </TableCell>
                    <TableCell>
                      <DateCell>
                        {formatDate(rental.expectedReturnDate)}
                      </DateCell>
                    </TableCell>
                    <TableCell>
                      <PriceCell>
                        {formatCurrency(rental.rentalPrice)}
                      </PriceCell>
                    </TableCell>
                    <TableCell>
                      <ActionButtonsContainer>
                        <AnimatedButton
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            handleViewDetail(rental.rentOrderDetailId)
                          }
                          sx={{ minWidth: "80px" }}
                        >
                          Xem
                        </AnimatedButton>
                        <AnimatedButton
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() => handleRecordReturn(rental)}
                          sx={{ minWidth: "120px" }}
                        >
                          Ghi nhận trả
                        </AnimatedButton>
                      </ActionButtonsContainer>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </StyledTable>
          </StyledTableContainer>
          <StyledTablePagination
            rowsPerPageOptions={[5, 10, 25]}
            count={data?.totalCount || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} của ${count}`
            }
          />
        </>
      )}
    </Box>
  );
};

export default PendingPickups;
