// src/components/OrderHistory/OrderHistoryFilter.tsx
import React, { useState } from "react";
import {
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { OrderHistoryFilterRequest } from "../../types/orderHistory";
import { OrderStatus } from "../../types/orderManagement";
import { translateOrderStatus } from "../../utils/formatOrder";
import {
  StyledTextField,
  StyledSelect,
  AnimatedButton,
} from "../../components/StyledComponents";
import {
  FilterFormContainer,
  FilterActionsContainer,
} from "./OrderHistoryStyled";

interface OrderHistoryFilterProps {
  onFilterChange: (filter: OrderHistoryFilterRequest) => void;
}

const OrderHistoryFilter: React.FC<OrderHistoryFilterProps> = ({
  onFilterChange,
}) => {
  const [filter, setFilter] = useState<OrderHistoryFilterRequest>({
    startDate: undefined,
    endDate: undefined,
    status: undefined,
    customerName: "",
    pageNumber: 1,
    pageSize: 10,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (!name) return;

    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<unknown>) => {
    const { name, value } = event.target;
    setFilter((prev) => ({
      ...prev,
      [name as string]: value === "" ? undefined : value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFilter((prev) => ({
      ...prev,
      [name]: value ? new Date(value) : undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filter);
  };

  const handleReset = () => {
    const resetFilter: OrderHistoryFilterRequest = {
      startDate: undefined,
      endDate: undefined,
      status: undefined,
      customerName: "",
      pageNumber: 1,
      pageSize: 10,
    };

    setFilter(resetFilter);
    onFilterChange(resetFilter);
  };

  // Create an array of status options for the select
  const statusOptions = Object.values(OrderStatus)
    .filter((value) => typeof value === "number")
    .map((value) => ({
      value: value,
      label: translateOrderStatus(value as OrderStatus),
    }));

  return (
    <form onSubmit={handleSubmit}>
      <FilterFormContainer>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StyledTextField
              fullWidth
              label="Tên khách hàng"
              name="customerName"
              value={filter.customerName || ""}
              onChange={handleInputChange}
              placeholder="Tìm theo tên"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
              size="small"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <StyledTextField
              fullWidth
              label="Ngày bắt đầu"
              name="startDate"
              type="date"
              value={
                filter.startDate
                  ? new Date(filter.startDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleDateChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon />
                    </InputAdornment>
                  ),
                },
                inputLabel: {
                  shrink: true,
                },
              }}
              size="small"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <StyledTextField
              fullWidth
              label="Ngày kết thúc"
              name="endDate"
              type="date"
              value={
                filter.endDate
                  ? new Date(filter.endDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleDateChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon />
                    </InputAdornment>
                  ),
                },
                inputLabel: {
                  shrink: true,
                },
              }}
              size="small"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-select-label">Trạng thái</InputLabel>
              <StyledSelect
                labelId="status-select-label"
                id="status-select"
                name="status"
                value={filter.status !== undefined ? filter.status : ""}
                onChange={handleSelectChange}
                label="Trạng thái"
                displayEmpty
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="">Tất cả trạng thái</MenuItem>
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FilterActionsContainer>
              <AnimatedButton
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<FilterListIcon />}
                sx={{ flex: 1 }}
              >
                Áp dụng bộ lọc
              </AnimatedButton>

              <AnimatedButton
                type="button"
                variant="outlined"
                color="secondary"
                onClick={handleReset}
                startIcon={<RestartAltIcon />}
              >
                Đặt lại
              </AnimatedButton>
            </FilterActionsContainer>
          </Grid>
        </Grid>
      </FilterFormContainer>
    </form>
  );
};

export default OrderHistoryFilter;
