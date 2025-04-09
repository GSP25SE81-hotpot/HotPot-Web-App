import {
  Box,
  FormControlLabel,
  Switch,
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
  AssignmentChip,
  CardDescription,
  CustomerCell,
  CustomerName,
  CustomerPhone,
  EmptyStateContainer,
  FilterContainer,
  StatusContainer,
  StyledTable,
  StyledTableContainer,
} from "../../../components/StyledComponents";
import { useApi } from "../../../hooks/useApi";
import { StaffPickupAssignment } from "../../../types/rentalPickup";
import { formatDate } from "../../../utils/formatters";

const MyAssignments: React.FC = () => {
  const navigate = useNavigate();
  const [pendingOnly, setPendingOnly] = useState(false);
  const { data, loading, error, execute } = useApi(
    rentalService.getMyAssignments
  );

  useEffect(() => {
    execute(pendingOnly);
  }, [execute, pendingOnly]);

  const handleTogglePending = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPendingOnly(event.target.checked);
  };

  const handleViewDetail = (id: number) => {
    navigate(`/rentals/${id}`);
  };

  const handleRecordReturn = (assignment: StaffPickupAssignment) => {
    navigate("/rentals/record-return", {
      state: {
        assignmentId: assignment.assignmentId,
        rentOrderDetailId: assignment.rentOrderDetailId,
        customerName: assignment.customerName,
        equipmentName: assignment.equipmentName,
        expectedReturnDate: assignment.expectedReturnDate,
      },
    });
  };

  // Kiểm tra xem data và data.data có tồn tại trước khi truy cập length
  const assignments = data?.data || [];
  const hasAssignments = assignments.length > 0;

  return (
    <Box>
      <FilterContainer>
        <FormControlLabel
          control={
            <Switch
              checked={pendingOnly}
              onChange={handleTogglePending}
              color="primary"
            />
          }
          label="Chỉ hiển thị lấy hàng đang chờ xử lý"
        />
      </FilterContainer>

      {loading && <LoadingSpinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && (
        <>
          {!hasAssignments ? (
            <EmptyStateContainer>
              <Typography variant="h6" fontWeight={600}>
                Không tìm thấy nhiệm vụ nào
              </Typography>
              <CardDescription>
                {pendingOnly
                  ? "Bạn không có nhiệm vụ lấy hàng đang chờ xử lý nào được giao."
                  : "Bạn chưa có nhiệm vụ nào."}
              </CardDescription>
              <AnimatedButton
                variant="outlined"
                color="primary"
                onClick={() => setPendingOnly(!pendingOnly)}
              >
                {pendingOnly ? "Xem tất cả nhiệm vụ" : "Chỉ xem đang chờ xử lý"}
              </AnimatedButton>
            </EmptyStateContainer>
          ) : (
            <StyledTableContainer>
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell>Mã nhiệm vụ</TableCell>
                    <TableCell>Khách hàng</TableCell>
                    <TableCell>Thiết bị</TableCell>
                    <TableCell>Ngày trả dự kiến</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.assignmentId}>
                      <TableCell>#{assignment.assignmentId}</TableCell>
                      <TableCell>
                        <CustomerCell>
                          <CustomerName>{assignment.customerName}</CustomerName>
                          <CustomerPhone>
                            {assignment.customerPhone}
                          </CustomerPhone>
                        </CustomerCell>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={500}>
                          {assignment.equipmentName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Số lượng: {assignment.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={500}>
                          {formatDate(assignment.expectedReturnDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusContainer>
                          <AssignmentChip
                            label={
                              assignment.completedDate
                                ? "Hoàn thành"
                                : "Đang chờ"
                            }
                            status={
                              assignment.completedDate ? "completed" : "pending"
                            }
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
                              handleViewDetail(assignment.rentOrderDetailId)
                            }
                            sx={{ minWidth: "80px" }}
                          >
                            Xem
                          </AnimatedButton>
                          {!assignment.completedDate && (
                            <AnimatedButton
                              variant="contained"
                              size="small"
                              color="primary"
                              onClick={() => handleRecordReturn(assignment)}
                              sx={{ minWidth: "120px" }}
                            >
                              Ghi nhận trả
                            </AnimatedButton>
                          )}
                        </ActionButtonsContainer>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </StyledTable>
            </StyledTableContainer>
          )}
        </>
      )}
    </Box>
  );
};

export default MyAssignments;
