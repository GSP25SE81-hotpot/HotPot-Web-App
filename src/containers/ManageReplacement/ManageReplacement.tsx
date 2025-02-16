import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { styled, alpha } from "@mui/material/styles";

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  "& .MuiTypography-h4": {
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  backdropFilter: "blur(10px)",
  borderRadius: 16,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
}));

const StyledTable = styled(Table)(({ theme }) => ({
  "& .MuiTableCell-head": {
    fontWeight: 600,
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
  "& .MuiTableCell-root": {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  },
  "& .MuiTableRow-root": {
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      transform: "translateY(-2px)",
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: 12,
  },
  "& .MuiSelect-select": {
    padding: "8px 14px",
  },
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: alpha(theme.palette.background.paper, 0.05),
  },
})) as unknown as typeof Select;

const StyledChip = styled(Chip)<{ status: ReplacementStatus }>(
  ({ theme, status }) => ({
    borderRadius: 12,
    padding: "4px 8px",
    fontWeight: 500,
    backgroundColor: alpha(
      status === "Pending"
        ? theme.palette.warning.main
        : status === "In Progress"
        ? theme.palette.primary.main
        : theme.palette.success.main,
      0.1
    ),
    color:
      status === "Pending"
        ? theme.palette.warning.main
        : status === "In Progress"
        ? theme.palette.primary.main
        : theme.palette.success.main,
    border: `1px solid ${alpha(
      status === "Pending"
        ? theme.palette.warning.main
        : status === "In Progress"
        ? theme.palette.primary.main
        : theme.palette.success.main,
      0.2
    )}`,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      transform: "scale(1.05)",
    },
  })
);

const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "10px 24px",
  transition: "all 0.2s ease-in-out",
  textTransform: "none",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

interface ReplacementRequest {
  id: string;
  customerName: string;
  deviceId: string;
  issue: string;
  requestDate: string;
  status: "Pending" | "In Progress" | "Completed";
  assignedStaff?: string;
}

interface Staff {
  id: string;
  name: string;
  avatar: string;
}

type ReplacementStatus = "Pending" | "In Progress" | "Completed";

const fakeRequests: ReplacementRequest[] = [
  {
    id: "1",
    customerName: "John Doe",
    deviceId: "HP-1234",
    issue: "Heating element not working",
    requestDate: "2023-09-20",
    status: "Pending",
  },
  {
    id: "2",
    customerName: "Jane Smith",
    deviceId: "HP-5678",
    issue: "Temperature control malfunction",
    requestDate: "2023-09-21",
    status: "In Progress",
    assignedStaff: "staff-2",
  },
];

const fakeStaff: Staff[] = [
  { id: "staff-1", name: "Mike Chen", avatar: "M" },
  { id: "staff-2", name: "Sarah Johnson", avatar: "S" },
  { id: "staff-3", name: "Alex Thompson", avatar: "A" },
];

const ManageReplacement: React.FC = () => {
  const [requests, setRequests] = useState<ReplacementRequest[]>(fakeRequests);
  const [staff] = useState<Staff[]>(fakeStaff);

  const handleStatusChange = (
    requestId: string,
    newStatus: ReplacementStatus
  ) => {
    setRequests(
      requests.map((request) =>
        request.id === requestId ? { ...request, status: newStatus } : request
      )
    );
  };

  const handleStaffAssignment = (requestId: string, staffId: string) => {
    setRequests(
      requests.map((request) =>
        request.id === requestId
          ? { ...request, assignedStaff: staffId }
          : request
      )
    );
  };

  return (
    <StyledContainer maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Equipment Replacement Requests</Typography>
      </Box>

      <StyledPaper>
        <TableContainer>
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Device ID</TableCell>
                <TableCell>Issue</TableCell>
                <TableCell>Request Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned Staff</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.customerName}</TableCell>
                  <TableCell>{request.deviceId}</TableCell>
                  <TableCell>{request.issue}</TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>
                    <StyledChip
                      label={request.status}
                      status={request.status}
                    />
                  </TableCell>
                  <TableCell>
                    <StyledSelect<string>
                      value={request.assignedStaff || ""}
                      onChange={(e: SelectChangeEvent<string>) =>
                        handleStaffAssignment(request.id, e.target.value)
                      }
                      disabled={request.status === "Completed"}
                      sx={{ minWidth: 150 }}
                    >
                      <MenuItem value="">Assign Staff</MenuItem>
                      {staff.map((s) => (
                        <MenuItem key={s.id} value={s.id}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                backgroundColor: (theme) =>
                                  alpha(theme.palette.primary.main, 0.1),
                                color: "primary.main",
                                fontWeight: 600,
                              }}
                            >
                              {s.avatar}
                            </Avatar>
                            {s.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </TableCell>
                  <TableCell>
                    <StyledSelect
                      value={request.status}
                      onChange={(e: SelectChangeEvent) =>
                        handleStatusChange(
                          request.id,
                          e.target.value as ReplacementStatus
                        )
                      }
                      sx={{ minWidth: 150 }}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </StyledSelect>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </TableContainer>
      </StyledPaper>

      <AnimatedButton
        variant="contained"
        sx={{ mt: 3 }}
        onClick={() => {
          const newRequest: ReplacementRequest = {
            id: Date.now().toString(),
            customerName: "New Customer",
            deviceId: "HP-NEW",
            issue: "New issue reported",
            requestDate: new Date().toISOString().split("T")[0],
            status: "Pending",
          };
          setRequests([...requests, newRequest]);
        }}
      >
        Simulate New Request (Demo)
      </AnimatedButton>
    </StyledContainer>
  );
};

export default ManageReplacement;
