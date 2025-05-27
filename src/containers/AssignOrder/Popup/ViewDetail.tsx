import {
  Close,
  LocationOn,
  Person,
  Phone,
  Receipt,
  StickyNote2,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import staffGetOrderApi from "../../../api/staffGetOrderAPI";
import { colors } from "../../../styles/Color/color";
import { StaffOrderDetailType } from "../../../types/staffOrderDetailType";

interface ViewDetailProps {
  orderId?: number;
  onOpen: boolean;
  onClose: () => void;
}

const ViewDetail: React.FC<ViewDetailProps> = ({
  orderId,
  onOpen,
  onClose,
}) => {
  //Define state
  const [orderDetails, setOrderDetails] =
    React.useState<StaffOrderDetailType>();
  const [loading, setLoading] = React.useState(false);

  //call api
  const getOrderDetailById = async () => {
    try {
      setLoading(true);
      const res = await staffGetOrderApi.getOrderDetailById(orderId);
      setOrderDetails(res?.data);
    } catch (error: any) {
      console.error("Error fetching order details:", error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId && onOpen) {
      getOrderDetailById();
    }
  }, [orderId, onOpen]);

  return (
    <Dialog
      open={onOpen}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: "500px",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}dd 100%)`,
          color: colors.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 3,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${colors.primary}aa, transparent)`,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
            <Receipt />
          </Avatar>
          <Typography variant="h5" component="span" sx={{ fontWeight: 600 }}>
            Chi tiết đơn hàng
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: colors.white,
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.1)",
              transform: "scale(1.1)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: "#fafafa" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 300,
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CircularProgress size={48} />
            <Typography variant="body1" color="text.secondary">
              Đang tải chi tiết đơn hàng...
            </Typography>
          </Box>
        ) : orderDetails ? (
          <Box>
            {/* Order Header Info */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                m: 3,
                borderRadius: 2,
                border: `1px solid ${colors.gray_300}`,
                background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: colors.primary,
                  fontWeight: 600,
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Receipt fontSize="small" />
                Thông tin cơ bản
              </Typography>

              <Stack spacing={3}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip
                    label="Mã đơn hàng"
                    size="small"
                    sx={{
                      minWidth: 120,
                      bgcolor: colors.primary,
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 600,
                      color: colors.gray_600,
                      bgcolor: "#f5f5f5",
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      border: `1px solid ${colors.gray_300}`,
                    }}
                  >
                    {orderDetails.orderCode}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Chip
                    icon={<LocationOn />}
                    label="Địa chỉ"
                    size="small"
                    sx={{
                      minWidth: 120,
                      bgcolor: "#e3f2fd",
                      color: "#1976d2",
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      color: colors.gray_600,
                      flex: 1,
                      lineHeight: 1.6,
                    }}
                  >
                    {orderDetails.address}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Chip
                    icon={<StickyNote2 />}
                    label="Ghi chú"
                    size="small"
                    sx={{
                      minWidth: 120,
                      bgcolor: "#fff3e0",
                      color: "#f57c00",
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      color: colors.gray_600,
                      fontStyle: orderDetails.notes ? "normal" : "italic",
                      flex: 1,
                    }}
                  >
                    {orderDetails.notes || "Không có ghi chú"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip
                    icon={<Person />}
                    label="Khách hàng"
                    size="small"
                    sx={{
                      minWidth: 120,
                      bgcolor: "#e8f5e8",
                      color: "#2e7d32",
                    }}
                  />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {orderDetails.userName}
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Phone fontSize="small" sx={{ color: colors.gray_500 }} />
                      <Typography
                        variant="body2"
                        sx={{ color: colors.gray_600 }}
                      >
                        {orderDetails.userPhone}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Stack>
            </Paper>

            {/* Order Items */}
            <Paper
              elevation={0}
              sx={{
                mx: 3,
                mb: 3,
                borderRadius: 2,
                border: `1px solid ${colors.gray_300}`,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  bgcolor: colors.primary,
                  color: "white",
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Receipt />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Chi tiết sản phẩm ({orderDetails.orderDetails.length} món)
                </Typography>
              </Box>

              <List sx={{ p: 0 }}>
                {orderDetails.orderDetails.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      sx={{
                        py: 2,
                        px: 3,
                        "&:hover": {
                          bgcolor: "#f8f9fa",
                        },
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          gap: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: colors.primary,
                            width: 32,
                            height: 32,
                            fontSize: "0.875rem",
                          }}
                        >
                          {index + 1}
                        </Avatar>

                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: colors.gray_600,
                              mb: 0.5,
                            }}
                          >
                            {item.itemName}
                          </Typography>
                        </Box>

                        <Chip
                          label={`${item.quantity}`}
                          sx={{
                            bgcolor: colors.primary,
                            color: "white",
                            fontWeight: 600,
                            minWidth: 80,
                          }}
                        />
                      </Box>
                    </ListItem>
                    {index < orderDetails.orderDetails.length - 1 && (
                      <Divider sx={{ mx: 3 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 300,
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Không tìm thấy thông tin đơn hàng
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vui lòng thử lại sau
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          bgcolor: "#fafafa",
          borderTop: `1px solid ${colors.gray_300}`,
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: colors.primary,
            px: 4,
            py: 1,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              bgcolor: colors.primary,
              transform: "translateY(-1px)",
              boxShadow: 3,
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewDetail;
