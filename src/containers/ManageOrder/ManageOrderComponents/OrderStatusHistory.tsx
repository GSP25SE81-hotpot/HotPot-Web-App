import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import React from "react";
import { FrontendOrder } from "../../../types/orderManagement";
import { StyledStepper } from "../../../components/StyledComponents";
import { formatDate } from "../../../utils/orderUtils";
import { getStatusIcon, statusSteps } from "../../../utils/statusUtils";
import { Step, StepLabel } from "@mui/material";

interface OrderStatusHistoryProps {
  order: FrontendOrder;
}

const OrderStatusHistory: React.FC<OrderStatusHistoryProps> = ({ order }) => {
  const theme = useTheme();

  return (
    <Box>
      <StyledStepper
        activeStep={statusSteps.indexOf(order.status)}
        alternativeLabel
      >
        {statusSteps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconProps={{ icon: getStatusIcon(label) }}>
              {label.split("_").join(" ")}
            </StepLabel>
          </Step>
        ))}
      </StyledStepper>
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Lịch sử cập nhật
        </Typography>
        <List>
          {order.statusHistory.map((item, index) => (
            <ListItem
              key={index}
              divider={index < order.statusHistory.length - 1}
              sx={{ py: 2 }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                >
                  {getStatusIcon(item.status)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1" fontWeight="medium">
                      {item.status.split("_").join(" ")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(item.timestamp)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Cập nhật bởi: {item.actor}
                    </Typography>
                    {item.note && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, fontStyle: "italic" }}
                      >
                        "{item.note}"
                      </Typography>
                    )}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default OrderStatusHistory;
