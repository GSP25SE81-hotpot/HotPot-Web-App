import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { IOrder } from "../../../types/order";

interface ListOrderItemsProps {
  data?: IOrder;
}

const ListOderItems: React.FC<ListOrderItemsProps> = ({ data }) => {
  const newArrayData = data?.items;
  return (
    <div>
      <Box>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={4}>
            <Typography variant="h5">Danh sách sản phẩm</Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Hình ảnh</TableCell>
                    <TableCell align="center">Sản phẩm</TableCell>
                    <TableCell align="center">Loại</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                    <TableCell align="center">Giá/cái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {newArrayData?.map((row, index) => (
                    <TableRow key={row.itemId}>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="center">
                        {
                          <img
                            alt="img"
                            src={row?.imageUrl}
                            style={{ height: "50px", width: "50px" }}
                          />
                        }
                      </TableCell>
                      <TableCell align="center">{row.itemName}</TableCell>
                      <TableCell align="center">{row.itemType}</TableCell>
                      <TableCell align="center">{row.quantity}</TableCell>
                      <TableCell align="center">{row.unitPrice}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Paper>
      </Box>
    </div>
  );
};

export default ListOderItems;
