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
  IconButton,
  ButtonGroup,
} from "@mui/material";
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import adminIngredientsAPI from "../../../api/Services/adminIngredientsAPI";
import useDebounce from "../../../hooks/useDebounce";

interface IngredientType {
  ingredientTypeId: number;
  name: string;
  ingredientCount: number;
}

interface SelectedIngredientType {
  ingredientTypeId: number;
  name: string;
  ingredientCount: number;
  quantity: number; // This tracks the quantity of this ingredient type
  minQuantity?: number; // Optional minimum quantity for validation
}

interface IngredientsTypeSelectorProps {
  open: boolean;
  handleCloseVegetableModal: VoidFunction;
  onSendVegetable: (selectedIngredients: IngredientType[]) => void;
  selectBefore?: any[]; // Previously selected ingredients
}

const IngredientsTypeSelectorModal: React.FC<IngredientsTypeSelectorProps> = ({
  open,
  handleCloseVegetableModal,
  onSendVegetable,
  selectBefore = [],
}) => {
  // Process selectBefore to group by ingredientTypeId and count quantity
  const processInitialSelection = () => {
    const typeMap = new Map<number, SelectedIngredientType>();

    selectBefore.forEach((ingredient) => {
      const typeId = ingredient.ingredientTypeId;

      if (typeMap.has(typeId)) {
        // Increment quantity for existing type
        const existing = typeMap.get(typeId)!;
        typeMap.set(typeId, {
          ...existing,
          quantity: existing.quantity + 1,
          minQuantity: ingredient.minQuantity || existing.minQuantity,
        });
      } else {
        // Add new type with quantity 1
        typeMap.set(typeId, {
          ingredientTypeId: typeId,
          name: ingredient.name,
          ingredientCount: ingredient.ingredientCount || 0,
          quantity: 1,
          minQuantity: ingredient.minQuantity || 0,
        });
      }
    });

    return Array.from(typeMap.values());
  };

  const [selectedIngredientTypes, setSelectedIngredientTypes] = useState<
    SelectedIngredientType[]
  >(processInitialSelection());
  const [ingredientTypes, setIngredientTypes] = useState<IngredientType[]>([]);
  const [size, setSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const debouncedSearch = useDebounce(searchText, 500);

  const getListIngredientType = async () => {
    try {
      setIsLoading(true);
      const res: any = await adminIngredientsAPI.getListIngredientsType();

      setIngredientTypes(res?.data || []);
      setTotal(res?.data.length || 0);
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error fetching ingredients:", error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch ingredients data
  useEffect(() => {
    getListIngredientType();
  }, []);

  // Handle checkbox selection
  const handleIngredientChange = (ingredient: IngredientType) => {
    setSelectedIngredientTypes((prev) => {
      const isSelected = prev.some(
        (item) => item.ingredientTypeId === ingredient.ingredientTypeId
      );

      if (isSelected) {
        return prev.filter(
          (item) => item.ingredientTypeId !== ingredient.ingredientTypeId
        );
      } else {
        return [
          ...prev,
          {
            ...ingredient,
            quantity: 1,
            minQuantity: 0,
          },
        ];
      }
    });
  };

  // Handle quantity change
  const handleQuantityChange = (ingredientTypeId: number, change: number) => {
    setSelectedIngredientTypes((prev) =>
      prev.map((item) => {
        if (item.ingredientTypeId === ingredientTypeId) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Confirm selection and convert back to the expected format
  const handleConfirm = () => {
    // Convert selected ingredients with quantity to individual ingredient objects
    const result: IngredientType[] = [];

    selectedIngredientTypes.forEach((selectedType) => {
      // Create multiple individual ingredient objects based on quantity
      for (let i = 0; i < selectedType.quantity; i++) {
        result.push({
          ingredientTypeId: selectedType.ingredientTypeId,
          name: selectedType.name,
          ingredientCount: selectedType.ingredientCount,
        });
      }
    });

    onSendVegetable(result);
    handleCloseVegetableModal();
  };

  // Handle pagination
  const handleChangePage = (_event: unknown, newPage: number) => {
    if (newPage >= 0 && newPage < Math.ceil(total / size)) {
      setPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate total number of ingredients (considering quantities)
  const totalQuantity = selectedIngredientTypes.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const filteredIngredientTypes = ingredientTypes.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const paginatedIngredientTypes = filteredIngredientTypes.slice(
    page * size,
    page * size + size
  );

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
        {selectedIngredientTypes.length > 0 && (
          <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
            <Chip
              label={`Đã chọn ${selectedIngredientTypes.length} loại nguyên liệu`}
              color="primary"
              icon={<CheckCircleIcon />}
              sx={{ fontWeight: 500 }}
            />
            <Chip
              label={`Tổng số lượng: ${totalQuantity}`}
              color="secondary"
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
                <TableCell>Tên Nguyên Liệu</TableCell>
                <TableCell align="center">Số lượng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography>Đang tải nguyên liệu...</Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedIngredientTypes.length > 0 ? (
                paginatedIngredientTypes.map((ingredient) => {
                  const isSelected = selectedIngredientTypes.some(
                    (selected) =>
                      selected.ingredientTypeId === ingredient.ingredientTypeId
                  );

                  const selectedIngredient = selectedIngredientTypes.find(
                    (selected) =>
                      selected.ingredientTypeId === ingredient.ingredientTypeId
                  );

                  return (
                    <TableRow
                      key={ingredient.ingredientTypeId}
                      hover
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                        ...(isSelected && {
                          backgroundColor: "#e3f2fd !important",
                        }),
                      }}
                    >
                      <TableCell align="center">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleIngredientChange(ingredient)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {ingredient.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {isSelected && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <ButtonGroup size="small" variant="outlined">
                              <IconButton
                                onClick={() =>
                                  handleQuantityChange(
                                    ingredient.ingredientTypeId,
                                    -1
                                  )
                                }
                                disabled={selectedIngredient?.quantity === 1}
                                size="small"
                                color="primary"
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>

                              <Box
                                sx={{
                                  px: 2,
                                  display: "flex",
                                  alignItems: "center",
                                  minWidth: "40px",
                                  justifyContent: "center",
                                  border: "1px solid rgba(25, 118, 210, 0.5)",
                                  borderLeft: 0,
                                  borderRight: 0,
                                }}
                              >
                                <Typography variant="body2" fontWeight="bold">
                                  {selectedIngredient?.quantity || 1}
                                </Typography>
                              </Box>

                              <IconButton
                                onClick={() =>
                                  handleQuantityChange(
                                    ingredient.ingredientTypeId,
                                    1
                                  )
                                }
                                size="small"
                                color="primary"
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </ButtonGroup>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
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
          disabled={selectedIngredientTypes.length === 0}
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
          Xác Nhận ({totalQuantity})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IngredientsTypeSelectorModal;
