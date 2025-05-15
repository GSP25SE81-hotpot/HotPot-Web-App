/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Box, Chip, Typography, Tooltip } from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PeopleIcon from "@mui/icons-material/People";
import { OrderWithDetailsDTO } from "../../../types/orderManagement";
// import { StaffName } from "../../../components/manager/styles/PendingDeliveriesListStyles";

interface StaffAssignmentStatusProps {
  order: OrderWithDetailsDTO;
}

const StaffAssignmentStatus: React.FC<StaffAssignmentStatusProps> = ({
  order,
}) => {
  // Check if we have multiple preparation staff assignments
  const hasMultiplePrepStaff =
    order.preparationAssignments && order.preparationAssignments.length > 1;

  if (order.isPreparationStaffAssigned && order.isShippingStaffAssigned) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Chip
          label="Đã phân công đầy đủ"
          color="success"
          size="small"
          icon={<CheckCircleIcon fontSize="small" />}
        />

        {/* Display multiple preparation staff if available */}
        {hasMultiplePrepStaff ? (
          <Tooltip
            title={
              <Box sx={{ p: 0.5 }}>
                {order.preparationAssignments!.map((assignment, _index) => (
                  <Typography
                    key={assignment.staffId}
                    variant="caption"
                    display="block"
                  >
                    {assignment.staffName}
                  </Typography>
                ))}
              </Box>
            }
          >
            <Typography
              variant="caption"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <PeopleIcon fontSize="small" color="info" />
              {`${order.preparationAssignments!.length} nhân viên chuẩn bị`}
            </Typography>
          </Tooltip>
        ) : order.preparationAssignments &&
          order.preparationAssignments.length === 1 ? (
          <Typography
            variant="caption"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <BuildIcon fontSize="small" color="info" />
            {order.preparationAssignments[0].staffName}
          </Typography>
        ) : (
          order.preparationAssignments && (
            <Typography
              variant="caption"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <BuildIcon fontSize="small" color="info" />
              {order.preparationAssignments[0].staffName}
            </Typography>
          )
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
        {/* Use different icon and label for multiple staff */}
        <Chip
          label={
            hasMultiplePrepStaff ? "Nhiều nhân viên chuẩn bị" : "Đã phân công"
          }
          color="info"
          size="small"
          icon={
            hasMultiplePrepStaff ? (
              <PeopleIcon fontSize="small" />
            ) : (
              <BuildIcon fontSize="small" />
            )
          }
        />

        {/* Display multiple preparation staff if available */}
        {hasMultiplePrepStaff ? (
          <Tooltip
            title={
              <Box sx={{ p: 0.5 }}>
                {order.preparationAssignments!.map((assignment, index) => (
                  <Typography key={index} variant="caption" display="block">
                    {assignment.staffName}
                  </Typography>
                ))}
              </Box>
            }
          >
            <Typography
              variant="caption"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              {order.preparationAssignments!.length} nhân viên
            </Typography>
          </Tooltip>
        ) : order.preparationAssignments &&
          order.preparationAssignments.length === 1 ? (
          <Typography
            variant="caption"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            {order.preparationAssignments[0].staffName}
          </Typography>
        ) : (
          order.preparationAssignments && (
            <Typography
              variant="caption"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              {order.preparationAssignments[0].staffName}
            </Typography>
          )
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
