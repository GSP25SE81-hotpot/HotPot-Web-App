// src/components/FeedbackManagement.tsx
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
  Pagination,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState, useEffect, useCallback } from "react";
import feedbackService from "../../api/services/feedbackService";
import { useSignalR } from "../../context/SignalRContext";
import { Feedback } from "../../api/services/feedbackService";
import { HubConnectionState } from "@microsoft/signalr";

// Styled components
const StyledCard = styled(Card)(() => ({
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
  },
}));

const AnimatedChip = styled(Chip)(() => ({
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const StyledButton = styled(Button)(() => ({
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "none",
  "&:hover": {
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
}));

const FeedbackManagement: React.FC = () => {
  const theme = useTheme();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [responseText, setResponseText] = useState<string>("");
  const [activeFeedbackId, setActiveFeedbackId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "pending">("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [stats, setStats] = useState({
    totalFeedbackCount: 0,
    respondedFeedbackCount: 0,
    unrespondedFeedbackCount: 0,
    responseRate: 0,
  });

  // Get SignalR context
  const { hubService, isInitialized, error: signalRError } = useSignalR();

  // Get manager ID from localStorage
  const managerId = parseInt(localStorage.getItem("uid") || "1");

  // Fetch feedback based on current filter
  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (filter === "pending") {
        response = await feedbackService.getUnrespondedFeedback(
          pageNumber,
          pageSize
        );
      } else {
        response = await feedbackService.getAllFeedback(pageNumber, pageSize);
      }
      if (response.isSuccess && response.data) {
        setFeedbacks(response.data.items);
        setTotalCount(response.data.totalCount);
      } else {
        setError(response.message || "Failed to fetch feedback");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching feedback";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filter, pageNumber, pageSize]);

  // Fetch feedback statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await feedbackService.getFeedbackStats();
      if (response.isSuccess && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  // Set up real-time updates using the SignalR context
  useEffect(() => {
    if (isInitialized) {
      // Handle SignalR errors
      if (signalRError) {
        setError(`SignalR error: ${signalRError.message}`);
      }

      // Register for approved feedback notifications
      const handleApprovedFeedback = (
        _feedbackId: number,
        title: string,
        adminName: string
      ) => {
        setSuccess(`New feedback "${title}" approved by ${adminName}`);
        // Refresh the feedback list and stats
        fetchFeedback();
        fetchStats();
      };

      // Register for feedback response notifications
      const handleFeedbackResponse = (
        feedbackId: number,
        responseMessage: string,
        managerName: string,
        responseDate: Date
      ) => {
        // Update the feedback in the list if it exists
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((fb) =>
            fb.feedbackId === feedbackId
              ? {
                  ...fb,
                  response: responseMessage,
                  responseDate: responseDate,
                  manager: fb.manager
                    ? { ...fb.manager, name: managerName }
                    : { name: managerName, id: 0 },
                }
              : fb
          )
        );
      };

      // Register event handlers with the hub service
      hubService.feedback.onReceiveApprovedFeedback(handleApprovedFeedback);
      hubService.feedback.onReceiveFeedbackResponse(handleFeedbackResponse);

      // No need to return cleanup function as the SignalR context handles disconnection
    }
  }, [
    isInitialized,
    signalRError,
    fetchFeedback,
    fetchStats,
    hubService.feedback,
  ]);

  // Load data when component mounts or filter/page changes
  useEffect(() => {
    fetchFeedback();
    fetchStats();
  }, [filter, pageNumber, pageSize, fetchFeedback, fetchStats]);

  // Handle filter change
  const handleFilterChange = (newFilter: "all" | "pending") => {
    setFilter(newFilter);
    setPageNumber(1); // Reset to first page when filter changes
  };

  // Handle page change
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPageNumber(value);
  };

  // Submit response to feedback
  const handleSubmitResponse = async (feedbackId: number) => {
    if (!responseText.trim()) {
      setError("Response cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const response = await feedbackService.respondToFeedback(feedbackId, {
        managerId,
        response: responseText,
      });

      if (response.isSuccess && response.data) {
        // Get the feedback and user info
        const feedback = response.data;

        // Update the feedback in the list
        setFeedbacks(
          feedbacks.map((fb) =>
            fb.feedbackId === feedbackId
              ? {
                  ...fb,
                  response: responseText,
                  responseDate: new Date(),
                  manager: fb.manager
                    ? {
                        ...fb.manager,
                        name: localStorage.getItem("userName") || "Manager",
                      }
                    : {
                        name: localStorage.getItem("userName") || "Manager",
                        id: managerId,
                      },
                }
              : fb
          )
        );

        setSuccess("Response submitted successfully");
        setResponseText("");
        setActiveFeedbackId(null);

        // Notify the user about the response via SignalR
        if (isInitialized && feedback.userId) {
          try {
            const managerName = localStorage.getItem("userName") || "Manager";
            await hubService.feedback.notifyFeedbackResponse(
              feedback.userId,
              feedbackId,
              responseText,
              managerName
            );
          } catch (err) {
            console.error("Failed to send real-time notification:", err);
          }
        }

        // Refresh stats
        fetchStats();
      } else {
        setError(response.message || "Failed to submit response");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while submitting response";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Close alert messages
  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  // Set active feedback for response
  const handleSetActiveFeedback = (feedbackId: number) => {
    setActiveFeedbackId(feedbackId === activeFeedbackId ? null : feedbackId);
    setResponseText("");
  };

  // Get connection state
  const connectionState = isInitialized
    ? HubConnectionState.Connected
    : HubConnectionState.Disconnected;

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

      {/* Connection status */}
      {connectionState !== HubConnectionState.Connected && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Trạng thái kết nối: {connectionState}
        </Alert>
      )}

      {/* Stats Section */}
      <Box sx={{ mb: 4, p: 2, bgcolor: "background.paper", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Thống kê
        </Typography>
        <Stack direction="row" spacing={4} sx={{ flexWrap: "wrap" }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Tổng số phản hồi
            </Typography>
            <Typography variant="h5">{stats.totalFeedbackCount}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Đã phản hồi
            </Typography>
            <Typography variant="h5">{stats.respondedFeedbackCount}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Chưa phản hồi
            </Typography>
            <Typography variant="h5">
              {stats.unrespondedFeedbackCount}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Tỷ lệ phản hồi
            </Typography>
            <Typography variant="h5">
              {stats.responseRate.toFixed(1)}%
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Filters */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <AnimatedChip
          key="all"
          label="Tất cả"
          onClick={() => handleFilterChange("all")}
          color={filter === "all" ? "primary" : "default"}
          sx={{ px: 2, borderRadius: "10px" }}
        />
        <AnimatedChip
          key="pending"
          label="Chờ xử lý"
          onClick={() => handleFilterChange("pending")}
          color={filter === "pending" ? "primary" : "default"}
          sx={{ px: 2, borderRadius: "10px" }}
        />
      </Stack>

      {/* Error and Success Messages */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Feedback List */}
      <Stack spacing={3}>
        {feedbacks.length === 0 && !loading ? (
          <Typography variant="body1" sx={{ textAlign: "center", my: 4 }}>
            Không có phản hồi nào
          </Typography>
        ) : (
          feedbacks.map((feedback) => (
            <StyledCard key={feedback.feedbackId}>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  {/* Feedback Header */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6">
                      {feedback.user ? feedback.user.name : "Khách hàng"}
                    </Typography>
                    <Chip
                      label={feedback.response ? "Đã phản hồi" : "Chờ xử lý"}
                      color={feedback.response ? "success" : "error"}
                      size="small"
                    />
                  </Stack>

                  {/* Feedback Title */}
                  <Typography variant="subtitle1" fontWeight="bold">
                    {feedback.title}
                  </Typography>

                  {/* Feedback Content */}
                  <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                    "{feedback.comment}"
                  </Typography>

                  {/* Rating Display */}
                  {feedback.rating > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Rating
                        value={feedback.rating}
                        readOnly
                        precision={0.5}
                        icon={<Star fontSize="inherit" />}
                        emptyIcon={<StarBorder fontSize="inherit" />}
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({feedback.rating}/5)
                      </Typography>
                    </Box>
                  )}

                  {/* Order Information */}
                  {feedback.order && (
                    <Typography variant="caption" color="text.secondary">
                      Đơn hàng: #{feedback.order.orderNumber} -
                      {new Date(feedback.createdAt).toLocaleDateString("vi-VN")}
                    </Typography>
                  )}

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
                        {feedback.responseDate && (
                          <Typography variant="caption" color="text.secondary">
                            Phản hồi lúc:{" "}
                            {new Date(feedback.responseDate).toLocaleString(
                              "vi-VN"
                            )}
                          </Typography>
                        )}
                      </Stack>
                    </>
                  )}

                  {/* Response Input */}
                  {!feedback.response && (
                    <>
                      <Divider />
                      {activeFeedbackId === feedback.feedbackId ? (
                        <Stack spacing={2}>
                          <TextField
                            multiline
                            rows={3}
                            variant="outlined"
                            label="Viết phản hồi"
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                          />
                          <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="flex-end"
                          >
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleSetActiveFeedback(feedback.feedbackId)
                              }
                            >
                              Hủy
                            </Button>
                            <StyledButton
                              variant="contained"
                              sx={{
                                backgroundColor: theme.palette.success.main,
                              }}
                              onClick={() =>
                                handleSubmitResponse(feedback.feedbackId)
                              }
                              disabled={loading}
                            >
                              Gửi phản hồi
                            </StyledButton>
                          </Stack>
                        </Stack>
                      ) : (
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() =>
                            handleSetActiveFeedback(feedback.feedbackId)
                          }
                          sx={{ alignSelf: "flex-start", mt: 1 }}
                        >
                          Viết phản hồi
                        </Button>
                      )}
                    </>
                  )}
                </Stack>
              </CardContent>
            </StyledCard>
          ))
        )}
      </Stack>

      {/* Pagination */}
      {totalCount > pageSize && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={Math.ceil(totalCount / pageSize)}
            page={pageNumber}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export default FeedbackManagement;
