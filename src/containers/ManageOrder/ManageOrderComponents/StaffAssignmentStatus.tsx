import React from "react";
import { Box, Chip, Typography, Tooltip } from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleIcon from "@mui/icons-material/People";
import InfoIcon from "@mui/icons-material/Info";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { OrderWithDetailsDTO } from "../../../types/orderManagement";

interface StaffAssignmentStatusProps {
  order: OrderWithDetailsDTO;
}

const StaffAssignmentStatus: React.FC<StaffAssignmentStatusProps> = ({
  order,
}) => {
  // Check if we have multiple preparation staff assignments
  const hasMultiplePrepStaff =
    order.preparationAssignments && order.preparationAssignments.length > 1;

  // Tooltip content for preparation staff
  const prepStaffTooltipContent = (
    <Box sx={{ p: 0.5 }}>
      <Typography
        variant="caption"
        sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}
      >
        Danh sách nhân viên chuẩn bị:
      </Typography>
      {order.preparationAssignments!.map((assignment, index) => (
        <Typography
          key={assignment.staffId || index}
          variant="caption"
          display="block"
          sx={{ pl: 1 }}
        >
          {index + 1}. {assignment.staffName}
        </Typography>
      ))}
    </Box>
  );

  if (order.isPreparationStaffAssigned && order.isShippingStaffAssigned) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Chip
          label="Đã phân công đủ"
          color="success"
          size="small"
          sx={{
            px: 0.5, // reduce horizontal padding
            fontSize: "0.75rem", // reduce font size
            "& .MuiChip-label": {
              paddingLeft: 0.5,
              paddingRight: 0.5,
            },
            "& .MuiChip-icon": {
              marginLeft: 0,
            },
          }}
          icon={<CheckCircleIcon fontSize="inherit" />}
        />

        {/* Display multiple preparation staff with tooltip indicator */}
        {hasMultiplePrepStaff ? (
          <Tooltip title={prepStaffTooltipContent} arrow placement="right">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "help",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.04)",
                  borderRadius: 1,
                  px: 0.5,
                },
              }}
            >
              <PeopleIcon fontSize="small" color="info" />
              <Typography variant="caption">
                {`${order.preparationAssignments!.length} nhân viên chuẩn bị`}
              </Typography>
              <InfoIcon
                fontSize="small"
                color="action"
                sx={{
                  fontSize: "14px",
                  opacity: 0.9,
                  ml: 0.5,
                }}
              />
            </Box>
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

        {/* Display multiple preparation staff with tooltip indicator */}
        {hasMultiplePrepStaff ? (
          <Tooltip title={prepStaffTooltipContent} arrow placement="right">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "help",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.04)",
                  borderRadius: 1,
                  px: 0.5,
                },
              }}
            >
              <Typography variant="caption">
                {order.preparationAssignments!.length} nhân viên
              </Typography>
              <MoreHorizIcon
                fontSize="small"
                color="action"
                sx={{ fontSize: "14px", opacity: 0.7 }}
              />
            </Box>
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
    return <Chip label="Chưa phân công" color="default" size="small" />;
  }
};

export default StaffAssignmentStatus;
