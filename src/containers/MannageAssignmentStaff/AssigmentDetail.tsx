/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StaffAssignemtAPI from "../../api/Services/staffAssignmentAPI";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Avatar,
  Divider,
  Badge,
  CircularProgress,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  ArrowBack,
  CheckCircle,
  CalendarToday,
  AttachMoney,
  AccessTime,
  LocationOn,
  Phone,
  Email,
  Inventory,
  Edit,
  Info,
  Receipt,
  EventAvailable,
  DoDisturbAlt,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { formatDateFunc } from "../../utils/fn";
import { AssignmentCompletionDialog } from "./Modal/ModalUpdateAssignment";

const formatCurrency = (amount: any) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const getStatusText = (status: any) => {
  switch (status) {
    case 0:
      return { text: "Đang chờ", color: "warning" };
    case 1:
      return { text: "Đã xác nhận", color: "info" };
    case 2:
      return { text: "Đang thực hiện", color: "primary" };
    case 3:
      return { text: "Hoàn thành", color: "success" };
    case 4:
      return { text: "Đã hủy", color: "error" };
    default:
      return { text: "Không xác định", color: "default" };
  }
};

const AssignmentDetail = () => {
  const { orderId } = useParams();
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [rentalOrder, setRentalOrder] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const getAssignmentDetail = async () => {
    try {
      setLoading(true);
      const res: any = await StaffAssignemtAPI.getAssignmentDetail(orderId);
      setRentalOrder(res);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết thuê:", error);
      setError("Không thể tải chi tiết đơn hàng thuê");
      setLoading(false);
    }
  };

  useEffect(() => {
    getAssignmentDetail();
  }, [orderId]);

  const onSave = () => {
    setOpen(false);
    getAssignmentDetail();
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const calculateRentalDays = () => {
    if (!rentalOrder) return 0;

    const startDate = new Date(rentalOrder.rentalStartDate);
    const endDate = rentalOrder.actualReturnDate
      ? new Date(rentalOrder.actualReturnDate)
      : new Date(rentalOrder.expectedReturnDate);

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: "#6366F1" }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Đang tải thông tin...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Alert
          severity="error"
          icon={<ErrorIcon fontSize="large" />}
          sx={{
            maxWidth: 600,
            width: "100%",
            p: 3,
            borderRadius: 2,
            "& .MuiAlert-icon": {
              alignItems: "center",
            },
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Đã xảy ra lỗi!
          </Typography>
          <Typography variant="body1" gutterBottom>
            {error}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              color="error"
              variant="contained"
              onClick={() => navigate(-1)}
              startIcon={<ArrowBack />}
              sx={{ borderRadius: 2 }}
            >
              Quay lại
            </Button>
          </Box>
        </Alert>
      </Box>
    );
  }

  if (!rentalOrder) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Alert
          severity="info"
          sx={{
            maxWidth: 600,
            width: "100%",
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Không tìm thấy!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Không tìm thấy đơn thuê với mã: {orderId}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              color="primary"
              variant="contained"
              onClick={() => navigate(-1)}
              startIcon={<ArrowBack />}
              sx={{ borderRadius: 2 }}
            >
              Quay lại danh sách
            </Button>
          </Box>
        </Alert>
      </Box>
    );
  }

  const rentalDays = calculateRentalDays();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with gradient background */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
          color: "white",
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              mr: 2,
              color: "white",
              bgcolor: "rgba(255,255,255,0.15)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Mã đơn hàng #{rentalOrder.order.orderCode}
            </Typography>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Chi Tiết Phân Công Cho Thuê
            </Typography>
          </Box>
        </Box>
        <Chip
          label={getStatusText(rentalOrder.order.status).text}
          sx={{
            bgcolor: "rgba(255,255,255,0.25)",
            color: "white",
            fontWeight: "bold",
            px: 1,
          }}
        />
      </Paper>

      <Grid container spacing={3}>
        {/* Order and Customer Information */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              height: "100%",
              transition: "all 0.3s",
              "&:hover": { transform: "translateY(-5px)", boxShadow: 8 },
            }}
          >
            <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  bgcolor: "#6366F1",
                  width: 56,
                  height: 56,
                  mr: 2,
                }}
              >
                {rentalOrder.order.user.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {rentalOrder.order.user.name}
                </Typography>
                <Chip
                  size="small"
                  label={`Khách hàng • ${rentalOrder.order.user.loyatyPoint} điểm`}
                  sx={{
                    bgcolor: "#EEF2FF",
                    color: "#6366F1",
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Thông tin liên hệ
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Phone sx={{ fontSize: 18, color: "#6366F1", mr: 1 }} />
                <Typography variant="body1">
                  {rentalOrder.order.user.phoneNumber}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Email sx={{ fontSize: 18, color: "#6366F1", mr: 1 }} />
                <Typography variant="body1">
                  {rentalOrder.order.user.email}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="body2" color="text.secondary">
                Địa chỉ giao hàng
              </Typography>
              <Box sx={{ display: "flex", alignItems: "flex-start", mt: 1 }}>
                <LocationOn
                  sx={{ fontSize: 18, color: "#6366F1", mr: 1, mt: 0.5 }}
                />
                <Typography variant="body1">
                  {rentalOrder.order.address}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="body2" color="text.secondary">
                Tổng tiền đơn hàng
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <AttachMoney sx={{ fontSize: 18, color: "#6366F1", mr: 1 }} />
                <Typography variant="h6" fontWeight="bold" color="#6366F1">
                  {formatCurrency(rentalOrder.order.totalPrice)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Rental Timeline */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              transition: "all 0.3s",
              "&:hover": { transform: "translateY(-5px)", boxShadow: 8 },
            }}
          >
            <Box
              sx={{
                p: 2,
                px: 3,
                bgcolor: "#F3F4F6",
                borderRadius: "12px 12px 0 0",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                }}
              >
                <AccessTime sx={{ mr: 1, color: "#6366F1" }} />
                Thời Gian Thuê
              </Typography>
            </Box>
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{ display: "flex", alignItems: "stretch", height: "100%" }}
              >
                <Box
                  sx={{
                    p: 3,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    borderRight: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <CalendarToday
                      sx={{ fontSize: 18, color: "#6366F1", mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Ngày bắt đầu
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="medium" sx={{ mt: 1 }}>
                    {formatDateFunc.formatDate(rentalOrder.rentalStartDate)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    borderRight: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <EventAvailable
                      sx={{ fontSize: 18, color: "#6366F1", mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Ngày trả dự kiến
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="medium" sx={{ mt: 1 }}>
                    {formatDateFunc.formatDate(rentalOrder.expectedReturnDate)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    borderRight: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <EventAvailable
                      sx={{ fontSize: 18, color: "#6366F1", mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Ngày trả thực tế
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="medium" sx={{ mt: 1 }}>
                    {rentalOrder.actualReturnDate
                      ? formatDateFunc.formatDate(rentalOrder.actualReturnDate)
                      : "Chưa trả"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <DoDisturbAlt
                      sx={{ fontSize: 18, color: "#6366F1", mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Số ngày thuê
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="medium" sx={{ mt: 1 }}>
                    {rentalDays} ngày
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Product List Table */}
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={2}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              transition: "all 0.3s",
              "&:hover": { transform: "translateY(-5px)", boxShadow: 8 },
            }}
          >
            <Box sx={{ p: 2, px: 3, bgcolor: "#F3F4F6" }}>
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                }}
              >
                <Inventory sx={{ mr: 1, color: "#6366F1" }} />
                Danh Sách Sản Phẩm Thuê
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: "#F9FAFB" }}>
                  <TableRow>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell>Loại</TableCell>
                    <TableCell>Mã/ID</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                    <TableCell align="right">Giá thuê</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rentalOrder?.rentOrderDetails?.map((detail: any) => {
                    const isHotpot = detail.hotpotInventory !== null;
                    const item = isHotpot
                      ? detail.hotpotInventory?.hotpot
                      : detail.utensil;

                    let imageUrl = isHotpot
                      ? item?.imageURLs && item.imageURLs.length > 0
                        ? item.imageURLs[0]
                        : "/placeholder.jpg"
                      : item?.imageURL || "/placeholder.jpg";

                    const serialNumber = isHotpot
                      ? detail.hotpotInventory?.seriesNumber
                      : `UT-${detail.utensilId}`;

                    // Handle image URL format
                    if (
                      typeof imageUrl === "string" &&
                      imageUrl.startsWith("[")
                    ) {
                      try {
                        const parsedUrls = JSON.parse(imageUrl);
                        imageUrl = parsedUrls[0];
                      } catch (e) {
                        console.log(e);
                        imageUrl = imageUrl.replace(/[[\]"]/g, "");
                      }
                    }

                    return (
                      <TableRow
                        key={detail.rentOrderDetailId}
                        sx={{
                          "&:nth-of-type(odd)": {
                            bgcolor: "background.default",
                          },
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {isHotpot ? (
                              <Badge
                                badgeContent="N"
                                color="primary"
                                anchorOrigin={{
                                  vertical: "top",
                                  horizontal: "left",
                                }}
                                sx={{ mr: 2 }}
                              >
                                <Avatar
                                  variant="rounded"
                                  src={imageUrl}
                                  sx={{ width: 56, height: 56 }}
                                />
                              </Badge>
                            ) : (
                              <Avatar
                                variant="rounded"
                                src={imageUrl}
                                sx={{ width: 56, height: 56, mr: 2 }}
                              />
                            )}
                            <Box>
                              <Typography
                                variant="subtitle1"
                                fontWeight="medium"
                              >
                                {item?.name || "Sản phẩm không xác định"}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {isHotpot
                                  ? `${item?.size || ""} • ${
                                      item?.material || ""
                                    }`
                                  : item?.material}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={isHotpot ? "Nồi lẩu" : "Dụng cụ"}
                            size="small"
                            sx={{
                              bgcolor: isHotpot ? "#EEF2FF" : "#ECFDF5",
                              color: isHotpot ? "#6366F1" : "#10B981",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              fontFamily: "monospace",
                              fontWeight: "medium",
                            }}
                          >
                            {serialNumber}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{detail.quantity}</TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="medium">
                            {formatCurrency(detail.rentalPrice)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{
                p: 3,
                display: "flex",
                justifyContent: "flex-end",
                bgcolor: "#F9FAFB",
              }}
            >
              <Box sx={{ width: "300px" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body1">Tổng tiền:</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatCurrency(rentalOrder.order.totalPrice)}
                  </Typography>
                </Box>
                {rentalOrder.damageFee > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1">Phí hư hỏng:</Typography>
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      color="error.main"
                    >
                      {formatCurrency(rentalOrder.damageFee)}
                    </Typography>
                  </Box>
                )}
                {rentalOrder.lateFee > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1">Phí trả trễ:</Typography>
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      color="error.main"
                    >
                      {formatCurrency(rentalOrder.lateFee)}
                    </Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Tổng cộng:
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="#6366F1"
                  >
                    {formatCurrency(
                      rentalOrder.order.totalPrice +
                        (rentalOrder.damageFee || 0) +
                        (rentalOrder.lateFee || 0)
                    )}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Action buttons */}
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "all 0.3s",
              "&:hover": { transform: "translateY(-5px)", boxShadow: 8 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Receipt sx={{ fontSize: 28, color: "#6366F1", mr: 2 }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  {rentalOrder.actualReturnDate
                    ? "Thông tin trả hàng"
                    : "Cập nhật thông tin thuê"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {rentalOrder.actualReturnDate
                    ? "Đơn hàng đã được trả vào " +
                      formatDateFunc.formatDate(rentalOrder.actualReturnDate)
                    : "Cập nhật trạng thái và thông tin cho thuê"}
                </Typography>
              </Box>
            </Box>
            {!rentalOrder.actualReturnDate && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpen}
                startIcon={<Edit />}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: "#6366F1",
                  "&:hover": { bgcolor: "#4F46E5" },
                }}
              >
                Cập nhật công việc
              </Button>
            )}
            {rentalOrder.actualReturnDate && (
              <Chip
                icon={<CheckCircle />}
                label="Đã hoàn thành"
                color="success"
                sx={{ px: 1, py: 0.5 }}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
      {/* Return Information if item is returned */}
      {rentalOrder.actualReturnDate && (
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              transition: "all 0.3s",
              "&:hover": { transform: "translateY(-5px)", boxShadow: 8 },
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}
            >
              <Info sx={{ mr: 1, color: "#6366F1" }} />
              Chi tiết trả hàng
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Tình trạng nhận:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mt: 1, p: 2, bgcolor: "#F9FAFB", borderRadius: 1 }}
                >
                  {rentalOrder.returnCondition || "Không có ghi chú"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Ghi chú thuê:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mt: 1, p: 2, bgcolor: "#F9FAFB", borderRadius: 1 }}
                >
                  {rentalOrder.rentalNotes || "Không có ghi chú"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Phí Hư Hỏng:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mt: 1, p: 2, bgcolor: "#F9FAFB", borderRadius: 1 }}
                >
                  {rentalOrder?.damageFee
                    ? formatCurrency(rentalOrder?.damageFee)
                    : "None"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Phí Trả Trễ:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mt: 1, p: 2, bgcolor: "#F9FAFB", borderRadius: 1 }}
                >
                  {rentalOrder?.lateFee
                    ? formatCurrency(rentalOrder?.lateFee)
                    : "None"}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )}
      {open && (
        <AssignmentCompletionDialog
          onClose={() => setOpen(false)}
          open={open}
          assignment={rentalOrder}
          onSave={onSave}
          assignId={assignmentId}
        />
      )}
    </Container>
  );
};

export default AssignmentDetail;
