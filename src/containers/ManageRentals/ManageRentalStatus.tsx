/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  Button,
  Stack,
  ThemeProvider,
  createTheme,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

// Custom theme with updated typography
const theme = createTheme({
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
  },
});

// Custom colors
const customColors = {
  ivory: '#FFFFF0',
  maroon: '#800000',
  lightRed: '#FF6F61',
  palegoldenrod: '#EEE8AA',
  powderblue: '#B0E0E6',
  black: '#000000'
};

// Styled components
const StyledCard = styled(Card)(() => ({
  backgroundColor: customColors.ivory,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 24px rgba(0, 0, 0, 0.15)`,
  },
  border: `1px solid ${customColors.palegoldenrod}`,
}));

const ActionButton = styled(Button)(() => ({
  backgroundColor: customColors.maroon,
  color: customColors.ivory,
  padding: '8px 24px',
  '&:hover': {
    backgroundColor: customColors.black,
  },
}));

const StyledSelect = styled(Select)(() => ({
  '& .MuiSelect-select': {
    padding: '8px 16px',
    minWidth: 180,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: customColors.palegoldenrod,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: customColors.maroon,
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
    duration: "2 hours"
  },
  { 
    id: 2, 
    hotpotName: "Basic Hotpot Set", 
    customerName: "Jane Smith",
    status: "Ready for Pickup",
    lastUpdated: "3 hours ago",
    duration: "3 hours"
  },
  { 
    id: 3, 
    hotpotName: "Family Hotpot Set", 
    customerName: "Emily Johnson",
    status: "Completed",
    lastUpdated: "Yesterday",
    duration: "4 hours"
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'In Use':
      return <RestaurantIcon sx={{ color: customColors.lightRed }} />;
    case 'Ready for Pickup':
      return <PendingActionsIcon sx={{ color: customColors.palegoldenrod }} />;
    case 'Completed':
      return <DoneAllIcon sx={{ color: customColors.maroon }} />;
    default:
      return <DoneAllIcon sx={{ color: customColors.maroon }} />;
  }
};

const getStatusChipColor = (status: string) => {
  switch (status) {
    case 'In Use':
      return customColors.lightRed;
    case 'Ready for Pickup':
      return customColors.palegoldenrod;
    case 'Completed':
      return customColors.maroon;
    default:
      return customColors.black;
  }
};

const ManageHotpotRentals: React.FC = () => {
  const [rentals, setRentals] = useState<HotpotRental[]>(initialRentals);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRental, setSelectedRental] = useState<HotpotRental | null>(null);
  const [tempStatus, setTempStatus] = useState('');

  const handleStatusChange = (id: number, newStatus: string) => {
    const rental = rentals.find(r => r.id === id);
    if (rental) {
      setSelectedRental(rental);
      setTempStatus(newStatus);
      setOpenDialog(true);
    }
  };

  const handleConfirmStatus = () => {
    if (selectedRental && tempStatus) {
      setRentals(prev =>
        prev.map(rental =>
          rental.id === selectedRental.id
            ? { ...rental, status: tempStatus, lastUpdated: 'Just now' }
            : rental
        )
      );
      setOpenDialog(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        flexGrow: 1, 
        p: 3, 
        backgroundColor: customColors.powderblue,
        minHeight: '100vh'
      }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            color: customColors.black,
            mb: 4
          }}
        >
          Manage Hotpot Rentals
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
                    <Typography 
                      variant="h6"
                      sx={{ color: customColors.black }}
                    >
                      {rental.hotpotName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: customColors.black }}>
                      Customer: {rental.customerName}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Tooltip title="Last Updated">
                        <Typography variant="body2" sx={{ color: customColors.maroon }}>
                          {rental.lastUpdated}
                        </Typography>
                      </Tooltip>
                      <Chip
                        icon={getStatusIcon(rental.status)}
                        label={rental.status}
                        size="small"
                        sx={{
                          bgcolor: `${getStatusChipColor(rental.status)}20`,
                          color: getStatusChipColor(rental.status),
                          borderColor: getStatusChipColor(rental.status),
                          border: '1px solid'
                        }}
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
          <DialogTitle>
            Confirm Status Change
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to change the status of {selectedRental?.hotpotName} to {tempStatus}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <ActionButton onClick={handleConfirmStatus}>
              Confirm
            </ActionButton>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default ManageHotpotRentals;
