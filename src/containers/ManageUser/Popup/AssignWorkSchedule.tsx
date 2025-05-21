/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { colors } from "../../../styles/Color/color";
import CloseIcon from "@mui/icons-material/Close";
import { WorkDays } from "../../../types/scheduleInterfaces";
import { WorkShift } from "../../../types/schedule";
import adminScheduleApi from "../../../api/adminSchedule";
import { toast } from "react-toastify";
// import { set } from "date-fns";

interface Props {
  onOpen: boolean;
  onClose: () => void;
  data: any;
  fetchData: () => void;
}

const AssignWorkSchedule: React.FC<Props> = ({
  data,
  onClose,
  onOpen,
  fetchData,
}) => {
  //declare
  const [workShift, setWorkShift] = React.useState<WorkShift[]>([]);

  const [seletedWorkDays, setWorkDays] = React.useState<number>(0);

  //funcSum
  function sumArrayElements(arr: any) {
    if (!Array.isArray(arr) || arr.length === 0) {
      return 0;
    }
    let sum = 0;
    return arr.reduce((accumulator, currentValue) => {
      if (typeof currentValue == "number") {
        sum = accumulator + currentValue;
        return sum;
      }
      setWorkDays(sum);
      return accumulator;
    }, 0);
  }

  //formdata
  const [dataForm, setDataForm] = React.useState<any>({
    managerId: data?.userId,
    workDays: seletedWorkDays,
    workShiftIds: [],
  });

  //opt array
  const weekSch = [
    { title: "Thứ 2", value: WorkDays.Monday },
    { title: "Thứ 3", value: WorkDays.Tuesday },
    { title: "Thứ 4", value: WorkDays.Wednesday },
    { title: "Thứ 5", value: WorkDays.Thursday },
    { title: "Thứ 6", value: WorkDays.Friday },
    { title: "Thứ 7", value: WorkDays.Saturday },
    { title: "Chủ nhật", value: WorkDays.Sunday },
  ];

  //Call API
  const getWorkShift = async () => {
    try {
      const res: any = await adminScheduleApi.getAdminSchedule();
      setWorkShift(res);
      console.log(res);
    } catch (error: any) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    getWorkShift();
  }, []);

  const handleAssign = async () => {
    console.log("formData: ", dataForm);

    try {
      const res: any = await adminScheduleApi.setSchedule({
        ...dataForm,
      });
      console.log(res);
      toast.success("Phân công lịch làm việc thành công");
      onClose();
      fetchData();
    } catch (error: any) {
      console.log("Error: ", error);
    }
  };

  return (
    <div>
      <Dialog open={onOpen} onClose={onClose}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: colors.primary,
          }}
        >
          <Typography variant="h6" sx={{ color: colors.white }}>
            Phân công lịch làm việc
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: colors.white }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography sx={{ fontWeight: 200, pt: 3 }}>
              Phân công lịch làm việc cho "{data?.name}"
            </Typography>

            <Autocomplete
              multiple
              id="tags-outlined"
              options={workShift}
              getOptionLabel={(option) => option?.shiftName}
              filterSelectedOptions
              onChange={(_event, newValue) => {
                const selectedValues = newValue.map((item) => item.workShiftId);
                setDataForm({
                  ...dataForm,
                  workShiftIds: selectedValues,
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn ca làm việc"
                  placeholder="Ca làm việc"
                />
              )}
            />

            <Autocomplete
              multiple
              id="tags-outlined"
              options={weekSch}
              getOptionLabel={(option) => option.title}
              filterSelectedOptions
              onChange={(_event, newValue) => {
                const selectedValues = newValue.map((item) => item.value);
                console.log("selectedValues: ", selectedValues);
                sumArrayElements(selectedValues);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Ngày trong tuần"
                  placeholder="Thứ"
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAssign()}
          >
            Nộp
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AssignWorkSchedule;
