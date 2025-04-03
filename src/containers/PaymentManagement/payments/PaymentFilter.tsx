// src/components/payments/PaymentFilter.tsx
import React, { useState } from "react";
import {
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  IconButton,
  Tooltip,
  SelectChangeEvent,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { format } from "date-fns";
import {
  PaymentStatus,
  PaymentFilterRequest,
} from "../../../types/staffPayment";

interface PaymentFilterProps {
  onFilterChange: (filter: PaymentFilterRequest) => void;
  onRefresh: () => void;
}

const PaymentFilter: React.FC<PaymentFilterProps> = ({
  onFilterChange,
  onRefresh,
}) => {
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "">("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const handleStatusChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    setStatusFilter(value ? (Number(value) as PaymentStatus) : "");
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onFilterChange({
      status: statusFilter === "" ? undefined : statusFilter,
      fromDate: fromDate ? format(fromDate, "yyyy-MM-dd") : undefined,
      toDate: toDate ? format(toDate, "yyyy-MM-dd") : undefined,
      sortBy: "CreatedAt",
      sortDescending: true,
    });
  };

  const handleFilterReset = () => {
    setStatusFilter("");
    setFromDate(null);
    setToDate(null);

    onFilterChange({});
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <form onSubmit={handleFilterSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="status-label">Payment Status</InputLabel>
              <Select
                labelId="status-label"
                value={statusFilter.toString()}
                onChange={handleStatusChange}
                label="Payment Status"
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value={PaymentStatus.Pending.toString()}>
                  Pending
                </MenuItem>
                <MenuItem value={PaymentStatus.Success.toString()}>
                  Success
                </MenuItem>
                <MenuItem value={PaymentStatus.Cancelled.toString()}>
                  Cancelled
                </MenuItem>
                <MenuItem value={PaymentStatus.Refunded.toString()}>
                  Refunded
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="From Date"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="To Date"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={handleFilterReset}
                startIcon={<ClearIcon />}
              >
                Reset
              </Button>
              <Tooltip title="Refresh">
                <IconButton onClick={onRefresh} color="primary">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default PaymentFilter;
