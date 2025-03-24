/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  SelectChangeEvent,
} from "@mui/material";
import {
  RentOrderDetail,
  Staff,
  PickupAssignmentRequestDto,
} from "../../../types/rentalTypes";
import {
  getAvailableStaff,
  allocateStaffForPickup,
} from "../../../api/Services/rentalService";
import { format } from "date-fns";

interface AssignStaffDialogProps {
  open: boolean;
  onClose: () => void;
  pickup: RentOrderDetail;
  onSuccess: () => void;
}

const AssignStaffDialog: React.FC<AssignStaffDialogProps> = ({
  open,
  onClose,
  pickup,
  onSuccess,
}) => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      setStaffLoading(true);
      try {
        const availableStaff = await getAvailableStaff();
        setStaff(availableStaff);
      } catch (error) {
        setError("Failed to load available staff");
      } finally {
        setStaffLoading(false);
      }
    };

    if (open) {
      fetchStaff();
    }
  }, [open]);

  // src/components/manager/AssignStaffDialog.tsx (continued)
  const handleStaffChange = (event: SelectChangeEvent<number | "">) => {
    setSelectedStaffId(event.target.value as number);
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };

  const handleSubmit = async () => {
    if (selectedStaffId === "") {
      setError("Please select a staff member");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: PickupAssignmentRequestDto = {
        staffId: selectedStaffId as number,
        rentOrderDetailId: pickup.id,
        notes: notes || undefined,
      };

      await allocateStaffForPickup(request);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign Staff for Pickup</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="subtitle1" gutterBottom>
            Pickup Details
          </Typography>

          <Box
            sx={{ mb: 3, p: 2, bgcolor: "background.default", borderRadius: 1 }}
          >
            <Typography variant="body2">
              <strong>Customer:</strong> {pickup.customerName}
            </Typography>
            <Typography variant="body2">
              <strong>Equipment:</strong> {pickup.equipmentName}
            </Typography>
            <Typography variant="body2">
              <strong>Return Date:</strong>{" "}
              {format(new Date(pickup.expectedReturnDate), "MMM dd, yyyy")}
            </Typography>
            <Typography variant="body2">
              <strong>Address:</strong>{" "}
              {pickup.customerAddress || "Not provided"}
            </Typography>
            <Typography variant="body2">
              <strong>Phone:</strong> {pickup.customerPhone || "Not provided"}
            </Typography>
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="staff-select-label">Assign Staff</InputLabel>
            <Select
              labelId="staff-select-label"
              value={selectedStaffId}
              onChange={handleStaffChange}
              label="Assign Staff"
              disabled={staffLoading}
            >
              {staffLoading ? (
                <MenuItem value="">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Loading staff...
                  </Box>
                </MenuItem>
              ) : (
                staff.map((staffMember) => (
                  <MenuItem key={staffMember.id} value={staffMember.id}>
                    {staffMember.name}{" "}
                    {staffMember.isAvailable ? "(Available)" : "(Busy)"}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <TextField
            label="Notes for Staff"
            multiline
            rows={3}
            fullWidth
            value={notes}
            onChange={handleNotesChange}
            placeholder="Add any special instructions or notes for the staff member"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading || selectedStaffId === ""}
        >
          {loading ? <CircularProgress size={24} /> : "Assign Staff"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignStaffDialog;
