import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";

type IProps = {
  name: string;
};

type Props = IProps & TextFieldProps;

const formatNumberWithSpaces = (value: string) => {
  const numericValue = value.replace(/[^\d]/g, "");
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const parseFormattedNumber = (value: string) => {
  return parseFloat(value.replace(/,/g, ""));
};

export default function RHFTextFieldNumber({ name, ...other }: Props) {
  const { control, setValue, getValues } = useFormContext();
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    const initialValue = getValues(name);
    if (initialValue && other.type === "number") {
      setDisplayValue(formatNumberWithSpaces(String(initialValue)));
    } else {
      setDisplayValue(initialValue || "");
    }
  }, [getValues, name, other.type]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    if (other.type === "number") {
      const formattedValue = formatNumberWithSpaces(value);
      setDisplayValue(formattedValue);
      setValue(name, parseFormattedNumber(formattedValue));
    } else {
      setDisplayValue(value);
      setValue(name, value);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          error={!!error}
          helperText={error?.message}
          {...other}
          value={displayValue}
          onChange={(e) => {
            handleChange(e);
            field.onChange(e);
          }}
          onBlur={() => {
            field.onBlur();
            if (other.type === "number") {
              setValue(name, parseFormattedNumber(displayValue));
            }
          }}
          InputProps={{
            ...other.InputProps,
            type: "text",
            inputProps: { ...other.InputProps?.inputProps, min: 0 },
          }}
          InputLabelProps={{
            required: true,
            sx: {
              "& .MuiInputLabel-asterisk": {
                color: "red",
              },
            },
          }}
        />
      )}
    />
  );
}
