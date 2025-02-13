import { Star, StarBorder } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Rating,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";

// Feedback interface
interface Feedback {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  response?: string;
  date: string;
  status: "pending" | "responded" | "resolved";
}

// Mock feedback data
const feedbackData: Feedback[] = [
  {
    id: 1,
    customerName: "Lê Minh Anh",
    rating: 4,
    comment: "Dịch vụ thuê nồi lẩu tốt, nhưng thiếu 2 cái bát",
    date: "2024-03-15",
    status: "pending",
  },
  {
    id: 2,
    customerName: "Trần Quốc Bảo",
    rating: 5,
    comment: "Nhân viên giao hàng rất nhiệt tình, thiết bị sạch sẽ",
    date: "2024-03-14",
    status: "responded",
    response: "Cảm ơn bạn đã phản hồi, chúng tôi sẽ cố gắng duy trì chất lượng",
  },
  {
    id: 3,
    customerName: "Phạm Thị Cẩm Tú",
    rating: 3,
    comment: "Nồi lẩu hơi trầy xước, cần kiểm tra kỹ hơn trước khi giao",
    date: "2024-03-13",
    status: "resolved",
  },
];

// Enhanced styled components
const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.9)})`,
  backdropFilter: "blur(10px)",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  borderRadius: "16px",
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.1)}`,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `0 12px 48px 0 ${alpha(theme.palette.common.black, 0.12)}`,
  },
}));

const AnimatedChip = styled(Chip)(() => ({
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "12px",
  padding: "8px 24px",
  transition: "all 0.2s ease-in-out",
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 8px 20px -6px ${alpha(theme.palette.primary.main, 0.6)}`,
  },
}));

const FeedbackManagement: React.FC = () => {
  const theme = useTheme();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(feedbackData);
  const [responseText, setResponseText] = useState<string>("");
  const [filter, setFilter] = useState<"all" | Feedback["status"]>("all");

  const handleSubmitResponse = (feedbackId: number) => {
    setFeedbacks(
      feedbacks.map((fb) =>
        fb.id === feedbackId
          ? { ...fb, response: responseText, status: "responded" }
          : fb
      )
    );
    setResponseText("");
  };

  const handleFilterChange = (newFilter: "all" | Feedback["status"]) => {
    setFilter(newFilter);
  };

  const filteredFeedbacks = feedbacks.filter(
    (fb) => filter === "all" || fb.status === filter
  );

  return (
    <Box
      sx={{
        p: 4,
        background: (theme) =>
          `linear-gradient(135deg, ${alpha(
            theme.palette.background.default,
            0.95
          )}, ${alpha(theme.palette.background.paper, 0.95)})`,
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        Quản lý Phản hồi Khách hàng
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        {["all", "pending", "responded", "resolved"].map((filterType) => (
          <AnimatedChip
            key={filterType}
            label={
              filterType === "all"
                ? "Tất cả"
                : filterType === "pending"
                ? "Chờ xử lý"
                : filterType === "responded"
                ? "Đã phản hồi"
                : "Đã giải quyết"
            }
            onClick={() =>
              handleFilterChange(filterType as "all" | Feedback["status"])
            }
            color={filter === filterType ? "primary" : "default"}
            sx={{
              px: 2,
              borderRadius: "10px",
            }}
          />
        ))}
      </Stack>

      <Stack spacing={3}>
        {filteredFeedbacks.map((feedback) => (
          <StyledCard key={feedback.id}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                {/* Feedback Header */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">{feedback.customerName}</Typography>
                  <Chip
                    label={
                      feedback.status === "pending"
                        ? "Chờ xử lý"
                        : feedback.status === "responded"
                        ? "Đã phản hồi"
                        : "Đã giải quyết"
                    }
                    color={
                      feedback.status === "pending"
                        ? "error"
                        : feedback.status === "responded"
                        ? "warning"
                        : "success"
                    }
                    size="small"
                  />
                </Stack>

                {/* Rating */}
                <Rating
                  name="read-only"
                  value={feedback.rating}
                  readOnly
                  precision={0.5}
                  emptyIcon={<StarBorder />}
                  icon={<Star />}
                />

                {/* Feedback Content */}
                <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                  "{feedback.comment}"
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(feedback.date).toLocaleDateString("vi-VN")}
                </Typography>

                {/* Response Section */}
                {feedback.response && (
                  <>
                    <Divider />
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" color="primary">
                        Phản hồi của quản lý:
                      </Typography>
                      <Typography variant="body2">
                        {feedback.response}
                      </Typography>
                    </Stack>
                  </>
                )}

                {/* Response Input */}
                {feedback.status !== "resolved" && (
                  <>
                    <Divider />
                    <Stack spacing={2}>
                      <TextField
                        multiline
                        rows={3}
                        variant="outlined"
                        label="Viết phản hồi"
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                      />
                      <StyledButton
                        variant="contained"
                        sx={{
                          alignSelf: "flex-end",
                          backgroundColor: theme.palette.success.main,
                        }}
                        onClick={() => handleSubmitResponse(feedback.id)}
                      >
                        Gửi phản hồi
                      </StyledButton>
                    </Stack>
                  </>
                )}
              </Stack>
            </CardContent>
          </StyledCard>
        ))}
      </Stack>
    </Box>
  );
};

export default FeedbackManagement;
