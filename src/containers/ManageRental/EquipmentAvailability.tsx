import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BuildIcon from "@mui/icons-material/Build";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalDiningIcon from "@mui/icons-material/LocalDining"; // New icon for hotpot equipment
import {
  Box,
  Card,
  CardContent,
  Chip,
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

interface Equipment {
  id: number;
  name: string;
  status: string;
  lastRentalDate?: string;
  nextAvailableDate?: string;
  renter?: string;
}

// Mock hotpot rental data
const equipmentData: Equipment[] = [
  {
    id: 1,
    name: "Large Hotpot Cooker",
    status: "Available",
    lastRentalDate: "2024-01-01",
    nextAvailableDate: "2024-01-10",
    renter: "John Doe",
  },
  {
    id: 2,
    name: "Table Grill Set",
    status: "Rented",
    lastRentalDate: "2024-01-05",
    nextAvailableDate: "2024-01-15",
    renter: "Jane Smith",
  },
  {
    id: 3,
    name: "Soup Base Container",
    status: "Available",
    lastRentalDate: "2024-01-03",
    nextAvailableDate: "2024-01-12",
    renter: "Mike Johnson",
  },
  {
    id: 4,
    name: "Portable Burner",
    status: "Rented",
    lastRentalDate: "2024-01-06",
    nextAvailableDate: "2024-01-18",
    renter: "Sarah Wilson",
  },
];

const EquipmentAvailability: React.FC = () => {
  const theme = useTheme();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Available":
        return <CheckCircleIcon color="success" />;
      case "Rented":
        return <BuildIcon color="error" />;
      default:
        return <BuildIcon />;
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Dịch vụ cho thuê lẩu sẵn có
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {equipmentData.filter((e) => e.status === "Available").length} of{" "}
            {equipmentData.length} mặt hàng có sẵn để cho thuê
          </Typography>
        </Box>

        <Stack spacing={2}>
          {equipmentData.map((equipment) => (
            <StyledCard
              key={equipment.id}
              onMouseEnter={() => setHoveredId(equipment.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack spacing={1}>
                      <Typography variant="h6">{equipment.name}</Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Chip
                          icon={getStatusIcon(equipment.status)}
                          label={equipment.status}
                          size="small"
                          variant="outlined"
                        />
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LocalDiningIcon color="primary" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            Renter: {equipment.renter}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>

                  {hoveredId === equipment.id && (
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Tooltip title="Last Rental Date">
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <AccessTimeIcon color="primary" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              Last: {equipment.lastRentalDate}
                            </Typography>
                          </Stack>
                        </Tooltip>
                        <Tooltip title="Next Available Date">
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <BuildIcon color="primary" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              Next: {equipment.nextAvailableDate}
                            </Typography>
                          </Stack>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </StyledCard>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default EquipmentAvailability;
