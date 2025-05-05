/* eslint-disable react-hooks/exhaustive-deps */
import EventIcon from "@mui/icons-material/Event";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NoteIcon from "@mui/icons-material/Note";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import { Alert, Box, CircularProgress, TablePagination } from "@mui/material";
import Grid from "@mui/material/Grid2";

import { format, formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";
import { getCurrentAssignments } from "../../../api/Services/rentalService";
import {
  PagedResult,
  StaffPickupAssignmentDto,
} from "../../../types/rentalTypes";

// Import styled components
import {
  StyledPaper,
  StyledContainer,
} from "../../../components/StyledComponents";

// Import assignment-specific styled components
import {
  AssignmentCard,
  AssignmentHeader,
  StatusChip,
  StaffAvatar,
  StaffInfo,
  StaffName,
  StaffId,
  InfoItem,
  InfoText,
  NotesContainer,
  EmptyStateContainer,
  StyledDivider,
  TimeAgo,
  PageTitle,
} from "../../../components/manager/styles/AssignmentStyles";

const CurrentAssignments: React.FC = () => {
  const [assignments, setAssignments] =
    useState<PagedResult<StaffPickupAssignmentDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [6, 12, 24];

  const fetchAssignments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentAssignments(page + 1, rowsPerPage);
      setAssignments(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching assignments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <StyledContainer maxWidth="xl">
      <StyledPaper elevation={0} sx={{ p: 4 }}>
        <PageTitle variant="h4">Theo dõi nhiệm vụ</PageTitle>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {loading && !assignments ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {assignments?.items.length === 0 ? (
              <EmptyStateContainer elevation={0}>
                <Box sx={{ p: 3 }}>
                  <InventoryIcon
                    sx={{
                      fontSize: 48,
                      color: "text.secondary",
                      opacity: 0.6,
                      mb: 2,
                    }}
                  />
                  {/* <PageTitle variant="h5">Không có công việc</PageTitle> */}
                  <InfoText>
                    Hiện tại không có nhân viên nào được phân công phụ trách thu
                    hồi thiết bị.
                  </InfoText>
                </Box>
              </EmptyStateContainer>
            ) : (
              <>
                <Grid container spacing={3}>
                  {assignments?.items.map((assignment) => (
                    <Grid
                      size={{ xs: 12, md: 6, lg: 4 }}
                      key={assignment.assignmentId}
                    >
                      <AssignmentCard elevation={0}>
                        <Box sx={{ p: 3 }}>
                          <AssignmentHeader>
                            <StatusChip
                              label={
                                assignment.completedDate
                                  ? "Completed"
                                  : "In Progress"
                              }
                              status={
                                assignment.completedDate
                                  ? "completed"
                                  : "inProgress"
                              }
                              size="small"
                            />
                            <TimeAgo>
                              Assigned{" "}
                              {formatDistanceToNow(
                                new Date(assignment.assignedDate),
                                { addSuffix: true }
                              )}
                            </TimeAgo>
                          </AssignmentHeader>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <StaffAvatar>
                              {assignment.staffName.charAt(0)}
                            </StaffAvatar>
                            <StaffInfo>
                              <StaffName variant="h6">
                                {assignment.staffName}
                              </StaffName>
                              <StaffId variant="body2">
                                Staff ID: {assignment.staffId}
                              </StaffId>
                            </StaffInfo>
                          </Box>

                          <StyledDivider />

                          <InfoItem>
                            <InventoryIcon />
                            <InfoText>{assignment.equipmentName}</InfoText>
                          </InfoItem>

                          <InfoItem>
                            <PersonIcon />
                            <InfoText>{assignment.customerName}</InfoText>
                          </InfoItem>

                          <InfoItem>
                            <LocationOnIcon />
                            <InfoText>
                              {assignment.customerAddress ||
                                "Address not provided"}
                            </InfoText>
                          </InfoItem>

                          <InfoItem>
                            <PhoneIcon />
                            <InfoText>
                              {assignment.customerPhone || "Phone not provided"}
                            </InfoText>
                          </InfoItem>

                          <InfoItem>
                            <EventIcon />
                            <InfoText>
                              Expected Return:{" "}
                              {format(
                                new Date(assignment.expectedReturnDate),
                                "MMM dd, yyyy"
                              )}
                            </InfoText>
                          </InfoItem>

                          {assignment.notes && (
                            <NotesContainer>
                              <NoteIcon
                                fontSize="small"
                                sx={{ mt: 0.5, mr: 1.5 }}
                              />
                              <InfoText>{assignment.notes}</InfoText>
                            </NotesContainer>
                          )}
                        </Box>
                      </AssignmentCard>
                    </Grid>
                  ))}
                </Grid>

                <Box
                  sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}
                >
                  <TablePagination
                    component="div"
                    count={assignments?.totalCount || 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={rowsPerPageOptions}
                    sx={{
                      borderRadius: 2,
                      "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                        {
                          fontWeight: 500,
                        },
                    }}
                  />
                </Box>
              </>
            )}
          </>
        )}
      </StyledPaper>
    </StyledContainer>
  );
};

export default CurrentAssignments;
