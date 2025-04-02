// src/components/replacement/VerifyEquipmentForm.tsx
import { Switch } from "@mui/material";
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
  SubmitButton,
  SwitchControl,
} from "../../../components/staff/styles/verifyEquipmentFormStyles";
import { ReplacementRequestDetailDto } from "../../../types/pickupReplacement";

interface VerifyEquipmentFormProps {
  replacementId: number;
  onSuccess: (updatedReplacement: ReplacementRequestDetailDto) => void;
  onCancel: () => void;
}

const VerifyEquipmentForm: React.FC<VerifyEquipmentFormProps> = ({
  replacementId,
  onSuccess,
  onCancel,
}) => {
  const [isFaulty, setIsFaulty] = useState<boolean>(true);
  const [verificationNotes, setVerificationNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationNotes(event.target.value);
  };

  const handleFaultyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFaulty(event.target.checked);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!verificationNotes.trim()) {
      setError("Ghi chú xác minh là bắt buộc");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      console.log(
        `Đang xác minh thiết bị cho yêu cầu thay thế ${replacementId} với dữ liệu:`,
        {
          isFaulty,
          verificationNotes: verificationNotes.trim(),
        }
      );
      const response = await staffReplacementService.verifyEquipmentFaulty(
        replacementId,
        {
          isFaulty,
          verificationNotes: verificationNotes.trim(),
        }
      );
      console.log("Phản hồi API cho xác minh thiết bị:", response);
      if (response.success && response.data) {
        console.log(
          "Xác minh thiết bị thành công. Dữ liệu cập nhật:",
          response.data
        );
        onSuccess(response.data);
      } else {
        console.error("API trả về success=false:", response.message);
        setError(response.message || "Không thể xác minh thiết bị");
      }
    } catch (err) {
      console.error("Lỗi trong handleSubmit:", err);
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
      <FormTitle variant="h6">Xác Minh Tình Trạng Thiết Bị</FormTitle>
      {error && <ErrorAlert message={error} />}

      <SwitchControl
        control={
          <Switch
            checked={isFaulty}
            onChange={handleFaultyChange}
            color="primary"
          />
        }
        label={isFaulty ? "Thiết bị bị lỗi" : "Thiết bị không bị lỗi"}
      />

      <NotesField
        required
        fullWidth
        id="verificationNotes"
        label="Ghi Chú Xác Minh"
        name="verificationNotes"
        multiline
        rows={4}
        value={verificationNotes}
        onChange={handleNotesChange}
        placeholder="Mô tả tình trạng của thiết bị và kết quả xác minh của bạn"
        error={error !== null && !verificationNotes.trim()}
        helperText={
          error !== null && !verificationNotes.trim()
            ? "Ghi chú xác minh là bắt buộc"
            : ""
        }
      />

      <ButtonContainer>
        <CancelButton variant="outlined" onClick={onCancel}>
          Hủy Bỏ
        </CancelButton>
        <SubmitButton
          type="submit"
          variant="contained"
          disabled={!verificationNotes.trim()}
        >
          Gửi Xác Minh
        </SubmitButton>
      </ButtonContainer>
    </FormContainer>
  );
};

export default VerifyEquipmentForm;
