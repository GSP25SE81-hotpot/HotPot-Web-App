/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { colors } from "../../../styles/Color/color";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import adminIngredientsAPI from "../../../api/Services/adminIngredientsAPI";
import { IngredientTypeSchema } from "../../../types/ingredients";

interface addModelProps {
  onOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddNewIngredients: React.FC<addModelProps> = ({
  onOpen,
  onClose,
  onSuccess,
}) => {
  //Declare
  const defaultValues = {
    name: "",
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Bắt buộc").min(1, "Tối thiểu 1 kí tự"),
  });

  const methods = useForm<IngredientTypeSchema>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  //call Api
  const createUser = async (values: IngredientTypeSchema) => {
    try {
      const res: any = await adminIngredientsAPI.createNewIngredientType(
        values
      );
      toast.success(res.message);
      if (res.success) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Dialog open={onOpen}>
        <FormProvider methods={methods} onSubmit={handleSubmit(createUser)}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: colors.primary,
            }}
          >
            <DialogTitle sx={{ color: colors.white }}>
              Thêm mới loại nguyên liệu
            </DialogTitle>
            <IconButton onClick={onClose}>
              <CloseIcon sx={{ color: colors.white }} />
            </IconButton>
          </Box>
          <DialogContent>
            <RHFTextField name="name" label="Tên" sx={{ mb: 2 }} />
          </DialogContent>
          <DialogActions>
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}
              sx={{ ml: "auto" }}
            >
              Thêm
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
};

export default AddNewIngredients;
