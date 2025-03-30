import { HubConnectionState } from "@microsoft/signalr";
import {
  Alert,
  Button,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Pagination,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import feedbackService, {
  FeedbackStats,
  ManagerFeedbackListDto,
} from "../../api/Services/feedbackService";
import { toast } from "react-toastify";
import { feedbackHubService } from "../../api/Services/hubServices";
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
} from "../../components/StyledComponents";

const FeedbackManagement: React.FC = () => {
  // State for feedback data
  const [feedbacks, setFeedbacks] = useState<ManagerFeedbackListDto[]>([]);
  const [responseText, setResponseText] = useState<string>("");
  const [activeFeedbackId, setActiveFeedbackId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "pending">("all");

  // State for UI
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State for pagination
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);

  // State for statistics
  const [stats, setStats] = useState<FeedbackStats>({
    totalFeedbackCount: 0,
    pendingFeedbackCount: 0,
    approvedFeedbackCount: 0,
    rejectedFeedbackCount: 0,
    unrespondedFeedbackCount: 0,
    respondedFeedbackCount: 0,
    responseRate: 0,
  });

  // State for SignalR connection
  const [hubConnectionState, setHubConnectionState] =
    useState<HubConnectionState>(HubConnectionState.Disconnected);

  // Get manager ID from localStorage
  const managerId = parseInt(localStorage.getItem("uid") || "1");
  const managerName = localStorage.getItem("userName") || "Manager";

  // Initialize SignalR connection
  useEffect(() => {
    const initializeSignalR = async () => {
      try {
        // Connect to the feedback hub
        await feedbackHubService.connect(managerId, "Manager");
        setHubConnectionState(HubConnectionState.Connected);

        // Register for connection confirmation
        feedbackHubService.onConnectionRegistered((userId) => {
          console.log(`Connection registered for user ${userId}`);
        });

        // Register for approved feedback notifications
        feedbackHubService.onReceiveApprovedFeedback(
          (feedbackTitle, adminName) => {
            setSuccess(
              `New feedback "${feedbackTitle}" approved by ${adminName}`
            );
            // Refresh the feedback list and stats
            fetchFeedback();
            fetchStats();
          }
        );

        // Register for feedback response notifications
        feedbackHubService.onReceiveFeedbackResponse(
          (feedbackId, responseMessage, managerName, responseDate) => {
            // Update the feedback in the list if it exists
            setFeedbacks((prevFeedbacks) =>
              prevFeedbacks.map((fb) =>
                fb.feedbackId === feedbackId
                  ? {
                      ...fb,
                      response: responseMessage,
                      responseDate: responseDate,
                      hasResponse: true,
                    }
                  : fb
              )
            );
          }
        );
      } catch (err) {
        console.error("Failed to initialize SignalR:", err);
        setHubConnectionState(HubConnectionState.Disconnected);
        setError("Failed to connect to real-time notifications");
      }
    };

    initializeSignalR();

    // Cleanup function to disconnect from SignalR
    return () => {
      feedbackHubService.disconnect();
    };
  }, [managerId]);

  // Fetch feedback based on current filter
  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching feedback with filter: ${filter}`);
      let response;
      if (filter === "pending") {
        response = await feedbackService.getUnrespondedFeedback(
          pageNumber,
          pageSize
        );
      } else {
        response = await feedbackService.getAllFeedback(pageNumber, pageSize);
      }

      // Check if response is directly a PagedResult
      // if (response.items !== undefined) {
      //   setFeedbacks(response.items);
      //   setTotalCount(response.totalCount);
      // }
      // Check if response is an ApiResponse with data property
      if (response?.data?.items) {
        setFeedbacks(response.data.items);
        setTotalCount(response.data.totalCount);
      }
      // Neither structure matches
      else {
        console.error("Malformed data received:", response);
        throw new Error("Invalid feedback data structure");
      }
    } catch (err: unknown) {
      console.error("Full fetch error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filter, pageNumber, pageSize]);

  // Fetch feedback statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await feedbackService.getFeedbackStats();
      if (response?.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  // Load data when component mounts or filter/page changes
  useEffect(() => {
    fetchFeedback();
    fetchStats();
  }, [filter, pageNumber, fetchFeedback, fetchStats]);

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
      const response = await feedbackService.respondToFeedback(
        feedbackId,
        {
          managerId,
          response: responseText,
        },
        {
          userId: managerId,
          name: managerName,
        }
      );

      if (response && response.data) {
        // Update the feedback in the list
        setFeedbacks(
          feedbacks.map((fb) =>
            fb.feedbackId === feedbackId
              ? {
                  ...fb,
                  response: responseText,
                  responseDate: new Date(),
                  hasResponse: true,
                }
              : fb
          )
        );

        setSuccess("Response submitted successfully");
        setResponseText("");
        setActiveFeedbackId(null);

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

  return (
    <FeedbackContainer>
      <FeedbackTitle variant="h4">Quản lý Phản hồi Khách hàng</FeedbackTitle>

      {/* Connection status */}
      {hubConnectionState !== HubConnectionState.Connected && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Trạng thái kết nối: {hubConnectionState}
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
          label="Tất cả"
          onClick={() => handleFilterChange("all")}
          color={filter === "all" ? "primary" : "default"}
          sx={{ px: 2, borderRadius: "10px" }}
        />
        <Chip
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
                      label={feedback.hasResponse ? "Đã phản hồi" : "Chờ xử lý"}
                      status={feedback.hasResponse ? "Completed" : "Pending"}
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

                  {/* Order Information */}
                  {feedback.order && (
                    <OrderInfoText>
                      Đơn hàng: #{feedback.order.orderId} -
                      {new Date(feedback.createdAt).toLocaleDateString("vi-VN")}
                    </OrderInfoText>
                  )}

                  {/* Response Section */}
                  {feedback.hasResponse && feedback.responseDate && (
                    <>
                      <Divider />
                      <ResponseSection>
                        <Typography variant="subtitle2" color="primary">
                          Phản hồi của quản lý:
                        </Typography>
                        <Typography variant="body2">
                          {/* This would be populated from the detailed feedback */}
                          {/* For now, we'll show a placeholder */}
                          Phản hồi đã được gửi
                        </Typography>
                        <DateText>
                          Phản hồi lúc:{" "}
                          {new Date(feedback.responseDate).toLocaleString(
                            "vi-VN"
                          )}
                        </DateText>
                      </ResponseSection>
                    </>
                  )}

                  {/* Response Input */}
                  {!feedback.hasResponse && (
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
