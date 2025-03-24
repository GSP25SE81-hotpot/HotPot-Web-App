import { useFormContext, Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

type IProps = {
  tagname: string;
  label: string;
  options: { ingredientId: string; name: string }[];
};

export default function RHFAutoCompleteBroth({
  tagname,
  label,
  options,
  ...other
}: IProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={tagname}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Autocomplete
          options={options || []}
          getOptionLabel={(option) => option.name}
          onChange={(_e, newValue) => {
            setValue(tagname, newValue ? newValue.ingredientId : "");
            onChange(newValue ? newValue.ingredientId : "");
          }}
          value={
            options.find((option) => option.ingredientId === value) || null
          } // initial value
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
