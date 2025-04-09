/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Fade,
  Button,
  Avatar,
  Rating,
  Stack,
  Divider,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { colors } from "../../../styles/Color/color";
import adminFeedbackAPI from "../../../api/Services/adminFeedbackAPI";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

interface ApproveFeedbackPopupProps {
  handleOpen: boolean;
  handleClose: () => void;
  dataFeedback: any;
  onSave: () => void;
}

const ApproveFeedbackPopup: React.FC<ApproveFeedbackPopupProps> = ({
  handleOpen,
  handleClose,
  dataFeedback,
  onSave,
}) => {
  const { auth } = useAuth();

  const data = jwtDecode(auth?.accessToken || "");

  const decodeData = Object(data);

  // Call API
  const handleAcceptFeedback = async () => {
    try {
      if (!dataFeedback) return;

      const prepareData = {
        adminUserId: decodeData?.id,
      };
      const res: any = await adminFeedbackAPI.ApproveFeedback(
        dataFeedback.feedbackId,
        prepareData
      );
      toast.success("Cập nhật đánh giá thành công");
      onSave();
      if (res) {
        handleClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      open={handleOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={300}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          backgroundColor: colors.primary,
          color: "white",
        }}
      >
        <Typography variant="h6" fontWeight="600">
          Duyệt Đánh giá
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 3 }}>
        {dataFeedback ? (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                src={dataFeedback.userAvatar || ""}
                alt={dataFeedback.userName}
                sx={{ width: 50, height: 50, mr: 2 }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {dataFeedback.userName || "Người dùng"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(dataFeedback.createdAt).toLocaleDateString("vi-VN")}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Rating
                  value={dataFeedback.rating || 0}
                  precision={0.5}
                  readOnly
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  ({dataFeedback.rating}/5)
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {dataFeedback.comment || "Không có nội dung"}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}></Box>

            <Stack
              direction="row"
              spacing={2}
              sx={{ mt: 4, justifyContent: "flex-end" }}
            >
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => {}}
              >
                Từ chối
              </Button>
              <Button
                variant="contained"
                startIcon={<CheckCircleIcon />}
                onClick={handleAcceptFeedback}
                sx={{
                  backgroundColor: colors.primary,
                  "&:hover": {
                    backgroundColor: colors.blue_100,
                  },
                }}
              >
                Duyệt đánh giá
              </Button>
            </Stack>
          </Box>
        ) : (
          <Typography variant="body1">Không có dữ liệu</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApproveFeedbackPopup;
