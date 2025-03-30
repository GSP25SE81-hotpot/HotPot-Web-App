import { useFormContext, Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

type IProps = {
  name: string;
  label: string;
  options: { id: string; fullName: string }[];
};

export default function RHFAutoCompleteUser({
  name,
  label,
  options,
  ...other
}: IProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Autocomplete
          options={options || []}
          getOptionLabel={(option) => option.fullName}
          onChange={(_e, newValue) => {
            setValue(name, newValue ? newValue.id : "");
            onChange(newValue ? newValue.id : "");
          }}
          value={options.find((option) => option.id === value) || null} // initial value
          renderInput={(params) => (
            <TextField
              {...params}
              {...other}
              label={label}
              error={!!error}
              helperText={error?.message}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />
      )}
    />
  );
}
