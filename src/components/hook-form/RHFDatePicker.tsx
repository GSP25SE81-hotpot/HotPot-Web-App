// components/hook-form/RHFDatePicker.tsx
import { Controller, useFormContext } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

interface RHFDatePickerProps {
  name: string;
  label: string;
  helperText?: string;
  minDate?: Dayjs;
  disabled?: boolean;
}

export default function RHFDatePicker({
  name,
  label,
  helperText,
  minDate,
  disabled,
}: RHFDatePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={label}
            value={field.value ? dayjs(field.value) : null}
            onChange={(newValue) => {
              field.onChange(newValue ? newValue.toISOString() : null);
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
                error: !!error,
                helperText: error ? error.message : helperText,
              },
            }}
            disabled={disabled}
            minDate={minDate || dayjs()} // Set minimum date to today if not provided
          />
        </LocalizationProvider>
      )}
    />
  );
}
