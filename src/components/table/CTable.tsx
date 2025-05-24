/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { alpha, styled } from "@mui/material/styles";
import React, { ReactNode } from "react";
import moment from "moment"; // Import moment.js for date formatting

interface CTbaleProps {
  tableHeaderTitle?: any;
  data?: any;
  title?: string;
  menuAction?: any;
  selectedData?: any;
  searchTool?: ReactNode;
  eventAction?: ReactNode;
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  handleChangeRowsPerPage?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  total: number;
  size: number;
  page: number;
  loading?: boolean;
  emptyMessage?: string;
  sx?: any;
  onRowClick?: (row: any) => void;
  selectedRow?: any;
}

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  backdropFilter: "blur(10px)",
  borderRadius: 16,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  "& .MuiTableCell-root": {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  },
  "& .MuiTableRow-root": {
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      transform: "translateY(-2px)",
    },
    // Support for custom row styling based on data attributes
    '&[data-expired="true"]': {
      backgroundColor: alpha(theme.palette.error.main, 0.05),
      "&:hover": {
        backgroundColor: alpha(theme.palette.error.main, 0.1),
      },
    },
    '&[data-expiring-soon="true"]': {
      backgroundColor: alpha(theme.palette.warning.main, 0.05),
      "&:hover": {
        backgroundColor: alpha(theme.palette.warning.main, 0.1),
      },
    },
  },
  "& .MuiTableHead-root": {
    "& .MuiTableCell-head": {
      fontWeight: "bold",
      fontSize: "0.875rem",
    },
  },
}));

const CTable: React.FC<CTbaleProps> = ({
  data,
  tableHeaderTitle,
  title,
  menuAction,
  selectedData,
  searchTool,
  handleChangePage,
  handleChangeRowsPerPage,
  eventAction,
  page,
  size,
  total,
  loading = false,
  emptyMessage = "Không có dữ liệu",
  sx,
  onRowClick,
  selectedRow,
}) => {
  //Declare
  const theme = useTheme();

  //func
  function getNestedValue(obj: any, path: any) {
    return path
      .split(".")
      .reduce((acc: any, part: any) => acc && acc[part], obj);
  }

  function formatValue(value: any, column: any, row?: any) {
    // Check if column has custom render function
    if (column.render && typeof column.render === "function") {
      return column.render(value, row);
    }

    //date time
    if (column.format && column.format == "date") {
      if (value) {
        return moment(value).format("DD/MM/YYYY");
      }
      return "-";
    }

    //datetime
    if (column.format && column.format == "datetime") {
      if (value) {
        return moment(value).format("DD/MM/YYYY HH:mm");
      }
      return "-";
    }

    //number
    if (column.format && column.format == "number") {
      if (value !== undefined && value !== null) {
        return value.toLocaleString("vi-VN");
      }
      return "-";
    }

    //boolean
    if (column.format && column.format == "boolean") {
      return value ? "Có" : "Không";
    }

    //array
    if (column.format && column.format == "array") {
      if (Array.isArray(value)) {
        return value.join(", ");
      }
      return value || "-";
    }

    //role
    if (column.format && column.format == "role") {
      switch (value) {
        case "Customer":
          return "Khách hàng";
        case "Admin":
          return "Quản trị viên";
        case "Manager":
          return "Quản lý";
        case "Staff":
          return "Nhân viên";
        default:
          return "-";
      }
    }
    //status
    if (column.format && column.format == "status") {
      switch (value) {
        case "Pending":
          return "Đang chờ";
        case "Complete":
          return "Hoàn thành";
        default:
          return "-";
      }
    }

    //status discount
    if (column.format && column.format == "statusDiscount") {
      switch (value) {
        case false:
          return (
            <Chip
              label="Kết thúc"
              color="warning"
              variant="outlined"
              size="small"
              sx={{ minWidth: "90px" }}
            />
          );
        case true:
          return (
            <Chip
              label="Hoạt động"
              color="success"
              variant="outlined"
              size="small"
              sx={{ minWidth: "90px" }}
            />
          );
        default:
          return (
            <Chip
              label="-"
              color="default"
              variant="outlined"
              size="small"
              sx={{ minWidth: "90px" }}
            />
          );
      }
    }
    //status hotpot
    if (column.format && column.format == "statusHotpot") {
      switch (value) {
        case "Pending":
          return (
            <Chip
              label="Đang chờ"
              color="warning"
              variant="outlined"
              size="small"
              sx={{ minWidth: "90px" }}
            />
          );
        case "Completed":
          return (
            <Chip
              label="Hoàn thành"
              color="success"
              variant="outlined"
              size="small"
              sx={{ minWidth: "90px" }}
            />
          );
        case "In Progress":
          return (
            <Chip
              label="Đang tiến hành"
              color="info"
              variant="outlined"
              size="small"
              sx={{ minWidth: "90px" }}
            />
          );
        case "Cancelled":
          return (
            <Chip
              label="Huỷ"
              color="error"
              variant="outlined"
              size="small"
              sx={{ minWidth: "90px" }}
            />
          );
        default:
          return (
            <Chip
              label="-"
              color="default"
              variant="outlined"
              size="small"
              sx={{ minWidth: "90px" }}
            />
          );
      }
    }

    if (column.format && column.format == "statusDetailHopot") {
      switch (value) {
        case "Available":
          return (
            <Chip
              label="Khả dụng"
              color="success"
              variant="outlined"
              size="small"
              sx={{ minWidth: "90px" }}
            />
          );
        case "Damaged":
          return (
            <Chip
              label="Bị hư"
              color="error"
              variant="outlined"
              size="small"
              sx={{ minWidth: "90px" }}
            />
          );
        case "Rented":
          return (
            <Chip
              label="Đang Cho thuê"
              color="primary"
              variant="outlined"
              size="small"
              sx={{ minWidth: "90px" }}
            />
          );
        default:
          return (
            <Chip
              label="-"
              color="default"
              variant="outlined"
              size="small"
              sx={{ minWidth: "90px" }}
            />
          );
      }
    }

    //price
    if (column.format && column.format == "price") {
      if (value === undefined || value === null) return "N/A";
      return value.toLocaleString("vi-VN") + " VND";
    }

    return value;
  }

  return (
    <Box sx={{ minWidth: "600px", mx: "auto", p: 2, ...sx }}>
      <StyledCard>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {title && (
            <CardHeader
              title={
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {title}
                </Typography>
              }
            />
          )}
          <Box sx={{ pr: 2 }}>{eventAction}</Box>
        </Box>
        <Box>{searchTool}</Box>
        <CardContent>
          <Box sx={{ position: "relative" }}>
            {loading && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: "rgba(255, 255, 255, 0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                  backdropFilter: "blur(2px)",
                }}
              >
                <CircularProgress size={40} />
              </Box>
            )}

            <StyledTableContainer sx={sx}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                    {tableHeaderTitle?.map((column: any) => (
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          minWidth: column.minWidth || "auto",
                        }}
                        key={column.id}
                        align={column.align || "left"}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                    {menuAction && (
                      <TableCell sx={{ fontWeight: "bold" }}></TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!data || data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={
                          (tableHeaderTitle?.length || 0) + (menuAction ? 2 : 1)
                        }
                        align="center"
                        sx={{ py: 4 }}
                      >
                        <Alert
                          severity="info"
                          sx={{ border: "none", bgcolor: "transparent" }}
                        >
                          {emptyMessage}
                        </Alert>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.map((row: any, index: number) => (
                      <TableRow
                        key={index}
                        data-expired={row["data-expired"]}
                        data-expiring-soon={row["data-expiring-soon"]}
                        onClick={() => {
                          if (onRowClick) onRowClick(row);
                          if (selectedData) selectedData(row);
                        }}
                        sx={{
                          cursor:
                            onRowClick || selectedData ? "pointer" : "default",
                          bgcolor:
                            selectedRow === row
                              ? alpha(theme.palette.primary.main, 0.1)
                              : "transparent",
                        }}
                      >
                        <TableCell sx={{ fontWeight: "medium" }}>
                          {page * size + index + 1}
                        </TableCell>
                        {tableHeaderTitle.map((column: any) => (
                          <TableCell
                            key={column.id}
                            align={column.align || "left"}
                            sx={{ minWidth: column.minWidth || "auto" }}
                          >
                            {column.id == "imageURL" ? (
                              <img
                                src={getNestedValue(row, column.id)}
                                alt="Thumbnail"
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: "8px",
                                  objectFit: "cover",
                                }}
                              />
                            ) : column.id == "imageURLs" ? (
                              <img
                                src={getNestedValue(row, column.id)?.[0]}
                                alt="Thumbnail"
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: "8px",
                                  objectFit: "cover",
                                }}
                              />
                            ) : getNestedValue(row, column.id) !== undefined &&
                              getNestedValue(row, column.id) !== null ? (
                              formatValue(
                                getNestedValue(row, column.id),
                                column,
                                row
                              )
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        ))}
                        {menuAction && <TableCell>{menuAction}</TableCell>}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={total ?? 0}
                rowsPerPage={size ?? 10}
                page={page ?? 0}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Số hàng trên trang"
                labelDisplayedRows={({ from, to, count }) => {
                  return `${from}–${to} trên ${
                    count !== -1 ? count : `nhiều hơn ${to}`
                  }`;
                }}
              />
            </StyledTableContainer>
          </Box>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default CTable;
