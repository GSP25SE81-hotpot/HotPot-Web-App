// src/components/payments/PaymentFilter.tsx
import React, { useState } from "react";
import {
  InputLabel,
  Select,
  MenuItem,
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
import Grid from "@mui/material/Grid2";
import {
  PaymentStatus,
  PaymentFilterRequest,
} from "../../../types/staffPayment";
import {
  FilterContainer,
  FilterGrid,
  FilterFormControl,
  ButtonsContainer,
  SearchButton,
  ResetButton,
} from "../../../components/staff/styles/paymentFilterStyles";

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
    <FilterContainer>
      <form onSubmit={handleFilterSubmit}>
        <FilterGrid container spacing={2}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <FilterFormControl variant="outlined" size="small">
              <InputLabel id="status-label">Trạng thái thanh toán</InputLabel>
              <Select
                labelId="status-label"
                value={statusFilter.toString()}
                onChange={handleStatusChange}
                label="Trạng thái thanh toán"
              >
                <MenuItem value="">Tất cả trạng thái</MenuItem>
                <MenuItem value={PaymentStatus.Pending.toString()}>
                  Đang chờ
                </MenuItem>
                <MenuItem value={PaymentStatus.Success.toString()}>
                  Thành công
                </MenuItem>
                <MenuItem value={PaymentStatus.Cancelled.toString()}>
                  Đã hủy
                </MenuItem>
                <MenuItem value={PaymentStatus.Refunded.toString()}>
                  Đã hoàn tiền
                </MenuItem>
              </Select>
            </FilterFormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Từ ngày"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Đến ngày"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            <ButtonsContainer>
              <SearchButton
                type="submit"
                variant="contained"
                startIcon={<SearchIcon />}
              >
                Tìm kiếm
              </SearchButton>

              <ResetButton
                variant="outlined"
                onClick={handleFilterReset}
                startIcon={<ClearIcon />}
              >
                Đặt lại
              </ResetButton>

              <Tooltip title="Làm mới">
                <IconButton onClick={onRefresh} color="primary">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </ButtonsContainer>
          </Grid>
        </FilterGrid>
      </form>
    </FilterContainer>
  );
};

export default PaymentFilter;
