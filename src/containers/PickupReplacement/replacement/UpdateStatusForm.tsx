// src/components/replacement/UpdateStatusForm.tsx
import { InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React, { useState } from "react";
import staffReplacementService from "../../../api/Services/staffReplacementService";
import ErrorAlert from "../../../components/errorAlert/ErrorAlert";
import LoadingSpinner from "../../../components/loadingSpinner/LoadingSpinner";
import {
  ButtonContainer,
  CancelButton,
  FormContainer,
  FormTitle,
  NotesField,
  StyledFormControl,
  UpdateButton,
} from "../../../components/staff/styles/updateStatusFormStyles";
import {
  ReplacementRequestDetailDto,
  ReplacementRequestStatus,
} from "../../../types/pickupReplacement";

// Vietnamese translations for status
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

interface UpdateStatusFormProps {
  replacementId: number;
  currentStatus: ReplacementRequestStatus;
  onSuccess: (updatedReplacement: ReplacementRequestDetailDto) => void;
  onCancel: () => void;
}

const UpdateStatusForm: React.FC<UpdateStatusFormProps> = ({
  replacementId,
  currentStatus,
  onSuccess,
  onCancel,
}) => {
  const [status, setStatus] = useState<ReplacementRequestStatus>(currentStatus);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = (event: SelectChangeEvent<number>) => {
    setStatus(event.target.value as number as ReplacementRequestStatus);
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await staffReplacementService.updateReplacementStatus(
        replacementId,
        {
          status,
          notes: notes.trim() || undefined,
        }
      );
      if (response.success && response.data) {
        onSuccess(response.data);
      } else {
        setError(response.message || "Không thể cập nhật trạng thái");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <FormContainer component="form" onSubmit={handleSubmit} noValidate>
      <FormTitle variant="h6">Cập Nhật Trạng Thái Yêu Cầu Thay Thế</FormTitle>
      {error && <ErrorAlert message={error} />}

      <StyledFormControl fullWidth>
        <InputLabel id="status-select-label">Trạng Thái</InputLabel>
        <Select
          labelId="status-select-label"
          id="status-select"
          value={status}
          label="Trạng Thái"
          onChange={handleStatusChange}
        >
          <MenuItem value={ReplacementRequestStatus.InProgress}>
            {getStatusTextVietnamese(ReplacementRequestStatus.InProgress)}
          </MenuItem>
          {/* Only show Approved if current status is not already InProgress */}
          {currentStatus !== ReplacementRequestStatus.InProgress && (
            <MenuItem value={ReplacementRequestStatus.Approved}>
              {getStatusTextVietnamese(ReplacementRequestStatus.Approved)}
            </MenuItem>
          )}
        </Select>
      </StyledFormControl>

      <NotesField
        fullWidth
        id="notes"
        label="Ghi Chú Trạng Thái"
        name="notes"
        multiline
        rows={4}
        value={notes}
        onChange={handleNotesChange}
        placeholder="Thêm ghi chú về việc cập nhật trạng thái này"
      />

      <ButtonContainer direction="row" spacing={2}>
        <CancelButton variant="outlined" onClick={onCancel}>
          Hủy Bỏ
        </CancelButton>
        <UpdateButton type="submit" variant="contained">
          Cập Nhật Trạng Thái
        </UpdateButton>
      </ButtonContainer>
    </FormContainer>
  );
};

export default UpdateStatusForm;
