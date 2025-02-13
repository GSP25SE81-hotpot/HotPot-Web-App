/* eslint-disable @typescript-eslint/no-explicit-any */
import DoneAllIcon from "@mui/icons-material/DoneAll";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[6],
  },
  border: `1px solid ${theme.palette.divider}`,
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiSelect-select": {
    padding: theme.spacing(1, 2),
    minWidth: 180,
  },
}));

interface HotpotRental {
  id: number;
  hotpotName: string;
  status: string;
  customerName: string;
  duration?: string;
  lastUpdated?: string;
}

const initialRentals: HotpotRental[] = [
  {
    id: 1,
    hotpotName: "Premium Hotpot Set",
    customerName: "John Doe",
    status: "In Use",
    lastUpdated: "1 hour ago",
    duration: "2 hours",
  },
  {
    id: 2,
    hotpotName: "Basic Hotpot Set",
    customerName: "Jane Smith",
    status: "Ready for Pickup",
    lastUpdated: "3 hours ago",
    duration: "3 hours",
  },
  {
    id: 3,
    hotpotName: "Family Hotpot Set",
    customerName: "Emily Johnson",
    status: "Completed",
    lastUpdated: "Yesterday",
    duration: "4 hours",
  },
];

const ManageRentalStatus: React.FC = () => {
  const theme = useTheme();
  const [rentals, setRentals] = useState<HotpotRental[]>(initialRentals);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRental, setSelectedRental] = useState<HotpotRental | null>(
    null
  );
  const [tempStatus, setTempStatus] = useState("");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Use":
        return <RestaurantIcon color="primary" />;
      case "Ready for Pickup":
        return <PendingActionsIcon color="warning" />;
      case "Completed":
        return <DoneAllIcon color="success" />;
      default:
        return <DoneAllIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Use":
        return "primary";
      case "Ready for Pickup":
        return "warning";
      case "Completed":
        return "success";
      default:
        return "default";
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    const rental = rentals.find((r) => r.id === id);
    if (rental) {
      setSelectedRental(rental);
      setTempStatus(newStatus);
      setOpenDialog(true);
    }
  };

  const handleConfirmStatus = () => {
    if (selectedRental && tempStatus) {
      setRentals((prev) =>
        prev.map((rental) =>
          rental.id === selectedRental.id
            ? { ...rental, status: tempStatus, lastUpdated: "Just now" }
            : rental
        )
      );
      setOpenDialog(false);
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Quản lý cho thuê lẩu
      </Typography>
      <Stack spacing={3}>
        {rentals.map((rental) => (
          <StyledCard key={rental.id}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={3}
              >
                <Stack spacing={1}>
                  <Typography variant="h6">{rental.hotpotName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Khách hàng: {rental.customerName}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Tooltip title="Last Updated">
                      <Typography variant="body2" color="text.secondary">
                        {rental.lastUpdated}
                      </Typography>
                    </Tooltip>
                    <Chip
                      icon={getStatusIcon(rental.status)}
                      label={rental.status}
                      size="small"
                      color={getStatusColor(rental.status)}
                      variant="outlined"
                    />
                  </Stack>
                </Stack>

                <StyledSelect
                  value={rental.status}
                  onChange={(e: any) =>
                    handleStatusChange(rental.id, e.target.value)
                  }
                >
                  <MenuItem value="In Use">In Use</MenuItem>
                  <MenuItem value="Ready for Pickup">Ready for Pickup</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </StyledSelect>
              </Stack>
            </CardContent>
          </StyledCard>
        ))}
      </Stack>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn thay đổi trạng thái của{" "}
            {selectedRental?.hotpotName} về {tempStatus}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleConfirmStatus}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageRentalStatus;
