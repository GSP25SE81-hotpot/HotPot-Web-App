// src/pages/OrderManagement/components/StaffAssignmentInfo.tsx
import React from "react";
import { Box, Chip, Typography, Divider } from "@mui/material";
import { StaffAssignmentDTO } from "../../../types/orderManagement";
import { formatDetailDate } from "../../../utils/formatters";
import PeopleIcon from "@mui/icons-material/People";

interface StaffAssignmentInfoProps {
  preparationAssignments?: StaffAssignmentDTO[];
  shippingAssignment?: StaffAssignmentDTO;
}

const StaffAssignmentInfo: React.FC<StaffAssignmentInfoProps> = ({
  preparationAssignments = [],
  shippingAssignment,
}) => {
  const hasMultiplePrepStaff =
    preparationAssignments && preparationAssignments.length > 1;

  return (
    <Box sx={{ mt: 2, mb: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Thông tin phân công nhân viên
      </Typography>

      {/* Preparation Staff Section */}
      {preparationAssignments && preparationAssignments.length > 0 ? (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mr: 1 }}>
              Nhân viên chuẩn bị:
            </Typography>

            {hasMultiplePrepStaff ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PeopleIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {preparationAssignments.length} nhân viên
                </Typography>
                <Chip
                  label="Chuẩn bị"
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ ml: 1, fontSize: "0.75rem" }}
                />
              </Box>
            ) : (
              <>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {preparationAssignments[0].staffName}
                </Typography>
                <Chip
                  label="Chuẩn bị"
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ ml: 1, fontSize: "0.75rem" }}
                />
              </>
            )}
          </Box>

          {/* Show all staff members if multiple */}
          {hasMultiplePrepStaff && (
            <Box sx={{ ml: 2, mt: 1, mb: 1 }}>
              {preparationAssignments.map((assignment, index) => (
                <Box key={assignment.assignmentId || index} sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {index + 1}. {assignment.staffName}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", ml: 2 }}
                  >
                    Phân công lúc: {formatDetailDate(assignment.assignedDate)}
                  </Typography>
                  {assignment.completedDate && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", ml: 2 }}
                    >
                      Hoàn thành lúc:{" "}
                      {formatDetailDate(assignment.completedDate)}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* Show assignment date for single staff */}
          {!hasMultiplePrepStaff && preparationAssignments.length === 1 && (
            <>
              <Typography variant="body2" color="text.secondary">
                Phân công lúc:{" "}
                {formatDetailDate(preparationAssignments[0].assignedDate)}
              </Typography>
              {preparationAssignments[0].completedDate && (
                <Typography variant="body2" color="text.secondary">
                  Hoàn thành lúc:{" "}
                  {formatDetailDate(preparationAssignments[0].completedDate)}
                </Typography>
              )}
            </>
          )}
        </Box>
      ) : null}

      {/* Divider between preparation and shipping staff if both exist */}
      {preparationAssignments &&
        preparationAssignments.length > 0 &&
        shippingAssignment && <Divider sx={{ my: 1.5 }} />}

      {/* Shipping Staff Section */}
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

      {/* No staff assigned message */}
      {(!preparationAssignments || preparationAssignments.length === 0) &&
        !shippingAssignment && (
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
