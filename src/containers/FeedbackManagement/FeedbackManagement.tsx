import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import { Star, StarBorder } from "@mui/icons-material";
import { Rating } from "@mui/material";

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

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "8px",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
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
      sx={{ p: 3, backgroundColor: "background.default", minHeight: "100vh" }}
    >
      <Typography variant="h4" gutterBottom>
        Quản lý Phản hồi Khách hàng
      </Typography>

      {/* Filter Chips */}
      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        <Chip
          label="Tất cả"
          onClick={() => handleFilterChange("all")}
          color={filter === "all" ? "primary" : "default"}
        />
        <Chip
          label="Chờ xử lý"
          onClick={() => handleFilterChange("pending")}
          color={filter === "pending" ? "primary" : "default"}
        />
        <Chip
          label="Đã phản hồi"
          onClick={() => handleFilterChange("responded")}
          color={filter === "responded" ? "primary" : "default"}
        />
        <Chip
          label="Đã giải quyết"
          onClick={() => handleFilterChange("resolved")}
          color={filter === "resolved" ? "primary" : "default"}
        />
      </Stack>

      <Stack spacing={3}>
        {filteredFeedbacks.map((feedback) => (
          <StyledCard key={feedback.id}>
            <CardContent>
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
                      <Button
                        variant="contained"
                        sx={{
                          alignSelf: "flex-end",
                          backgroundColor: theme.palette.success.main,
                        }}
                        onClick={() => handleSubmitResponse(feedback.id)}
                      >
                        Gửi phản hồi
                      </Button>
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
