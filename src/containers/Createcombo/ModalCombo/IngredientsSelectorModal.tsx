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
} from "@mui/material";
import adminIngredientsAPI from "../../../api/Services/adminIngredientsAPI";
import useDebounce from "../../../hooks/useDebounce";

interface Ingredient {
  ingredientId: number;
  name: string;
  description: string;
  quantity: number;
  measurementUnit: string;
}

interface AddMeatsForHotpot {
  open: boolean;
  handleCloseVegetableModal: VoidFunction;
  onSendVegetable: (selectedMeats: Ingredient[]) => void;
  selectBefore?: Ingredient[];
}

const IngredientsSelectorModal: React.FC<AddMeatsForHotpot> = ({
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

  const debouncedSearch = useDebounce(searchText, 500);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const resData: any = await adminIngredientsAPI.getListIngredients({
          pageNumber: page + 1, // API expects 1-based index
          size: size,
          searchTerm: debouncedSearch, // Use debounced search
        });
        setIngredients(resData?.data?.items || []);
        setTotal(resData?.data?.totalCount || 0);
      } catch (e) {
        console.error("Error fetching ingredients:", e);
        setIngredients([]);
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

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleCloseVegetableModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select Ingredients</DialogTitle>
        <DialogContent>
          {/* Search Input */}
          <TextField
            label="Search Ingredients"
            variant="outlined"
            fullWidth
            margin="dense"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ingredients.length > 0 ? (
                ingredients.map((ingredient) => (
                  <TableRow key={ingredient.ingredientId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIngredients.some(
                          (selected) =>
                            selected.ingredientId === ingredient.ingredientId
                        )}
                        onChange={() => handleIngredientChange(ingredient)}
                      />
                    </TableCell>
                    <TableCell>{ingredient.name}</TableCell>
                    <TableCell>{ingredient.description}</TableCell>
                    <TableCell>{ingredient.quantity}</TableCell>
                    <TableCell>{ingredient.measurementUnit}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No ingredients available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Component */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={total} // Total items from API
            rowsPerPage={size}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVegetableModal}>Cancel</Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            disabled={selectedIngredients.length === 0}
            onClick={handleConfirm}
          >
            Confirm Selection
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IngredientsSelectorModal;
