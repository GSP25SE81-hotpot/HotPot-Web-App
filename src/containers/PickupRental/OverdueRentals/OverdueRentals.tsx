// src/pages/OverdueRentals/OverdueRentals.tsx
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { rentalService } from "../../../api/services/pickupService";
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

// Additional styled component for overdue days
import { Box } from "@mui/material";

const OverdueRentals: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, loading, error, execute } = useApi(
    rentalService.getOverdueRentals
  );

  useEffect(() => {
    execute(page + 1, rowsPerPage);
  }, [execute, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
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

  const getSeverity = (days: number): "high" | "medium" | "low" => {
    if (days > 14) return "high";
    if (days > 7) return "medium";
    return "low";
  };

  return (
    <Box>
      {loading && <LoadingSpinner />}
      {error && <ErrorAlert message={error} />}

      {data && data.items.length === 0 ? (
        <EmptyStateContainer>
          <Typography variant="h6" fontWeight={600}>
            No overdue rentals found
          </Typography>
          <CardDescription>
            All rentals are currently on time. Check back later for any overdue
            items.
          </CardDescription>
        </EmptyStateContainer>
      ) : (
        <>
          <StyledTableContainer>
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Equipment</TableCell>
                  <TableCell>Expected Return</TableCell>
                  <TableCell>Days Overdue</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.items.map((rental) => {
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
                            {rental.equipmentType} • Qty: {rental.quantity}
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
                            label={`${daysOverdue} days`}
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
                            View
                          </AnimatedButton>
                          <AnimatedButton
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={() => handleRecordReturn(rental)}
                            sx={{ minWidth: "120px" }}
                          >
                            Record Return
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
          />
        </>
      )}
    </Box>
  );
};

export default OverdueRentals;
