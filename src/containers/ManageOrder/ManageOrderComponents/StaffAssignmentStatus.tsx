import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { OrderWithDetailsDTO } from "../../../types/orderManagement";

interface StaffAssignmentStatusProps {
  order: OrderWithDetailsDTO;
}

const StaffAssignmentStatus: React.FC<StaffAssignmentStatusProps> = ({
  order,
}) => {
  if (order.isPreparationStaffAssigned && order.isShippingStaffAssigned) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Chip
          label="Đã phân công đầy đủ"
          color="success"
          size="small"
          icon={<CheckCircleIcon fontSize="small" />}
        />
        {order.preparationAssignment && (
          <Typography
            variant="caption"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <BuildIcon fontSize="small" color="info" />
            {order.preparationAssignment.staffName}
          </Typography>
        )}
        {order.shippingAssignment && (
          <Typography
            variant="caption"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <LocalShippingIcon fontSize="small" color="secondary" />
            {order.shippingAssignment.staffName}
          </Typography>
        )}
      </Box>
    );
  } else if (order.isPreparationStaffAssigned) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Chip
          label="Đã phân công"
          color="info"
          size="small"
          icon={<BuildIcon fontSize="small" />}
        />
        {order.preparationAssignment && (
          <Typography
            variant="caption"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            {order.preparationAssignment.staffName}
          </Typography>
        )}
      </Box>
    );
  } else if (order.isShippingStaffAssigned) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Chip
          label="Đã phân công giao hàng"
          color="warning"
          size="small"
          icon={<LocalShippingIcon fontSize="small" />}
        />
        {order.shippingAssignment && (
          <Typography
            variant="caption"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            {order.shippingAssignment.staffName}
          </Typography>
        )}
      </Box>
    );
  } else {
    return (
      <Chip
        label="Chưa phân công"
        color="default"
        size="small"
        icon={<ErrorOutlineIcon fontSize="small" />}
      />
    );
  }
};

export default StaffAssignmentStatus;
