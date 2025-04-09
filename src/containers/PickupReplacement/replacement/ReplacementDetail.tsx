// src/components/replacement/ReplacementDetail.tsx
import {
  Button,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import staffReplacementService from "../../../api/Services/staffReplacementService";
import ErrorAlert from "../../../components/errorAlert/ErrorAlert";
import LoadingSpinner from "../../../components/loadingSpinner/LoadingSpinner";
import {
  ActionContainer,
  BackButton,
  DetailCard,
  DetailContainer,
  DetailPaper,
  FormContainer,
  HeaderContainer,
} from "../../../components/staff/styles/replacementDetailStyles";
import {
  EquipmentType,
  ReplacementRequestDetailDto,
  ReplacementRequestStatus,
} from "../../../types/pickupReplacement";
import CompleteReplacementForm from "./CompleteReplacementForm";
import UpdateStatusForm from "./UpdateStatusForm";
import VerifyEquipmentForm from "./VerifyEquipmentForm";

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

const ReplacementDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [replacement, setReplacement] =
    useState<ReplacementRequestDetailDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [showCompleteForm, setShowCompleteForm] = useState<boolean>(false);
  const [showVerifyForm, setShowVerifyForm] = useState<boolean>(false);

  useEffect(() => {
    const fetchReplacementDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response =
          await staffReplacementService.getReplacementRequestById(parseInt(id));
        if (response.success && response.data) {
          setReplacement(response.data);
        } else {
          setError(
            response.message || "Không thể tải thông tin yêu cầu thay thế"
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
    fetchReplacementDetail();
  }, [id]);

  const handleUpdateStatus = async (
    updatedReplacement: ReplacementRequestDetailDto
  ) => {
    setReplacement(updatedReplacement);
    setShowUpdateForm(false);
  };

  const handleCompleteReplacement = async (
    updatedReplacement: ReplacementRequestDetailDto
  ) => {
    console.log(
      "Nhận thông tin cập nhật sau khi hoàn thành:",
      updatedReplacement
    );
    console.log("Trạng thái trước khi cập nhật:", replacement?.status);
    console.log("Trạng thái mới:", updatedReplacement.status);

    // Ensure the status is Completed
    if (updatedReplacement.status !== ReplacementRequestStatus.Completed) {
      console.warn("Đang chuyển trạng thái sang Hoàn Thành");
      updatedReplacement.status = ReplacementRequestStatus.Completed;
    }

    setReplacement(updatedReplacement);
    setShowCompleteForm(false);
  };

  const handleVerifyEquipment = async (
    updatedReplacement: ReplacementRequestDetailDto
  ) => {
    console.log(
      "Nhận thông tin cập nhật sau khi xác minh:",
      updatedReplacement
    );
    setReplacement(updatedReplacement);
    setShowVerifyForm(false);
  };

  const handleBack = () => {
    navigate("/pickup-replacement");
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!replacement)
    return <ErrorAlert message="Không tìm thấy yêu cầu thay thế" />;

  // Determine which actions are available based on the current status
  const canUpdateStatus =
    replacement.status === ReplacementRequestStatus.Approved ||
    replacement.status === ReplacementRequestStatus.InProgress;

  const canComplete =
    replacement.status === ReplacementRequestStatus.InProgress;

  const canVerify =
    replacement.status === ReplacementRequestStatus.Pending ||
    replacement.status === ReplacementRequestStatus.Approved;

  return (
    <DetailContainer>
      <BackButton variant="outlined" onClick={handleBack}>
        Quay Lại Danh Sách
      </BackButton>

      <DetailPaper>
        <HeaderContainer>
          <Typography variant="h5" component="h1">
            Yêu Cầu Thay Thế #{replacement.replacementRequestId}
          </Typography>
          <Chip
            label={getStatusTextVietnamese(replacement.status)}
            color={getStatusColor(replacement.status)}
          />
        </HeaderContainer>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <DetailCard variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thông Tin Thiết Bị
                </Typography>
                <Typography variant="body1">
                  <strong>Tên:</strong> {replacement.equipmentName}
                </Typography>
                <Typography variant="body1">
                  <strong>Loại:</strong>{" "}
                  {getEquipmentTypeVietnamese(replacement.equipmentType)}
                </Typography>
                {replacement.equipmentType === EquipmentType.HotPot && (
                  <>
                    <Typography variant="body1">
                      <strong>Số Sê-ri:</strong>{" "}
                      {replacement.hotPotSeriesNumber || "N/A"}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Tên Nồi Lẩu:</strong>{" "}
                      {replacement.hotPotName || "N/A"}
                    </Typography>
                  </>
                )}
                {replacement.equipmentType === EquipmentType.Utensil && (
                  <>
                    <Typography variant="body1">
                      <strong>Tên Dụng Cụ:</strong>{" "}
                      {replacement.utensilName || "N/A"}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Loại Dụng Cụ:</strong>{" "}
                      {replacement.utensilType || "N/A"}
                    </Typography>
                  </>
                )}
              </CardContent>
            </DetailCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <DetailCard variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thông Tin Khách Hàng
                </Typography>
                <Typography variant="body1">
                  <strong>Tên:</strong> {replacement.customerName}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {replacement.customerEmail}
                </Typography>
                <Typography variant="body1">
                  <strong>Điện Thoại:</strong> {replacement.customerPhone}
                </Typography>
              </CardContent>
            </DetailCard>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <DetailCard variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Chi Tiết Yêu Cầu
                </Typography>
                <Typography variant="body1">
                  <strong>Lý Do:</strong> {replacement.requestReason}
                </Typography>
                <Typography variant="body1">
                  <strong>Ghi Chú Bổ Sung:</strong>{" "}
                  {replacement.additionalNotes || "Không có"}
                </Typography>
                <Typography variant="body1">
                  <strong>Ngày Yêu Cầu:</strong>{" "}
                  {format(new Date(replacement.requestDate), "dd/MM/yyyy")}
                </Typography>
                {replacement.reviewDate && (
                  <>
                    <Typography variant="body1">
                      <strong>Ngày Xem Xét:</strong>{" "}
                      {format(new Date(replacement.reviewDate), "dd/MM/yyyy")}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Ghi Chú Xem Xét:</strong>{" "}
                      {replacement.reviewNotes || "Không có"}
                    </Typography>
                  </>
                )}
                {replacement.completionDate && (
                  <Typography variant="body1">
                    <strong>Ngày Hoàn Thành:</strong>{" "}
                    {format(new Date(replacement.completionDate), "dd/MM/yyyy")}
                  </Typography>
                )}
              </CardContent>
            </DetailCard>
          </Grid>
        </Grid>

        <ActionContainer>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            {canVerify && (
              <Button
                variant="contained"
                color="info"
                onClick={() => setShowVerifyForm(true)}
                disabled={showVerifyForm}
              >
                Xác Minh Thiết Bị
              </Button>
            )}
            {canUpdateStatus && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowUpdateForm(true)}
                disabled={showUpdateForm}
              >
                Cập Nhật Trạng Thái
              </Button>
            )}
            {canComplete && (
              <Button
                variant="contained"
                color="success"
                onClick={() => setShowCompleteForm(true)}
                disabled={showCompleteForm}
              >
                Đánh Dấu Hoàn Thành
              </Button>
            )}
          </Stack>
        </ActionContainer>

        {showUpdateForm && (
          <FormContainer>
            <UpdateStatusForm
              replacementId={replacement.replacementRequestId}
              currentStatus={replacement.status}
              onSuccess={handleUpdateStatus}
              onCancel={() => setShowUpdateForm(false)}
            />
          </FormContainer>
        )}

        {showCompleteForm && (
          <FormContainer>
            <CompleteReplacementForm
              replacementId={replacement.replacementRequestId}
              onSuccess={handleCompleteReplacement}
              onCancel={() => setShowCompleteForm(false)}
            />
          </FormContainer>
        )}

        {showVerifyForm && (
          <FormContainer>
            <VerifyEquipmentForm
              replacementId={replacement.replacementRequestId}
              onSuccess={handleVerifyEquipment}
              onCancel={() => setShowVerifyForm(false)}
            />
          </FormContainer>
        )}
      </DetailPaper>
    </DetailContainer>
  );
};

export default ReplacementDetail;
