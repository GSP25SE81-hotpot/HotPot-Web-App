import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
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
  EmptyStateContainer,
  EquipmentCell,
  EquipmentName,
  EquipmentType,
  OverdueChip,
  StatusContainer,
  StyledTable,
  StyledTableContainer,
  StyledTablePagination,
} from "../../../components/StyledComponents";
import { useApi } from "../../../hooks/useApi";
import { RentalListing } from "../../../types/rentalPickup";
import { formatDate, getDaysOverdue } from "../../../utils/formatters";
import { Box } from "@mui/material";

const OverdueRentals: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, loading, error, execute } = useApi(
    rentalService.getRentalListings
  );

  useEffect(() => {
    execute("overdue", page + 1, rowsPerPage);
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
        rentOrderId: rental.orderId,
        customerName: rental.customerName,
        equipmentName: rental.equipmentName,
        expectedReturnDate: rental.expectedReturnDate,
      },
    });
  };

  const getSeverity = (days: number): "high" | "medium" | "low" => {
    if (days > 14) return "high";
    if (days > 7) return "medium";
    return "low";
  };

  return (
    <Box>
      {loading && <LoadingSpinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && data?.items?.length === 0 ? (
        <EmptyStateContainer>
          <Typography variant="h6" fontWeight={600}>
            Không tìm thấy thuê quá hạn
          </Typography>
          <CardDescription>
            Tất cả các đơn thuê hiện đang đúng hạn. Kiểm tra lại sau để xem các
            mục quá hạn.
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
                  <TableCell>Số ngày quá hạn</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.items?.map((rental) => {
                  const daysOverdue = getDaysOverdue(rental.expectedReturnDate);
                  const severity = getSeverity(daysOverdue);
                  return (
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
                        <Typography fontWeight={500}>
                          {formatDate(rental.expectedReturnDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusContainer>
                          <OverdueChip
                            label={`${daysOverdue} ngày`}
                            severity={severity}
                            size="small"
                          />
                        </StatusContainer>
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
                  );
                })}
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

export default OverdueRentals;
