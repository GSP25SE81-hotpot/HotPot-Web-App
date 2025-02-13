import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { HotpotVegetable } from "../../../types/vegetable";

interface AddMeatsForHotpot {
  open: boolean;
  handleCloseVegetableModal: VoidFunction;
  onSendVegetable: (selectedMeats: HotpotVegetable[]) => void;
  selectBefore?: HotpotVegetable[];
}

const MeatSelectorModal: React.FC<AddMeatsForHotpot> = ({
  open,
  handleCloseVegetableModal,
  onSendVegetable,
  selectBefore = [],
}) => {
  const [chooseVegetables, setChooseVegetables] =
    useState<HotpotVegetable[]>(selectBefore);

  const vegetables: HotpotVegetable[] = [
    { id: 1, name: "Napa Cabbage", price: 3 },
    { id: 2, name: "Mushroom Mix", price: 4 },
    { id: 3, name: "Corn", price: 2 },
    { id: 4, name: "Spinach", price: 3 },
    { id: 5, name: "Tofu", price: 3 },
  ];
  const handleVegetableChange = (id: number) => {
    setChooseVegetables((prev) =>
      prev.some((vegetable) => vegetable.id === id)
        ? prev.filter((vegetable) => vegetable.id !== id)
        : [...prev, vegetables.find((vegetable) => vegetable.id === id)!]
    );
  };

  const handleConfirm = () => {
    onSendVegetable(chooseVegetables);
    handleCloseVegetableModal();
  };

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleCloseVegetableModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select Meats</DialogTitle>
        <DialogContent>
          <FormGroup sx={{ mt: 2 }}>
            {vegetables.map((vegetable) => (
              <FormControlLabel
                key={vegetable.id}
                control={
                  <Checkbox
                    checked={chooseVegetables.some(
                      (selected) => selected.id === vegetable.id
                    )}
                    onChange={() => handleVegetableChange(vegetable.id)}
                    name={vegetable.name}
                  />
                }
                label={vegetable.name}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVegetableModal}>Cancel</Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            disabled={chooseVegetables.length === 0}
            onClick={handleConfirm}
          >
            Confirm Selection
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MeatSelectorModal;
