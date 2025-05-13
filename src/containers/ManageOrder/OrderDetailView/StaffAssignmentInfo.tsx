// src/pages/OrderManagement/components/StaffAssignmentInfo.tsx
import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import { StaffAssignmentDTO } from "../../../types/orderManagement";
import { formatDetailDate } from "../../../utils/formatters";

interface StaffAssignmentInfoProps {
  preparationAssignment?: StaffAssignmentDTO;
  shippingAssignment?: StaffAssignmentDTO;
}

const StaffAssignmentInfo: React.FC<StaffAssignmentInfoProps> = ({
  preparationAssignment,
  shippingAssignment,
}) => {
  return (
    <Box sx={{ mt: 2, mb: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Thông tin phân công nhân viên
      </Typography>

      {preparationAssignment && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mr: 1 }}>
              Nhân viên chuẩn bị:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {preparationAssignment.staffName}
            </Typography>
            <Chip
              label="Chuẩn bị"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ ml: 1, fontSize: "0.75rem" }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Phân công lúc:{" "}
            {formatDetailDate(preparationAssignment.assignedDate)}
          </Typography>
          {preparationAssignment.completedDate && (
            <Typography variant="body2" color="text.secondary">
              Hoàn thành lúc:{" "}
              {formatDetailDate(preparationAssignment.completedDate)}
            </Typography>
          )}
        </Box>
      )}

      {shippingAssignment && (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mr: 1 }}>
              Nhân viên giao hàng:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {shippingAssignment.staffName}
            </Typography>
            <Chip
              label="Giao hàng"
              size="small"
              color="secondary"
              variant="outlined"
              sx={{ ml: 1, fontSize: "0.75rem" }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Phân công lúc: {formatDetailDate(shippingAssignment.assignedDate)}
          </Typography>
          {shippingAssignment.completedDate && (
            <Typography variant="body2" color="text.secondary">
              Hoàn thành lúc:{" "}
              {formatDetailDate(shippingAssignment.completedDate)}
            </Typography>
          )}
        </Box>
      )}

      {!preparationAssignment && !shippingAssignment && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: "italic" }}
        >
          Chưa có nhân viên nào được phân công cho đơn hàng này.
        </Typography>
      )}
    </Box>
  );
};

export default StaffAssignmentInfo;
