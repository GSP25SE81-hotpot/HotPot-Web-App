// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { Box, FormHelperText, Typography } from "@mui/material";
// type
import {
  UploadAvatar,
  UploadSingleFile,
  UploadProps,
  UploadMultiFileProps,
  UploadMultiFile,
} from "../upload";

// ----------------------------------------------------------------------

interface Props extends Omit<UploadProps, "file"> {
  name: string;
  label?: string;
}

export function RHFUploadAvatar({ name, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && !field.value;

        return (
          <div>
            <UploadAvatar error={checkError} {...other} file={field.value} />
            {checkError && (
              <FormHelperText error sx={{ px: 2, textAlign: "center" }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUploadSingleFile({ name, label, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && !field.value;

        return (
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
            <UploadSingleFile
              file={field.value}
              error={checkError}
              helperText={
                checkError && (
                  <FormHelperText error sx={{ px: 2 }}>
                    {error.message}
                  </FormHelperText>
                )
              }
              {...other}
            />
          </Box>
        );
      }}
    />
  );
}

//.--------------------------------------------------------------------------------
interface RHFUploadMultiFileProps extends Omit<UploadMultiFileProps, "files"> {
  name: string;
  label: string;
}

export function RHFUploadMultiFile({
  name,
  label,
  ...other
}: RHFUploadMultiFileProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && field.value?.length === 0;

        return (
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
            <UploadMultiFile
              files={field.value}
              error={checkError}
              helperText={
                checkError && (
                  <FormHelperText error sx={{ px: 2 }}>
                    {error?.message}
                  </FormHelperText>
                )
              }
              {...other}
            />
          </Box>
        );
      }}
    />
  );
}
