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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";

// Custom colors
const customColors = {
  ivory: "#FFFFF0",
  maroon: "#800000",
  palegoldenrod: "#EEE8AA",
  powderblue: "#B0E0E6",
  black: "#000000",
};

// Styled components
const StyledCard = styled(Card)(() => ({
  backgroundColor: customColors.ivory,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 8px 24px rgba(0, 0, 0, 0.15)`,
  },
  border: `1px solid ${customColors.palegoldenrod}`,
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Available":
      return <CheckCircleIcon sx={{ color: "#4CAF50" }} />;
    case "Rented":
      return <BuildIcon sx={{ color: customColors.maroon }} />;
    default:
      return <BuildIcon sx={{ color: customColors.maroon }} />;
  }
};

const getStatusChipColor = (status: string) => {
  switch (status) {
    case "Available":
      return "#4CAF50";
    case "Rented":
      return customColors.maroon;
    default:
      return customColors.black;
  }
};

const EquipmentAvailability: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: customColors.ivory,
        minHeight: "100vh",
      }}
    >
      <Stack spacing={4}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: customColors.black,
              mb: 2,
            }}
          >
            Dịch vụ cho thuê lẩu sẵn có
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: customColors.maroon,
              mb: 3,
            }}
          >
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
                      <Typography
                        variant="h6"
                        sx={{ color: customColors.black }}
                      >
                        {equipment.name}
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Chip
                          icon={getStatusIcon(equipment.status)}
                          label={equipment.status}
                          size="small"
                          sx={{
                            bgcolor: `${getStatusChipColor(
                              equipment.status
                            )}20`,
                            color: getStatusChipColor(equipment.status),
                            borderColor: getStatusChipColor(equipment.status),
                            border: "1px solid",
                          }}
                        />
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LocalDiningIcon
                            sx={{
                              color: customColors.maroon,
                              fontSize: "1rem",
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ color: customColors.maroon }}
                          >
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
                            <AccessTimeIcon
                              sx={{
                                color: customColors.maroon,
                                fontSize: "1rem",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: customColors.maroon }}
                            >
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
                            <BuildIcon
                              sx={{
                                color: customColors.maroon,
                                fontSize: "1rem",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: customColors.maroon }}
                            >
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
