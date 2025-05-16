/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  TablePagination,
  TextField,
  Paper,
  Typography,
  InputAdornment,
  Chip,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import adminIngredientsAPI from "../../../api/Services/adminIngredientsAPI";
import { formatMoney } from "../../../utils/fn";
import useDebounce from "../../../hooks/useDebounce";

interface Ingredient {
  ingredientId: number;
  name: string;
  description: string;
  quantity: number;
  measurementUnit: string;
  price: number;
  imageURL: string;
}

interface IngredientsSelectorProps {
  open: boolean;
  handleCloseVegetableModal: VoidFunction;
  onSendVegetable: (selectedMeats: Ingredient[]) => void;
  selectBefore?: Ingredient[];
}

const IngredientsSelectorModal: React.FC<IngredientsSelectorProps> = ({
  open,
  handleCloseVegetableModal,
  onSendVegetable,
  selectBefore = [],
}) => {
  const [selectedIngredients, setSelectedIngredients] =
    useState<Ingredient[]>(selectBefore);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [size, setSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const debouncedSearch = useDebounce(searchText, 500);

  useEffect(() => {
    const fetchIngredients = async () => {
      setIsLoading(true);
      try {
        const resData: any = await adminIngredientsAPI.getListIngredients({
          pageNumber: page + 1, // API expects 1-based index
          size: size,
          searchTerm: debouncedSearch, // Use debounced search
        });
        setIngredients(resData?.data?.items || []);
        setTotal(resData?.data?.totalCount || 0);
      } catch (e) {
        console.error("Lỗi khi tải nguyên liệu:", e);
        setIngredients([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIngredients();
  }, [page, size, debouncedSearch]); // Re-fetch when page, size, or search query changes

  // Handle checkbox selection
  const handleIngredientChange = (ingredient: Ingredient) => {
    setSelectedIngredients((prev) =>
      prev.some((item) => item.ingredientId === ingredient.ingredientId)
        ? prev.filter((item) => item.ingredientId !== ingredient.ingredientId)
        : [...prev, ingredient]
    );
  };

  // Confirm selection
  const handleConfirm = () => {
    onSendVegetable(selectedIngredients);
    handleCloseVegetableModal();
  };

  // Handle pagination change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  // Format price with Vietnamese Dong format
  // const formatPrice = (price: number) => {
  //   return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  // };

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason === "backdropClick") return;
        handleCloseVegetableModal();
      }}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#f7f7f7",
          padding: "20px 24px",
          "& .MuiTypography-root": {
            fontWeight: 600,
            color: "#1a365d",
          },
        }}
      >
        Chọn Nguyên Liệu
      </DialogTitle>

      <DialogContent sx={{ padding: "24px" }}>
        {/* Search Input */}
        <TextField
          label="Tìm kiếm nguyên liệu"
          variant="outlined"
          fullWidth
          margin="dense"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {/* Selected ingredients count */}
        {selectedIngredients.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={`Đã chọn ${selectedIngredients.length} nguyên liệu`}
              color="primary"
              icon={<CheckCircleIcon />}
              sx={{ fontWeight: 500 }}
            />
          </Box>
        )}

        <Paper
          elevation={2}
          sx={{
            width: "100%",
            overflow: "hidden",
            borderRadius: "8px",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f9ff" }}>
                <TableCell align="center" sx={{ width: "60px" }}>
                  Chọn
                </TableCell>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Tên Nguyên Liệu</TableCell>
                <TableCell>Mô Tả</TableCell>
                <TableCell align="right">Giá</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography>Đang tải nguyên liệu...</Typography>
                  </TableCell>
                </TableRow>
              ) : ingredients.length > 0 ? (
                ingredients.map((ingredient) => (
                  <TableRow
                    key={ingredient.ingredientId}
                    hover
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                      ...(selectedIngredients.some(
                        (selected) =>
                          selected.ingredientId === ingredient.ingredientId
                      ) && { backgroundColor: "#e3f2fd !important" }),
                    }}
                  >
                    <TableCell align="center">
                      <Checkbox
                        checked={selectedIngredients.some(
                          (selected) =>
                            selected.ingredientId === ingredient.ingredientId
                        )}
                        onChange={() => handleIngredientChange(ingredient)}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <img
                        src={ingredient?.imageURL}
                        alt="Thumbnail"
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {ingredient.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {ingredient.description ? (
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {ingredient.description}
                        </Typography>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ color: "text.disabled", fontStyle: "italic" }}
                        >
                          Không có mô tả
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 600, color: "#2e7d32" }}>
                        {formatMoney(ingredient?.price)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Không tìm thấy nguyên liệu nào
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Component */}
          <Divider />
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 20]}
            component="div"
            count={total}
            rowsPerPage={size}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Hiển thị:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} trên ${count !== -1 ? count : `hơn ${to}`}`
            }
          />
        </Paper>
      </DialogContent>

      <DialogActions
        sx={{
          padding: "16px 24px",
          borderTop: "1px solid #e0e0e0",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={handleCloseVegetableModal}
          variant="outlined"
          color="inherit"
          startIcon={<CancelIcon />}
        >
          Hủy
        </Button>
        <Button
          type="button"
          variant="contained"
          color="primary"
          disabled={selectedIngredients.length === 0}
          onClick={handleConfirm}
          startIcon={<CheckCircleIcon />}
          sx={{
            fontWeight: 600,
            boxShadow: 2,
            "&:hover": {
              boxShadow: 4,
            },
          }}
        >
          Xác Nhận ({selectedIngredients.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IngredientsSelectorModal;
