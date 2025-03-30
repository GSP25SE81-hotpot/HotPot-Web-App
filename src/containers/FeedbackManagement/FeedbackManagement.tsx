// src/components/FeedbackManagement.tsx
import { HubConnectionState } from "@microsoft/signalr";
import { Star, StarBorder } from "@mui/icons-material";
import {
  Alert,
  Button,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Pagination,
  Rating,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import feedbackService, { Feedback } from "../../api/Services/feedbackService";
import {
  DateText,
  EmptyStateMessage,
  FeedbackContainer,
  FeedbackList,
  FeedbackTitle,
  FilterContainer,
  LoadingContainer,
  OrderInfoText,
  PaginationContainer,
  RatingContainer,
  RatingScoreText,
  ResponseActionsContainer,
  ResponseButton,
  ResponseInputContainer,
  ResponseSection,
  SectionHeading,
  StatItem,
  StatsContainer,
  StyledCard,
  StyledChip,
  SubmitButton,
} from "../../components/StyledComponents"; // Adjust the import path as needed
import { useSignalR } from "../../context/SignalRContext";

const FeedbackManagement: React.FC = () => {
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
    <FeedbackContainer>
      <FeedbackTitle variant="h4">Quản lý Phản hồi Khách hàng</FeedbackTitle>

      {/* Connection status */}
      {connectionState !== HubConnectionState.Connected && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Trạng thái kết nối: {connectionState}
        </Alert>
      )}

      {/* Stats Section */}
      <StatsContainer>
        <SectionHeading variant="h6">Thống kê</SectionHeading>
        <Stack direction="row" spacing={4} sx={{ flexWrap: "wrap" }}>
          <StatItem>
            <Typography variant="subtitle2" color="text.secondary">
              Tổng số phản hồi
            </Typography>
            <Typography variant="h5">{stats.totalFeedbackCount}</Typography>
          </StatItem>
          <StatItem>
            <Typography variant="subtitle2" color="text.secondary">
              Đã phản hồi
            </Typography>
            <Typography variant="h5">{stats.respondedFeedbackCount}</Typography>
          </StatItem>
          <StatItem>
            <Typography variant="subtitle2" color="text.secondary">
              Chưa phản hồi
            </Typography>
            <Typography variant="h5">
              {stats.unrespondedFeedbackCount}
            </Typography>
          </StatItem>
          <StatItem>
            <Typography variant="subtitle2" color="text.secondary">
              Tỷ lệ phản hồi
            </Typography>
            <Typography variant="h5">
              {stats.responseRate.toFixed(1)}%
            </Typography>
          </StatItem>
        </Stack>
      </StatsContainer>

      {/* Filters */}
      <FilterContainer>
        <Chip
          key="all"
          label="Tất cả"
          onClick={() => handleFilterChange("all")}
          color={filter === "all" ? "primary" : "default"}
          sx={{ px: 2, borderRadius: "10px" }}
        />
        <Chip
          key="pending"
          label="Chờ xử lý"
          onClick={() => handleFilterChange("pending")}
          color={filter === "pending" ? "primary" : "default"}
          sx={{ px: 2, borderRadius: "10px" }}
        />
      </FilterContainer>

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
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      )}

      {/* Feedback List */}
      <FeedbackList>
        {feedbacks.length === 0 && !loading ? (
          <EmptyStateMessage variant="body1">
            Không có phản hồi nào
          </EmptyStateMessage>
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
                    <StyledChip
                      label={feedback.response ? "Đã phản hồi" : "Chờ xử lý"}
                      status={feedback.response ? "Completed" : "Pending"}
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
                    <RatingContainer>
                      <Rating
                        value={feedback.rating}
                        readOnly
                        precision={0.5}
                        icon={<Star fontSize="inherit" />}
                        emptyIcon={<StarBorder fontSize="inherit" />}
                      />
                      <RatingScoreText>({feedback.rating}/5)</RatingScoreText>
                    </RatingContainer>
                  )}

                  {/* Order Information */}
                  {feedback.order && (
                    <OrderInfoText>
                      Đơn hàng: #{feedback.order.orderNumber} -
                      {new Date(feedback.createdAt).toLocaleDateString("vi-VN")}
                    </OrderInfoText>
                  )}

                  {/* Response Section */}
                  {feedback.response && (
                    <>
                      <Divider />
                      <ResponseSection>
                        <Typography variant="subtitle2" color="primary">
                          Phản hồi của quản lý:
                        </Typography>
                        <Typography variant="body2">
                          {feedback.response}
                        </Typography>
                        {feedback.responseDate && (
                          <DateText>
                            Phản hồi lúc:{" "}
                            {new Date(feedback.responseDate).toLocaleString(
                              "vi-VN"
                            )}
                          </DateText>
                        )}
                      </ResponseSection>
                    </>
                  )}

                  {/* Response Input */}
                  {!feedback.response && (
                    <>
                      <Divider />
                      {activeFeedbackId === feedback.feedbackId ? (
                        <ResponseInputContainer>
                          <TextField
                            multiline
                            rows={3}
                            variant="outlined"
                            label="Viết phản hồi"
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                          />
                          <ResponseActionsContainer>
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleSetActiveFeedback(feedback.feedbackId)
                              }
                            >
                              Hủy
                            </Button>
                            <SubmitButton
                              variant="contained"
                              onClick={() =>
                                handleSubmitResponse(feedback.feedbackId)
                              }
                              disabled={loading}
                            >
                              Gửi phản hồi
                            </SubmitButton>
                          </ResponseActionsContainer>
                        </ResponseInputContainer>
                      ) : (
                        <ResponseButton
                          variant="outlined"
                          color="primary"
                          onClick={() =>
                            handleSetActiveFeedback(feedback.feedbackId)
                          }
                        >
                          Viết phản hồi
                        </ResponseButton>
                      )}
                    </>
                  )}
                </Stack>
              </CardContent>
            </StyledCard>
          ))
        )}
      </FeedbackList>

      {/* Pagination */}
      {totalCount > pageSize && (
        <PaginationContainer>
          <Pagination
            count={Math.ceil(totalCount / pageSize)}
            page={pageNumber}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </PaginationContainer>
      )}
    </FeedbackContainer>
  );
};

export default FeedbackManagement;
