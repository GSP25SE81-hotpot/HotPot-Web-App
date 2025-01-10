// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { Box, FormHelperText, Typography } from "@mui/material";
//
import Editor, { Props as EditorProps } from "../editor";

// ----------------------------------------------------------------------

interface Props extends EditorProps {
  name: string;
  label: string;
}

export default function RHFEditor({ label, name, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box>
          {label && (
            <Typography
              variant="body1"
              component="label"
              sx={{ display: "flex", alignItems: "center" }}
            >
              {label}
              <Typography component="span" color="red" sx={{ ml: 0.5 }}>
                *
              </Typography>
            </Typography>
          )}
          <Editor
            id={name}
            value={field.value}
            onChange={field.onChange}
            error={!!error}
            helperText={
              <FormHelperText error sx={{ px: 2, textTransform: "capitalize" }}>
                {error?.message}
              </FormHelperText>
            }
            {...other}
          />
        </Box>
      )}
    />
  );
}
