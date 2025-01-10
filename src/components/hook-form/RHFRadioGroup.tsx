/* eslint-disable @typescript-eslint/no-explicit-any */
// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import {
  Radio,
  RadioGroup,
  FormHelperText,
  RadioGroupProps,
  FormControlLabel,
} from "@mui/material";

// ----------------------------------------------------------------------

type TaskStatusCount = {
  Process: number;
  Completed: number;
};
type IProps = {
  name: string;
  options: {
    label: string;
    value: any;
    taskStatusCount?: TaskStatusCount;
  }[];
};

type Props = IProps & RadioGroupProps;

export default function RHFRadioGroup({ name, options, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <RadioGroup {...field} row={false} {...other}>
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={`${option.label} (Đang tiến hành: ${option.taskStatusCount?.Process} nhiệm vụ)`}
                />
              ))}
            </RadioGroup>

            {!!error && (
              <FormHelperText error sx={{ px: 2 }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        )}
      />
    </>
  );
}
