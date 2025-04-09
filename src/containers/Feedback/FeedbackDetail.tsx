/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Paper,
  Chip,
  IconButton,
  Skeleton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import adminFeedbackAPI from "../../api/Services/adminFeedbackAPI";
import { useParams } from "react-router";
import ApproveFeedbackPopup from "./Modal/AcceptModal";
import RejectFeedbackPopup from "./Modal/RejectModal";
import { formatDateFunc } from "../../utils/fn";

// Icons
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FeedbackIcon from "@mui/icons-material/Feedback";
import CommentIcon from "@mui/icons-material/Comment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  overflow: "visible",
}));

const HeaderPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: "relative",
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(1),
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "50px",
    height: "3px",
    backgroundColor: theme.palette.primary.main,
  },
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  "& .MuiSvgIcon-root": {
    marginRight: theme.spacing(1.5),
    color: theme.palette.primary.main,
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: "bold",
  padding: theme.spacing(0.5, 0),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(1, 3),
  textTransform: "none",
  fontWeight: "bold",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
}));

const FeedbackDetail: React.FC = () => {
  const { feedbackId } = useParams<{ feedbackId: string }>();
  const [dataFeedback, setDataFeedback] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [openApprove, setOpenApprove] = useState<boolean>(false);
  const [openReject, setOpenReject] = useState<boolean>(false);
  const navigate = useNavigate();

  const getListFeedback = async () => {
    try {
      setLoading(true);
      if (!feedbackId) return;
      const res: any = await adminFeedbackAPI.getFeedbackDetails(feedbackId);
      setDataFeedback(res?.data);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching feedback details:", error?.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getListFeedback();
  }, [feedbackId]);

  const onSave = () => {
    getListFeedback();
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case "Approved":
      case "1":
        return (
          <StatusChip
            icon={<CheckCircleIcon />}
            label="Đã duyệt"
            color="success"
            variant="filled"
          />
        );
      case "Rejected":
      case "2":
        return (
          <StatusChip
            icon={<CancelIcon />}
            label="Từ chối"
            color="error"
            variant="filled"
          />
        );
      default:
        return (
          <StatusChip
            icon={<HourglassEmptyIcon />}
            label="Chưa xử lí"
            color="warning"
            variant="filled"
          />
        );
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
      <HeaderPaper elevation={2}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Quay lại">
            <IconButton
              color="inherit"
              sx={{ mr: 2 }}
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h5" fontWeight="bold">
            Chi tiết phản hồi #{feedbackId}
          </Typography>
        </Box>
        {!loading && dataFeedback && (
          <Box>{getStatusChip(dataFeedback?.approvalStatus)}</Box>
        )}
      </HeaderPaper>

      <StyledCard>
        <CardContent sx={{ p: 4 }}>
          {loading ? (
            <Box>
              <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={120} />
              <Skeleton
                variant="rectangular"
                height={40}
                sx={{ mt: 3, mb: 2 }}
              />
              <Skeleton variant="rectangular" height={120} />
            </Box>
          ) : dataFeedback ? (
            <>
              {/* Thông tin khách hàng */}
              <Box sx={{ mb: 4 }}>
                <SectionTitle variant="h6" fontWeight="bold">
                  Thông tin khách hàng
                </SectionTitle>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                    borderRadius: 2,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <InfoItem>
                        <PersonIcon />
                        <Typography>
                          <strong>Tên khách hàng:</strong>{" "}
                          {dataFeedback?.userName || "Không có thông tin"}
                        </Typography>
                      </InfoItem>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <InfoItem>
                        <PhoneIcon />
                        <Typography>
                          <strong>Số điện thoại:</strong>{" "}
                          {dataFeedback?.phoneNumber || "Không có thông tin"}
                        </Typography>
                      </InfoItem>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <InfoItem>
                        <EmailIcon />
                        <Typography>
                          <strong>Email:</strong>{" "}
                          {dataFeedback?.email || "Không có thông tin"}
                        </Typography>
                      </InfoItem>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <InfoItem>
                        <ShoppingBasketIcon />
                        <Typography>
                          <strong>ID Đơn hàng:</strong>{" "}
                          {dataFeedback?.orderId || "Không có thông tin"}
                        </Typography>
                      </InfoItem>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              {/* Nội dung phản hồi */}
              <Box sx={{ mb: 4 }}>
                <SectionTitle variant="h6" fontWeight="bold">
                  Nội dung phản hồi
                </SectionTitle>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                    borderRadius: 2,
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <InfoItem>
                        <FeedbackIcon />
                        <Typography>
                          <strong>Loại phản hồi:</strong>{" "}
                          {dataFeedback?.title || "Không có thông tin"}
                        </Typography>
                      </InfoItem>
                    </Grid>
                    <Grid item xs={12}>
                      <InfoItem alignItems="flex-start">
                        <CommentIcon sx={{ mt: 0.5 }} />
                        <Typography>
                          <strong>Nội dung:</strong>{" "}
                          <Box
                            component="span"
                            sx={{ display: "block", mt: 1, pl: 0.5 }}
                          >
                            {dataFeedback?.comment || "Không có nội dung"}
                          </Box>
                        </Typography>
                      </InfoItem>
                    </Grid>
                    <Grid item xs={12}>
                      <InfoItem>
                        <AccessTimeIcon />
                        <Typography>
                          <strong>Thời gian gửi:</strong>{" "}
                          {dataFeedback?.createdAt
                            ? formatDateFunc.formatDateTime(
                                dataFeedback?.createdAt
                              )
                            : "Không có thông tin"}
                        </Typography>
                      </InfoItem>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              {/* Trạng thái xử lý */}
              <Box sx={{ mb: 4 }}>
                <SectionTitle variant="h6" fontWeight="bold">
                  Trạng thái xử lý
                </SectionTitle>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                    borderRadius: 2,
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Box display="flex" alignItems="center">
                        <Typography sx={{ mr: 2 }}>
                          <strong>Trạng thái:</strong>
                        </Typography>
                        {getStatusChip(dataFeedback?.approvalStatus)}
                      </Box>
                    </Grid>

                    {dataFeedback?.responseDate && (
                      <Grid item xs={12} sm={6}>
                        <InfoItem>
                          <AccessTimeIcon />
                          <Typography>
                            <strong>Thời gian phản hồi:</strong>{" "}
                            {formatDateFunc.formatDateTime(
                              dataFeedback?.responseDate
                            )}
                          </Typography>
                        </InfoItem>
                      </Grid>
                    )}

                    {dataFeedback?.approvalDate && (
                      <Grid item xs={12} sm={6}>
                        <InfoItem>
                          <AccessTimeIcon />
                          <Typography>
                            <strong>Thời gian duyệt:</strong>{" "}
                            {formatDateFunc.formatDateTime(
                              dataFeedback?.approvalDate
                            )}
                          </Typography>
                        </InfoItem>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Box>

              {/* Actions */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 4,
                  justifyContent: "center",
                }}
              >
                <ActionButton
                  variant="contained"
                  color="success"
                  onClick={() => setOpenApprove(true)}
                  disabled={
                    dataFeedback?.approvalStatus === "Approved" ||
                    dataFeedback?.approvalStatus === "1" ||
                    dataFeedback?.approvalStatus === "Rejected"
                  }
                  startIcon={<CheckCircleIcon />}
                  size="large"
                >
                  Chấp nhận phản hồi
                </ActionButton>
                <ActionButton
                  variant="contained"
                  color="error"
                  onClick={() => setOpenReject(true)}
                  disabled={
                    dataFeedback?.approvalStatus === "Rejected" ||
                    dataFeedback?.approvalStatus === "2" ||
                    dataFeedback?.approvalStatus === "Approved"
                  }
                  startIcon={<CancelIcon />}
                  size="large"
                >
                  Từ chối phản hồi
                </ActionButton>
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <Typography variant="h6" color="text.secondary">
                Không tìm thấy dữ liệu phản hồi
              </Typography>
            </Box>
          )}
        </CardContent>
      </StyledCard>

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
