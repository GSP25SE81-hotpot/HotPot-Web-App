import { useFormContext, Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

type IProps = {
  name: string;
  label: string;
  options: { ingredientTypeId: string; name: string }[];
};

export default function RHFAutoComplete({
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
          getOptionLabel={(option) => option.name}
          onChange={(_e, newValue) => {
            setValue(name, newValue ? newValue.ingredientTypeId : "");
            onChange(newValue ? newValue.ingredientTypeId : "");
          }}
          value={
            options.find((option) => option.ingredientTypeId === value) || null
          }
          renderInput={(params) => (
            <TextField
              {...params}
              {...other}
              label={label}
              error={!!error}
              helperText={error?.message}
              InputLabelProps={{
                shrink: true,
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
      )}
    />
  );
}
