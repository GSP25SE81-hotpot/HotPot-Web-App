// src/components/replacement/ReplacementList.tsx
import { Chip, TableBody, TableCell, TableRow } from "@mui/material";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import staffReplacementService from "../../../api/Services/staffReplacementService";
import ErrorAlert from "../../../components/errorAlert/ErrorAlert";
import LoadingSpinner from "../../../components/loadingSpinner/LoadingSpinner";
import {
  ActionButton,
  DataRow,
  EmptyMessage,
  HeaderCell,
  ListContainer,
  StyledTable,
  TableHeader,
  TableWrapper,
} from "../../../components/staff/styles/replacementListStyles";
import {
  EquipmentType,
  ReplacementRequestStatus,
  ReplacementRequestSummaryDto,
} from "../../../types/pickupReplacement";

// Vietnamese translations for status text
const getStatusTextVietnamese = (status: ReplacementRequestStatus): string => {
  switch (status) {
    case ReplacementRequestStatus.Pending:
      return "Đang Chờ";
    case ReplacementRequestStatus.Approved:
      return "Đã Duyệt";
    case ReplacementRequestStatus.Rejected:
      return "Từ Chối";
    case ReplacementRequestStatus.InProgress:
      return "Đang Xử Lý";
    case ReplacementRequestStatus.Completed:
      return "Hoàn Thành";
    case ReplacementRequestStatus.Cancelled:
      return "Đã Hủy";
    default:
      return "Không Xác Định";
  }
};

// Vietnamese translations for equipment type
const getEquipmentTypeVietnamese = (type: EquipmentType): string => {
  switch (type) {
    case EquipmentType.HotPot:
      return "Nồi Lẩu";
    case EquipmentType.Utensil:
      return "Dụng Cụ";
    default:
      return "Không Xác Định";
  }
};

const getStatusColor = (status: ReplacementRequestStatus) => {
  switch (status) {
    case ReplacementRequestStatus.Pending:
      return "warning";
    case ReplacementRequestStatus.Approved:
      return "info";
    case ReplacementRequestStatus.Rejected:
      return "error";
    case ReplacementRequestStatus.InProgress:
      return "primary";
    case ReplacementRequestStatus.Completed:
      return "success";
    case ReplacementRequestStatus.Cancelled:
      return "default";
    default:
      return "default";
  }
};

const ReplacementList: React.FC = () => {
  const [replacements, setReplacements] = useState<
    ReplacementRequestSummaryDto[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReplacements = async () => {
      try {
        setLoading(true);
        const response =
          await staffReplacementService.getAssignedReplacements();
        if (response.success && response.data) {
          setReplacements(response.data);
        } else {
          setError(
            response.message || "Không thể tải danh sách yêu cầu thay thế"
          );
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchReplacements();
  }, []);

  const handleViewDetails = (id: number) => {
    navigate(`/replacements/${id}`);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <ListContainer>
      {replacements.length === 0 ? (
        <EmptyMessage variant="body1">
          Không có yêu cầu thay thế nào được giao cho bạn.
        </EmptyMessage>
      ) : (
        <TableWrapper>
          <StyledTable>
            <TableHeader>
              <TableRow>
                <HeaderCell>ID</HeaderCell>
                <HeaderCell>Thiết Bị</HeaderCell>
                <HeaderCell>Loại</HeaderCell>
                <HeaderCell>Khách Hàng</HeaderCell>
                <HeaderCell>Ngày Yêu Cầu</HeaderCell>
                <HeaderCell>Trạng Thái</HeaderCell>
                <HeaderCell>Thao Tác</HeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {replacements.map((replacement) => (
                <DataRow key={replacement.replacementRequestId}>
                  <TableCell>{replacement.replacementRequestId}</TableCell>
                  <TableCell>{replacement.equipmentName}</TableCell>
                  <TableCell>
                    {getEquipmentTypeVietnamese(replacement.equipmentType)}
                  </TableCell>
                  <TableCell>{replacement.customerName}</TableCell>
                  <TableCell>
                    {format(new Date(replacement.requestDate), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusTextVietnamese(replacement.status)}
                      color={getStatusColor(replacement.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <ActionButton
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        handleViewDetails(replacement.replacementRequestId)
                      }
                    >
                      Xem Chi Tiết
                    </ActionButton>
                  </TableCell>
                </DataRow>
              ))}
            </TableBody>
          </StyledTable>
        </TableWrapper>
      )}
    </ListContainer>
  );
};

export default ReplacementList;
