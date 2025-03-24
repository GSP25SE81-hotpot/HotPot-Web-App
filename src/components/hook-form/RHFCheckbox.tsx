// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormControlLabelProps,
  FormHelperText,
} from "@mui/material";

// ----------------------------------------------------------------------

interface RHFCheckboxProps extends Omit<FormControlLabelProps, "control"> {
  name: string;
}

export function RHFCheckbox({ name, ...other }: RHFCheckboxProps) {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => <Checkbox {...field} checked={field.value} />}
        />
      }
      {...other}
    />
  );
}

// ----------------------------------------------------------------------

interface RHFMultiCheckboxProps
  extends Omit<FormControlLabelProps, "control" | "label"> {
  name: string;
  options: {
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
  }[];
}

export function RHFMultiCheckbox({
  name,
  options,
  ...other
}: RHFMultiCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        //check show message
        const checkError =
          !!error && (!field.value || field.value.length === 0);

        //check choose
        const onSelected = (option: string) =>
          field.value.includes(option)
            ? field.value.filter((value: string) => value !== option)
            : [...field.value, option];

        return (
          <FormGroup>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={field.value.includes(option.value)}
                    onChange={() => field.onChange(onSelected(option.value))}
                  />
                }
                label={option.label}
                {...other}
              />
            ))}{" "}
            {checkError && (
              <FormHelperText error sx={{ px: 2, textAlign: "center" }}>
                {error.message}
              </FormHelperText>
            )}
          </FormGroup>
        );
      }}
    />
  );
}
