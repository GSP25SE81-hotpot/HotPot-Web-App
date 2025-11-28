/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment"; // Import moment.js for date formatting
import React, { ReactNode } from "react";
import {
  ActionButtonsContainer,
  HeaderContainer,
  LoadingOverlay,
  SearchToolsContainer,
  StyledActionCell,
  StyledAlert,
  StyledCard,
  StyledCardContent,
  StyledCardHeader,
  StyledCardTitle,
  StyledHeaderCell,
  StyledImageContainer,
  StyledIndexCell,
  StyledTableCell,
  StyledTableContainer,
  StyledTablePagination,
} from "./CTableStyles";

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
        Processing: "Đang xử lý",
        Processed: "Đã xử lý",
        Shipping: "Đang giao hàng",
        Delivered: "Đã giao",
        Cancelled: "Đã huỷ",
        Returning: "Đang trả hàng",
        Completed: "Hoàn thành",
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
        InProgress: { label: "Đang tiến hành", color: "info" },
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
    <Box sx={{ 
      width: "100%",
      minWidth: { xs: "100%", sm: "100%", md: "600px" }, 
      mx: "auto", 
      p: { xs: 1, sm: 2 },
      overflowX: "auto",
      ...sx 
    }}>
      <StyledCard>
        {/* Header Section */}
        <HeaderContainer>
          {title && (
            <StyledCardHeader
              title={<StyledCardTitle variant="h5">{title}</StyledCardTitle>}
            />
          )}
          {eventAction && (
            <ActionButtonsContainer>{eventAction}</ActionButtonsContainer>
          )}
        </HeaderContainer>

        {/* Search Tool Section */}
        {searchTool && (
          <SearchToolsContainer>{searchTool}</SearchToolsContainer>
        )}

        <StyledCardContent>
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
                    <StyledTableCell>#</StyledTableCell>
                    {tableHeaderTitle?.map((column: any) => (
                      <StyledHeaderCell
                        key={column.id}
                        align={column.align || "left"}
                        sx={{
                          minWidth: column.minWidth || "auto",
                          maxWidth: column.maxWidth || "none",
                        }}
                      >
                        {column.label}
                      </StyledHeaderCell>
                    ))}
                    {menuAction && (
                      <StyledActionCell>Thao tác</StyledActionCell>
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
                        <StyledAlert severity="info">
                          {emptyMessage}
                        </StyledAlert>
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
                        <StyledIndexCell>
                          {page * size + index + 1}
                        </StyledIndexCell>
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
                              <StyledImageContainer>
                                <Box
                                  component="img"
                                  src={getNestedValue(row, column.id)}
                                  alt="Thumbnail"
                                  sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                  onError={(e: any) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              </StyledImageContainer>
                            ) : column.id === "imageURLs" ? (
                              <StyledImageContainer>
                                <Box
                                  component="img"
                                  src={getNestedValue(row, column.id)?.[0]}
                                  alt="Thumbnail"
                                  sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                  onError={(e: any) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              </StyledImageContainer>
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
                          <TableCell align="center">
                            {typeof menuAction === "function"
                              ? menuAction(row)
                              : menuAction}
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <StyledTablePagination
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
        </StyledCardContent>
      </StyledCard>
    </Box>
  );
};

export default CTable;
