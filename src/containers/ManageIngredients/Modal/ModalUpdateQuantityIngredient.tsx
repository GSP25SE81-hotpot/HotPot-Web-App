/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Divider,
  IconButton,
  Paper,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import adminIngredientsAPI from "../../../api/Services/adminIngredientsAPI";
import { Ingredient } from "../../../types/ingredients";
import BatchPagination from "../../ManageImportProduct/BatchPagination";
import adminBatchAPI from "../../../api/Services/adminBatch";
import { toast } from "react-toastify";
import useDebounce from "../../../hooks/useDebounce";

interface Batch {
  ingredientId: number;
  totalAmount: number;
  bestBeforeDate: string;
  unit: string;
}

console.log(1);

interface UpdateQuantityModel {
  batches: Batch[];
}

// Define props for the component
interface UpdateQuantityModalProps {
  open: boolean;
  handleClose: () => void;
  onSave?: () => void;
}

// Helper function to format date for input field
const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
};

// Helper function to convert input date to ISO string
const convertDateToISO = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString();
};

export default function UpdateQuantityModal({
  open,
  handleClose,
  onSave,
}: UpdateQuantityModalProps): JSX.Element {
  // State for ingredients list
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State for search
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>(
    []
  );

  // State for selected ingredients in the table
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);

  // State for the update model
  const [model, setModel] = useState<UpdateQuantityModel>({
    batches: [],
  });

  //debounce
  const debounce = useDebounce(searchTerm, 500);
  // Pagination state for batches (lô hàng)
  const [batchesPage, setBatchesPage] = useState<number>(1);
  const [batchesPerPage] = useState<number>(5); // Fixed size of 5

  // Filter ingredients based on search term
  useEffect(() => {
    if (!debounce) {
      setFilteredIngredients(ingredients);
    } else {
      const filtered = ingredients.filter(
        (ingredient) =>
          ingredient.name.toLowerCase().includes(debounce.toLowerCase()) ||
          ingredient.ingredientTypeName
            .toLowerCase()
            .includes(debounce.toLowerCase())
      );
      setFilteredIngredients(filtered);
    }
  }, [ingredients, debounce]);

  // Reset model when dialog opens
  useEffect(() => {
    if (open) {
      setModel({
        batches: [],
      });
      setSelectedIngredients([]);
      setSearchTerm(""); // Reset search term
      fetchIngredients();
    }
  }, [open]);

  // Fetch all ingredients list without pagination
  const fetchIngredients = async () => {
    setIsLoading(true);
    try {
      const res = await adminIngredientsAPI.getListIngredients({
        pageNumber: 1,
        pageSize: 1000, // Get a large number to avoid pagination
        searchTerm: "",
      });
      setIngredients(res?.data?.items || []);
    } catch (error: any) {
      console.error("Error fetching ingredients:", error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle checkbox selection in table
  const handleCheckboxToggle = (ingredientId: number) => {
    setSelectedIngredients((prev) => {
      if (prev.includes(ingredientId)) {
        return prev.filter((id) => id !== ingredientId);
      } else {
        return [...prev, ingredientId];
      }
    });
  };

  // Handle select all checkbox (considering filtered ingredients)
  const handleSelectAll = () => {
    const visibleIngredientIds = filteredIngredients.map((i) => i.ingredientId);
    const selectedVisibleIngredients = selectedIngredients.filter((id) =>
      visibleIngredientIds.includes(id)
    );

    if (selectedVisibleIngredients.length === visibleIngredientIds.length) {
      // Deselect all visible ingredients
      setSelectedIngredients((prev) =>
        prev.filter((id) => !visibleIngredientIds.includes(id))
      );
    } else {
      // Select all visible ingredients
      setSelectedIngredients((prev) => {
        const newSelected = [...prev];
        visibleIngredientIds.forEach((id) => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return newSelected;
      });
    }
  };

  // Get select all checkbox state
  const getSelectAllState = () => {
    const visibleIngredientIds = filteredIngredients.map((i) => i.ingredientId);
    const selectedVisibleIngredients = selectedIngredients.filter((id) =>
      visibleIngredientIds.includes(id)
    );

    if (selectedVisibleIngredients.length === 0) {
      return { checked: false, indeterminate: false };
    } else if (
      selectedVisibleIngredients.length === visibleIngredientIds.length
    ) {
      return { checked: true, indeterminate: false };
    } else {
      return { checked: false, indeterminate: true };
    }
  };

  // Handlers for batches
  const handleSave = async () => {
    try {
      // Here you would send the model to your API
      console.log("Saving model:", model);

      const prepareData = model.batches.map(
        ({ unit, totalAmount, ...rest }) => ({
          ...rest,
          totalAmount: unit === "kg" ? totalAmount * 1000 : totalAmount,
        })
      );
      console.log(prepareData);
      const data = { batches: prepareData };
      //  API call
      const response = await adminBatchAPI.CreateNewBatch(data);

      console.log(response);

      if (onSave) {
        onSave();
        toast.success("Cập nhật thành công");
      }
      handleClose();
    } catch (error: any) {
      const apiError = error?.response?.data || error;
      const errorMessage = apiError?.message || "Something went wrong!";
      const firstDetailedError = apiError?.errors?.[0];

      toast.error(firstDetailedError || errorMessage);
    }
  };

  // Add batches for selected ingredients
  // Initialize with default unit 'g' in addSelectedBatches function
  const addSelectedBatches = () => {
    if (selectedIngredients.length === 0) return;

    const newBatches = selectedIngredients.map((id) => ({
      ingredientId: id,
      totalAmount: 0.0001,
      bestBeforeDate: new Date().toISOString(),
      unit: "g", // Default unit
    }));

    setModel({
      ...model,
      batches: [...model.batches, ...newBatches],
    });

    // Clear selection after adding
    setSelectedIngredients([]);
  };

  const removeBatch = (index: number) => {
    const newBatches = [...model.batches];
    newBatches.splice(index, 1);
    setModel({ ...model, batches: newBatches });
  };

  const updateBatch = (index: number, field: keyof Batch, value: any) => {
    const newBatches = [...model.batches];
    newBatches[index] = { ...newBatches[index], [field]: value };
    setModel({ ...model, batches: newBatches });
  };

  // Find ingredient name by id (for batch display)
  const getIngredientNameById = (id: number): string => {
    const ingredient = ingredients.find((i) => i.ingredientId === id);
    return ingredient ? ingredient.name : `Ingredient ID: ${id}`;
  };

  //get today
  const getTodayFormatted = (): string => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Returns YYYY-MM-DD
  };

  // Handle batch page change
  const handleBatchPageChange = (page: number) => {
    setBatchesPage(page);
  };

  // Handle search clear
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const selectAllState = getSelectAllState();

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="md"
      onClose={(_event, reason) => {
        if (reason === "backdropClick") return;
        handleClose();
      }}
      aria-hidden={false}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="div">
          Cập nhật số lượng nguyên liệu
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Box sx={{ py: 2 }}>
          {/* Table of ingredients with checkboxes */}
          <Paper elevation={1} sx={{ width: "100%", mb: 3 }}>
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#f9f9f9",
              }}
            >
              <Typography variant="subtitle2">
                Chọn nhiều nguyên liệu ({selectedIngredients.length} đã chọn)
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={fetchIngredients}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <RefreshIcon fontSize="small" />
                  )}
                </IconButton>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={addSelectedBatches}
                  disabled={selectedIngredients.length === 0}
                  size="small"
                >
                  Thêm tất cả ({selectedIngredients.length})
                </Button>
              </Box>
            </Box>

            {/* Search Field */}
            <Box sx={{ px: 2, pb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Tìm kiếm theo tên nguyên liệu hoặc loại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleClearSearch}
                        edge="end"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <TableContainer sx={{ maxHeight: 300 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selectAllState.indeterminate}
                        checked={selectAllState.checked}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>Tên nguyên liệu</TableCell>
                    <TableCell>Loại</TableCell>
                    <TableCell align="right">Giá</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredIngredients.map((ingredient) => (
                    <TableRow
                      key={ingredient.ingredientId}
                      hover
                      selected={selectedIngredients.includes(
                        ingredient.ingredientId
                      )}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedIngredients.includes(
                            ingredient.ingredientId
                          )}
                          onChange={() =>
                            handleCheckboxToggle(ingredient.ingredientId)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell
                        onClick={() =>
                          handleCheckboxToggle(ingredient.ingredientId)
                        }
                      >
                        {ingredient.name}
                      </TableCell>
                      <TableCell
                        onClick={() =>
                          handleCheckboxToggle(ingredient.ingredientId)
                        }
                      >
                        {ingredient.ingredientTypeName}
                      </TableCell>
                      <TableCell
                        align="right"
                        onClick={() =>
                          handleCheckboxToggle(ingredient.ingredientId)
                        }
                      >
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(ingredient.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredIngredients.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          {searchTerm
                            ? "Không tìm thấy nguyên liệu nào"
                            : "Không có dữ liệu"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Batches section - without pagination */}
          {model.batches.length > 0 && (
            <>
              <Divider sx={{ mb: 3 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Thông tin lô hàng ({model.batches.length})
                </Typography>
              </Box>

              {/* Display paginated batches in a more compact layout */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {model.batches
                  .slice(
                    (batchesPage - 1) * batchesPerPage,
                    batchesPage * batchesPerPage
                  )
                  .map((batch, displayIndex) => {
                    const actualIndex =
                      (batchesPage - 1) * batchesPerPage + displayIndex;
                    return (
                      <Paper
                        key={actualIndex}
                        elevation={1}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            width: "100%",
                            gap: 2,
                            p: 1,
                            border: "1px solid #e0e0e0",
                            borderRadius: 2,
                            mb: 2,
                          }}
                        >
                          {/* Quantity + Unit */}
                          <Box
                            sx={{
                              display: "flex",
                              minWidth: 200,
                              flexShrink: 0,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                pb: 1,
                                borderBottom: "1px solid",
                                borderColor: "divider",
                                mr: 2,
                              }}
                            >
                              <Typography variant="subtitle2" noWrap>
                                Tên sản phẩm:{" "}
                                {getIngredientNameById(batch.ingredientId)}
                              </Typography>
                            </Box>
                            <TextField
                              label="Số lượng"
                              type="number"
                              size="small"
                              sx={{ mr: 2 }}
                              value={batch.totalAmount}
                              onChange={(e) =>
                                updateBatch(
                                  actualIndex,
                                  "totalAmount",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              fullWidth
                              InputProps={{
                                inputProps: { min: 0, step: 200 },
                              }}
                            />
                            <TextField
                              select
                              size="small"
                              value={batch.unit || "g"}
                              onChange={(e) =>
                                updateBatch(actualIndex, "unit", e.target.value)
                              }
                              sx={{
                                minWidth: 80,
                                "& .MuiSelect-select": { py: 1 },
                              }}
                            >
                              <MenuItem value="g">g</MenuItem>
                              <MenuItem value="kg">kg</MenuItem>
                            </TextField>
                          </Box>

                          {/* Expiration Date */}
                          <TextField
                            label="Hạn sử dụng"
                            type="date"
                            size="small"
                            value={formatDateForInput(batch.bestBeforeDate)}
                            onChange={(e) => {
                              const selectedDate = new Date(e.target.value);
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);

                              if (selectedDate >= today) {
                                updateBatch(
                                  actualIndex,
                                  "bestBeforeDate",
                                  convertDateToISO(e.target.value)
                                );
                              }
                            }}
                            sx={{ minWidth: 180, flexShrink: 0 }}
                            InputProps={{
                              inputProps: { min: getTodayFormatted() },
                            }}
                            InputLabelProps={{ shrink: true }}
                          />

                          {/* Spacer & Delete Button */}
                          <Box sx={{ flexGrow: 1 }} />
                          <IconButton
                            size="small"
                            onClick={() => removeBatch(actualIndex)}
                            aria-label="Delete batch"
                            sx={{ color: "error.main" }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
                    );
                  })}
              </Box>

              {/* Batch Pagination */}
              {model.batches.length > batchesPerPage && (
                <BatchPagination
                  totalItems={model.batches.length}
                  itemsPerPage={batchesPerPage}
                  currentPage={batchesPage}
                  onPageChange={handleBatchPageChange}
                  onItemsPerPageChange={() => {}} // Not allowing change of page size
                />
              )}
            </>
          )}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          disabled={
            model.batches.length === 0 ||
            model.batches.some((b) => b.totalAmount <= 0)
          }
        >
          Lưu thay đổi ({model.batches.length} lô)
        </Button>
      </DialogActions>
    </Dialog>
  );
}
