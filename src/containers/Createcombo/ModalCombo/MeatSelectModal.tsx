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
import { HotpotMeat } from "../../../types/meat";

interface AddMeatsForHotpot {
  open: boolean;
  handleCloseMeatModal: VoidFunction;
  onSendMeat: (selectedMeats: HotpotMeat[]) => void;
  selectBefore?: HotpotMeat[];
}

const MeatSelectorModal: React.FC<AddMeatsForHotpot> = ({
  open,
  handleCloseMeatModal,
  onSendMeat,
  selectBefore = [],
}) => {
  const [chooseMeats, setChooseMeats] = useState<HotpotMeat[]>(selectBefore);

  const meats: HotpotMeat[] = [
    { id: 1, name: "Sliced Beef", price: 8 },
    { id: 2, name: "Lamb", price: 9 },
    { id: 3, name: "Pork Belly", price: 7 },
    { id: 4, name: "Chicken", price: 6 },
  ];

  const handleMeatChange = (id: number) => {
    setChooseMeats(
      (prev) =>
        prev.some((meat) => meat.id === id)
          ? prev.filter((meat) => meat.id !== id)
          : [...prev, meats.find((meat) => meat.id === id)!] ///exlcamation make sure it not return null
    );
  };

  const handleConfirm = () => {
    onSendMeat(chooseMeats);
    handleCloseMeatModal();
  };

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleCloseMeatModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select Meats</DialogTitle>
        <DialogContent>
          <FormGroup sx={{ mt: 2 }}>
            {meats.map((meat) => (
              <FormControlLabel
                key={meat.id}
                control={
                  <Checkbox
                    checked={chooseMeats.some(
                      (selected) => selected.id === meat.id
                    )}
                    onChange={() => handleMeatChange(meat.id)}
                    name={meat.name}
                  />
                }
                label={meat.name}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMeatModal}>Cancel</Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            disabled={chooseMeats.length === 0}
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
