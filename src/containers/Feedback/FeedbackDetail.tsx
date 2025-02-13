import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

interface FeedbackDetailProps {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  orderId: string;
  content: string;
  feedbackType: string;
  status: string;
  createdAt: string;
  priority: string;
}

const FeedbackDetail: React.FC<FeedbackDetailProps> = ({
  customerName,
  phone,
  email,
  orderId,
  content,
  feedbackType,
  status,
  createdAt,
  priority,
}) => {
  return (
    <Box>
      <Card variant="outlined">
        <CardContent>
          {/* Title */}
          <Typography variant="h5" gutterBottom>
            Chi tiết phản hồi
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Thông tin người gửi */}
          <Typography variant="h6" gutterBottom>
            Thông tin khách hàng
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ mobile: 12, desktop: 6 }}>
              <Typography variant="body1">
                <strong>Tên khách hàng:</strong> {customerName}
              </Typography>
            </Grid>
            <Grid size={{ mobile: 12, desktop: 6 }}>
              <Typography variant="body1">
                <strong>Số điện thoại:</strong> {phone}
              </Typography>
            </Grid>
            <Grid size={{ mobile: 12, desktop: 6 }}>
              <Typography variant="body1">
                <strong>Email:</strong> {email}
              </Typography>
            </Grid>
            <Grid size={{ mobile: 12, desktop: 6 }}>
              <Typography variant="body1">
                <strong>ID Đơn hàng:</strong> {orderId}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          {/* Nội dung phản hồi */}
          <Typography variant="h6" gutterBottom>
            Nội dung phản hồi
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ mobile: 12 }}>
              <Typography variant="body1">
                <strong>Loại phản hồi:</strong> {feedbackType}
              </Typography>
            </Grid>
            <Grid size={{ mobile: 12 }}>
              <Typography variant="body1">
                <strong>Nội dung:</strong> {content}
              </Typography>
            </Grid>
            <Grid size={{ mobile: 12 }}>
              <Typography variant="body1">
                <strong>Thời gian gửi:</strong> {createdAt}
              </Typography>
            </Grid>
            <Grid size={{ mobile: 12 }}>
              <Typography variant="body1">
                <strong>Mức độ ưu tiên:</strong>{" "}
                <Chip
                  label={priority}
                  color={
                    priority === "Cao"
                      ? "error"
                      : priority === "Trung bình"
                      ? "warning"
                      : "success"
                  }
                />
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          {/* Trạng thái xử lý */}
          <Typography variant="h6" gutterBottom>
            Trạng thái xử lý
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ mobile: 6 }}>
              <Typography variant="body1">
                <strong>Trạng thái:</strong>{" "}
                <Chip
                  label={status}
                  color={
                    status === "Chưa xử lý"
                      ? "default"
                      : status === "Đang xử lý"
                      ? "warning"
                      : "success"
                  }
                />
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FeedbackDetail;
