import {
  Alert,
  CardContent,
  Chip,
  CircularProgress,
  Pagination,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import feedbackService, {
  FeedbackFilterRequest,
  FeedbackListDto,
  FeedbackStats,
} from "../../api/Services/feedbackService";
import { toast } from "react-toastify";
import {
  EmptyStateMessage,
  FeedbackContainer,
  FeedbackList,
  FeedbackTitle,
  FilterContainer,
  LoadingContainer,
  OrderInfoText,
  PaginationContainer,
  SectionHeading,
  StatItem,
  StatsContainer,
  StyledCard,
} from "../../components/StyledComponents";

const FeedbackManagement: React.FC = () => {
  // State for feedback data
  const [feedbacks, setFeedbacks] = useState<FeedbackListDto[]>([]);

  // State for UI
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State for pagination
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);

  // State for filtering
  const [filterType, setFilterType] = useState<"all" | "recent">("all");

  // State for statistics
  const [stats, setStats] = useState<FeedbackStats>({
    totalFeedbackCount: 0,
  });

  // Fetch feedback based on current filter
  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching feedback with filter: ${filterType}`);

      // Create filter request based on current filter type
      const filterRequest: FeedbackFilterRequest = {
        pageNumber,
        pageSize,
        // If filter is "recent", sort by creation date descending
        sortBy: "CreatedAt",
        ascending: false,
      };

      // Add any additional filter parameters based on filter type
      if (filterType === "recent") {
        // For example, get feedback from the last 7 days
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 7);
        filterRequest.fromDate = fromDate;
      }

      const response = await feedbackService.getFilteredFeedback(filterRequest);

      if (response?.data?.items) {
        setFeedbacks(response.data.items);
        setTotalCount(response.data.totalCount);
      } else {
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
  }, [filterType, pageNumber, pageSize]);

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
  }, [filterType, pageNumber, fetchFeedback, fetchStats]);

  // Handle filter change
  const handleFilterChange = (newFilter: "all" | "recent") => {
    setFilterType(newFilter);
    setPageNumber(1); // Reset to first page when filter changes
  };

  // Handle page change
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPageNumber(value);
  };

  // Close alert messages
  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <FeedbackContainer>
      <FeedbackTitle variant="h4">Quản lý Phản hồi Khách hàng</FeedbackTitle>

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
          {/* Add other stats if they become available in the backend */}
        </Stack>
      </StatsContainer>

      {/* Filters */}
      <FilterContainer>
        <Chip
          label="Tất cả"
          onClick={() => handleFilterChange("all")}
          color={filterType === "all" ? "primary" : "default"}
          sx={{ px: 2, borderRadius: "10px" }}
        />
        <Chip
          label="Gần đây"
          onClick={() => handleFilterChange("recent")}
          color={filterType === "recent" ? "primary" : "default"}
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
                      {feedback.userName || "Khách hàng"}
                    </Typography>
                  </Stack>

                  {/* Order Information */}
                  <OrderInfoText>
                    Đơn hàng: #{feedback.orderId} -
                    {new Date(feedback.createdAt).toLocaleDateString("vi-VN")}
                  </OrderInfoText>
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
