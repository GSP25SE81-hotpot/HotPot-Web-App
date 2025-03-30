/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Grid2,
  Button,
} from "@mui/material";
import adminFeedbackAPI from "../../api/Services/adminFeedbackAPI";
import { useParams } from "react-router";
import ApproveFeedbackPopup from "./Modal/AcceptModal";
import { formatDateFunc } from "../../utils/fn";
import RejectFeedbackPopup from "./Modal/RejectModal";

const FeedbackDetail: React.FC = () => {
  const { feedbackId } = useParams<{ feedbackId: string }>();
  const [dataFeedback, setDataFeedback] = useState<any>();
  const [openApprove, setOpenApprove] = useState<boolean>(false);

  const [openReject, setOpenReject] = useState<boolean>(false);

  const getListFeedback = async () => {
    try {
      if (!feedbackId) return;
      const res: any = await adminFeedbackAPI.getFeedbackDetails(feedbackId);
      setDataFeedback(res?.data);
    } catch (error: any) {
      console.error("Error fetching feedback details:", error?.message);
    }
  };

  useEffect(() => {
    getListFeedback();
  }, [feedbackId]);

  const onSave = () => {
    getListFeedback();
  };
  return (
    <Box>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Chi tiết phản hồi
          </Typography>

          {/* Thông tin người gửi */}
          <Typography variant="h6" gutterBottom>
            Thông tin khách hàng
          </Typography>
          <Grid2 container spacing={2} sx={{ mb: 2 }}>
            <Grid2 size={{ mobile: 12, desktop: 6 }}>
              <Typography variant="body1">
                <strong>Tên khách hàng:</strong> {dataFeedback?.userName}
              </Typography>
            </Grid2>
            <Grid2 size={{ mobile: 12, desktop: 6 }}>
              <Typography variant="body1">
                <strong>Số điện thoại:</strong>
              </Typography>
            </Grid2>
            <Grid2 size={{ mobile: 12, desktop: 6 }}>
              <Typography variant="body1">
                <strong>Email:</strong>
              </Typography>
            </Grid2>
            <Grid2 size={{ mobile: 12, desktop: 6 }}>
              <Typography variant="body1">
                <strong>ID Đơn hàng:</strong> {dataFeedback?.orderId}
              </Typography>
            </Grid2>
          </Grid2>

          <Divider sx={{ mb: 2 }} />

          {/* Nội dung phản hồi */}
          <Typography variant="h6" gutterBottom>
            Nội dung phản hồi
          </Typography>
          <Grid2 container spacing={2} sx={{ mb: 2 }}>
            <Grid2 size={{ mobile: 12 }}>
              <Typography variant="body1">
                <strong>Loại phản hồi:</strong> {dataFeedback?.title}
              </Typography>
            </Grid2>
            <Grid2 size={{ mobile: 12 }}>
              <Typography variant="body1">
                <strong>Nội dung:</strong> {dataFeedback?.comment}
              </Typography>
            </Grid2>
            <Grid2 size={{ mobile: 12 }}>
              <Typography variant="body1">
                <strong>Thời gian gửi:</strong> <b />
                {formatDateFunc.formatDateTime(dataFeedback?.createdAt)}
              </Typography>
            </Grid2>
            <Grid2 size={{ mobile: 12 }}></Grid2>
          </Grid2>

          <Divider sx={{ mb: 2 }} />
          <Divider sx={{ mb: 2 }} />

          <Typography variant="h6" gutterBottom>
            Trạng thái xử lý
          </Typography>
          <Grid2 container spacing={2} sx={{ mb: 2 }}>
            <Grid2 size={{ mobile: 6 }}>
              <Typography variant="body1">
                <strong>Trạng thái:</strong>{" "}
                {dataFeedback?.approvalStatus == "1"
                  ? "Đã duyệt"
                  : dataFeedback?.approvalStatus == "2"
                  ? "Từ chối"
                  : "Chưa xử lí"}
              </Typography>
            </Grid2>
          </Grid2>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                setOpenApprove(true);
              }}
              disabled={dataFeedback?.status === "Accepted"}
            >
              Chấp nhận
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setOpenReject(true);
              }}
              disabled={dataFeedback?.status === "Rejected"}
            >
              Từ chối
            </Button>
          </Box>
        </CardContent>
      </Card>

      {openApprove && (
        <ApproveFeedbackPopup
          dataFeedback={dataFeedback}
          handleClose={() => {
            setOpenApprove(false);
          }}
          handleOpen={openApprove}
          onSave={onSave}
        />
      )}

      {openReject && (
        <RejectFeedbackPopup
          dataFeedback={dataFeedback}
          handleClose={() => {
            setOpenReject(false);
          }}
          handleOpen={openReject}
          onSave={onSave}
        />
      )}
    </Box>
  );
};

export default FeedbackDetail;
