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
} from "@mui/material";

// Mock data
const initialRentals = [
  { id: 1, name: "Rental A", status: "Active" },
  { id: 2, name: "Rental B", status: "Completed" },
  { id: 3, name: "Rental C", status: "Canceled" },
];

const ManageRentalStatus: React.FC = () => {
  const [rentals, setRentals] = useState(initialRentals);

  // Handle status change
  const handleStatusChange = (id: number, newStatus: string) => {
    setRentals((prev) =>
      prev.map((rental) =>
        rental.id === id ? { ...rental, status: newStatus } : rental
      )
    );
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Rental Status
      </Typography>
      <Stack spacing={3}>
        {rentals.map((rental) => (
          <Card key={rental.id} variant="outlined">
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">{rental.name}</Typography>
                <Select
                  value={rental.status}
                  onChange={(e) =>
                    handleStatusChange(rental.id, e.target.value)
                  }
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Canceled">Canceled</MenuItem>
                </Select>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    alert(
                      `Rental ${rental.name} status updated to ${rental.status}`
                    )
                  }
                >
                  Confirm
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default ManageRentalStatus;
