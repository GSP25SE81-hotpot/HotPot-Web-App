import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import React, { ReactNode } from "react";

interface CTbaleProps {
  tableHeaderTitle: any;
  data: any;
  title: string;
  menuAction?: any;
  selectedData?: any;
  searchTool?: ReactNode;
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
  },
}));

const CTable: React.FC<CTbaleProps> = ({
  data,
  tableHeaderTitle,
  title,
  menuAction,
  selectedData,
  searchTool,
}) => {
  //Declare
  const theme = useTheme();

  return (
    <Box sx={{ minWidth: "600px", mx: "auto", p: 2 }}>
      <StyledCard>
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
        <CardContent>
          <StyledTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {tableHeaderTitle.map((column: any) => (
                    <TableCell key={column.id} align={column.align || "left"}>
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data.map((row: any, index: number) => (
                  <TableRow key={index}>
                    {tableHeaderTitle.map((column: any) => (
                      <TableCell key={column.id} align={column.align || "left"}>
                        {row[column.id]}
                      </TableCell>
                    ))}
                    <TableCell
                      onClick={() => selectedData && selectedData(row)}
                    >
                      {menuAction}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={total}
              rowsPerPage={size}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Số hàng trên trang"
              labelDisplayedRows={({ from, to, count }) => {
                return `${from}–${to} trên ${
                  count !== -1 ? count : `nhiều hơn ${to}`
                }`;
              }}
            /> */}
          </StyledTableContainer>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default CTable;
