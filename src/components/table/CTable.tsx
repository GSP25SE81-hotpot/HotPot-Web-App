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
  TablePagination,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import React, { ReactNode } from "react";
import moment from "moment"; // Import moment.js for date formatting
import { colors } from "../../styles/Color/color";

interface CTableProps {
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
  border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: "70vh",
  overflow: "auto",

  "& .MuiTable-root": {
    minWidth: 650,
  },

  "& .MuiTableCell-root": {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    padding: theme.spacing(1.5),
    fontSize: "0.875rem",
  },

  "& .MuiTableHead-root": {
    backgroundColor: alpha(theme.palette.primary.main, 1),
    position: "sticky",
    top: 0,
    zIndex: 10,

    "& .MuiTableCell-head": {
      fontWeight: 600,
      fontSize: "0.875rem",
      color: colors.white,
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
      borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },

  "& .MuiTableBody-root": {
    "& .MuiTableRow-root": {
      transition: "all 0.2s ease-in-out",
      cursor: "default",

      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.06),
        transform: "translateY(-1px)",
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
      },

      "&.clickable": {
        cursor: "pointer",
      },

      "&.selected": {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),

        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.16),
        },
      },

      // Custom row styling based on data attributes
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
  // "& .MuiTableHead-root": {
  //   "& .MuiTableCell-head": {
  //     fontWeight: "bold",
  //     fontSize: "0.875rem",
  //   },
  // },
}));

// const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
//   borderTop: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
//   backgroundColor: alpha(theme.palette.background.default, 0.5),

//   "& .MuiTablePagination-toolbar": {
//     paddingLeft: theme.spacing(2),
//     paddingRight: theme.spacing(2),
//   },

//   "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
//     fontSize: "0.875rem",
//     color: theme.palette.text.secondary,
//   },
// }));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2,
  backdropFilter: "blur(2px)",
  borderRadius: "inherit",
}));

const CTable: React.FC<CTableProps> = ({
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
  const theme = useTheme();

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

    // Handle null/undefined values early
    if (value === null || value === undefined) {
      // Special cases for date formats
      if (
        column.format === "datetime" ||
        column.format === "dateTimeDiscount"
      ) {
        return "không có thời hạn";
      }
      return "-";
    }

    // Date formatting
    if (column.format === "date") {
      return value ? moment(value).format("DD/MM/YYYY") : "-";
    }

    // DateTime formatting
    if (column.format === "datetime") {
      return value
        ? moment(value).format("DD/MM/YYYY HH:mm")
        : "không có thời hạn";
    }

    // DateTime discount formatting
    if (column.format === "dateTimeDiscount") {
      if (!value || value === "") {
        return "không có thời hạn";
      }
      return moment(value).format("DD/MM/YYYY");
    }

    // Number formatting
    if (column.format === "number") {
      return typeof value === "number" ? value.toLocaleString("vi-VN") : "-";
    }

    // Boolean formatting
    if (column.format === "boolean") {
      return value ? "Có" : "Không";
    }

    // Array formatting
    if (column.format === "array") {
      if (Array.isArray(value)) {
        return value.join(", ");
      }
      return value || "-";
    }

    // Role formatting
    if (column.format === "role") {
      const roleMap: { [key: string]: string } = {
        Customer: "Khách hàng",
        Admin: "Quản trị viên",
        Manager: "Quản lý",
        Staff: "Nhân viên",
      };
      return roleMap[value] || "-";
    }

    // Status formatting
    if (column.format === "status") {
      const statusMap: { [key: string]: string } = {
        Pending: "Đang chờ",
        Complete: "Hoàn thành",
      };
      return statusMap[value] || "-";
    }

    // Status discount formatting
    if (column.format === "statusDiscount") {
      if (value === true) {
        return (
          <Chip
            label="Hoạt động"
            color="success"
            variant="outlined"
            size="small"
            sx={{ minWidth: "90px" }}
          />
        );
      } else if (value === false) {
        return (
          <Chip
            label="Kết thúc"
            color="warning"
            variant="outlined"
            size="small"
            sx={{ minWidth: "90px" }}
          />
        );
      }
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

    // Status hotpot formatting
    if (column.format === "statusHotpot") {
      const statusConfig: { [key: string]: { label: string; color: any } } = {
        Pending: { label: "Đang chờ", color: "warning" },
        Completed: { label: "Hoàn thành", color: "success" },
        "In Progress": { label: "Đang tiến hành", color: "info" },
        Cancelled: { label: "Huỷ", color: "error" },
      };

      const config = statusConfig[value] || { label: "-", color: "default" };
      return (
        <Chip
          label={config.label}
          color={config.color}
          variant="outlined"
          size="small"
          sx={{ minWidth: "90px" }}
        />
      );
    }

    // Status detail hotpot formatting
    if (column.format === "statusDetailHopot") {
      const statusConfig: { [key: string]: { label: string; color: any } } = {
        Available: { label: "Khả dụng", color: "success" },
        Damaged: { label: "Bị hư", color: "error" },
        Rented: { label: "Đang Cho thuê", color: "primary" },
      };

      const config = statusConfig[value] || { label: "-", color: "default" };
      return (
        <Chip
          label={config.label}
          color={config.color}
          variant="outlined"
          size="small"
          sx={{ minWidth: "90px" }}
        />
      );
    }

    // Price formatting
    if (column.format === "price") {
      if (typeof value === "number") {
        return value.toLocaleString("vi-VN") + " VND";
      }
      return "N/A";
    }

    return value;
  }

  const isClickableRow = Boolean(onRowClick || selectedData);
  const hasData = data && data.length > 0;

  return (
    <Box sx={{ minWidth: "600px", mx: "auto", p: 2, ...sx }}>
      <StyledCard>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
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
                    backgroundClip: "text",
                  }}
                >
                  {title}
                </Typography>
              }
              sx={{ pb: 0 }}
            />
          )}
          {eventAction && (
            <Box sx={{ pr: 2, display: "flex", gap: 1 }}>{eventAction}</Box>
          )}
        </Box>

        {/* Search Tool Section */}
        {searchTool && <Box sx={{ px: 2, pb: 1 }}>{searchTool}</Box>}

        <CardContent sx={{ pt: 1 }}>
          <Box sx={{ position: "relative" }}>
            {/* Loading Overlay */}
            {loading && (
              <LoadingOverlay>
                <CircularProgress size={40} />
              </LoadingOverlay>
            )}

            <StyledTableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", minWidth: "60px" }}>
                      #
                    </TableCell>
                    {tableHeaderTitle?.map((column: any) => (
                      <TableCell
                        key={column.id}
                        align={column.align || "left"}
                        sx={{
                          fontWeight: "bold",
                          minWidth: column.minWidth || "auto",
                          maxWidth: column.maxWidth || "none",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                    {menuAction && (
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          minWidth: "100px",
                          textAlign: "center",
                        }}
                      >
                        Thao tác
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!hasData ? (
                    <TableRow>
                      <TableCell
                        colSpan={
                          (tableHeaderTitle?.length || 0) + (menuAction ? 2 : 1)
                        }
                        align="center"
                        sx={{ py: 6 }}
                      >
                        <Alert
                          severity="info"
                          sx={{
                            border: "none",
                            bgcolor: "transparent",
                            justifyContent: "center",
                          }}
                        >
                          {emptyMessage}
                        </Alert>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((row: any, index: number) => (
                      <TableRow
                        key={row.id || index}
                        data-expired={row["data-expired"]}
                        data-expiring-soon={row["data-expiring-soon"]}
                        className={`
                          ${isClickableRow ? "clickable" : ""}
                          ${selectedRow === row ? "selected" : ""}
                        `.trim()}
                        onClick={() => {
                          if (onRowClick) onRowClick(row);
                          if (selectedData) selectedData(row);
                        }}
                      >
                        <TableCell sx={{ fontWeight: "medium" }}>
                          {page * size + index + 1}
                        </TableCell>
                        {tableHeaderTitle?.map((column: any) => (
                          <TableCell
                            key={column.id}
                            align={column.align || "left"}
                            sx={{
                              minWidth: column.minWidth || "auto",
                              maxWidth: column.maxWidth || "none",
                              wordBreak: column.wordBreak || "normal",
                            }}
                          >
                            {column.id === "imageURL" ? (
                              <Box
                                component="img"
                                src={getNestedValue(row, column.id)}
                                alt="Thumbnail"
                                sx={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 2,
                                  objectFit: "cover",
                                  border: `1px solid ${alpha(
                                    theme.palette.divider,
                                    0.2
                                  )}`,
                                }}
                                onError={(e: any) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : column.id === "imageURLs" ? (
                              <Box
                                component="img"
                                src={getNestedValue(row, column.id)?.[0]}
                                alt="Thumbnail"
                                sx={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 2,
                                  objectFit: "cover",
                                  border: `1px solid ${alpha(
                                    theme.palette.divider,
                                    0.2
                                  )}`,
                                }}
                                onError={(e: any) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              formatValue(
                                getNestedValue(row, column.id),
                                column,
                                row
                              )
                            )}
                          </TableCell>
                        ))}
                        {menuAction && (
                          <TableCell align="center">{menuAction}</TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={total ?? 0}
                rowsPerPage={size ?? 10}
                page={page ?? 0}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Số hàng trên trang:"
                labelDisplayedRows={({ from, to, count }) => {
                  return `${from}–${to} trên ${
                    count !== -1 ? count : `nhiều hơn ${to}`
                  }`;
                }}
                showFirstButton
                showLastButton
              />
            </StyledTableContainer>
          </Box>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default CTable;
